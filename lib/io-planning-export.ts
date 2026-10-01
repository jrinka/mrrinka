import { ioSelections, ioWholeLabel } from './individual-oral';
import { planningHeaders, type IOPlanningExport, type PlanningRow } from './io-planning';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

export async function createIOPdf(plan: IOPlanningExport): Promise<Blob> {
  const [{ default: pdfMake }, { default: fonts }] = await Promise.all([import('pdfmake/build/pdfmake'), import('pdfmake/build/vfs_fonts')]);
  pdfMake.addVirtualFileSystem(fonts);
  function table(rows: PlanningRow[], whole: boolean): Content {
    return { table: { headerRows: 1, widths: ['38%', '62%'], heights: (row: number) => row ? 37 : 26,
      body: [planningHeaders(whole).map(text => ({ text, bold: true, fillColor: '#EDF4CD' })), ...rows.map(row => [row.evidence || ' ', row.analysis || ' '])] },
      layout: { hLineWidth: () => 0.5, vLineWidth: () => 0.5, hLineColor: () => '#90958D', vLineColor: () => '#90958D', paddingLeft: () => 7, paddingRight: () => 7, paddingTop: () => 7, paddingBottom: () => 7 } };
  }
  const content: Content[] = plan.selections.flatMap((s, i): Content[] => [
    { text: `MR RINKA.COM / INDIVIDUAL ORAL / ${plan.course === 'literature' ? 'LITERATURE' : 'LANGUAGE & LITERATURE'}`, fontSize: 8, pageBreak: i ? 'before' : undefined },
    { text: 'Analysis planning', fontSize: 22, bold: true, margin: [0, 10, 0, 8] },
    { text: `Selection ${i + 1}: ${ioSelections(plan.course)[i]}`, bold: true, margin: [0, 0, 0, 8] },
    { text: 'Record your own evidence and interpretation before reducing them to speaking cues.', fontSize: 9, margin: [0, 0, 0, 8] },
    { text: [{ text: 'Work / creator: ', bold: true }, s.work || '________________________'], margin: [0, 0, 0, 8] },
    { text: [{ text: 'My provisional global issue: ', bold: true }, plan.issue || '________________________'], margin: [0, 0, 0, 8] },
    { text: [{ text: 'Extract location and context: ', bold: true }, s.extract || '________________________'], margin: [0, 0, 0, 8] },
    { text: 'Close analysis', fontSize: 13, bold: true, margin: [0, 6, 0, 6] }, table(s.close, false),
    { text: ioWholeLabel(plan.course, i).replace(/^./, c => c.toUpperCase()), fontSize: 13, bold: true, margin: [0, 12, 0, 6] }, table(s.whole, true),
    { text: 'The connection I need to explain', fontSize: 13, bold: true, margin: [0, 12, 0, 6] },
    { text: 'What does the evidence beyond the extract add? Where might my interpretation need qualification?', fontSize: 9, margin: [0, 0, 0, 6] },
    { table: { widths: ['*'], heights: 36, body: [[s.connection || ' ']] }, layout: { hLineWidth: () => 0.5, vLineWidth: () => 0.5, hLineColor: () => '#90958D', vLineColor: () => '#90958D', paddingLeft: () => 7, paddingRight: () => 7, paddingTop: () => 7, paddingBottom: () => 7 } },
  ]);
  const definition: TDocumentDefinitions = { info: { title: 'IO analysis planning', creator: 'mrrinka.com' }, pageSize: 'A4', pageMargins: [42, 36, 42, 40], defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.05, color: '#25282B', preserveLeadingSpaces: true }, content,
    footer: (page, pages) => ({ text: `Planning only, not an assessment-room form · MR RINKA.COM · ${page} / ${pages}`, fontSize: 8, alignment: 'center', margin: [0, 15, 0, 0] }) };
  return pdfMake.createPdf(definition).getBlob();
}

export async function createIODocx(plan: IOPlanningExport): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeightRule, HeadingLevel, Footer, PageNumber, AlignmentType, TableLayoutType, BorderStyle } = await import('docx');
  const paragraphs = (text: string) => (text || ' ').split('\n').map(line => new Paragraph({ text: line, spacing: { after: 20 } }));
  const table = (rows: PlanningRow[], whole: boolean) => new Table({ width: { size: 10000, type: WidthType.DXA }, columnWidths: [3800, 6200], layout: TableLayoutType.FIXED,
    borders: Object.fromEntries(['top', 'bottom', 'left', 'right', 'insideHorizontal', 'insideVertical'].map(side => [side, { style: BorderStyle.SINGLE, size: 4, color: '90958D' }])),
    rows: [new TableRow({ tableHeader: true, children: planningHeaders(whole).map((text, i) => new TableCell({ width: { size: i ? 6200 : 3800, type: WidthType.DXA }, shading: { fill: 'EDF4CD' }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18 })] })] })) }),
      ...rows.map(row => new TableRow({ height: { value: 900, rule: HeightRule.ATLEAST }, children: [row.evidence, row.analysis].map((text, i) => new TableCell({ width: { size: i ? 6200 : 3800, type: WidthType.DXA }, margins: { top: 100, bottom: 100, left: 100, right: 100 }, children: paragraphs(text) })) }))] });
  const heading = (text: string) => new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 160, after: 80 }, keepNext: true });
  const field = (label: string, value: string) => new Paragraph({ children: [new TextRun({ text: label + ': ', bold: true }), new TextRun(value || '________________________')], spacing: { after: 100 } });
  const children = plan.selections.flatMap((s, i) => [
    new Paragraph({ text: 'Analysis planning', heading: HeadingLevel.TITLE, pageBreakBefore: i > 0 }),
    new Paragraph({ text: `Selection ${i + 1}: ${ioSelections(plan.course)[i]}`, spacing: { after: 100 } }),
    new Paragraph({ text: 'Record your own evidence and interpretation before reducing them to speaking cues.', spacing: { after: 100 } }),
    field('Work / creator', s.work), field('My provisional global issue', plan.issue), field('Extract location and context', s.extract),
    heading('Close analysis'), table(s.close, false), heading(ioWholeLabel(plan.course, i).replace(/^./, c => c.toUpperCase())), table(s.whole, true),
    heading('The connection I need to explain'), new Paragraph({ text: 'What does the evidence beyond the extract add? Where might my interpretation need qualification?', spacing: { after: 80 } }), ...paragraphs(s.connection),
  ]);
  return Packer.toBlob(new Document({ title: 'IO analysis planning', creator: 'mrrinka.com', styles: { default: { document: { run: { font: 'Arial', size: 20, color: '25282B' }, paragraph: { spacing: { after: 40, line: 240 } } } }, paragraphStyles: [
    { id: 'Title', name: 'Title', basedOn: 'Normal', run: { size: 40, bold: true, color: '25282B' }, paragraph: { spacing: { after: 140 }, keepNext: true } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', run: { size: 24, bold: true, color: '25282B' }, paragraph: { keepNext: true } },
  ] }, sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 720, bottom: 720, left: 950, right: 950 } } }, footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Planning only, not an assessment-room form · MR RINKA.COM · ', size: 16 }), new TextRun({ children: [PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES], size: 16 })] })] }) }, children }] }));
}
