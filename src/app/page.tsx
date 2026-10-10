import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Braces } from "lucide-react";
import HeroExperience from "@/components/HeroExperience";
import SelectedWork from "@/components/SelectedWork";
import ExperienceSection from "@/components/ExperienceSection";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import {
  skillGroups,
  additionalWork,
} from "@/lib/projects";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="hero container" aria-labelledby="hero-heading">
          <div className="hero-meta">
            <span className="eyebrow">
              <i className="status-dot" /> Hoàng Anh Vũ / Full-stack engineer
            </span>
            <span className="hero-location">Based in Ho Chi Minh City, VN</span>
          </div>
          <div className="hero-composition">
            <div className="hero-copy">
              <div className="hero-index"><span>PORTFOLIO / 2026</span><span className="hero-index-line" /></div>
              <h1 id="hero-heading">
                Beyond<br />{" "}
                <span className="hero-outline">the</span> <span>interface.</span>
              </h1>
              <div className="hero-intro">
                <p>
                  I’m Hoàng Anh Vũ, a full-stack engineer.<br />
                  I build the interfaces people use — and the systems teams run.
                </p>
                <div className="hero-actions">
                  <a className="hero-primary" href="#work">
                    Explore my work <ArrowDown size={18} />
                  </a>
                  <a className="hero-secondary" href="https://github.com/vuhoang123" target="_blank" rel="noreferrer">
                    GitHub <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
              <div className="hero-specialties">
                <span>Frontend craft</span><i />
                <span>Full-stack thinking</span>
              </div>
            </div>
            <HeroExperience />
          </div>
          <div className="hero-footnote">
            <span>Good interfaces go deeper than the surface.</span>
            <span>
              Scroll to explore <ArrowDown size={13} />
            </span>
          </div>
        </section>
        <div className="stack-strip" aria-label="Core technologies">
          <div className="container stack-strip-inner">
            <span className="stack-strip-label">THE TOOLS BEHIND THE WORK</span>
            <span>React <i>↗</i></span><span>Next.js <i>↗</i></span>
            <span>Vue <i>↗</i></span><span>Laravel <i>↗</i></span>
          </div>
        </div>
        <SelectedWork />
        <ExperienceSection />
        <section
          id="about"
          className="about-section container"
          aria-labelledby="about-heading"
        >
          <div className="about-intro">
            <div>
              <span className="eyebrow">03 / A little about me</span>
              <h2 id="about-heading">
                Curious about
                <br />
                the whole system.
              </h2>
              <div className="about-monogram" aria-hidden="true">
                h<span>v</span>
                <div className="monogram-orbit" />
              </div>
            </div>
            <div className="about-copy">
              <p className="large-copy">
                I like understanding how a product works, from what a user sees
                to how a team manages it.
              </p>
              <p>
                My work spans customer-facing interfaces, configurable content,
                order management, and factory reporting. I’m comfortable moving
                between frontend development and Laravel applications, with a
                particular interest in clear, usable workflows.
              </p>
              <div className="education">
                <span className="eyebrow">Education</span>
                <p>Bachelor of Computer Science</p>
                <span>
                  VNUHCM — University of Science
                  <br />
                  2019–2023
                </span>
              </div>
              <a
                href="https://www.linkedin.com/in/hoanganhvu2405/"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                More on LinkedIn <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="skills-heading">
            <span className="eyebrow">Tools I work with</span>
            <span>Chosen to fit the work.</span>
          </div>
          <div className="skills-grid">
            {skillGroups.slice(0, 4).map((group) => (
              <div className="skill-group" key={group.label}>
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section
          className="more-section container"
          aria-labelledby="more-heading"
        >
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">04 / More things I’ve built</span>
              <h2 id="more-heading">Beyond the highlights.</h2>
            </div>
          </div>
          <div className="additional-grid">
            {additionalWork.map((item, index) => (
              <article className="additional-card" key={item.title}>
                <span className="mono">0{index + 1} / Earlier work</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.stack.length > 0 && (
                  <span className="additional-stack">
                    Vue · Laravel · MySQL · WebSocket
                  </span>
                )}
              </article>
            ))}
            <a
              className="additional-card package-card"
              href="https://github.com/vuhoang123/demo-package-affiliate"
              target="_blank"
              rel="noreferrer"
            >
              <div className="package-icon">
                <Braces size={28} />
                <ArrowUpRight size={23} />
              </div>
              <span className="mono">03 / Engineering demo</span>
              <h3>Laravel affiliate package</h3>
              <p>
                A reusable package demo covering migrations, models, services,
                controllers, and application integration.
              </p>
              <span className="text-link">
                Explore the repository <ArrowRight size={17} />
              </span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
