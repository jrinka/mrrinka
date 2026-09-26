export const nonfictionExample = {
 title: "The Gastronomical Me — M. F. K. Fisher",
 source: "/examples/gastronomical-me-exam-page.png",
 question: "How and to what effect are the diner and the waitress contrasted here?",
 context: "In this memoir extract, M. F. K. Fisher recounts her experience in a French restaurant.",
 credit: "M. F. K. Fisher, The Gastronomical Me (1943), Daunt Books, pp. 183–184. Source adapted by the examination paper. Rights remain with their respective holders.",
};
export const nonfictionPassages = [
 {title:"The intended ending and the next dish · paragraphs 1–3", paragraphs:[
 "Fate could not harm me, I remembered winily, for I had indeed dined today, and dined well. Now for a leaf of crisp salad, and I’d be on my way.",
 "The girl slid into the room. She asked me again, in a respectful but gossipy manner, how I had liked this and that and the other things, and then talked on as she mixed dressing for the endive.",
 "“And now,” she announced, after I had eaten one green sprig and dutifully pronounced it excellent, “now Madame is going to taste Monsieur Paul’s special terrine, one that is not even on the summer menu, when a hundred covers are laid here daily and we have a head-waiter and a wine-waiter, and cabinet ministers telegraph for tables! Madame will be pleased.”",
 ]},
 {title:"Abundance and the diner’s response · paragraphs 4–5", paragraphs:[
 "And heedless of my low moans of the walk still before me, of my appreciation and my unhappily human and limited capacity, she cut a thick heavy slice from the terrine of meat and stood over me while I ate it, telling with almost hysterical pleasure of the wild ducks, the spices, the wines that went into it. Even surfeit could not make me deny that it was a rare dish. I ate it all, knowing my luck, and wishing only that I had red wine to drink with it.",
 "I was beginning, though, to feel almost frightened, realising myself an accidental victim of these stranded gourmets, Monsieur Paul and his handmaiden. I began to feel that they were using me for a safety valve, much as a thwarted woman relieves herself with tantrums or a fit of weeping. I was serving a purpose, and perhaps a noble one, but I resented it in a way approaching panic.",
 ]},
 {title:"Polite acceptance and private fantasy · paragraph 6", paragraphs:[
 "I protested only to myself when one of Monsieur Paul’s special cheeses was cut for me, and I ate it doggedly, like a slave. When the girl said that Monsieur Paul himself was preparing a special filter of coffee for me, I smiled servile acceptance; wine and the weight of food and my own character could not force me to argue with maniacs. When, before the coffee came, Monsieur Paul presented me, through his idolater, with the most beautiful apple tart I had ever seen, I allowed it to be cut and served to me. Not a wince or a murmur showed the waitress my distressed fearfulness. With a stuffed careful smile on my face, and a clear nightmare in my head of trussed wanderers prepared for his altar by this hermit-priest of gastronomy, I listened to the girl’s passionate plea for fresh pastry dough.",
 ]},
];
export const nonfictionReadingSections: Record<string,{label:string;phase:string;passage:number|null}> = {
 "read-the-remembered-meal":{label:"Read the meal",phase:"Orient",passage:null},
 "a-meal-that-will-not-end":{label:"A meal without an ending",phase:"Analyse",passage:0},
 "pleasure-meets-physical-limits":{label:"Pleasure & limits",phase:"Analyse",passage:1},
 "the-private-story-of-a-victim":{label:"The private ‘victim’",phase:"Analyse",passage:1},
 "politeness-and-the-sacrificial-fantasy":{label:"Politeness & fantasy",phase:"Analyse",passage:2},
 "build-an-analytical-response":{label:"Build a response",phase:"Write",passage:2},
 "practice-and-transfer":{label:"Practice & transfer",phase:"Write",passage:null},
};
export const nonfictionNoteFields = [
 {key:"contrast",label:"The contrast and what it reveals",hint:"How do the two figures experience the same encounter differently?"},
 {key:"evidence",label:"Connected evidence",hint:"Choose precise details that connect the waitress’s behavior with the diner’s response."},
 {key:"analysis",label:"Your analytical paragraph",hint:"Explain the contrast and its effect, including a detail that complicates your reading."},
] as const;
