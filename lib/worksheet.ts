import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { WorksheetDraft } from '@/lib/llm/types';

export async function buildWorksheetPdf(worksheet: WorksheetDraft) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();

  page.drawText(worksheet.unitTitle, {
    x: 40,
    y: height - 60,
    size: 20,
    font,
    color: rgb(0, 0, 0)
  });

  let y = height - 100;
  worksheet.questions.forEach((question, index) => {
    page.drawText(`${index + 1}. ${question.prompt}`, {
      x: 40,
      y,
      size: 12,
      font,
      color: rgb(0.1, 0.1, 0.1)
    });
    y -= 24;
  });

  return pdf.save();
}
