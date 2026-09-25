export const infographicExample = {
  title: "Physical activity for early years",
  year: "2019",
  image: "/examples/physical-activity-early-years-2019.png",
  pdf: "/examples/physical-activity-early-years-2019.pdf",
  source: "https://www.cumbria.gov.uk/elibrary/Content/Internet/537/6379/4376214596.pdf",
  context: "https://www.gov.uk/government/publications/physical-activity-guidelines-early-years-under-5s",
  license: "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
  question: "How do words and visual choices make the advice feel both authoritative and achievable?",
  alt: "2019 UK government infographic about activity from birth to five. Benefits appear as six labeled icons above the slogan Every movement counts. A large orange clock carries the 180-minute target for ages one to five; teal tiles show everyday activities. An orange Under-1s panel specifies 30 minutes across the day beside a tummy-time icon. Three closing instructions appear above the Chief Medical Officers’ source line.",
};

// Regions are percentages of the unaltered 1819 × 2573 source image.
export const infographicViews = [
  { id: "whole", label: "Whole text", x: 0, y: 0, width: 100, height: 100,
    term: "Reading path", note: "Trace a possible movement from benefits, to a measurable target, to examples of action. The layout offers a route; it cannot guarantee the order in which everyone reads." },
  { id: "benefits", label: "Benefits", x: 4, y: 12, width: 92, height: 24,
    term: "Image–text anchorage", note: "The heart could suggest several things. Its label directs us toward health and weight. Ask how the words narrow the meaning of the icon, then connect that benefit to a caregiver’s priorities." },
  { id: "target", label: "Time target", x: 4, y: 37, width: 39, height: 27,
    term: "Salience and qualification", note: "Scale and orange contrast make 180 prominent. But the surrounding words matter: at least sets a minimum, and the age range limits whom the target addresses. The clock is not a pie chart." },
  { id: "activities", label: "Activity choices", x: 4, y: 66, width: 92, height: 23,
    term: "Grouping and differentiation", note: "Repeated teal tiles make activities look like a menu of possibilities. The orange Under-1s frame distinguishes a separate recommendation; do not invent an age sequence for the other tiles." },
  { id: "ending", label: "Closing lines", x: 4, y: 89, width: 92, height: 10,
    term: "Imperatives and authority", note: "Three short instructions turn explanation into a prompt to act. The named medical officers lend institutional authority; that source line alone does not show the research behind the advice." },
] as const;

export const infographicNoteFields = [
  { key: "audience", label: "Audience inference", hint: "Who can act on this advice? Support your answer with a particular word, image or detail." },
  { key: "evidence", label: "Evidence and choice", hint: "Record exact wording or a precise visual detail. Name the choice only if the term helps." },
  { key: "analysis", label: "Your analytical paragraph", hint: "Explain how the choice shapes meaning for that audience and advances a purpose. Aim for 3–5 connected sentences." },
] as const;
