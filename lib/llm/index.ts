import { WorksheetDraft, UnitPlanPacket } from '@/lib/llm/types';

const isMock = process.env.LLM_MODE === 'mock';

export async function generateWorksheet(
  packet: UnitPlanPacket
): Promise<WorksheetDraft> {
  if (packet.excerpts.length === 0) {
    throw new Error('No vetted source excerpts available.');
  }

  if (isMock) {
    return {
      unitTitle: packet.topic,
      questions: [
        {
          id: 'q1',
          prompt: 'Circle the words that match our topic.',
          type: 'circle',
          citations: [packet.excerpts[0].id],
          answerKey: 'Use only words found in the packet excerpts.'
        }
      ]
    };
  }

  throw new Error('LLM integration not configured.');
}

export function validateWorksheet(
  worksheet: WorksheetDraft,
  packet: UnitPlanPacket
) {
  const excerptIds = new Set(packet.excerpts.map((excerpt) => excerpt.id));
  const missingCitations = worksheet.questions.filter((question) =>
    question.citations.some((citation) => !excerptIds.has(citation))
  );

  if (missingCitations.length > 0) {
    throw new Error('Worksheet contains uncited claims.');
  }
}
