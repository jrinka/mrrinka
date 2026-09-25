import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";

/** Keep the student's text literal: Markdown markers, indentation and line breaks are not interpreted. */
export function documentLines(content: string) {
  return content.replace(/\r\n?/g, "\n").split("\n");
}
export function documentTitle(filename: string) {
  const title = filename.replace(/\.(txt|md|pdf|docx)$/i, "").replace(/[-_]+/g, " ");
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export async function createPdf(content: string, filename: string): Promise<Blob> {
  const [{ default: pdfMake }, { default: fonts }] = await Promise.all([
    import("pdfmake/build/pdfmake"), import("pdfmake/build/vfs_fonts"),
  ]);
  pdfMake.addVirtualFileSystem(fonts);
  const title = documentTitle(filename);
  const lines = documentLines(content);
  const definition: TDocumentDefinitions = {
    info: { title, creator: "mrrinka.com" },
    pageSize: "A4", pageMargins: [54, 54, 54, 54],
    defaultStyle: { font: "Roboto", fontSize: 11, lineHeight: 1.35, color: "#000000", preserveLeadingSpaces: true },
    content: [
      { text: title, fontSize: 18, bold: true, margin: [0, 0, 0, 18] },
      ...lines.map(line => ({ text: line || " ", margin: [0, 0, 0, line ? 2 : 5] }) as Content),
    ],
    footer: (page, pages) => ({ text: `${page} / ${pages}`, alignment: "center", fontSize: 9, margin: [0, 20, 0, 0] }),
  };
  return pdfMake.createPdf(definition).getBlob();
}

export async function createDocx(content: string, filename: string): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Footer, PageNumber, AlignmentType } = await import("docx");
  const title = documentTitle(filename);
  const document = new Document({
    title, creator: "", description: "Exported from mrrinka.com",
    styles: {
      default: { document: { run: { font: "Arial", size: 22, color: "000000" }, paragraph: { spacing: { line: 324, after: 40 } } } },
      paragraphStyles: [{ id: "Title", name: "Title", basedOn: "Normal", next: "Normal", run: { font: "Arial", size: 36, bold: true, color: "000000" }, paragraph: { spacing: { after: 300 }, keepNext: true } }],
    },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT, " / ", PageNumber.TOTAL_PAGES], size: 18 })] })] }) },
      children: [
        new Paragraph({ text: title, heading: HeadingLevel.TITLE }),
        ...documentLines(content).map(line => new Paragraph({ children: [new TextRun(line)], spacing: { after: line ? 40 : 100 }, wordWrap: true, widowControl: true })),
      ],
    }],
  });
  return Packer.toBlob(document);
}
