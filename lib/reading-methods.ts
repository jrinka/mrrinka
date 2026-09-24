export type ReadingStep = { letter: string; title: string; prompt: string; example: string };
export const readingMethods = {
  tpcastt: {
    title: "TPCASTT", subtitle: "A step-by-step approach to reading poetry", work: "Mirror — Sylvia Plath",
    source: "https://allpoetry.com/poem/8498499-Mirror-by-Sylvia-Plath",
    sourceLabel: "Read Mirror at All Poetry", note: "Use your class copy or the linked text alongside these notes. The poem is copyright-protected and is not reproduced in full here.",
    steps: [
      {letter:"T",title:"Title: a first prediction",prompt:"Before reading, what possibilities does the title suggest? Be ready to revise your prediction.",example:"A mirror might promise an accurate reflection—or raise questions about how we see ourselves."},
      {letter:"P",title:"Paraphrase",prompt:"Establish what literally happens. Who speaks? What changes? Summarize briefly in your own words.",example:"A reflective surface describes its work. A woman repeatedly seeks her reflection and confronts her ageing."},
      {letter:"C",title:"Connotation",prompt:"Select precise language, imagery, sound or form. Explain what each choice adds beyond literal meaning.",example:"“Silver and exact” claims detachment, but the mirror’s “heart” complicates it. The lake gives reflection depth and uncertainty."},
      {letter:"A",title:"Attitude",prompt:"Describe the speaker’s attitude with evidence. Do not assume the speaker and the poet are the same person.",example:"The voice begins confidently, as if reporting facts without emotion. The woman’s distress makes that apparent neutrality harder to accept."},
      {letter:"S",title:"Shifts",prompt:"Locate a change in voice, tone, imagery, time or argument. How does it change the meaning?",example:"“Now I am a lake” begins the second stanza. Looking becomes searching; the final “terrible fish” makes ageing threatening."},
      {letter:"T",title:"Title: reconsidered",prompt:"Return to your first hypothesis. How has the whole poem changed your understanding?",example:"The title now names a troubling relationship between external appearance and a self the woman wants to recover."},
      {letter:"T",title:"Theme",prompt:"Write a claim about meaning that you can support, not a one-word topic. Test it against the whole poem.",example:"One reading: looking for certainty in a reflection can intensify anxiety about change. Test it against the speaker’s confident opening."},
    ] satisfies ReadingStep[],
    bridge:"Choose the shift from surface to depth and trace what it does. That gives you an analytical direction; seven TPCASTT entries do not require seven essay paragraphs.",
  },
  soapstone: {
    title:"SOAPSTone", subtitle:"A guide to speaker, audience and purpose", work:"Gettysburg Address — Abraham Lincoln",
    source:"https://loc.gov/exhibits/gettysburg-address/ext/trans-nicolay-copy.html", sourceLabel:"Read the Nicolay draft at the Library of Congress",
    note:"Delivered at the dedication of the Soldiers’ National Cemetery, Gettysburg, on 19 November 1863. This public-domain speech survives in several versions; the examples here use the Nicolay draft.",
    steps:[
      {letter:"S",title:"Speaker",prompt:"Who speaks, in what role, and how is authority established? Distinguish a speaker from a publisher.",example:"Lincoln speaks as US president, but repeatedly places himself within a collective ‘we’. His position gives authority; the pronoun shares responsibility."},
      {letter:"O",title:"Occasion",prompt:"What immediate event and wider circumstances shape the text? Use known context; do not invent it.",example:"The immediate occasion is a cemetery dedication. The ongoing Civil War gives the ceremony a larger question: whether the nation’s founding commitment can endure."},
      {letter:"A",title:"Audience",prompt:"Who is directly addressed? What larger audience might the text reach? Identify clues.",example:"Those attending the dedication are the immediate audience. References to the nation and collective duty also address a wider public. Neither group is a single uniform reader."},
      {letter:"P",title:"Purpose",prompt:"What does the speaker invite that audience to think, feel or do? Distinguish this from the subject.",example:"The speech honours the dead while redirecting the living towards continuing their work. It moves beyond commemorating a battle to renewing a political commitment."},
      {letter:"S",title:"Subject",prompt:"What does the text literally discuss? Keep this brief so you can move on to its choices.",example:"The founding of the nation, the war, the soldiers’ sacrifice, and the responsibilities of the living."},
      {letter:"T",title:"Tone",prompt:"Name an attitude precisely, then support it with specific words. Trace changes rather than attaching one adjective to everything.",example:"The tone moves from solemn commemoration towards resolve. The sequence ‘we can not dedicate—we can not consecrate—we can not hallow’ limits the speakers’ power before the turn towards duty."},
    ] satisfies ReadingStep[],
    bridge:"Lincoln’s repeated collective pronoun links listeners to an unfinished obligation. Connect speaker, audience and purpose through that choice rather than writing six separate factual paragraphs.",
  },
} as const;
export type ReadingMethod=keyof typeof readingMethods;
