"use client";
import {exportFormats, type ExportFormat} from "@/lib/practice-record";
export default function ExportFormatSelect({value,onChange,storage="session",showStorageNote=true}:{value:ExportFormat;onChange:(value:ExportFormat)=>void;storage?:"session"|"tab"|"local";showStorageNote?:boolean}){
 return <div className="export-controls"><label className="export-format">Download format<select value={value} onChange={e=>onChange(e.target.value as ExportFormat)}>{exportFormats.map(format=><option key={format.value} value={format.value}>{format.label}</option>)}</select></label>{showStorageNote && storage !== "local" && <span className="hint export-storage-status">{storage === "tab" ? "Saved in this tab’s session when browser storage is available. Download before closing the tab." : "This page only: download before leaving or reloading."}</span>}</div>;
}
