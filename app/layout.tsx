import "./globals.css";
import type { Metadata, Viewport } from "next";
import { site, services } from "@/config/site";
export const metadata:Metadata={metadataBase:new URL(site.url),title:`${site.name} | Bridal, Hair, Skin & Makeup`,description:site.blurb,alternates:{canonical:"/"},
 openGraph:{title:site.name,description:site.blurb,type:"website",url:site.url},twitter:{card:"summary_large_image",title:site.name,description:site.blurb}};
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover"};
export default function Root({children}:{children:React.ReactNode}){
 const ld={"@context":"https://schema.org","@type":"BeautySalon",name:site.name,telephone:site.phone,address:site.address,url:site.url,sameAs:[site.instagram],
  openingHours:"Mo-Sa 10:00-20:00",hasOfferCatalog:{"@type":"OfferCatalog",itemListElement:services.map(s=>({"@type":"Offer",itemOffered:{"@type":"Service",name:s.name}}))}};
 return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld)}}/></body></html>;
}
