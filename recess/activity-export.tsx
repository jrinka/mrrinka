'use client';
import {useEffect,useState} from 'react';
import {Download} from 'lucide-react';
import {activityText,downloadFile,fileName} from './exports';

export default function ActivityExport({title}:{title:string}) {
  const [notice,setNotice]=useState('');
  const [saved,setSaved]=useState<{url:string;name:string}|null>(null);
  useEffect(()=>()=>{if(saved)URL.revokeObjectURL(saved.url);},[saved]);
  return <div className="activity-export"><button className="control" onClick={event=>{
    try {
      const root=event.currentTarget.closest('main');if(!root)return;
      const name=fileName(title)+'.txt';
      const url=downloadFile(new Blob([activityText(root,title)],{type:'text/plain;charset=utf-8'}),name);setSaved({url,name});
      setNotice('Activity download ready.');
    } catch {setNotice('Could not save the activity. Please try again.');}
  }}><Download aria-hidden="true"/>Save activity <span className="export-format">.txt</span></button><span role="status">{notice}</span>{saved&&<a className="export-open" href={saved.url} target="_blank" rel="noopener noreferrer">Open text file</a>}</div>;
}
