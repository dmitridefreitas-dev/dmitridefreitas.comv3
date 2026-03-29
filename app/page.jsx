import HeroToggler from '@/components/hero/HeroToggler';
import InfoBanner from '@/components/sections/InfoBanner';
import AcademicTicker from '@/components/sections/FinanceTicker';
import KPIFullscreen from '@/components/sections/KPIFullscreen';
import ProjectsShowcase from '@/components/sections/ProjectsShowcase';
import SkillsHorizontal from '@/components/sections/SkillsHorizontal';
import CompetenciesSticky from '@/components/sections/CompetenciesSticky';
import TimelineScroll from '@/components/sections/TimelineScroll';
import CTASection from '@/components/sections/CTASection';
import SectionAtmosphere from '@/components/effects/SectionAtmosphere';

export const metadata = {
  title: 'Erich Huang — Financial Engineering & Accounting',
  description:
    'Portfolio of Erich Huang — Financial Engineering and Accounting at WashU. Incoming MUFG Financial Analyst. Credit risk research, FP&A, audit & assurance.',
};

export default function Home() {
  return (
    <>
      <HeroToggler />
      <InfoBanner />
      <AcademicTicker />
      <SectionAtmosphere atmosphere="work">
        <KPIFullscreen />
      </SectionAtmosphere>
      <SectionAtmosphere atmosphere="work">
        <ProjectsShowcase />
      </SectionAtmosphere>
      <SectionAtmosphere atmosphere="skills">
        <SkillsHorizontal />
      </SectionAtmosphere>
      <SectionAtmosphere atmosphere="skills">
        <CompetenciesSticky />
      </SectionAtmosphere>
      <SectionAtmosphere atmosphere="timeline">
        <TimelineScroll />
      </SectionAtmosphere>
      <SectionAtmosphere atmosphere="cta">
        <CTASection />
      </SectionAtmosphere>
    </>
  );
}
