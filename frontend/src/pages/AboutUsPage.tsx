import { SiteFooter } from "~/components/layout/SiteFooter";
import { SiteHeader } from "~/components/layout/SiteHeader";
import { AboutHero } from "~/components/about/AboutHero";
import { StorySection } from "~/components/about/StorySection";
import { MissionVision } from "~/components/about/MissionVision";
import { ValuesGrid } from "~/components/about/ValuesGrid";
import { TeamSection } from "~/components/about/TeamSection";
import { TechStackSection } from "~/components/about/TechStackSection";
import { WhySection } from "~/components/about/WhySection";
import { CTASection } from "~/components/about/CTASection";

export function AboutUsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-grow overflow-x-hidden">
                <AboutHero />
                <StorySection />
                <MissionVision />
                <ValuesGrid />
                <TeamSection />
                <TechStackSection />
                <WhySection />
                <CTASection />
            </main>
            <SiteFooter />
        </div>
    )
}