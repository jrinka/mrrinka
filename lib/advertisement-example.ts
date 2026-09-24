export const advertisementExample = {
  title: "FIJI Water — No Added Chemicals",
  image: "/examples/fiji-water-no-added-chemicals.png",
  width: 2090,
  height: 1348,
  question: "How do visual contrast and language present FIJI Water as a desirable choice?",
  credit: "Advertisement: FIJI Water. Supplied teaching scan; publication date and photographer not identified.",
  transcript: [
    { title: "Headline", text: "Fiji Water. No Added Chemicals." },
    { title: "Body copy", text: "Other water has added chemicals. Our water is free of chemicals. Fiji Water is gathered from an artesian aquifer hundreds of miles from pollution, acid rain and industrial waste. Our water comes straight from the source deep within the earth and goes right into the bottle, so it never comes in contact with environmental pollutants like other bottled water. Fiji Water is the only bottled water out there that is protected by layers of clay and rock, keeping it free from harmful chemicals. So next time you’re looking for a healthy refreshment, treat yourself with a bottle of Fiji." },
    { title: "Closing slogan", text: "Natural. Clean. Pure. Fiji." },
    { title: "Prominent bottle-label wording", text: "FIJI · NATURAL ARTESIAN WATER" },
  ],
} as const;

export const advertisementViews = [
  { id: "whole", label: "Whole ad", title: "Start with the contrast", x: 0, y: 0, width: 1, height: 1,
    alt: "Wide FIJI Water ad: a gloved hand with a syringe beside an unbranded bottle on the dark left; a headline, explanatory copy, FIJI bottle and slogan against white on the right.",
    prompt: "Compare what each side makes prominent. Which bottle is larger, and which is made to seem desirable? Those are different questions.",
    section: "start-with-the-whole-advertisement" },
  { id: "syringe", label: "01 · Image", title: "An alternative made unsettling", x: .025, y: .04, width: .47, height: .53,
    alt: "Close-up of a gloved hand holding a syringe beside the open, unbranded bottle, under blue lighting against a dark background.",
    prompt: "Trace the needle, glove and bottle. How does the headline guide the meaning of this clinical imagery? The photograph dramatises a suggestion; it does not prove a competitor’s practice.",
    section: "1-the-image-creates-the-problem" },
  { id: "headline", label: "02 · Headline", title: "A claim defined by absence", x: .56, y: .025, width: .415, height: .18,
    alt: "Headline close-up: Fiji Water. No Added Chemicals.",
    prompt: "Read the short statements and the negative “No.” What does the image make the audience understand by “added”?",
    section: "2-the-headline-supplies-the-distinction" },
  { id: "copy", label: "03 · Copy", title: "A story of natural protection", x: .574, y: .338, width: .256, height: .412,
    alt: "Close-up of the body copy comparing other water with FIJI and describing an artesian aquifer, distance from pollution and layers of clay and rock.",
    prompt: "Follow the contrast between other water and our water. Notice how the claim shifts from no added chemicals in the headline to the broader free of chemicals in the copy.",
    section: "3-the-copy-gives-reassurance-a-rationale" },
  { id: "product", label: "04 · Bottle", title: "A recognisable choice", x: .836, y: .318, width: .111, height: .442,
    alt: "Close-up of the FIJI bottle, with a blue cap and a leafy, floral label, isolated against a light background.",
    prompt: "Compare this small, clearly labelled bottle with the large anonymous one. How do the plant imagery and surrounding space develop the product’s associations?",
    section: "4-the-product-and-slogan-resolve-the-contrast" },
  { id: "slogan", label: "05 · Slogan", title: "Qualities become a brand", x: .642, y: .89, width: .324, height: .069,
    alt: "Slogan close-up: Natural. Clean. Pure. Fiji.",
    prompt: "Read the sequence aloud. What happens when the brand name follows three desirable qualities in the same clipped pattern?",
    section: "4-the-product-and-slogan-resolve-the-contrast" },
] as const;

export const advertisementNoteFields = [
  { key: "audience", label: "Audience and purpose", hint: "Identify a plausible buyer concern and the details that support it." },
  { key: "evidence", label: "Connected evidence", hint: "Choose a short phrase and a precise visual detail. Explain their relationship." },
  { key: "analysis", label: "Your analytical paragraph", hint: "Develop one interpretation. Distinguish the ad’s suggestion from what it establishes." },
] as const;
