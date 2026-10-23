import { About } from "@/components/home/about";
import { Hero } from "@/components/home/hero";
import { HowIWork } from "@/components/home/how-i-work";
import { LetsTalk } from "@/components/home/lets-talk";
import { SelectedWork } from "@/components/home/selected-work";
import { WebWork } from "@/components/home/web-work";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader active="home" onHome />
      <main>
        <Hero />
        <About />
        <SelectedWork />
        <WebWork />
        <HowIWork />
        <LetsTalk />
      </main>
      <SiteFooter developerLink />
    </>
  );
}
