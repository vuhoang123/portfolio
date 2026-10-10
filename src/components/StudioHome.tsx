import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUpRight } from "lucide-react";
import HeroExperience from "@/components/HeroExperience";
import DirectionExperience from "@/components/DirectionExperience";
import DirectionMotion from "@/components/DirectionMotion";
import { StudioHeader, StudioFooter } from "@/components/StudioChrome";
import { additionalWork, projects } from "@/lib/projects";

const projectScopes: Record<string, string> = {
  evisa: "Admin order management, database development, and configurable website content.",
  skyservice: "Substantial full-stack participation in a live airport-services website.",
  valqua: "Vue frontend modules for daily reports, photos, OCR-assisted input, and flange reporting.",
  offshore: "UI implementation for international corporate services within a Next.js / Laravel project.",
};

const tools = [
  { number: "01", title: "Interfaces", stack: "React · Next.js · Vue 2 / 3", description: "Customer-facing websites and practical reporting interfaces." },
  { number: "02", title: "Operations", stack: "PHP · Laravel · MySQL", description: "Admin systems, order management, and configurable public content." },
  { number: "03", title: "Connection", stack: "Frontend + backend integration", description: "Understanding the workflow behind the screen, then making it usable." },
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
          <span><i />Hoàng Anh Vũ / Full-stack engineer</span>
          <span>Ho Chi Minh City, VN</span>
        </div>
        <div className="direction-hero-composition">
          <div className="direction-hero-copy">
            <span className="direction-eyebrow">Interfaces + systems</span>
            <h1 id="direction-hero-title" aria-label="Beyond the interface.">Beyond<br /><span className="direction-outline">the</span>{" "}<br /><span className="direction-blue">interface.</span></h1>
            <p>I build the interfaces people use<br />and the systems teams run.</p>
            <a href="#work" className="direction-round-link" data-magnetic>
              <span data-magnetic-content><span>Explore<br />the work</span><ArrowDown size={24} aria-hidden="true" /></span>
            </a>
          </div>
          <HeroExperience />
        </div>
        <div className="direction-hero-foot"><span>Frontend craft. Full-stack thinking.</span><span>Scroll to discover <ArrowDown size={14} aria-hidden="true" /></span></div>
      </section>

      <section id="work" className="direction-work direction-container" aria-labelledby="direction-work-title">
        <div className="direction-section-heading" data-motion-reveal>
          <div><span className="direction-eyebrow">01 / Selected work</span><h2 id="direction-work-title">Made for<br /><span>real workflows.</span><sup>04</sup></h2></div>
          <p>Public websites. Internal operations.<br />A closer look at my contribution.</p>
        </div>
        <div className="direction-work-grid">
          {projects.map((project, index) => (
            <article className="direction-project" key={project.slug} data-motion-reveal style={{ "--reveal-delay": `${(index % 2) * 90}ms`, "--project-accent": project.accent } as CSSProperties}>
              <Link href={`/work/${project.slug}/`} className="direction-project-link" aria-label={`View ${project.title} case study`}>
                <div className="direction-project-index"><span>{project.number} / {project.category}</span><ArrowUpRight size={23} aria-hidden="true" /></div>
                <div className="direction-project-visual" data-motion-tilt>
                  <div className="direction-project-glow" />
                  <div className="direction-project-browser" data-motion-parallax>
                    <div className="direction-project-browser-bar"><span><i /><i /><i /></span><span>{new URL(project.externalUrl).hostname}</span></div>
                    <Image src={project.image} alt={project.imageAlt} width={1265} height={712} sizes="(max-width: 760px) 90vw, 45vw" />
                  </div>
                  <span className="direction-view-badge" aria-hidden="true">View case<ArrowUpRight size={24} /></span>
                </div>
                <div className="direction-project-name"><h3>{project.title}</h3><span>{project.stack.slice(0, 2).join(" / ")}</span></div>
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
            <span className="direction-eyebrow">02 / How I think</span>
            <h2 id="direction-about-title">A good interface<br />goes <em>deeper.</em></h2>
            <div className="direction-about-bottom">
              <p>I like understanding how a product works, from what a user sees to how a team manages it. My work connects frontend craft with the everyday systems behind the screen.</p>
              <span className="direction-orbit-mark" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="45" /><ellipse cx="60" cy="60" rx="22" ry="45" /><ellipse cx="60" cy="60" rx="45" ry="15" /><path d="M60 15V105M15 60H105" /></svg><ArrowUpRight size={28} /></span>
            </div>
          </div>
          <div className="direction-capabilities">
            {tools.map((tool, index) => (
              <article key={tool.title} data-motion-reveal style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}>
                <span>{tool.number}</span><h3>{tool.title}</h3><p>{tool.description}</p><small>{tool.stack}</small>
              </article>
            ))}
          </div>
          <div className="direction-education" data-motion-reveal>
            <div>
              <span className="direction-eyebrow">Education / 2019–2023</span>
              <p>Bachelor of Computer Science</p>
              <span>VNUHCM — University of Science</span>
            </div>
            <a href="https://www.linkedin.com/in/hoanganhvu2405/" target="_blank" rel="noreferrer">More on LinkedIn <ArrowUpRight size={20} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <DirectionExperience />

      <section className="direction-more direction-container" aria-labelledby="direction-more-title">
        <div className="direction-more-heading" data-motion-reveal>
          <span className="direction-eyebrow">04 / More things I’ve built</span>
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
