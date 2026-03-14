import fontkit from '@pdf-lib/fontkit';
import {
  PDFDocument,
  PageSizes,
  rgb,
  type PDFFont,
  type PDFPage,
} from 'pdf-lib';
import { loadTwKaiFontBytes, FontLoadError } from './fontLoader';
import {
  ATTACHMENT_LAYOUT,
  GRID_TEXT_STYLE,
  HEADER_FIELDS,
  PDF_PAGE_HEIGHT,
  PDF_PAGE_WIDTH,
  getGridCellRect,
  type HeaderFieldCoordinates,
} from './pdfCoordinates';
import { layoutGridText, type GridCharacterPlacement, type GridPage } from './gridEngine';

const TEMPLATE_PATH = '/example10206.pdf';
const BLACK = rgb(0, 0, 0);

export interface LetterPerson {
  name: string;
  address: string;
}

export interface LegalAttestLetterInput {
  senders: LetterPerson[];
  receivers: LetterPerson[];
  copyReceivers: LetterPerson[];
  content: string;
}

export interface PdfBinaryAssets {
  templateBytes: ArrayBuffer | Uint8Array;
  fontBytes: ArrayBuffer | Uint8Array;
}

export interface PdfGenerationResult {
  blob: Blob;
  filename: string;
  pageCount: number;
  usedAttachmentPage: boolean;
}

export class PdfGenerationError extends Error {
  readonly userMessage: string;

  constructor(userMessage: string, cause?: unknown) {
    super(userMessage);
    this.name = 'PdfGenerationError';
    this.userMessage = userMessage;

    if (cause instanceof Error && cause.stack) {
      this.stack = cause.stack;
    }
  }
}

function toUint8Array(bytes: ArrayBuffer | Uint8Array): Uint8Array {
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
}

function formatFilename(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `存證信函_${year}${month}${day}.pdf`;
}

async function loadTemplateBytes(): Promise<ArrayBuffer> {
  const response = await fetch(TEMPLATE_PATH);

  if (!response.ok) {
    throw new PdfGenerationError('模板載入失敗，請重新整理頁面後再試');
  }

  return response.arrayBuffer();
}

function measureTextWidth(font: PDFFont, text: string, size: number) {
  return font.widthOfTextAtSize(text, size);
}

function getTextHeight(font: PDFFont, size: number) {
  return font.heightAtSize(size, { descender: false });
}

function fitSingleLineSize(
  font: PDFFont,
  text: string,
  preferredSize: number,
  maxWidth: number,
  minSize = 6,
) {
  let size = preferredSize;

  while (size > minSize && measureTextWidth(font, text, size) > maxWidth) {
    size -= 0.25;
  }

  return size;
}

function wrapByCharacters(font: PDFFont, text: string, fontSize: number, maxWidth: number) {
  const lines: string[] = [];
  let current = '';

  for (const char of text) {
    const candidate = `${current}${char}`;

    if (current && measureTextWidth(font, candidate, fontSize) > maxWidth) {
      lines.push(current);
      current = char;
      continue;
    }

    current = candidate;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function drawSingleLineText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  field: HeaderFieldCoordinates,
) {
  if (!text.trim()) {
    return;
  }

  const fontSize = fitSingleLineSize(font, text.trim(), field.fontSize, field.maxWidth);
  page.drawText(text.trim(), {
    x: field.x,
    y: field.y,
    font,
    size: fontSize,
    color: BLACK,
  });
}

function drawWrappedHeaderText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  field: HeaderFieldCoordinates,
) {
  if (!text.trim()) {
    return;
  }

  let fontSize = field.fontSize;
  let lines = wrapByCharacters(font, text.trim(), fontSize, field.maxWidth);
  const maxLines = field.maxHeight ? Math.max(1, Math.floor(field.maxHeight / (fontSize + 1))) : 1;

  while ((lines.length > maxLines || lines.some((line) => measureTextWidth(font, line, fontSize) > field.maxWidth)) && fontSize > 6) {
    fontSize -= 0.25;
    lines = wrapByCharacters(font, text.trim(), fontSize, field.maxWidth);
  }

  const clampedLines = lines.slice(0, maxLines);
  const lineHeight = fontSize + 1;

  clampedLines.forEach((line, index) => {
    page.drawText(line, {
      x: field.x,
      y: field.y - index * lineHeight,
      font,
      size: fontSize,
      color: BLACK,
    });
  });
}

