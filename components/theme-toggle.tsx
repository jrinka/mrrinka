"use client";
import {useEffect,useState} from "react";
import {Moon,Sun} from "lucide-react";
export default function ThemeToggle(){
 const [dark,setDark]=useState(false);
 useEffect(()=>{setDark(document.documentElement.dataset.theme==="dark");},[]);
 function toggle(){const next=!dark;setDark(next);document.documentElement.dataset.theme=next?"dark":"light";try{localStorage.setItem("mrrinka-theme",next?"dark":"light");}catch{}}
 return <button type="button" className="theme-toggle" onClick={toggle} aria-label={dark?"Switch to light mode":"Switch to dark mode"} aria-pressed={dark} title={dark?"Light mode":"Dark mode"}>{dark?<Sun size={18}/>:<Moon size={18}/>}<span>{dark?"Light mode":"Dark mode"}</span></button>;
}
