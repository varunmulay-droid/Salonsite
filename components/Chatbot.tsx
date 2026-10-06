"use client";
import { useEffect, useRef, useState } from "react";
import { reply, welcome, Reply } from "@/lib/chatbot";
import { site, wa } from "@/config/site";
type M={who:"u"|"b";t?:string;r?:Reply};
export const track=(e:string)=>{try{console.debug("[chat]",e)}catch{}};
export default function Chatbot(){
 const [open,setOpen]=useState(false);const [typing,setTyping]=useState(false);
 const [msgs,setMsgs]=useState<M[]>([{who:"b",r:welcome}]);const [v,setV]=useState("");const end=useRef<HTMLDivElement>(null);
 const [hint,setHint]=useState(false);
 useEffect(()=>{try{if(!localStorage.getItem("hint")){const t=setTimeout(()=>setHint(true),4000);return()=>clearTimeout(t)}}catch{}},[]);
 useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"})},[msgs,typing,open]);
 useEffect(()=>{const k=(e:KeyboardEvent)=>e.key==="Escape"&&setOpen(false);addEventListener("keydown",k);return()=>removeEventListener("keydown",k)},[]);
 const dismiss=()=>{setHint(false);try{localStorage.setItem("hint","1")}catch{}};
 const send=(t:string,label?:string)=>{if(!t.trim())return;setMsgs(m=>[...m,{who:"u",t:label||t}]);setTyping(true);
  setTimeout(()=>{const r=reply(t,{});if(/pric/.test(t))track("pricing_requested");setMsgs(m=>[...m,{who:"b",r}]);setTyping(false)},450)};
 const openSvc=(id:string)=>window.dispatchEvent(new CustomEvent("open-service",{detail:id}));
 return(<>
  {!open&&<div className="fixed right-4 bottom-24 md:bottom-6 z-40 flex flex-col items-end gap-2">
   {hint&&<button onClick={dismiss} className="bg-white shadow-lg rounded-2xl px-4 py-2 text-sm rv">Need help choosing a service? ✕</button>}
   <button aria-label="Open beauty assistant chat" onClick={()=>{setOpen(true);dismiss();track("chat_opened")}} className="h-14 w-14 rounded-full bg-brand text-white text-2xl shadow-xl hover:scale-105 transition">💬<span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-accent"/></button></div>}
  {open&&<section role="dialog" aria-label="Beauty Assistant" className="fixed z-50 inset-x-0 bottom-0 h-[85dvh] md:inset-x-auto md:right-6 md:bottom-6 md:w-[380px] md:h-[600px] bg-cream rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden rv">
   <header className="bg-brand text-white p-4 flex justify-between items-center"><div><p className="font-serif text-lg">{site.name.split(" ")[0]} Beauty Assistant</p><p className="text-xs opacity-80">Usually replies instantly</p></div>
    <div className="flex gap-3 text-sm"><button onClick={()=>setMsgs([{who:"b",r:welcome}])}>Clear</button><button aria-label="Close chat" onClick={()=>setOpen(false)} className="text-xl">✕</button></div></header>
   <div className="flex-1 overflow-y-auto p-4 space-y-3" aria-live="polite">
    {msgs.map((m,i)=>{const r=m.r;return m.who==="u"?<p key={i} className="ml-auto max-w-[80%] bg-brand text-white rounded-2xl px-4 py-2 text-sm">{m.t}</p>:
     <div key={i} className="max-w-[90%] space-y-2"><p className="bg-white rounded-2xl px-4 py-2 text-sm whitespace-pre-line shadow-sm">{r!.t}</p>
      {r!.svc&&<div className="bg-white rounded-2xl overflow-hidden shadow-sm"><div className={`h-20 bg-gradient-to-br ${r!.svc.tone}`}/><div className="p-3 text-sm"><b>{r!.svc.name}</b><p className="opacity-70">{r!.svc.desc}</p>
       <div className="flex gap-2 mt-2"><button className="btn btn-o !py-1" onClick={()=>{openSvc(r!.svc!.id);setOpen(false)}}>View Details</button><a className="btn btn-p !py-1" target="_blank" rel="noreferrer" href={wa(`Hello, I am interested in ${r!.svc.name}.`)}>Enquire</a></div></div></div>}
      {r!.link&&<a className="btn btn-p" target="_blank" rel="noreferrer" href={r!.link.href} onClick={()=>track("link_clicked")}>{r!.link.l}</a>}
      {i===msgs.length-1&&<div className="flex flex-wrap gap-2">{r!.btns.slice(0,8).map(b=><button key={b.l} onClick={()=>{if(b.v==="whatsapp")window.open(wa("Hello, I'd like to enquire."),"_blank");else send(b.v,b.l)}} className="btn btn-o !py-1.5 !px-3 text-sm bg-white">{b.l}</button>)}</div>}</div>})}
    {typing&&<p className="bg-white w-16 rounded-2xl px-4 py-2 animate-pulse" aria-label="Typing">•••</p>}<div ref={end}/></div>
   <form onSubmit={e=>{e.preventDefault();send(v);setV("")}} className="p-3 border-t flex gap-2 bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))]">
    <input aria-label="Type your question" value={v} onChange={e=>setV(e.target.value)} placeholder="Ask about services, price…" className="flex-1 rounded-full border px-4 py-2 text-base"/><button className="btn btn-p">Send</button></form>
  </section>}</>);
}
