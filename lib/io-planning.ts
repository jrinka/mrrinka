import { ioSelections, ioWholeLabel, type IOCourse } from './individual-oral';
export type PlanningRow = { evidence: string; analysis: string };
export type PlanningSelection = { work: string; extract: string; close: PlanningRow[]; whole: PlanningRow[]; connection: string };
export type IOPlanningExport = { kind: 'io-planning'; course: IOCourse; issue: string; selections: PlanningSelection[] };
export function blankIOPlan(course: IOCourse): IOPlanningExport {
  const rows = () => Array.from({ length: 3 }, () => ({ evidence: '', analysis: '' }));
  return { kind: 'io-planning', course, issue: '', selections: [0, 1].map(() => ({ work: '', extract: '', close: rows(), whole: rows(), connection: '' })) };
}
export function validIOPlan(value: unknown, course: IOCourse): value is IOPlanningExport {
  if (!value || typeof value !== 'object') return false;
  const p = value as IOPlanningExport;
  return p.kind === 'io-planning' && p.course === course && typeof p.issue === 'string' && Array.isArray(p.selections) && p.selections.length === 2 && p.selections.every(s => s && typeof s.work === 'string' && typeof s.extract === 'string' && typeof s.connection === 'string' && [s.close, s.whole].every(rows => Array.isArray(rows) && rows.length === 3 && rows.every(row => row && typeof row.evidence === 'string' && typeof row.analysis === 'string')));
}
export const planningHeaders = (whole: boolean) => whole ? ['Precise moment and choice beyond the extract', 'How it develops or qualifies my reading of the issue'] : ['Evidence and choice', 'Meaning and relevance to my issue'];
export function ioPlanText(plan: IOPlanningExport) {
  return `IO analysis planning
${plan.course === 'literature' ? 'Literature' : 'Language & Literature'}

My provisional global issue: ${plan.issue}

` + plan.selections.map((s, i) => `## Selection ${i + 1}: ${ioSelections(plan.course)[i]}

Work / creator: ${s.work}

Extract location and context: ${s.extract}

` + (['close', 'whole'] as const).map(key => `### ${key === 'close' ? 'Close analysis' : ioWholeLabel(plan.course, i)}

` + s[key].map((row, n) => `${n + 1}. ${planningHeaders(key === 'whole')[0]}:
${row.evidence}

${planningHeaders(key === 'whole')[1]}:
${row.analysis}`).join('\n\n')).join('\n\n') + `

### The connection I need to explain

${s.connection}`).join('\n\n---\n\n') + '\n\nPlanning only, not an assessment-room form. MR RINKA.COM';
}
