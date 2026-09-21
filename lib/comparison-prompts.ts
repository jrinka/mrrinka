// Original classroom practice questions, not quotations from IB examination papers.
export const comparisonPrompts = [
 "Compare how two works you have studied use moments of silence to reveal conflict.",
 "How, and to what effect, do two works you have studied present a tension between belonging and independence?",
 "Compare how the endings of two works you have studied reshape your understanding of earlier events.",
 "In what ways do two works you have studied make apparently minor characters important to the work’s meaning?",
 "Compare how two works you have studied use setting to establish and challenge relationships of power.",
 "How do two works you have studied present the gap between what characters say and what they do, and why does it matter?",
 "Compare how two works you have studied invite readers to question an accepted version of events.",
 "In what ways, and with what effects, do two works you have studied depict attempts to resist social expectations?",
 "Compare the significance of journeys or changes of place in two works you have studied.",
 "How do two works you have studied use recurring images or objects to develop an idea about loss?",
 "Compare how two works you have studied make private experiences reveal wider social pressures.",
 "How, and to what effect, do two works you have studied complicate a clear division between innocence and responsibility?",
] as const;
export function nextPrompt(current:string,random=Math.random()){const choices=comparisonPrompts.filter(p=>p!==current);return choices[Math.min(Math.floor(Math.max(0,random)*choices.length),choices.length-1)];}
