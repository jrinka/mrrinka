# Student exports

Every shared export-format selector now offers PDF, Word (.docx), plain text and Markdown. Existing plain-text defaults remain unchanged. This covers practice activities, assessment notebooks, worked examples, reading grids and feedback records. Existing content producers still supply the same text, including source references, questions, student drafts/revisions and any feedback attribution. Export does not fetch source images or add undisplayed guidance.

`lib/practice-record.ts` handles file naming, progress/error messages and downloading. Plain text and Markdown preserve their previous behavior. PDF and DOCX generators in `lib/document-export.ts` load only when selected and run in the browser. PDF uses embedded Roboto with selectable text, A4 pages, 54-point margins and page numbers. DOCX uses editable paragraphs, a Word title style, A4 pages, matching margins and page-number fields. Student text is literal: Markdown syntax and HTML-like strings are not interpreted or rewritten. Line breaks, indentation, unfinished writing and attribution remain part of the output.

Download failures display a recoverable message and leave the workspace unchanged. Plain-text download remains available when a document-generation chunk cannot load. No student content is submitted to a server for export.

## Downloadable grids

The TPCASTT and SOAPSTone HTML grids include the same four export choices. `scripts/templates/` contains their editable source; `scripts/offline-grid.ts` collects prompts and notes. `npm run build:exports` bundles the exporter and fonts into each standalone HTML file (about 2.2 MB), so all four formats work with networking disabled. Do not manually patch generated files in `public/downloads/`; edit the templates or shared exporter and rebuild. The regular build/dev commands regenerate them. Printing retains the original grid layout; document exports present its prompts and notes as readable paragraphs.

## Verification

Production build and TypeScript passed; 74 tests passed. Browser checks downloaded all four formats from Paper 2, a worked example, a refinery and both standalone grids opened offline. Extracted PDF/DOCX text matched the corresponding plain-text export after accounting for wrapping whitespace and page numbers. Multi-page PDF and Word output was rendered and visually checked; accented characters, Greek letters, curly quotation marks, currency signs, literal Markdown, indentation and final revisions survived. A forced document-chunk failure retained the draft and allowed a plain-text export. Goodnotes itself was not available for an import test; these are ordinary PDF and DOCX files.
