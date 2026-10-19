import { TechLabel } from "@/components/TechIcon";
import TechMarqueeMotion from "@/components/TechMarqueeMotion";

const toolkit = [
  "React", "Next.js", "Vue.js", "TypeScript", "JavaScript", "Laravel", "PHP",
  "MySQL", "Redux", "Docker", "Git", "SCSS", "Postman", "Figma",
];

export default function TechMarquee() {
  return (
    <TechMarqueeMotion>
      {[false, true].map((duplicate) => (
        <ul
          key={String(duplicate)}
          className="tech-marquee-group"
          aria-label={duplicate ? undefined : "Technologies and tools I work with"}
          aria-hidden={duplicate ? true : undefined}
        >
          {toolkit.map((name) => (
            <li key={name}><TechLabel name={name} iconSize={30} /></li>
          ))}
        </ul>
      ))}
    </TechMarqueeMotion>
  );
}
