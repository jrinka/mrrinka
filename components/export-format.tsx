"use client";
import type {ExportFormat} from "@/lib/practice-record";
export default function ExportFormatSelect({value,onChange}:{value:ExportFormat;onChange:(value:ExportFormat)=>void}){
 return <label className="export-format">Export format<select value={value} onChange={e=>onChange(e.target.value as ExportFormat)}><option value="txt">Plain text (.txt) — recommended</option><option value="md">Markdown (.md) — for Markdown apps</option></select></label>;
}
