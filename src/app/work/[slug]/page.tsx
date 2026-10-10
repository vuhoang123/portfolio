import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import DirectionMotion from "@/components/DirectionMotion";
import { StudioFooter, StudioHeader } from "@/components/StudioChrome";
import { caseStudies } from "@/lib/case-studies";
import { getProjectBySlug, projects } from "@/lib/projects";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title + " - Selected work",
    description: project.description,
    openGraph: {
      title: project.title + " — Selected work by Hoàng Anh Vũ",
      description: project.description,
      type: "website",
      locale: "en_US",
    },
  };
}

const sections = [
  { id: "overview", number: "01", label: "Overview" },
  { id: "scope", number: "02", label: "My scope" },
  { id: "flow", number: "03", label: "Product flow" },
  { id: "delivered", number: "04", label: "Delivered" },
];

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const presentation = caseStudies[slug];
  if (!project || !presentation) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const publicHost = new URL(project.externalUrl).hostname;

  return (
    <div className="direction-page" data-direction-root style={{ "--study-accent": project.accent } as CSSProperties}>
      <DirectionMotion />
      <StudioHeader />
      <main id="main" className="study-main" tabIndex={-1}>
        <div className="study-shell">
          <div className="study-breadcrumb">
            <Link href="/#work" className="study-back">
              <ArrowLeft size={18} aria-hidden="true" />
              All selected work
            </Link>
            <span>{project.number} / 04</span>
          </div>

          <div className="study-opening">
          <header className="study-intro" data-motion-reveal>
            <div className="study-kicker">
              <span>Selected work / {project.number}</span>
              <span aria-hidden="true">—</span>
              <span>{project.category}</span>
            </div>
            <h1 className="study-title">{project.title}</h1>
            <div className="study-intro-bottom">
              <p className="study-headline">{project.headline}</p>
              <div className="study-intro-actions">
                <p className="study-description">{project.description}</p>
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="study-visit"
                  data-magnetic
                  aria-label={"View " + project.title + " public website (opens in a new tab)"}
                >
                  <span data-magnetic-content>
                    View public website <ArrowUpRight size={20} aria-hidden="true" />
                  </span>
                </a>
              </div>
            </div>
          </header>

          <figure className="study-preview">
            <div className="study-preview-stage" data-motion-tilt>
              <div className="study-preview-glow" aria-hidden="true" />
              <div className="study-preview-stage-label" aria-hidden="true">
                <span>{project.slug === "valqua" ? "Product introduction" : "Public website"}</span>
                <span>{project.stack.slice(0, 2).join(" / ")}</span>
              </div>
              <div className="study-browser" data-motion-parallax>
                <div className="study-browser-bar" aria-hidden="true">
                  <span className="study-browser-dots">
                    <span className="study-browser-dot" />
                    <span className="study-browser-dot" />
                    <span className="study-browser-dot" />
                  </span>
                  <span className="study-browser-address">{publicHost}</span>
                  <span className="study-browser-public">Public preview</span>
                </div>
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  width={1265}
                  height={712}
                  sizes="(max-width: 760px) calc(100vw - 72px), (max-width: 1100px) calc(100vw - 136px), 1168px"
                  preload
                />
              </div>
            </div>
            <figcaption className="study-preview-caption" data-motion-reveal>
              <span className="study-preview-label">{project.slug === "valqua" ? "Public product introduction" : "Public website preview"}</span>
              <p>{project.scopeNote}</p>
            </figcaption>
          </figure>
          <dl className="study-meta" data-motion-reveal>
            <div><dt>My role</dt><dd>{project.role}</dd></div>
            <div><dt>Company</dt><dd>{project.company}</dd></div>
            <div>
              <dt>Project stack</dt>
              <dd className="study-stack">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</dd>
            </div>
            <div><dt>Context</dt><dd>{project.year}</dd></div>
          </dl>
          </div>

          <div className="study-layout">
            <aside className="study-nav-wrap">
              <nav className="study-nav" aria-label="Case study sections">
                <span className="study-nav-label">In this case study</span>
                <ol>
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a href={"#" + section.id}>
                        <span aria-hidden="true">{section.number}</span>{section.label}
                      </a>
                    </li>
                  ))}
                </ol>
                <span className="study-nav-note">
                  {project.company}<br />{project.role}
                </span>
              </nav>
            </aside>

            <div className="study-content">
              <section id="overview" className="study-section" aria-labelledby="overview-heading">
                <div className="study-section-heading" data-motion-reveal>
                  <span className="study-section-number">01 / Overview</span>
                  <h2 id="overview-heading">The product & my place in it.</h2>
                </div>
                <p className="study-overview-copy">{project.context}</p>
                <dl className="study-summary-grid">
                  <div className="study-summary-card" data-motion-reveal><dt>Product</dt><dd>{presentation.product}</dd></div>
                  <div className="study-summary-card" data-motion-reveal><dt>People</dt><dd>{presentation.audience}</dd></div>
                  <div className="study-summary-card" data-motion-reveal><dt>My focus</dt><dd>{presentation.focus}</dd></div>
                </dl>
              </section>

              <section id="scope" className="study-section" aria-labelledby="scope-heading">
                <div className="study-section-heading" data-motion-reveal>
                  <span className="study-section-number">02 / My scope</span>
                  <h2 id="scope-heading">What I worked on.</h2>
                </div>
                <p className="study-section-lead">{presentation.scopeIntro}</p>
                <div className="study-modules">
                  {presentation.modules.map((module, index) => (
                    <article className="study-module" key={module.title} data-motion-reveal style={{ "--reveal-delay": `${(index % 2) * 70}ms` } as CSSProperties}>
                      <span className="study-module-number">{String(index + 1).padStart(2, "0")} / Contribution</span>
                      <h3>{module.title}</h3>
                      <p>{module.body}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section id="flow" className="study-section study-section--flow" aria-labelledby="flow-heading">
                <div className="study-section-heading" data-motion-reveal>
                  <span className="study-section-number">03 / Product flow</span>
                  <h2 id="flow-heading">How the pieces connect.</h2>
                </div>
                <p className="study-section-lead">{presentation.flowIntro}</p>
                <div className="study-flow">
                  <div className="study-flow-top">
                    <span>Workflow illustration</span>
                    <span>{project.stack.slice(0, 2).join(" / ")}</span>
                  </div>
                  {presentation.lanes.map((lane) => (
                    <div className="study-flow-lane" key={lane.title}>
                      <h3>{lane.title}</h3>
                      <ol className="study-flow-steps" style={{ "--study-flow-columns": lane.steps.length } as CSSProperties}>
                        {lane.steps.map((step) => (
                          <li className={"study-flow-step" + (step.own ? " study-flow-step--own" : "")} key={step.title} data-motion-reveal>
                            <span className="study-flow-scope">{step.scope}</span>
                            <h4>{step.title}</h4>
                            <p>{step.body}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                  {presentation.foundation && (
                    <div className="study-flow-foundation" data-motion-reveal>
                      <strong>{presentation.foundation.title}</strong>
                      <p>{presentation.foundation.body}</p>
                    </div>
                  )}
                </div>
                <p className="study-flow-note">{presentation.flowNote}</p>
              </section>

              <section id="delivered" className="study-section" aria-labelledby="delivered-heading">
                <div className="study-section-heading" data-motion-reveal>
                  <span className="study-section-number">04 / Delivered</span>
                  <h2 id="delivered-heading">The contribution, in practice.</h2>
                </div>
                <div className="study-delivered" data-motion-reveal><p>{project.outcome}</p></div>
                <div className="study-capabilities">
                  {presentation.capabilities.map((capability) => (
                    <article className="study-capability" key={capability.title} data-motion-reveal>
                      <h3><Check size={16} aria-hidden="true" />{capability.title}</h3>
                      <p>{capability.body}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <nav className="study-next" aria-label="Project navigation">
            <Link href="/#work" className="study-return"><ArrowLeft size={17} aria-hidden="true" />Back to all selected work</Link>
            <Link href={"/work/" + nextProject.slug + "/"} className="study-next-project" data-motion-reveal>
              <div className="study-next-copy">
                <span className="study-next-label">Next case study / {nextProject.number}</span>
                <strong>{nextProject.title}</strong>
                <p>{nextProject.category}</p>
                <span className="study-next-arrow"><ArrowUpRight size={28} aria-hidden="true" /></span>
              </div>
              <div className="study-next-visual" style={{ "--next-accent": nextProject.accent } as CSSProperties}>
                <div className="study-next-browser">
                  <Image src={nextProject.image} alt={nextProject.imageAlt} width={1265} height={712} sizes="(max-width: 760px) calc(100vw - 96px), 500px" />
                </div>
                <span>{nextProject.slug === "valqua" ? "Public product introduction" : "Public website preview"}</span>
              </div>
            </Link>
          </nav>
        </div>
      </main>
      <StudioFooter />
    </div>
  );
}
