import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import HeroExperience from "@/components/HeroExperience";
import DirectionExperience from "@/components/DirectionExperience";
import DirectionMotion from "@/components/DirectionMotion";
import { TechLabel } from "@/components/TechIcon";
import TechMarquee from "@/components/TechMarquee";
import { StudioHeader, StudioFooter } from "@/components/StudioChrome";
import { additionalWork, projects } from "@/lib/projects";

const projectScopes: Record<string, string> = {
  evisa: "Admin order management, database development, and configurable website content.",
  skyservice: "Substantial full-stack participation in a live airport-services website.",
  valqua: "Vue frontend modules for daily reports, photos, OCR-assisted input, and flange reporting.",
  offshore: "UI implementation for international corporate services within a Next.js / Laravel project.",
};

const tools = [
  { title: "Interfaces", stack: ["React", "Next.js", "Vue 2 / 3"], description: "Customer-facing websites and practical reporting interfaces." },
  { title: "Operations", stack: ["PHP", "Laravel", "MySQL"], description: "Admin systems, order management, and configurable public content." },
];

export default function StudioHome({ preview = false }: { preview?: boolean }) {
  const pharma = additionalWork.find((work) => work.title === "Pharmastream-net");
  return (
    <div className="direction-page" data-direction-root>
      <DirectionMotion />
      {preview && (
      <div className="direction-study-bar">
        <span>Developer studio / Design preview</span>
        <Link href="/"><ArrowLeft size={14} aria-hidden="true" /> View current portfolio</Link>
      </div>
      )}
      <StudioHeader />
      <main id="main" tabIndex={-1}>
      <section className="direction-hero direction-container" aria-labelledby="direction-hero-title">
        <div className="direction-hero-meta">
          <span className="direction-identity">Hoàng Anh Vũ<strong>Frontend / Full-stack Engineer</strong></span>
        </div>
        <div className="direction-hero-composition">
          <div className="direction-hero-copy">
            <div className="direction-hero-stack">{["React", "Next.js", "Vue", "Laravel"].map((name) => <TechLabel key={name} name={name} iconSize={16} />)}</div>
            <h1 id="direction-hero-title" aria-label="Beyond the interface.">Beyond <span className="direction-outline">the</span><br /><span className="direction-blue">interface.</span></h1>
            <p>I build the interfaces people use<br />and the systems teams run.</p>
            <a href="#work" className="direction-round-link" data-magnetic>
              <span data-magnetic-content>View work<ArrowUpRight size={21} aria-hidden="true" /></span>
            </a>
          </div>
          <HeroExperience />
        </div>
      </section>

      <section id="work" className="direction-work direction-container" aria-labelledby="direction-work-title">
        <div className="direction-section-heading" data-motion-reveal>
          <h2 id="direction-work-title">Selected <span>work.</span></h2>
          <p>Public websites. Internal operations.<br />A closer look at my contribution.</p>
        </div>
        <div className="direction-work-grid">
          {projects.map((project, index) => (
            <article className="direction-project" key={project.slug} data-motion-reveal style={{ "--reveal-delay": `${(index % 2) * 90}ms`, "--project-accent": project.accent } as CSSProperties}>
              <Link href={`/work/${project.slug}/`} className="direction-project-link" aria-label={`View ${project.title} case study`}>
                <div className="direction-project-index"><span>{project.category}</span><ArrowUpRight size={23} aria-hidden="true" /></div>
                <div className="direction-project-visual" data-motion-tilt>
                  <div className="direction-project-glow" />
                  <div className="direction-project-browser" data-motion-parallax>
                    <div className="direction-project-browser-bar"><span><i /><i /><i /></span><span>{new URL(project.externalUrl).hostname}</span></div>
                    <Image src={project.image} alt={project.imageAlt} width={1265} height={712} sizes="(max-width: 760px) 90vw, 45vw" />
                  </div>
                  <span className="direction-view-badge" aria-hidden="true">View case<ArrowUpRight size={24} /></span>
                </div>
                <div className="direction-project-name"><h3>{project.title}</h3><div className="direction-project-stack">{project.stack.slice(0, 2).map((name) => <TechLabel key={name} name={name} iconSize={14} />)}</div></div>
                <p className="direction-project-scope">{projectScopes[project.slug]}</p>
              </Link>
              <p className="direction-public-note">{project.slug === "valqua" ? "Public product introduction; my work was inside the application." : project.slug === "evisa" ? "Public website preview; my main contribution was the admin system." : `${project.role} · ${project.company}`}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="direction-about" aria-labelledby="direction-about-title">
        <div className="direction-container">
          <div className="direction-about-intro" data-motion-reveal>
            <h2 id="direction-about-title">A good interface<br />goes <em>deeper.</em></h2>
            <div className="direction-about-bottom">
              <p>I like understanding how a product works, from what a user sees to how a team manages it. My work connects frontend craft with the everyday systems behind the screen.</p>
              <a className="direction-about-repository" href="https://github.com/vuhoang123" target="_blank" rel="noreferrer">Explore my GitHub <ArrowUpRight size={22} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="direction-capabilities">
            {tools.map((tool, index) => (
              <article key={tool.title} data-motion-reveal style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}>
                <h3>{tool.title}</h3><p>{tool.description}</p><div className="direction-capability-stack">{tool.stack.map((name) => <TechLabel key={name} name={name} iconSize={17} />)}</div>
              </article>
            ))}
          </div>
          <TechMarquee />
          <div className="direction-education" data-motion-reveal>
            <div>
              <span className="direction-eyebrow">Education / 2019–2023</span>
              <p>Bachelor of Computer Science</p>
              <span>VNUHCM - University of Science</span>
            </div>
            <a href="https://www.linkedin.com/in/hoanganhvu2405/" target="_blank" rel="noreferrer">More on LinkedIn <ArrowUpRight size={20} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <DirectionExperience />

      <section className="direction-more direction-container" aria-labelledby="direction-more-title">
        <div className="direction-more-heading" data-motion-reveal>
          <h2 id="direction-more-title">Beyond the highlights.</h2>
        </div>
        <div className="direction-more-grid">
          {pharma && (
            <article className="direction-more-card" data-motion-reveal>
              <span className="direction-eyebrow">Frontend + UI/UX / 2023–2024</span>
              <h3>{pharma.title}</h3>
              <p>{pharma.description}</p>
            </article>
          )}
          <a className="direction-more-card direction-more-link" href="https://github.com/vuhoang123/demo-package-affiliate" target="_blank" rel="noreferrer" data-motion-reveal style={{ "--reveal-delay": "90ms" } as CSSProperties}>
            <span className="direction-eyebrow">Engineering demo / Laravel</span>
            <h3>Affiliate package <ArrowUpRight size={24} aria-hidden="true" /></h3>
            <p>A reusable package demo covering migrations, models, services, controllers, and application integration.</p>
            <span className="direction-more-cta">Explore the repository <ArrowUpRight size={17} aria-hidden="true" /></span>
          </a>
        </div>
      </section>
      </main>
      <StudioFooter />
    </div>
  );
}