function drawHeaderPersonBlock(
  page: PDFPage,
  font: PDFFont,
  fieldKey: keyof typeof HEADER_FIELDS,
  person?: LetterPerson,
) {
  if (!person) {
    return;
  }

  const field = HEADER_FIELDS[fieldKey];
  drawSingleLineText(page, font, person.name.trim(), field.name);
  drawWrappedHeaderText(page, font, person.address.trim(), field.address);
}

function drawGridCharacter(page: PDFPage, font: PDFFont, placement: GridCharacterPlacement) {
  const cell = getGridCellRect(placement.row, placement.column);
  const textWidth = measureTextWidth(font, placement.char, GRID_TEXT_STYLE.fontSize);
  const textHeight = getTextHeight(font, GRID_TEXT_STYLE.fontSize);

  page.drawText(placement.char, {
    x: cell.x + (cell.width - textWidth) / 2,
    y: cell.y + (cell.height - textHeight) / 2 + GRID_TEXT_STYLE.baselineNudge,
    font,
    size: GRID_TEXT_STYLE.fontSize,
    color: BLACK,
  });
}

function drawGridPage(page: PDFPage, font: PDFFont, gridPage: GridPage) {
  gridPage.characters.forEach((placement) => drawGridCharacter(page, font, placement));
}

function drawAttachmentPage(
  pdfDoc: PDFDocument,
  font: PDFFont,
  input: LegalAttestLetterInput,
) {
  const page = pdfDoc.addPage(PageSizes.A4);
  const layout = ATTACHMENT_LAYOUT;
  const DASH_COLOR = rgb(0.3, 0.3, 0.3);

  // Calculate total height needed for the block
  const personLineHeight = layout.lineHeight;
  let totalPersonLines = 0;
  const sections: Array<{ label: string; persons: LetterPerson[]; showSeal: boolean }> = [
    { label: '一、寄件人', persons: input.senders, showSeal: true },
    { label: '二、收件人', persons: input.receivers, showSeal: false },
    { label: '三、副本收件人', persons: input.copyReceivers, showSeal: false },
  ];

  sections.forEach((s) => {
    // Each person takes 2 lines (name + address), plus section label overhead
    totalPersonLines += 1; // section label line
    totalPersonLines += s.persons.length * 2;
  });

  const disclaimerHeight = 16;
  const noteHeight = 16;
  const blockInnerHeight = disclaimerHeight + totalPersonLines * personLineHeight + sections.length * layout.sectionGap + noteHeight + 20;
  const boxTop = layout.boxTop;
  const boxBottom = boxTop - blockInnerHeight;

  // Draw dashed border around the cut-out block
  const boxX = layout.boxX;
  const boxRight = boxX + layout.boxWidth;
  const dashOpts = { thickness: 1, color: DASH_COLOR, dashArray: [6, 3] };

  page.drawLine({ start: { x: boxX, y: boxTop }, end: { x: boxRight, y: boxTop }, ...dashOpts });
  page.drawLine({ start: { x: boxX, y: boxBottom }, end: { x: boxRight, y: boxBottom }, ...dashOpts });
  page.drawLine({ start: { x: boxX, y: boxTop }, end: { x: boxX, y: boxBottom }, ...dashOpts });
  page.drawLine({ start: { x: boxRight, y: boxTop }, end: { x: boxRight, y: boxBottom }, ...dashOpts });

  let cursorY = boxTop - 14;

  // Disclaimer line (same as template)
  const disclaimerSize = 6.5;
  page.drawText('〈寄件人如為機關、團體、學校、公司、商號請加蓋單位圖章及法定代理人簽名或蓋章〉', {
    x: layout.labelX,
    y: cursorY,
    font,
    size: disclaimerSize,
    color: BLACK,
  });

  cursorY -= disclaimerHeight;

  // Draw each section matching the template header style
  sections.forEach((section) => {
    // Section label (e.g., 一、寄件人)
    page.drawText(section.label, {
      x: layout.labelX,
      y: cursorY,
      font,
      size: layout.sectionLabelFontSize,
      color: BLACK,
    });

    if (!section.persons.length) {
      cursorY -= personLineHeight + layout.sectionGap;
      return;
    }

    // First person name on the same line as label
    section.persons.forEach((person) => {
      const nameLabel = '姓名：' + person.name.trim();

      page.drawText(nameLabel, { x: layout.fieldX, y: cursorY, font, size: layout.fieldFontSize, color: BLACK });
      if (section.showSeal) {
        page.drawText('印', { x: boxRight - 20, y: cursorY, font, size: layout.fieldFontSize, color: BLACK });
      }

      cursorY -= personLineHeight;

      // Address line
      const addrLabel = '詳細地址：' + person.address.trim();
      page.drawText(addrLabel, {
        x: layout.fieldX,
        y: cursorY,
        font,
        size: layout.addressFontSize,
        color: BLACK,
      });

      cursorY -= personLineHeight;
    });

    cursorY -= layout.sectionGap;
  });

  // Note line (same as template)
  page.drawText('（本欄姓名、地址不敷填寫時，請另紙聯記）', {
    x: layout.labelX,
    y: cursorY,
    font,
    size: 7,
    color: BLACK,
  });

  // Cut instruction below the box
  page.drawText('✂ 請沿虛線剪下，貼至每頁的寄收件人欄位', {
    x: boxX,
    y: boxBottom - 16,
    font,
    size: layout.instructionFontSize,
    color: DASH_COLOR,
  });
}

