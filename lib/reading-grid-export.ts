/** A student's filled reading grid. Teacher models are deliberately excluded. */
export type ReadingGridExport = {
  title: string;
  text: string;
  rows: { title: string; prompt: string; notes: string }[];
};
