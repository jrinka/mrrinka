import type { ReadingGridExport } from "./reading-grid-export";
import type { Content, TDocumentDefinitions, TableCell as PdfTableCell } from "pdfmake/interfaces";

/** Keep the student's text literal: Markdown markers, indentation and line breaks are not interpreted. */
export function documentLines(content: string) {
  return content.replace(/\r\n?/g, "\n").split("\n");
}
export function documentTitle(filename: string) {
  const title = filename.replace(/\.(txt|md|pdf|docx)$/i, "").replace(/[-_]+/g, " ");
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export async function createPdf(content: string, filename: string, grid?: ReadingGridExport): Promise<Blob> {
  const [{ default: pdfMake }, { default: fonts }] = await Promise.all([
    import("pdfmake/build/pdfmake"), import("pdfmake/build/vfs_fonts"),
  ]);
  pdfMake.addVirtualFileSystem(fonts);
  const title = grid?.title ?? documentTitle(filename);
  const lines = documentLines(content);
  const definition: TDocumentDefinitions = {
    info: { title, creator: "mrrinka.com" },
    pageSize: "A4", pageMargins: [54, 54, 54, 54],
    defaultStyle: { font: "Roboto", fontSize: 11, lineHeight: 1.35, color: "#000000", preserveLeadingSpaces: true },
    content: grid ? gridPdfContent(grid) : [
      { text: title, fontSize: 18, bold: true, margin: [0, 0, 0, 18] },
      ...lines.map(line => ({ text: line || " ", margin: [0, 0, 0, line ? 2 : 5] }) as Content),
    ],
    footer: (page, pages) => ({ text: `${page} / ${pages}`, alignment: "center", fontSize: 9, margin: [0, 20, 0, 0] }),
  };
  return pdfMake.createPdf(definition).getBlob();
}

export async function createDocx(content: string, filename: string, grid?: ReadingGridExport): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Footer, PageNumber, AlignmentType, Table, TableRow, TableCell, WidthType, HeightRule, BorderStyle, TableLayoutType } = await import("docx");
  const title = grid?.title ?? documentTitle(filename);
  const gridTable = grid ? new Table({
    layout: TableLayoutType.FIXED, width: { size: 9746, type: WidthType.DXA }, columnWidths: [3314, 6432],
    borders: Object.fromEntries(["top", "bottom", "left", "right", "insideHorizontal", "insideVertical"].map(side => [side, { style: BorderStyle.SINGLE, size: 4, color: "9A9E95" }])),
    rows: [
      new TableRow({ tableHeader: true, children: ["READING MOVE", "YOUR NOTES"].map((label, index) => new TableCell({
        width: { size: index ? 6432 : 3314, type: WidthType.DXA }, shading: { fill: "D8ED61" }, margins: { top: 140, bottom: 140, left: 140, right: 140 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 19 })] })],
      })) }),
      ...grid.rows.map(row => new TableRow({ height: { value: 900, rule: HeightRule.ATLEAST }, children: [
        new TableCell({ width: { size: 3314, type: WidthType.DXA }, shading: { fill: "EEE9DC" }, margins: { top: 140, bottom: 140, left: 140, right: 140 }, children: [
          new Paragraph({ children: [new TextRun({ text: row.title, bold: true })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: row.prompt, size: 19 })] }),
        ] }),
        new TableCell({ width: { size: 6432, type: WidthType.DXA }, margins: { top: 140, bottom: 140, left: 140, right: 140 }, children: documentLines(row.notes || "(Not yet written)").map(line => new Paragraph({ children: [new TextRun(line)], spacing: { after: 40 }, widowControl: true })) }),
      ] })),
    ],
  }) : undefined;
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
        ...(grid && gridTable ? [
          new Paragraph({ children: [new TextRun({ text: "Text / author: ", bold: true }), new TextRun(grid.text || "Not specified")], spacing: { after: 160 } }),
          gridTable,
        ] : documentLines(content).map(line => new Paragraph({ children: [new TextRun(line)], spacing: { after: line ? 40 : 100 }, wordWrap: true, widowControl: true }))),
      ],
    }],
  });
  return Packer.toBlob(document);
}

function gridPdfContent(grid: ReadingGridExport): Content[] {
  return [
    { text: "MR RINKA / READING NOTES", fontSize: 9, characterSpacing: 1, color: "#555D55", margin: [0, 0, 0, 10] },
    { text: grid.title, fontSize: 22, bold: true, margin: [0, 0, 0, 12] },
    { text: [{ text: "Text / author: ", bold: true }, grid.text || "Not specified"], margin: [0, 0, 0, 10] },
    {
      table: {
        headerRows: 1, widths: [145, "*"],
        body: [
          ["READING MOVE", "YOUR NOTES"].map(text => ({ text, bold: true, fontSize: 10, fillColor: "#D8ED61" })),
          ...grid.rows.map((row): PdfTableCell[] => [
            { stack: [{ text: row.title, bold: true, margin: [0, 0, 0, 8] }, { text: row.prompt, fontSize: 9 }], fillColor: "#EEE9DC" },
            { text: row.notes || "(Not yet written)", preserveLeadingSpaces: true },
          ]),
        ],
      },
      layout: { hLineWidth: () => 0.5, vLineWidth: () => 0.5, hLineColor: () => "#9A9E95", vLineColor: () => "#9A9E95", paddingLeft: () => 9, paddingRight: () => 9, paddingTop: () => 9, paddingBottom: () => 9 },
    },
  ];
}