function shouldUseAttachmentPage(input: LegalAttestLetterInput) {
  return input.senders.length > 1 || input.receivers.length > 1 || input.copyReceivers.length > 1;
}

async function buildPdf(
  input: LegalAttestLetterInput,
  assets: PdfBinaryAssets,
) {
  const pdfDoc = await PDFDocument.create();
  const templateDoc = await PDFDocument.load(toUint8Array(assets.templateBytes));
  const templatePage = await pdfDoc.embedPage(templateDoc.getPage(0));

  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(toUint8Array(assets.fontBytes), { subset: true });

  const gridPages = layoutGridText(input.content);
  const useAttachmentPage = shouldUseAttachmentPage(input);

  gridPages.forEach((gridPage, index) => {
    const page = pdfDoc.addPage([PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT]);
    page.drawPage(templatePage, {
      x: 0,
      y: 0,
      width: PDF_PAGE_WIDTH,
      height: PDF_PAGE_HEIGHT,
    });

    if (!useAttachmentPage && index === 0) {
      drawHeaderPersonBlock(page, font, 'sender', input.senders[0]);
      drawHeaderPersonBlock(page, font, 'receiver', input.receivers[0]);
      drawHeaderPersonBlock(page, font, 'copyReceiver', input.copyReceivers[0]);
    }

    drawGridPage(page, font, gridPage);
  });

  if (useAttachmentPage) {
    drawAttachmentPage(pdfDoc, font, input);
  }

  return {
    pdfDoc,
    pageCount: gridPages.length + (useAttachmentPage ? 1 : 0),
    usedAttachmentPage: useAttachmentPage,
  };
}

export async function createLegalAttestLetterPdf(
  input: LegalAttestLetterInput,
  assets: PdfBinaryAssets,
): Promise<PdfGenerationResult> {
  try {
    const { pdfDoc, pageCount, usedAttachmentPage } = await buildPdf(input, assets);
    const pdfBytes = await pdfDoc.save();
    const blobBytes = Uint8Array.from(pdfBytes);

    return {
      blob: new Blob([blobBytes], { type: 'application/pdf' }),
      filename: formatFilename(),
      pageCount,
      usedAttachmentPage,
    };
  } catch (error) {
    throw new PdfGenerationError('PDF 產生失敗，請稍後再試', error);
  }
}

function downloadPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function generateAndDownloadLegalAttestLetterPdf(
  input: LegalAttestLetterInput,
): Promise<PdfGenerationResult> {
  try {
    const [templateBytes, fontBytes] = await Promise.all([loadTemplateBytes(), loadTwKaiFontBytes()]);
    const result = await createLegalAttestLetterPdf(input, { templateBytes, fontBytes });
    downloadPdf(result.blob, result.filename);
    return result;
  } catch (error) {
    if (error instanceof PdfGenerationError || error instanceof FontLoadError) {
      throw error;
    }

    throw new PdfGenerationError('PDF 產生失敗，請稍後再試', error);
  }
}
