export const PDF_PAGE_WIDTH = 595;
export const PDF_PAGE_HEIGHT = 842;

export const GRID_COLUMNS = 20;
export const GRID_ROWS = 10;

// Coordinates extracted from PDF content stream (scale factor 0.12)
export const GRID_ROW_LABEL_LEFT = 63.84;
export const GRID_CONTENT_LEFT = 89.40;
export const GRID_CONTENT_RIGHT = 563.64;
export const GRID_HEADER_TOP = 619.92;
export const GRID_BODY_TOP = 585.96;
export const GRID_BODY_BOTTOM = 245.88;

export const GRID_COLUMN_LINES = [
  89.40, 113.04, 136.80, 160.44, 184.20, 207.84, 231.60, 255.24, 279.00, 302.64, 326.40,
  350.04, 373.80, 397.44, 421.20, 444.84, 468.60, 492.36, 516.12, 539.88, 563.64,
] as const;

export const GRID_ROW_LINES = [
  585.96, 552.00, 517.92, 483.96, 450.00, 415.92, 381.96, 348.00, 313.92, 279.96, 245.88,
] as const;

export const GRID_CELL_WIDTH = (GRID_CONTENT_RIGHT - GRID_CONTENT_LEFT) / GRID_COLUMNS;
export const GRID_CELL_HEIGHT = (GRID_BODY_TOP - GRID_BODY_BOTTOM) / GRID_ROWS;
export const GRID_ROW_GAP = GRID_CELL_HEIGHT;

export interface PdfRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HeaderFieldCoordinates {
  x: number;
  y: number;
  maxWidth: number;
  maxHeight?: number;
  fontSize: number;
}

export interface HeaderBlockCoordinates {
  name: HeaderFieldCoordinates;
  address: HeaderFieldCoordinates;
}

// Header right box: x=225.60, y=620.24, w=337.92, h=143.52
export const HEADER_RIGHT_BOX = {
  x: 225.60,
  y: 620.24,
  width: 337.92,
  height: 143.52,
};

// Coordinates from PDF content stream text positions:
//   Name fields: after "姓名：" label (~x=322)
//   Address fields: on 2nd address row at x=342 (after indented "詳細地址：")
//   Sender row1=739.64, addr row2=715.76; Receiver row1=695.12, addr row2=671.72
//   CC name y=663.92, CC addr y=648.32 (only one address row for CC)
export const HEADER_FIELDS: Record<'sender' | 'receiver' | 'copyReceiver', HeaderBlockCoordinates> = {
  sender: {
    name: {
      x: 322,
      y: 739.6,
      maxWidth: 190,
      fontSize: 9.5,
    },
    address: {
      x: 342,
      y: 715.76,
      maxWidth: 220,
      maxHeight: 14,
      fontSize: 9,
    },
  },
  receiver: {
    name: {
      x: 322,
      y: 695,
      maxWidth: 238,
      fontSize: 9.5,
    },
    address: {
      x: 342,
      y: 671.72,
      maxWidth: 220,
      maxHeight: 14,
      fontSize: 9,
    },
  },
  copyReceiver: {
    name: {
      x: 325,
      y: 652.96,
      maxWidth: 235,
      fontSize: 9,
    },
    address: {
      x: 342,
      y: 637.16,
      maxWidth: 220,
      maxHeight: 14,
      fontSize: 8.5,
    },
  },
};

export const GRID_TEXT_STYLE = {
  fontSize: 15,
  baselineNudge: 1.5,
};

export const ATTACHMENT_LAYOUT = {
  // Match the template's right header box width
  boxX: HEADER_RIGHT_BOX.x,
  boxWidth: HEADER_RIGHT_BOX.width,
  boxTop: PDF_PAGE_HEIGHT - 50,
  labelX: 234,
  fieldX: 365,
  fieldMaxWidth: 170,
  sectionLabelFontSize: 9,
  fieldFontSize: 9.5,
  addressFontSize: 8.5,
  lineHeight: 14,
  sectionGap: 6,
  instructionFontSize: 9,
  cutNoteY: 50,
};

export function getGridCellRect(row: number, column: number): PdfRect {
  const left = GRID_COLUMN_LINES[column];
  const right = GRID_COLUMN_LINES[column + 1];
  const top = GRID_ROW_LINES[row];
  const bottom = GRID_ROW_LINES[row + 1];

  return {
    x: left,
    y: bottom,
    width: right - left,
    height: top - bottom,
  };
}
