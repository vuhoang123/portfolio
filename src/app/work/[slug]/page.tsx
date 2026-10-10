import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
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

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: `${project.title} - Selected work`,
    description: project.description,
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <SiteHeader />
      <main id="main" className="case-main">
        <div className="container">
          <header className="case-intro">
            <div className="eyebrow">
              <Link href="/#work">Selected work</Link>
              <span aria-hidden="true"> / </span>
              <span>{project.number}</span>
              <span aria-hidden="true"> / </span>
              <span>{project.category}</span>
            </div>
            <h1 className="case-title">{project.title}</h1>
            <p className="case-headline">{project.headline}</p>
            <p>{project.description}</p>

            <dl className="case-facts">
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Company</dt>
                <dd>{project.company}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{project.stack.join(" / ")}</dd>
              </div>
              <div>
                <dt>Context</dt>
                <dd>{project.year}</dd>
              </div>
            </dl>

            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
              aria-label={`View ${project.title} public website (opens in a new tab)`}
            >
              View public website <span aria-hidden="true">↗</span>
            </a>
          </header>

          <figure className="case-image">
            <Image
              src={project.image}
              alt={project.imageAlt}
              width={1265}
              height={712}
              sizes="(max-width: 767px) 100vw, 1265px"
              preload
            />
            {project.scopeNote && (
              <figcaption className="case-caption">
                {project.scopeNote}
              </figcaption>
            )}
          </figure>

          <div className="case-body">
            <section className="case-section" aria-labelledby="context-heading">
              <h2 id="context-heading" className="section-kicker">
                01 / Context
              </h2>
              <p>{project.context}</p>
            </section>

            <section
              className="case-section"
              aria-labelledby="contribution-heading"
            >
              <h2 id="contribution-heading" className="section-kicker">
                02 / My contribution
              </h2>
              <ul className="case-contributions">
                {project.contributions.map((contribution) => (
                  <li key={contribution}>{contribution}</li>
                ))}
              </ul>
            </section>

            <section
              className="case-section"
              aria-labelledby="workflow-heading"
            >
              <h2 id="workflow-heading" className="section-kicker">
                03 / Workflow
              </h2>
              <ol className="case-workflow">
                {project.workflow.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section className="case-section" aria-labelledby="outcome-heading">
              <h2 id="outcome-heading" className="section-kicker">
                04 / Delivered capability
              </h2>
              <div className="case-outcome">
                <p>{project.outcome}</p>
              </div>
            </section>
          </div>

          <nav className="case-next" aria-label="Project navigation">
            <Link href="/#work" className="text-link">
              <span aria-hidden="true">←</span> All selected work
            </Link>
            <Link href={`/work/${nextProject.slug}`}>
              <span className="eyebrow">
                Next project / {nextProject.number}
              </span>
              <h2>
                {nextProject.title} <span aria-hidden="true">↗</span>
              </h2>
              <p>{nextProject.category}</p>
            </Link>
          </nav>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
