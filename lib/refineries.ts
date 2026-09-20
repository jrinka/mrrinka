export const ibAiPolicy = "https://www.ibo.org/globalassets/new-structure/programmes/shared-resources/pdfs/academic-integrity-policy-en.pdf";
export const refineryKinds = ["analysis", "comparison", "global-issue", "line-of-inquiry"] as const;
export type RefineryKind = typeof refineryKinds[number];
export const refineries: Record<RefineryKind, { title: string; description: string; evidence: string; draft: string }> = {
  analysis: { title: "Analysis Refinery", description: "Strengthen the connection between evidence and meaning.", evidence: "Paste the source passage, or describe the visual details precisely. Name the text and author or creator.", draft: "Your analysis of a specific choice and its effect" },
  comparison: { title: "Comparison Refinery", description: "Test a comparative claim against evidence from two works.", evidence: "Name both works and authors. Include your chosen evidence from each, with enough context to understand it.", draft: "Your comparative claim or analytical paragraph" },
  "global-issue": { title: "Global Issue Refinery", description: "Explore a direction, develop your own global issue, and test it against your texts.", evidence: "Identify both texts and their authors or creators, their course eligibility, and the details you chose that support your proposed issue.", draft: "Your proposed global issue and your explanation of its connection to each text" },
  "line-of-inquiry": { title: "Line of Inquiry Refinery", description: "Explore your observations, develop your own inquiry, and test its analytical potential.", evidence: "Name your chosen work or body of work and its author or creator. Provide the textual details and authorial choices that prompted your inquiry.", draft: "Your proposed line of inquiry and why you want to explore it" },
};
export function assessmentRefinery(title: string): RefineryKind | undefined {
  const mapping: Record<string, RefineryKind> = { "Paper 1": "analysis", "Paper 2": "comparison", "Individual Oral": "global-issue", "Higher Level Essay": "line-of-inquiry" };
  return mapping[title];
}
