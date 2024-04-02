export type PlaybookStep = {
  id: string;
  name: string;
  done: boolean;
};

export type PlaybookContent = {
  steps: Record<string, PlaybookStep>;
};
