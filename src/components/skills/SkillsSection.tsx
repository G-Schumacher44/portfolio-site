import { skillCategories } from '../../data/skills';
import Section from '../layout/Section';
import SectionTitle from '../shared/SectionTitle';
import GlassPanel from '../shared/GlassPanel';
import ChipList from '../shared/ChipList';
import { FadeInStagger, FadeInStaggerItem } from '../shared/FadeIn';

export default function SkillsSection() {
  return (
    <Section id="skills">
      <SectionTitle>Skills & Certifications</SectionTitle>

      <FadeInStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((category) => (
          <FadeInStaggerItem key={category.title}>
            <GlassPanel>
              <h3 className="mb-3 text-sm font-semibold text-brand">
                {category.title}
              </h3>
              <ChipList items={category.skills} />
            </GlassPanel>
          </FadeInStaggerItem>
        ))}
      </FadeInStagger>
    </Section>
  );
}
