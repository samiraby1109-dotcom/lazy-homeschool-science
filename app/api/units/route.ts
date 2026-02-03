import { NextResponse } from 'next/server';
import { generateWorksheet, validateWorksheet } from '@/lib/llm';
import { AppConfig } from '@/lib/config';

export async function POST() {
  const packet = {
    topic: 'Sample topic',
    ageBand: '5-7',
    readingLevel: 'middle' as const,
    excerpts: [
      {
        id: 'excerpt-1',
        text: 'Magnets can attract some metals.'
      }
    ],
    vocabulary: ['magnet', 'attract', 'repel']
  };

  try {
    const worksheet = await generateWorksheet(packet);
    validateWorksheet(worksheet, packet);

    return NextResponse.json({
      worksheet,
      maxDailyWatchMinutes: AppConfig.maxDailyWatchMinutes
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: (error as Error).message
      },
      { status: 400 }
    );
  }
}
