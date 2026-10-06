// Single source of truth: edit this file to rebrand (e.g. "Mitalli Bridal World").
export const site = {
  name:"Lumière Beauty Studio", tagline:"Beauty, redefined.",
  blurb:"Bridal beauty, hair, skin and makeup experiences designed around you.",
  phone:"+919999999999", whatsapp:"919999999999", email:"hello@example.com",
  address:"12 Demo Street, Koregaon Park, Pune 411001",
  mapsUrl:"https://www.google.com/maps/search/?api=1&query=Koregaon+Park+Pune",
  instagram:"https://instagram.com/yourstudio",
  hours:[["Mon–Sat","10:00 AM – 8:00 PM"],["Sunday","By appointment"]],
  url:process.env.NEXT_PUBLIC_SITE_URL||"https://example.com",
  trust:[["8+","Years experience (demo)"],["500+","Clients (demo)"],["12","Certified artists (demo)"]],
  nav:[["About","#about"],["Services","#services"],["Bridal","#bridal"],["Gallery","#gallery"],["Reviews","#reviews"],["Contact","#contact"]],
  offer:{title:"Bridal Season",text:"Book your bridal consultation this month.",endDate:""},
};
export type Service={id:string;name:string;cat:string;desc:string;price?:number;duration:string;includes:string[];tone:string};
const T=["from-rose-200 to-amber-100","from-stone-300 to-rose-100","from-amber-100 to-rose-300","from-rose-300 to-stone-200"];
export const cats=["Bridal","Hair","Skin","Nails","Spa","Party"];
export const services:Service[]=[
 {id:"bridal-makeup",name:"Bridal Makeup",cat:"Bridal",desc:"HD or airbrush finish tailored to your outfit and skin.",price:15000,duration:"3 hrs",includes:["Trial consult","Skin prep","Lashes","Touch-up kit"],tone:T[0]},
 {id:"pre-bridal",name:"Pre-Bridal Package",cat:"Bridal",desc:"Weeks of skin and hair prep before the big day.",duration:"Multi-session",includes:["Facials","Body polish","Hair spa"],tone:T[1]},
 {id:"saree-draping",name:"Saree Draping",cat:"Bridal",desc:"Pleat-perfect draping for weddings and receptions.",price:1500,duration:"45 min",includes:["Draping","Pinning"],tone:T[2]},
 {id:"hair-styling",name:"Hair Styling",cat:"Hair",desc:"Cuts, color and event styling.",price:800,duration:"1 hr",includes:["Consultation","Wash","Style"],tone:T[3]},
 {id:"facial",name:"Signature Facial",cat:"Skin",desc:"Deep-cleanse and glow treatment.",price:2500,duration:"75 min",includes:["Cleanse","Mask","Massage"],tone:T[0]},
 {id:"nail-art",name:"Nail Art",cat:"Nails",desc:"Gel, extensions and custom art.",price:1200,duration:"90 min",includes:["Shape","Gel polish","Art"],tone:T[1]},
 {id:"spa",name:"Relaxation Spa",cat:"Spa",desc:"Massage and body rituals.",duration:"60–90 min",includes:["Massage","Aromatherapy"],tone:T[2]},
 {id:"party-makeup",name:"Party Makeup",cat:"Party",desc:"Polished looks for any celebration.",price:3500,duration:"1.5 hrs",includes:["Makeup","Lashes","Hair touch"],tone:T[3]},
];
export const gallery=services.map((s,i)=>({id:i,label:s.name,cat:s.cat,tone:s.tone}));
export const testimonials=[
 {q:"Demo testimonial: replace with a real client review.",n:"Client A",s:"Bridal Makeup",r:5},
 {q:"Demo testimonial: replace with a real client review.",n:"Client B",s:"Facial",r:5},
 {q:"Demo testimonial: replace with a real client review.",n:"Client C",s:"Hair Styling",r:5}];
export const faqs=[
 {k:["appointment","book in advance"],a:"Appointments are recommended for bridal and premium services. You can enquire on WhatsApp."},
 {k:["home service","at home"],a:"Please ask the studio on WhatsApp about home service availability."},
 {k:["package"],a:"Bridal packages are available. Contact the studio for availability and exact pricing."}];
export const wa=(msg:string)=>`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;
export const waService=(n:string)=>wa(`Hello, I am interested in ${n}. I would like to know about availability and pricing.`);
