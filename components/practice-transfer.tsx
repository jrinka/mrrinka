"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Sparkles} from "lucide-react";
import {readTransfer,transferKey,type PracticeTransfer} from "@/lib/practice-transfer";
export function ContinueToRefinery({kind,source,prompt="",evidence,draft,disabled=false}:{kind:"analysis"|"comparison";source:string;prompt?:string;evidence:string;draft:string;disabled?:boolean}){
 const router=useRouter();const [error,setError]=useState("");
 function proceed(){try{
  const id=crypto.randomUUID();
  const transfer:PracticeTransfer={version:1,id,createdAt:Date.now(),kind,source,prompt,evidence,draft};
  if(!readTransfer(JSON.stringify(transfer),id,kind)){setError("These notes exceed the Refinery’s input limit. Save your complete work as a text file, then bring a shorter selection for feedback.");return;}
  sessionStorage.setItem(transferKey,JSON.stringify(transfer));
  router.push(`/practice/refineries/${kind}?transfer=${id}`);
 }catch{setError("Your browser could not carry the notes across. Save them as a text file, then copy them into the Refinery.");}}
 return <div className="practice-handoff"><button className="button secondary" type="button" disabled={disabled} onClick={proceed}><Sparkles size={16} aria-hidden="true"/>Continue in the {kind==="analysis"?"Analysis":"Comparison"} Refinery →</button><p className="hint">Carries this exercise into an editable form using temporary storage in this browser tab. Nothing is sent to AI until you request feedback. Save a text copy to keep your work.</p>{error&&<p role="alert">{error}</p>}</div>;
}
export function ImportPractice({id,kind,onImport,disabled=false}:{id:string;kind:string;disabled?:boolean;onImport:(value:PracticeTransfer)=>void}){
 const [status,setStatus]=useState<"ready"|"imported"|"unavailable"|"dismissed">("ready");
 function importNotes(){try{const value=readTransfer(sessionStorage.getItem(transferKey),id,kind);if(!value){setStatus("unavailable");return;}onImport(value);sessionStorage.removeItem(transferKey);setStatus("imported");}catch{setStatus("unavailable");}}
 if(!id||status==="dismissed")return null;
 return <aside className="transfer-notice" aria-live="polite">{status==="ready"?<><p><strong>Your exercise is ready to bring across.</strong> Import it before you begin editing here; importing replaces this form’s question, evidence and draft.</p><div className="tool-actions"><button type="button" className="button secondary" disabled={disabled} onClick={importNotes}>Bring my exercise into this form</button><button type="button" className="button secondary" disabled={disabled} onClick={()=>{try{const stored=readTransfer(sessionStorage.getItem(transferKey),id,kind);if(stored)sessionStorage.removeItem(transferKey);}catch{}setStatus("dismissed");}}>Start with a blank form</button></div></>:status==="imported"?<p>Your exercise is in the fields below. Review and edit it, choose your course, and request feedback when you are ready. Nothing has been sent to AI.</p>:<p>The temporary notes are unavailable or have expired (30 minutes). Use your saved text copy, or return to the exercise to carry them across again.</p>}</aside>;
}
