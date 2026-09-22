'use client';
import {useEffect,useState} from 'react';
import {Download} from 'lucide-react';
import {activityText,activityRecord,downloadFile,fileName} from './exports';

export default function ActivityExport({title}:{title:string}) {
  const [notice,setNotice]=useState('');
  const [format,setFormat]=useState<'txt'|'md'>('txt');
  const [saved,setSaved]=useState<{url:string;name:string}|null>(null);
  useEffect(()=>()=>{if(saved)URL.revokeObjectURL(saved.url);},[saved]);
  return <div className="activity-export"><label className="activity-format">File format<select aria-label="Activity file format" value={format} onChange={e=>setFormat(e.target.value as 'txt'|'md')}><option value="txt">Plain text (.txt)</option><option value="md">Markdown (.md)</option></select></label><button className="control" onClick={event=>{
    try {
      const root=event.currentTarget.closest('main');if(!root)return;
      const name=fileName(title)+'.'+format;
      const url=downloadFile(new Blob([activityRecord(activityText(root,title),title,format)],{type:format==='md'?'text/markdown;charset=utf-8':'text/plain;charset=utf-8'}),name);setSaved({url,name});
      setNotice('Activity download ready.');
    } catch {setNotice('Could not save the activity. Please try again.');}
  }}><Download aria-hidden="true"/>Save activity <span className="export-format">.{format}</span></button><span role="status">{notice}</span>{saved&&<a className="export-open" href={saved.url} target="_blank" rel="noopener noreferrer">Open text file</a>}</div>;
}
