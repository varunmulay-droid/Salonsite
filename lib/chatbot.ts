import { site, services, faqs, wa, waService, Service } from "@/config/site";
export type Btn={l:string;v:string};
export type Reply={t:string;btns:Btn[];svc?:Service;link?:{l:string;href:string}};
const K:Record<string,string[]>={
 greeting:["hi","hello","hey","namaste"],bridal:["bridal","bride","wedding","marriage"],makeup:["makeup","make up"],
 hair:["hair","haircut","hairstyle"],skin:["facial","skin","skincare"],nails:["nail","nails","manicure"],
 pricing:["price","cost","how much","rate","charges","budget"],location:["where","address","location","reach","directions"],
 hours:["open","timing","hours","available","time"],contact:["contact","phone","number","call"],whatsapp:["whatsapp"],
 booking:["book","booking","appointment","enquiry","enquire"],gallery:["gallery","photos","portfolio"],
 services:["services","menu","offer"],thanks:["thanks","thank"],bye:["bye","goodbye"],unsure:["not sure","confused","help me choose"]};
export const norm=(s:string)=>" "+s.toLowerCase().replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim()+" ";
export function detect(input:string){const n=norm(input);
 return Object.keys(K).filter(i=>K[i].some(w=>n.includes(" "+w+" ")||(w.length>3&&n.includes(w)&&!["hi"].includes(w))));}
const main:Btn[]=[{l:"💄 Makeup",v:"makeup"},{l:"👰 Bridal",v:"bridal"},{l:"💇 Hair",v:"hair"},{l:"✨ Skin & Facial",v:"facial"},{l:"💅 Nails",v:"nails"},{l:"💰 Pricing",v:"pricing"},{l:"📍 Location",v:"location"},{l:"📅 Enquiry",v:"book"}];
export const welcome:Reply={t:`Hi 👋 Welcome to ${site.name}. What can I help you with?`,btns:main};
const price=(s:Service)=>s.price?`from ₹${s.price.toLocaleString("en-IN")}`:"pricing on request";
const find=(ids:string[])=>services.find(s=>ids.includes(s.id));
export function reply(input:string,state:{service?:string}):Reply{
 const it=detect(input),has=(x:string)=>it.includes(x);
 const more:Btn[]=[{l:"💰 Pricing",v:"pricing"},{l:"📅 Enquiry",v:"book"},{l:"📍 Location",v:"location"}];
 const wBtn:Btn={l:"💬 WhatsApp",v:"whatsapp"};
 let svc:Service|undefined;
 if(has("bridal")&&has("makeup"))svc=find(["bridal-makeup"]);else if(has("bridal"))svc=undefined;
 else if(has("hair"))svc=find(["hair-styling"]);else if(has("skin"))svc=find(["facial"]);
 else if(has("nails"))svc=find(["nail-art"]);else if(has("makeup"))svc=find(["party-makeup"]);
 const parts:string[]=[];let btns:Btn[]=[];let link;
 if(has("booking")){const n=svc?.name||state.service;
  return n?{t:`Great! Tap below to send your enquiry for ${n} on WhatsApp. You can add preferred date/time in the chat.`,btns:more,link:{l:"Send Enquiry on WhatsApp",href:waService(n)}}
   :{t:"I can help you start an enquiry. Which service are you interested in?",btns:services.slice(0,5).map(s=>({l:s.name,v:s.name}))};}
 if(has("bridal")&&!svc&&!has("pricing"))return{t:"Congratulations! 👰 What are you looking for?",btns:["Bridal Makeup","Pre-Bridal Package","Saree Draping","Hair Styling"].map(l=>({l,v:l})).concat([wBtn])};
 if(svc){parts.push(`${svc.name}: ${svc.desc} ${has("pricing")?`Starts ${price(svc)}.`:""}`);}
 else if(has("pricing")){parts.push("Here are our starting prices:\n"+services.filter(s=>s.price).map(s=>`• ${s.name}: ${price(s)}`).join("\n")+"\nFor an exact quote, message us on WhatsApp.");}
 if(has("hours")){parts.push("Opening hours:\n"+site.hours.map(h=>`${h[0]}: ${h[1]}`).join("\n")+"\n(Please confirm availability on WhatsApp.)");}
 if(has("location")){parts.push(`We're at ${site.address}.`);link={l:"📍 Get Directions",href:site.mapsUrl};}
 if(has("contact")||has("whatsapp")){parts.push(`Phone: ${site.phone}\nWhatsApp: ${site.phone}\nEmail: ${site.email}`);link={l:"💬 WhatsApp",href:wa("Hello, I'd like to get in touch.")};}
 if(has("gallery")){parts.push("Opening our gallery for you ✨");if(typeof window!=="undefined")document.getElementById("gallery")?.scrollIntoView({behavior:"smooth"});}
 if(has("services")){parts.push("We offer: "+Array.from(new Set(services.map(s=>s.cat))).join(", ")+".");btns=main.slice(0,5);}
 const n=norm(input);const f=faqs.find(f=>f.k.some(k=>n.includes(k)));if(f)parts.push(f.a);
 if(has("unsure")){return{t:"No problem! What are you preparing for?",btns:["Wedding","Party","Festival","Self-care"].map(l=>({l,v:l}))};}
 if(/\b(wedding|festival|party|self care|selfcare)\b/.test(n)&&!parts.length){const w=n.includes("wedding");return{t:w?"Are you the bride? Bridal Makeup is our most popular choice 👰":"Party Makeup or a Signature Facial would suit that.",btns:more,svc:find([w?"bridal-makeup":"party-makeup"])};}
 if(has("thanks"))return{t:"You're welcome! 😊 Anything else?",btns:main.slice(0,4)};
 if(has("bye"))return{t:"Goodbye! Hope to see you at the studio soon 💫",btns:[]};
 if(has("greeting")&&!parts.length)return welcome;
 if(has("hair")&&!svc)svc=find(["hair-styling"]);
 if(!parts.length&&!svc)return{t:"I'm happy to help! Please choose one of these options:",btns:[{l:"Services",v:"services"},{l:"Bridal",v:"bridal"},{l:"Pricing",v:"pricing"},{l:"Location",v:"location"},wBtn]};
 return{t:parts.join("\n\n")||`Here's what I'd suggest:`,btns:[...more,wBtn],svc,link};
}
