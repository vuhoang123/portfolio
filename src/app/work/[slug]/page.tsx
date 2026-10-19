import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import DirectionMotion from "@/components/DirectionMotion";
import { StudioFooter, StudioHeader } from "@/components/StudioChrome";
import { TechLabel } from "@/components/TechIcon";
import { caseStudies, type CaseStudyPresentation } from "@/lib/case-studies";
import { getProjectBySlug, projects, type Project } from "@/lib/projects";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title + " - Selected work",
    description: project.description,
    openGraph: {
      title: project.title + " - Selected work by Hoàng Anh Vũ",
      description: project.description,
      type: "website",
      locale: "en_US",
    },
  };
}

function PublicPreview({ project, secondary = false }: { project: Project; secondary?: boolean }) {
  return (
    <figure className={"study-preview" + (secondary ? " study-preview--context" : "")}>
      <div className="study-preview-stage" data-motion-tilt>
        <div className="study-preview-glow" aria-hidden="true" />
        <div className="study-browser" data-motion-parallax>
          <div className="study-browser-bar">
            <span className="study-browser-address">{new URL(project.externalUrl).hostname}</span>
            <span className="study-browser-public">Public preview</span>
          </div>
          <Image
            src={project.image}
            alt={project.imageAlt}
            width={1265}
            height={712}
            sizes={secondary
              ? "(max-width: 760px) calc(100vw - 80px), (max-width: 900px) calc(100vw - 112px), 910px"
              : "(max-width: 760px) calc(100vw - 80px), (max-width: 1100px) calc(100vw - 136px), 1168px"}
            preload={!secondary}
          />
        </div>
      </div>
      <figcaption className="study-preview-caption">
        <div className="study-preview-caption-heading">
          <span className="study-preview-label">
            {project.slug === "valqua" ? "Public product introduction" : "Public website"}
          </span>
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="study-public-link"
            aria-label={"View " + project.title + " public website (opens in a new tab)"}
          >
            Visit public website <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        {!secondary && project.scopeNote && <p>{project.scopeNote}</p>}
      </figcaption>
    </figure>
  );
}

function WorkflowIllustration({ presentation }: { presentation: CaseStudyPresentation }) {
  return (
    <figure className="study-illustration" aria-label="Illustration of confirmed module workflows">
      <figcaption className="study-flow-caption">{presentation.flowNote}</figcaption>
      {presentation.lanes.map((lane) => (
        <div className="study-flow-lane" key={lane.title}>
          <h3>{lane.title}</h3>
          <div className="study-lane-body">
            <ul className="study-flow-inputs" aria-label={lane.title + " inputs"}>
              {lane.inputs.map((step) => (
                <li className={"study-flow-node" + (step.own ? " study-flow-node--own" : "")} key={step.title} data-motion-reveal>
                  <span className="study-flow-scope">{step.scope}</span>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </li>
              ))}
            </ul>
            <span className="study-flow-connector" aria-hidden="true">
              <ArrowRight size={30} strokeWidth={1.5} />
            </span>
            <div className={"study-flow-node study-flow-destination" + (lane.destination.own ? " study-flow-node--own" : "")} data-motion-reveal>
              <span className="study-flow-scope">{lane.destination.scope}</span>
              <h4>{lane.destination.title}</h4>
              <p>{lane.destination.body}</p>
            </div>
          </div>
        </div>
      ))}
    </figure>
  );
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const presentation = caseStudies[slug];
  if (!project || !presentation) notFound();

  const moduleStudy = presentation.depth === "module";
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "scope", label: "My contribution" },
    { id: "flow", label: "Product flow" },
    { id: "context", label: "Public context" },
  ];
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <div className="direction-page" data-direction-root>
      <DirectionMotion />
      <StudioHeader />
      <main id="main" className={"study-main" + (moduleStudy ? " study-main--module" : " study-main--summary")} tabIndex={-1}>
        <div className="study-shell">
          <div className="study-breadcrumb">
            <Link href="/#work" className="study-back">
              <ArrowLeft size={18} aria-hidden="true" />All selected work
            </Link>
          </div>

          <div className="study-opening">
            <header id="overview" className="study-intro" data-motion-reveal>
              <p className="study-kicker">{project.category}</p>
              <h1 className="study-title">{project.title}</h1>
              <p className="study-headline">{project.headline}</p>
              <p className="study-description">{project.context}</p>
              <a
                href="#scope"
                className="study-visit"
                data-magnetic
              >
                <span data-magnetic-content>
                  Explore my contribution <ArrowDown size={19} aria-hidden="true" />
                </span>
              </a>
            </header>
            <dl className="study-meta" data-motion-reveal>
              <div><dt>My role</dt><dd>{project.role}</dd></div>
              <div><dt>Company</dt><dd>{project.company}</dd></div>
              <div>
                <dt>Project stack</dt>
                <dd className="study-stack">{project.stack.map((tech) => <TechLabel key={tech} name={tech} iconSize={16} />)}</dd>
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
                    <li key={section.id}><a href={"#" + section.id}>{section.label}</a></li>
                  ))}
                </ol>
              </nav>
            </aside>

            <div className="study-content">
              <section id="scope" className="study-section" aria-labelledby="scope-heading">
                <div className="study-section-heading" data-motion-reveal>
                  <h2 id="scope-heading">{presentation.scopeHeading}</h2>
                </div>
                <p className="study-section-lead">{presentation.scopeIntro}</p>
                {presentation.implementation && (
                  <div className="study-implementation" data-motion-reveal>
                    <div className="study-implementation-heading">
                      <span className="study-implementation-label">Implementation focus</span>
                      <h3>{presentation.implementation.title}</h3>
                    </div>
                    <dl className="study-implementation-steps">
                      {presentation.implementation.steps.map((step) => (
                        <div key={step.label}>
                          <dt>{step.label}</dt>
                          <dd>{step.body}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
                {presentation.modules.length > 0 && (
                  <div className="study-modules">
                    {presentation.modules.map((module) => (
                      <article className="study-module" key={module.title} data-motion-reveal>
                        <h3>{module.title}</h3>
                        <p>{module.body}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section id="flow" className={"study-section " + (moduleStudy ? "study-section--flow" : "study-section--journey")} aria-labelledby="flow-heading">
                <div className="study-section-heading" data-motion-reveal>
                  <h2 id="flow-heading">{presentation.flowHeading}</h2>
                </div>
                <p className="study-section-lead">{presentation.flowIntro}</p>
                {moduleStudy ? (
                  <WorkflowIllustration presentation={presentation} />
                ) : (
                  <>
                    <ol className="study-journey" aria-label="Public website journey" data-motion-reveal>
                      {presentation.journey?.map((step) => <li key={step}>{step}<ArrowRight size={22} aria-hidden="true" /></li>)}
                    </ol>
                    <p className="study-journey-note">{presentation.flowNote}</p>
                  </>
                )}
              </section>

              <section id="context" className="study-section" aria-labelledby="context-heading">
                <div className="study-section-heading" data-motion-reveal>
                  <h2 id="context-heading">The public side of the product.</h2>
                </div>
                <p className="study-section-lead">{presentation.boundary}</p>
                <PublicPreview project={project} secondary />
              </section>
            </div>
          </div>

          <nav className="study-next" aria-label="Project navigation">
            <Link href="/#work" className="study-return"><ArrowLeft size={17} aria-hidden="true" />Back to all selected work</Link>
            <Link href={"/work/" + nextProject.slug + "/"} className="study-next-project" data-motion-reveal>
              <div className="study-next-copy">
                <span className="study-next-label">Next case study</span>
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
