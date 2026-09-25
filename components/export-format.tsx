"use client";
import {exportFormats, type ExportFormat} from "@/lib/practice-record";
export default function ExportFormatSelect({value,onChange}:{value:ExportFormat;onChange:(value:ExportFormat)=>void}){
 return <label className="export-format">Export format<select value={value} onChange={e=>onChange(e.target.value as ExportFormat)}>{exportFormats.map(format=><option key={format.value} value={format.value}>{format.label}</option>)}</select></label>;
}
