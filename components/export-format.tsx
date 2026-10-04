"use client";
import {exportFormats, type ExportFormat} from "@/lib/practice-record";
export default function ExportFormatSelect({value,onChange,storage="session",allowedFormats}:{value:ExportFormat;onChange:(value:ExportFormat)=>void;storage?:"session"|"local";allowedFormats?:readonly ExportFormat[]}){
 return <div className="export-controls"><label className="export-format">Export format<select value={value} onChange={e=>onChange(e.target.value as ExportFormat)}>{exportFormats.filter(format=>!allowedFormats || allowedFormats.includes(format.value)).map(format=><option key={format.value} value={format.value}>{format.label}</option>)}</select></label>{storage === "session" && <span className="hint export-storage-status">Session only: download before leaving or reloading.</span>}</div>;
}
