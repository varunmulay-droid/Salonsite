"use client";
import { useEffect, useState } from "react";
import { site, services, cats, gallery, testimonials, wa, waService, Service } from "@/config/site";

function Drawer({s,onClose}:{s:Service|null;onClose:()=>void}){
 useEffect(()=>{const k=(e:KeyboardEvent)=>e.key==="Escape"&&onClose();addEventListener("keydown",k);return()=>removeEventListener("keydown",k)},[onClose]);
 if(!s)return null;
 return(<div className="fixed inset-0 z-50"><div className="absolute inset-0 bg-black/40" onClick={onClose}/>
  <aside role="dialog" aria-modal="true" aria-label={s.name} className="absolute right-0 top-0 h-full w-full max-w-md bg-cream overflow-y-auto rv">
   <div className={`h-64 bg-gradient-to-br ${s.tone}`}/><div className="p-6 space-y-4">
   <button autoFocus onClick={onClose} className="float-right text-2xl" aria-label="Close">✕</button>
   <h3 className="text-3xl">{s.name}</h3><p>{s.desc}</p>
   <p className="text-sm">⏱ {s.duration} · {s.price?`From ₹${s.price.toLocaleString("en-IN")}`:"Price on request"}</p>
   <ul className="list-disc pl-5 text-sm">{s.includes.map(i=><li key={i}>{i}</li>)}</ul>
   <a className="btn btn-p w-full" target="_blank" rel="noreferrer" href={waService(s.name)}>Enquire on WhatsApp</a></div></aside></div>);
}
function BeforeAfter(){const [p,setP]=useState(50);
 return(<div className="relative aspect-[4/3] rounded-3xl overflow-hidden select-none">
  <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-400 grid place-items-center text-white/80">Before</div>
  <div className="absolute inset-0 bg-gradient-to-br from-rose-300 to-amber-200 grid place-items-center text-white" style={{clipPath:`inset(0 0 0 ${p}%)`}}>After</div>
  <div className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none" style={{left:`${p}%`}}/>
  <input type="range" min={0} max={100} value={p} onChange={e=>setP(+e.target.value)} aria-label="Before and after comparison" className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"/></div>);}

export default function Site(){
 const [menu,setMenu]=useState(false);const [cat,setCat]=useState(cats[0]);const [sel,setSel]=useState<Service|null>(null);
 const [gc,setGc]=useState("All");const [lb,setLb]=useState<number|null>(null);const [t,setT]=useState(0);const [err,setErr]=useState("");
 useEffect(()=>{const h=(e:Event)=>setSel(services.find(s=>s.id===(e as CustomEvent).detail)||null);addEventListener("open-service",h);return()=>removeEventListener("open-service",h)},[]);
 const gl=gallery.filter(g=>gc==="All"||g.cat===gc);
 useEffect(()=>{if(lb===null)return;const k=(e:KeyboardEvent)=>{if(e.key==="Escape")setLb(null);if(e.key==="ArrowRight")setLb(i=>i===null?i:(i+1)%gl.length);if(e.key==="ArrowLeft")setLb(i=>i===null?i:(i-1+gl.length)%gl.length)};addEventListener("keydown",k);return()=>removeEventListener("keydown",k)},[lb,gl.length]);
 const submit=(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);const n=String(f.get("n")||"").trim(),m=String(f.get("m")||"").trim();
  if(n.length<2||m.length<5){setErr("Please enter your name and a short message.");return}setErr("");window.open(wa(`Hello, I'm ${n}. ${m}`),"_blank")};
 const sec="px-5 md:px-12 py-20 max-w-6xl mx-auto";
 return(<>
 <header className="fixed top-0 inset-x-0 z-30 bg-cream/85 backdrop-blur border-b border-black/5"><div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
  <a href="#" className="font-serif text-xl tracking-wide">{site.name}</a>
  <nav aria-label="Main" className="hidden lg:flex gap-7 text-sm">{site.nav.map(n=><a key={n[0]} href={n[1]} className="hover:text-brand">{n[0]}</a>)}</nav>
  <a className="btn btn-p hidden lg:inline-flex !py-2" href={wa("Hello, I'd like to book a consultation.")} target="_blank" rel="noreferrer">Book on WhatsApp</a>
  <button className="lg:hidden" aria-label="Open menu" aria-expanded={menu} onClick={()=>setMenu(true)}>☰</button></div></header>
 {menu&&<div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 bg-ink text-cream p-8 flex flex-col gap-5 rv" onKeyDown={e=>e.key==="Escape"&&setMenu(false)}>
  <button autoFocus className="self-end text-2xl" aria-label="Close menu" onClick={()=>setMenu(false)}>✕</button>
  {site.nav.map(n=><a key={n[0]} href={n[1]} onClick={()=>setMenu(false)} className="font-serif text-3xl">{n[0]}</a>)}
  <div className="mt-auto text-sm space-y-2"><a className="btn btn-p w-full" href={wa("Hello!")}>WhatsApp</a><a className="btn btn-o w-full" href={`tel:${site.phone}`}>Call</a><a className="btn btn-o w-full" href={site.instagram}>Instagram</a><p>{site.address}</p><p>{site.hours.map(h=>h.join(": ")).join(" · ")}</p></div></div>}
 <main>
 <section className="min-h-[100dvh] grid items-end bg-gradient-to-br from-rose-200 via-amber-50 to-rose-300 px-5 md:px-12 pb-20 pt-32 relative overflow-hidden">
  <div className="max-w-6xl mx-auto w-full rv"><p className="text-sm tracking-[.3em] uppercase mb-4">📍 {site.address.split(",")[1]||"Pune"}</p>
   <h1 className="text-5xl md:text-8xl max-w-3xl leading-[1.05] uppercase">{site.tagline}</h1><p className="mt-6 max-w-md text-lg">{site.blurb}</p>
   <div className="mt-8 flex flex-wrap gap-3"><a className="btn btn-p" target="_blank" rel="noreferrer" href={wa("Hello, I'd like to book a consultation.")}>Book on WhatsApp</a><a className="btn btn-o" href="#services">Explore Services</a></div>
   <p className="mt-10 inline-block bg-white/70 backdrop-blur rounded-full px-4 py-2 text-sm">★ Trusted by 500+ clients <span className="opacity-50">(demo)</span></p></div></section>
 <section id="about" className={sec}><div className="grid md:grid-cols-3 gap-8">{site.trust.map(x=><div key={x[1]} className="border-t border-brand/30 pt-4"><p className="font-serif text-5xl text-brand">{x[0]}</p><p className="text-sm mt-1">{x[1]}</p></div>)}</div></section>
 <section id="services" className={sec}><h2 className="text-4xl md:text-5xl mb-8">Services</h2>
  <div role="tablist" className="flex gap-2 overflow-x-auto pb-3">{cats.map(c=><button key={c} role="tab" aria-selected={c===cat} onClick={()=>setCat(c)} className={`btn !py-2 ${c===cat?"btn-p":"btn-o"}`}>{c}</button>)}</div>
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">{services.filter(s=>s.cat===cat).map(s=>
   <button key={s.id} onClick={()=>setSel(s)} className="text-left group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition"><div className={`h-44 bg-gradient-to-br ${s.tone} group-hover:scale-105 transition duration-500`}/>
    <div className="p-5 bg-white relative"><h3 className="text-xl">{s.name}</h3><p className="text-sm opacity-70 mt-1">{s.desc}</p><p className="text-sm mt-3 text-brand">{s.duration} · {s.price?`from ₹${s.price.toLocaleString("en-IN")}`:"on request"}</p></div></button>)}</div></section>
 <section id="bridal" className="bg-ink text-cream"><div className={sec}><h2 className="text-4xl md:text-5xl max-w-2xl">Your wedding look deserves more than a makeup appointment.</h2>
  <ol className="mt-10 grid md:grid-cols-3 gap-6">{["Consultation","Skin Preparation","Makeup","Hair Styling","Draping","Final Look"].map((s,i)=><li key={s} className="border-t border-accent/50 pt-3"><span className="text-accent text-sm">0{i+1}</span><p className="font-serif text-2xl">{s}</p></li>)}</ol>
  <div className="mt-12 max-w-xl"><BeforeAfter/></div>
  <a className="btn btn-p mt-8" target="_blank" rel="noreferrer" href={waService("a Bridal Consultation")}>Book a bridal consultation</a></div></section>
 <section id="gallery" className={sec}><h2 className="text-4xl md:text-5xl mb-6">Gallery</h2>
  <div className="flex gap-2 overflow-x-auto pb-3">{["All",...cats].map(c=><button key={c} onClick={()=>setGc(c)} className={`btn !py-2 ${c===gc?"btn-p":"btn-o"}`}>{c}</button>)}</div>
  <div className="columns-2 md:columns-3 gap-4 mt-4">{gl.map((g,i)=><button key={g.id} onClick={()=>setLb(i)} aria-label={`View ${g.label}`} className={`mb-4 w-full rounded-2xl bg-gradient-to-br ${g.tone} hover:brightness-95 transition`} style={{height:[220,300,180,260][i%4]}}><span className="text-xs bg-white/70 rounded-full px-3 py-1">{g.label}</span></button>)}</div>
  <p className="text-sm opacity-60">Demo visuals: replace gradients with your photos.</p></section>
 {lb!==null&&gl[lb]&&<div role="dialog" aria-modal="true" aria-label="Gallery viewer" className="fixed inset-0 z-50 bg-black/90 grid place-items-center" onClick={()=>setLb(null)}>
  <div onClick={e=>e.stopPropagation()} className={`w-[90vw] max-w-lg aspect-[3/4] rounded-2xl bg-gradient-to-br ${gl[lb].tone} grid place-items-center`}>{gl[lb].label}</div>
  <button autoFocus className="absolute top-4 right-4 text-white text-3xl" aria-label="Close" onClick={()=>setLb(null)}>✕</button>
  <button className="absolute left-3 text-white text-4xl" aria-label="Previous" onClick={e=>{e.stopPropagation();setLb((lb-1+gl.length)%gl.length)}}>‹</button>
  <button className="absolute right-3 text-white text-4xl" aria-label="Next" onClick={e=>{e.stopPropagation();setLb((lb+1)%gl.length)}}>›</button></div>}
 <section className="bg-rose-100"><div className={sec}><h2 className="text-4xl mb-6">Seen on Instagram</h2><div className="grid grid-cols-3 gap-2">{gallery.slice(0,6).map(g=><div key={g.id} className={`aspect-square bg-gradient-to-br ${g.tone} rounded-lg`} role="img" aria-label={g.label}/>)}</div>
  <a className="btn btn-p mt-6" href={site.instagram} target="_blank" rel="noreferrer">Follow us on Instagram</a></div></section>
 <section id="reviews" className={sec}><h2 className="text-4xl mb-8">Kind words</h2><blockquote className="font-serif text-2xl md:text-4xl max-w-3xl min-h-[8rem]">“{testimonials[t].q}”</blockquote>
  <p className="mt-4 text-sm">{"★".repeat(testimonials[t].r)} {testimonials[t].n} · {testimonials[t].s}</p>
  <div className="flex gap-2 mt-4">{testimonials.map((_,i)=><button key={i} aria-label={`Review ${i+1}`} onClick={()=>setT(i)} className={`h-2 w-8 rounded-full ${i===t?"bg-brand":"bg-brand/20"}`}/>)}</div></section>
 <section id="contact" className="bg-white"><div className={`${sec} grid md:grid-cols-2 gap-12`}><div><h2 className="text-4xl mb-4">Visit or message us</h2><p>{site.address}</p>
  <p className="mt-3 text-sm">{site.hours.map(h=><span key={h[0]} className="block">{h[0]}: {h[1]}</span>)}</p>
  <div className="mt-6 flex flex-wrap gap-3"><a className="btn btn-p" target="_blank" rel="noreferrer" href={site.mapsUrl}>Get Directions</a><a className="btn btn-o" target="_blank" rel="noreferrer" href={wa("Hello!")}>Chat on WhatsApp</a><a className="btn btn-o" href={`tel:${site.phone}`}>Call</a><a className="btn btn-o" href={`mailto:${site.email}`}>Email</a></div></div>
  <form onSubmit={submit} className="space-y-3" noValidate><label className="block text-sm">Name<input name="n" className="mt-1 w-full border rounded-xl px-4 py-3"/></label>
   <label className="block text-sm">Message<textarea name="m" rows={4} className="mt-1 w-full border rounded-xl px-4 py-3"/></label>
   {err&&<p role="alert" className="text-sm text-red-700">{err}</p>}<button className="btn btn-p w-full">Continue on WhatsApp</button><p className="text-xs opacity-60">Your enquiry continues in WhatsApp. Nothing is stored on this site.</p></form></div></section>
 </main>
 <footer className="px-5 py-10 pb-28 text-center text-sm opacity-70">© {new Date().getFullYear()} {site.name}</footer>
 <nav aria-label="Quick actions" className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-cream/95 backdrop-blur border-t grid grid-cols-3 text-sm pb-[env(safe-area-inset-bottom)]">
  <a className="py-3 text-center" href={`tel:${site.phone}`}>📞 Call</a><a className="py-3 text-center" target="_blank" rel="noreferrer" href={wa("Hello!")}>💬 WhatsApp</a><a className="py-3 text-center" target="_blank" rel="noreferrer" href={site.mapsUrl}>📍 Directions</a></nav>
 <Drawer s={sel} onClose={()=>setSel(null)}/></>);
}
