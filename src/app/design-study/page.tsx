import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUpRight } from "lucide-react";
import HeroExperience from "@/components/HeroExperience";
import DirectionExperience from "@/components/DirectionExperience";
import DirectionMotion from "@/components/DirectionMotion";
import { projects } from "@/lib/projects";
import "./design-study.css";
import "./motion.css";

export const metadata: Metadata = {
  title: "Developer studio — Design study",
  description: "An alternative portfolio direction for Hoàng Anh Vũ: visual projects, open experience chapters, and interaction throughout.",
  robots: { index: false, follow: false },
};

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

export default function DesignStudy() {
  return (
    <main className="direction-page" data-direction-root id="direction-top">
      <DirectionMotion />
      <a href="#direction-work" className="skip-link">Skip to selected work</a>
      <div className="direction-study-bar">
        <span>Concept 02 / Developer studio</span>
        <Link href="/"><ArrowLeft size={14} aria-hidden="true" /> View current portfolio</Link>
      </div>
      <header className="direction-header direction-container">
        <a className="direction-wordmark" href="#direction-top" aria-label="Hoàng Anh Vũ, top">VŨ<span>*</span></a>
        <nav aria-label="Design study navigation">
          <a href="#direction-work">Work<span>04</span></a>
          <a href="#journey">Experience</a>
          <a href="#direction-about">About</a>
        </nav>
        <a href="#direction-contact" className="direction-contact-button" data-magnetic>
          <span data-magnetic-content>Let’s talk <ArrowUpRight size={17} aria-hidden="true" /></span>
        </a>
      </header>

      <section className="direction-hero direction-container" aria-labelledby="direction-hero-title">
        <div className="direction-hero-meta">
          <span><i />Hoàng Anh Vũ / Full-stack engineer</span>
          <span>Ho Chi Minh City, VN</span>
        </div>
        <div className="direction-hero-composition">
          <div className="direction-hero-copy">
            <span className="direction-eyebrow">Interfaces + systems</span>
            <h1 id="direction-hero-title">Beyond<br /><span className="direction-outline">the</span>{" "}<br /><span className="direction-blue">interface.</span></h1>
            <p>I build the interfaces people use<br />and the systems teams run.</p>
            <a href="#direction-work" className="direction-round-link" data-magnetic>
              <span data-magnetic-content><span>Explore<br />the work</span><ArrowDown size={24} aria-hidden="true" /></span>
            </a>
          </div>
          <HeroExperience />
        </div>
        <div className="direction-hero-foot"><span>Frontend craft. Full-stack thinking.</span><span>Scroll to discover <ArrowDown size={14} aria-hidden="true" /></span></div>
      </section>

      <section id="direction-work" className="direction-work direction-container" aria-labelledby="direction-work-title">
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

      <section id="direction-about" className="direction-about" aria-labelledby="direction-about-title">
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
        </div>
      </section>

      <DirectionExperience />

      <section className="direction-contact" id="direction-contact" aria-labelledby="direction-contact-title">
        <div className="direction-container">
          <div className="direction-contact-top" data-motion-reveal><span className="direction-eyebrow">Open to frontend & full-stack roles</span><span>Ho Chi Minh City, VN</span></div>
          <div className="direction-contact-heading" data-motion-reveal><h2 id="direction-contact-title">Let’s make<br /><span>what’s next.</span></h2><a href="mailto:hoanganhvu.dev@gmail.com" className="direction-mail-circle" aria-label="Email Hoàng Anh Vũ" data-magnetic><span data-magnetic-content><ArrowUpRight size={46} aria-hidden="true" /><span>Get in touch</span></span></a></div>
          <a href="mailto:hoanganhvu.dev@gmail.com" className="direction-email" data-motion-reveal>hoanganhvu.dev@gmail.com<ArrowUpRight size={23} aria-hidden="true" /></a>
          <footer className="direction-footer"><span>© 2026 Hoàng Anh Vũ</span><div><a href="https://github.com/vuhoang123" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a><a href="https://www.linkedin.com/in/hoanganhvu2405/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a><a href="#direction-top">Back to top <ArrowUpRight size={14} aria-hidden="true" /></a></div></footer>
        </div>
      </section>
    </main>
  );
}
