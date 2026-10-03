// Lightweight public-source allowlist. Catalog entries reference these stable IDs.
export const closeSourceTypes = {
 tourism: "ADVERTISEMENT",
 parenting: "ADVERTORIAL",
 theatre: "MANIFESTO",
} as const;
export type CloseSourceId = keyof typeof closeSourceTypes;
export const closeSourceIds = Object.keys(closeSourceTypes) as CloseSourceId[];
