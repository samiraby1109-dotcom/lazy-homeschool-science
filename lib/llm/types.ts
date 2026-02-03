export type SourceExcerpt = {
  id: string;
  text: string;
};

export type UnitPlanPacket = {
  topic: string;
  ageBand: string;
  readingLevel: 'younger' | 'middle' | 'older';
  excerpts: SourceExcerpt[];
  vocabulary: string[];
};

export type WorksheetQuestion = {
  id: string;
  prompt: string;
  type:
    | 'circle'
    | 'draw'
    | 'match'
    | 'tell'
    | 'observe';
  citations: string[];
  answerKey: string;
};

export type WorksheetDraft = {
  unitTitle: string;
  questions: WorksheetQuestion[];
};
