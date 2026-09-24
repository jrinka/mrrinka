"use client";
import ThemeToggle from "@/components/theme-toggle";
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Library, CalendarDays, Sparkles, FilePenLine, Home, Menu, X, PanelLeftClose, PanelLeftOpen, LayoutGrid } from "lucide-react";
import type { CourseId } from "@/lib/schema";
const defaults = [{id:"language-literature",short:"IB Lang & Lit",side:"Language & Literature"},{id:"literature",short:"IB Literature",side:"Literature"}];
export default function InteriorShell({children,courseId,courseLabels=defaults}:{children:React.ReactNode;courseId?:CourseId;courseLabels?:typeof defaults}) {
  const mobileToggle=useRef<HTMLButtonElement>(null);
  const path=usePathname(); const router=useRouter();
  const [collapsed,setCollapsed]=useState(false); const [mobileOpen,setMobileOpen]=useState(false);
  const base=courseId ? `/courses/${courseId}` : "";
  const course=courseLabels.find(c=>c.id===courseId);
  const local = courseId ? [
    ...(courseId === "english-10" ? [{href:base,label:"Overview",icon:Home},{href:`${base}/units`,label:"Units & texts",icon:BookOpen}] : []),
    {href:`${base}/assessment`,label:"Assessments",icon:FilePenLine},
    ...(courseId !== "english-10" ? [{href:`${base}/text-types`,label:"Text types",icon:LayoutGrid}] : []),
  ] : [];
  const shared=[{href:"/resources",label:"Skills & Methods",icon:Library},{href:"/practice",label:"Practice",icon:Sparkles},{href:"/calendar",label:"My calendar",icon:CalendarDays}];
  function links(items:typeof shared) {return items.map(item=><Link key={item.href} href={item.href} onClick={()=>setMobileOpen(false)} title={item.label} aria-current={(path===item.href || (item.href!==base && path.startsWith(item.href+"/"))) ? "page":undefined}><item.icon size={18} aria-hidden="true"/><span>{item.label}</span></Link>);}
  return <div className={`interior-site ${collapsed ? "interior-collapsed" : ""}`}>
    <a className="skip-link" href="#content">Skip to content</a>
    <header className="interior-mobile"><Link href="/" className="wordmark">mr rinka<span>_</span></Link><button ref={mobileToggle} type="button" aria-expanded={mobileOpen} aria-controls="interior-navigation" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={20}/> : <Menu size={20}/>}<span>{mobileOpen ? "Close menu" : "Menu"}</span></button></header>
    <aside id="interior-navigation" className={`interior-sidebar ${mobileOpen ? "mobile-open" : ""}`} onKeyDown={event=>{if(event.key==="Escape"){setMobileOpen(false);mobileToggle.current?.focus();}}}>
      <Link href="/" className="interior-home" aria-label="Mr. Rinka home"><Home size={20}/><span>mr rinka_</span></Link>
      <button className="interior-collapse" type="button" aria-expanded={!collapsed} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} onClick={()=>setCollapsed(!collapsed)}>{collapsed ? <PanelLeftOpen size={19}/> : <PanelLeftClose size={19}/>}</button>
      <label className="interior-course"><span className="mono">IB COURSES</span><select aria-label="Choose a course" value={courseId ?? ""} onChange={e=>{setMobileOpen(false);router.push(`/courses/${e.target.value}`);}}><option value="" disabled>Choose a course</option>{courseLabels.filter(c=>c.id!=="english-10").map(c=><option key={c.id} value={c.id}>{c.short}</option>)}</select></label>
      {course && <><p className="interior-context">{course.side}</p><nav aria-label="Course sections">{links(local)}</nav></>}
      <nav aria-label="Shared tools"><p className="mono interior-nav-label">SHARED TOOLS</p>{links(shared)}</nav>
      <Link className="interior-course-shortcut" href="/#courses" title="Choose a course"><BookOpen size={18}/><span>Choose a course</span></Link>
      <ThemeToggle/>
      <Link className="interior-admin" href="/admin" title="Teacher editor"><FilePenLine size={18}/><span>Teacher editor</span></Link>
    </aside>
    <div className="interior-body"><main id="content" className="interior-main">{children}</main><footer className="footer mono"><span>MRRINKA.COM</span><span>{courseId ? <>“We read books to find out who we are.” — <a href="https://www.theguardian.com/books/2018/jan/24/a-life-in-quotes-ursula-k-le-guin">Ursula K. Le Guin</a></> : "ENGLISH / LANGUAGE / LITERATURE"}</span></footer></div>
  </div>;
}
