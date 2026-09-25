export type LiteraryReading = {
 title: string; author: string; question: string; questionCredit: string; context: string;
 wholeLabel?: string; image?: { url: string; width: number; height: number; alt: string };
 sources: { label: string; url: string }[]; credit: string; footnotes?: string; poem?: boolean;
 passages: { title: string; paragraphs: string[] }[];
 sections: Record<string, { label: string; phase: string; passage: number | null }>;
 fields: readonly { key: "contrast" | "evidence" | "analysis"; label: string; hint: string }[];
 checks: string[]; filename: string;
};
