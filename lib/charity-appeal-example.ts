export const charityAppealExample = {
  title: "WWF — Adopt a snow leopard",
  url: "https://support.wwf.org.uk/adopt-a-snow-leopard",
  image: "/examples/wwf-snow-leopard-opening-excerpt.png",
  imageAlt: "Opening image and headline excerpt: a close view of a snow leopard lying in snow, with the instruction to adopt a snow leopard.",
  imageCredit: "Photograph © Muhammad Osama / WWF-Pakistan. Opening image and headline excerpt, WWF-UK; captured 24 September 2026.",
  question: "How does this appeal turn interest in an animal into a case for ongoing support?",
  checked: "24 September 2026",
};

export const charityReadingSections: Record<string, { label: string; phase: string; location: string; note: string }> = {
  "start-with-the-appeal": { label: "Start with the appeal", phase: "Orient", location: "Read the complete page", note: "Begin with the photograph and request, then inspect the adoption benefits and account of conservation work. The image here is an opening excerpt; the complete layout is on WWF’s website." },
  "audience-and-request": { label: "Audience & request", phase: "Orient", location: "Payment choices and adoption FAQ", note: "At the time reviewed, the page offered monthly contributions of £5, £8 or £10, a custom amount and a one-off alternative. Its FAQ explained that adoption supports groups of animals and wider work." },
  "make-protection-personal": { label: "Protection & connection", phase: "Analyse", location: "Opening image, headline and description", note: "Compare the close portrait with the opening description’s movement from power and attractiveness to vulnerability. Consider what kind of involvement the adoption imperative offers." },
  "make-support-manageable": { label: "A manageable contribution", phase: "Analyse", location: "Payment panel beside the page", note: "On the desktop page reviewed, payment choices stayed visible alongside the explanation. Examine how the location and recurring amounts connect interest with an available response." },
  "give-the-relationship-a-presence": { label: "Gifts & ongoing contact", phase: "Analyse", location: "Adoption benefits", note: "The page shows a soft toy, an adoption pack, updates and a certificate among the benefits. Inspect how their images make participation tangible, including when the adoption is given as a gift." },
  "connect-the-gift-with-conservation": { label: "What support funds", phase: "Analyse", location: "Conservation explanation and funding scope", note: "Read the account of practical work and the explanation that funds also support wider conservation. Keep those qualifications connected to the personal language of the offer." },
  "build-an-analytical-response": { label: "Build a response", phase: "Write", location: "Bring the page together", note: "Connect the animal portrait, the reader’s proposed role, the response mechanism and the explanation of the work. Check the scope of the promise before forming a thesis." },
  "practice-and-transfer": { label: "Practise & transfer", phase: "Write", location: "Compare benefits with charitable purpose", note: "Choose one detail from the adoption benefits and one from the account of conservation work. Explain the relationship rather than treating each as an isolated technique." },
};

export const charityNoteFields = [
  { key: "audience", label: "Audience and requested contribution", hint: "Who is addressed, what are they asked to do, and what evidence supports your inference?" },
  { key: "evidence", label: "Connected evidence", hint: "Record two precise details from the WWF source and the relationship between them." },
  { key: "analysis", label: "Your analytical paragraph", hint: "Develop one interpretation of how the appeal connects concern, trust or participation." },
] as const;
