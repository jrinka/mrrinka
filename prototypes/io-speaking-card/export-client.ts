import { createRecordBlob } from "../../lib/practice-record";
// Keep the existing local export path available; the compact card uses the same
// bundled PDF engine and embedded fonts with section headings and shorter spacing.
export { createRecordBlob };
export async function createCardPdf(course: string, sections: {title: string}[], notes: string[], groups: readonly (readonly number[])[]) {
  const [{ default: pdfMake }, { default: fonts }] = await Promise.all([
    import("pdfmake/build/pdfmake"), import("pdfmake/build/vfs_fonts"),
  ]);
  pdfMake.addVirtualFileSystem(fonts);
  let number = 0;
  return pdfMake.createPdf({
    info: {title: "Individual Oral speaking card"}, pageSize: "A4", pageMargins: [42, 42, 42, 42],
    defaultStyle: {font: "Roboto", fontSize: 11, lineHeight: 1.1, color: "#000000"},
    content: [
      {text: "Individual Oral speaking card", fontSize: 18, bold: true, margin: [0, 0, 0, 8]},
      {text: course === "literature" ? "Literature · Two literary works" : "Language & Literature · Literary work and non-literary body of work", fontSize: 10, margin: [0, 0, 0, 8]},
      ...sections.flatMap((section, index) => [
        {text: section.title, bold: true, margin: [0, 10, 0, 5] as [number, number, number, number]},
        ...groups[index].map(slot => ({text: `${++number}. ${notes[slot] || "[No cue entered]"}`, margin: [0, 0, 0, 5] as [number, number, number, number]})),
      ]),
    ],
  }).getBlob();
}
