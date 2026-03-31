import HeroToggler from '@/components/hero/HeroToggler';
import InfoBanner from '@/components/sections/InfoBanner';
import AcademicTicker from '@/components/sections/FinanceTicker';
import SkillsNetwork from '@/components/sections/SkillsNetwork';
import SkillsReveal from '@/components/sections/SkillsReveal';
import CompetenciesSticky from '@/components/sections/CompetenciesSticky';
import CTASection from '@/components/sections/CTASection';
import SectionAtmosphere from '@/components/effects/SectionAtmosphere';

export const metadata = {
  title: 'Dmitri De Freitas — Data Science & Financial Engineering',
  description:
    'Portfolio of Dmitri De Freitas — Data Science & Financial Engineering at WashU. Data Scientist at Amphora Investment Management. PEAD research, ML modeling, algorithmic trading.',
};

export default function Home() {
  return (
    <>
      <HeroToggler />
      <InfoBanner />
      <AcademicTicker />
      <SectionAtmosphere atmosphere="skills">
        <SkillsNetwork />
      </SectionAtmosphere>
      <SectionAtmosphere atmosphere="skills">
        <CompetenciesSticky />
      </SectionAtmosphere>
      <SectionAtmosphere atmosphere="skills">
        <SkillsReveal />
      </SectionAtmosphere>
      <SectionAtmosphere atmosphere="cta">
        <CTASection />
      </SectionAtmosphere>
    </>
  );
}
