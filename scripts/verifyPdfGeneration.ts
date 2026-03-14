import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  createLegalAttestLetterPdf,
  type LegalAttestLetterInput,
} from '../src/lib/pdfGenerator';

interface VerificationResult {
  name: string;
  outputPath: string;
  pageCount: number;
  usedAttachmentPage: boolean;
}

async function writePdf(
  name: string,
  input: LegalAttestLetterInput,
  assets: { templateBytes: Uint8Array; fontBytes: Uint8Array },
  outputDir: string,
) {
  const result = await createLegalAttestLetterPdf(input, assets);
  const outputPath = resolve(outputDir, `${name}.pdf`);
  await writeFile(outputPath, Buffer.from(await result.blob.arrayBuffer()));

  return {
    name,
    outputPath,
    pageCount: result.pageCount,
    usedAttachmentPage: result.usedAttachmentPage,
  } satisfies VerificationResult;
}

async function main() {
  const rootDir = process.cwd();
  const outputDir = resolve(rootDir, 'tmp/pdf-verification');

  await mkdir(outputDir, { recursive: true });

  const [templateBytes, fontBytes] = await Promise.all([
    readFile(resolve(rootDir, 'public/example10206.pdf')),
    readFile(resolve(rootDir, 'public/fonts/TW-Kai.ttf')),
  ]);

  const assets = { templateBytes, fontBytes };

  const standardInput: LegalAttestLetterInput = {
    senders: [{ name: '王小明', address: '台北市中正區忠孝西路一段 100 號 8 樓' }],
    receivers: [{ name: '陳大華', address: '新北市板橋區文化路二段 88 號 12 樓' }],
    copyReceivers: [{ name: '李美玉', address: '桃園市桃園區復興路 66 號 3 樓' }],
    content:
      '茲因雙方就房屋修繕費用負擔與履約期程發生爭議，特以本存證信函正式通知，請於文到七日內提出具體處理方案，逾期未回覆，將依法主張權利。',
  };

  const longContentInput: LegalAttestLetterInput = {
    ...standardInput,
    copyReceivers: [],
    content: '測'.repeat(240),
  };

  const attachmentInput: LegalAttestLetterInput = {
    senders: [
      { name: '王小明', address: '台北市中正區忠孝西路一段 100 號 8 樓' },
      { name: '王小華', address: '台北市大安區信義路三段 20 號 5 樓' },
    ],
    receivers: [
      { name: '陳大華', address: '新北市板橋區文化路二段 88 號 12 樓' },
      { name: '陳小華', address: '新北市中和區中山路二段 18 號 10 樓' },
    ],
    copyReceivers: [{ name: '李美玉', address: '桃園市桃園區復興路 66 號 3 樓' }],
    content:
      '因契約履行情形與實際交付成果不符，為維護權益，請於收受本函後立即與我方聯繫，並於期限內完成補正。',
  };

  const results = await Promise.all([
    writePdf('standard', standardInput, assets, outputDir),
    writePdf('long-content', longContentInput, assets, outputDir),
    writePdf('attachment', attachmentInput, assets, outputDir),
  ]);

  if ((results.find((result) => result.name === 'long-content')?.pageCount ?? 0) < 2) {
    throw new Error('Expected long-content sample to produce more than one page.');
  }

  if (!results.find((result) => result.name === 'attachment')?.usedAttachmentPage) {
    throw new Error('Expected attachment sample to include the attachment page.');
  }

  console.log(JSON.stringify(results, null, 2));
}

await main();
