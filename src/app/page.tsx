import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Braces } from "lucide-react";
import HeroExperience from "@/components/HeroExperience";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import {
  projects,
  experiences,
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
              <i className="status-dot" /> Hoàng Anh Vũ / Web developer
            </span>
            <span className="hero-location">Based in Ho Chi Minh City, VN</span>
          </div>
          <h1 id="hero-heading">
            Interfaces people use.
            <br />
            <span>Systems teams run.</span>
          </h1>
          <div className="hero-intro">
            <a className="round-link" href="#work">
              <span>Explore my work</span>
              <ArrowDown size={18} />
            </a>
            <p>
              I’m a full-stack engineer building thoughtful frontends and the
              systems behind them.
              <br className="desktop-break" /> React, Next.js, Vue & Laravel.
            </p>
          </div>
          <HeroExperience />
          <div className="hero-footnote">
            <span>Good interfaces go deeper than the surface.</span>
            <span>
              Scroll to explore <ArrowDown size={13} />
            </span>
          </div>
        </section>
        <section
          id="work"
          className="work-section container"
          aria-labelledby="work-heading"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / Selected work</span>
              <h2 id="work-heading">
                Built for real
                <br />
                people & workflows.
              </h2>
            </div>
            <p>
              From public websites to the admin tools
              <br className="desktop-break" /> and reporting modules behind
              them.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article
                className={`project-card project-${project.slug}`}
                key={project.slug}
              >
                <Link
                  href={`/work/${project.slug}/`}
                  className="project-image-link"
                  aria-label={`View ${project.title} case study`}
                >
                  <div
                    className="project-image-shell"
                    style={
                      {
                        "--project-accent": project.accent,
                      } as React.CSSProperties
                    }
                  >
                    <div className="preview-browser">
                      <div className="preview-bar">
                        <span className="browser-dots">
                          <i />
                          <i />
                          <i />
                        </span>
                        <span>{new URL(project.externalUrl).hostname}</span>
                        <ArrowUpRight size={12} />
                      </div>
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        width={1265}
                        height={712}
                        sizes={
                          index === 0
                            ? "(max-width: 760px) 92vw, 1100px"
                            : "(max-width: 760px) 92vw, 550px"
                        }
                      />
                    </div>
                    <span className="project-open">
                      <ArrowUpRight size={22} />
                    </span>
                    <span className="image-label">
                      {project.slug === "valqua"
                        ? "Public product introduction"
                        : "Live website preview"}
                    </span>
                  </div>
                </Link>
                <div className="project-details">
                  <div>
                    <span className="project-category">
                      {project.number} / {project.category}
                    </span>
                    <h3>
                      <Link href={`/work/${project.slug}/`}>
                        {project.title} <ArrowUpRight size={23} />
                      </Link>
                    </h3>
                    <p>{project.description}</p>
                  </div>
                  <div className="project-stack">
                    {project.stack.slice(0, 2).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          id="experience"
          className="experience-section container"
          aria-labelledby="experience-heading"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / Experience</span>
              <h2 id="experience-heading">
                From interface
                <br />
                to implementation.
              </h2>
            </div>
            <p>
              Building professionally since 2022.
              <br />
              Across service platforms and industrial software.
            </p>
          </div>
          <div className="experience-list">
            {experiences.map((experience, index) => (
              <article className="experience-row" key={experience.company}>
                <div className="experience-period">
                  <span className="mono">0{index + 1}</span>
                  <p>{experience.period}</p>
                </div>
                <div className="experience-company">
                  <h3>{experience.company}</h3>
                  <span>{experience.role}</span>
                </div>
                <div className="experience-description">
                  {experience.description.slice(0, 2).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
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
