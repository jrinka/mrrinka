'use client';
import {useEffect,useState} from 'react';
import {Download} from 'lucide-react';
import {activityText,createActivityBlob,downloadFile} from './exports';
import {exportFormats,type ExportFormat} from '../lib/practice-record';

export default function ActivityExport({title}:{title:string}) {
  const [notice,setNotice]=useState('');
  const [format,setFormat]=useState<ExportFormat>('docx');
  const [busy,setBusy]=useState(false);
  const [saved,setSaved]=useState<{url:string;name:string}|null>(null);
  useEffect(()=>()=>{if(saved)URL.revokeObjectURL(saved.url);},[saved]);
  return <div className="activity-export"><label className="activity-format">File format<select aria-label="Activity file format" disabled={busy} value={format} onChange={e=>setFormat(e.target.value as ExportFormat)}>{exportFormats.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></label><button className="control" disabled={busy} onClick={async event=>{
    try {
      const root=event.currentTarget.closest('main');if(!root)return;
      setBusy(true);setNotice('Preparing activity download…');
      const record=await createActivityBlob(activityText(root,title),title,format);
      const url=downloadFile(record.blob,record.filename);setSaved({url,name:record.filename});
      setNotice('Activity download ready.');
    } catch {setNotice('Could not save the activity. Please try again.');} finally {setBusy(false);}
  }}><Download aria-hidden="true"/>Save activity <span className="export-format">.{format}</span></button><span role="status">{notice}</span>{saved&&<a className="export-open" href={saved.url} target="_blank" rel="noopener noreferrer">Open saved file</a>}</div>;
}
