import { createFileRoute } from "@tanstack/react-router";
import { HeroSlider } from "@/components/home/hero-slider";
import { VanitySection } from "@/components/showcase/vanity-section";
import {
  FaqCta,
  LookbookRail,
  ServicesBento,
  ServicesMarquee,
  StatsRow,
  TeamStrip,
  Testimonials,
} from "@/components/home/home-sections";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <HeroSlider />
      <ServicesMarquee />
      <StatsRow />
      <ServicesBento />
      <VanitySection />
      <LookbookRail />
      <TeamStrip />
      <Testimonials />
      <FaqCta />
    </main>
  );
}
