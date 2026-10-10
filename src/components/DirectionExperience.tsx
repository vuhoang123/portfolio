import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { additionalWork, experiences, projects } from "@/lib/projects";
import "../app/design-study/experience.css";

export default function DirectionExperience() {
  const chatMeeting = additionalWork.find((work) => work.title === "Chat Meeting");

  return (
    <section
      id="journey"
      className="direction-experience"
      aria-labelledby="direction-journey-heading"
    >
      <header className="direction-career-header" data-motion-reveal="">
        <div>
          <p className="direction-career-kicker">Experience / 2022 — now</p>
          <h2 id="direction-journey-heading" className="direction-career-heading">
            Built with teams.
          </h2>
        </div>
        <p className="direction-career-intro">
          Customer-facing experiences, the systems behind them, and the reporting
          tools teams use.
        </p>
      </header>

      <div className="direction-career-chapters">
        {experiences.map((experience, index) => {
          const isMidota = experience.company.startsWith("Midota");
          const isCurrent = experience.period.includes("Present");
          const relatedProjects = projects.filter(
            (project) => project.company === experience.company,
          );
          const preview = relatedProjects.find(
            (project) => project.slug === (isMidota ? "valqua" : "evisa"),
          );
          const stack = [...new Set(relatedProjects.flatMap((project) => project.stack))];
          const paragraphs = isMidota && chatMeeting
            ? experience.description.slice(0, 2)
            : experience.description;
          const startYear = experience.period.match(/\d{4}/)?.[0];
          const companyHeadingId = `direction-career-company-${index}`;

          return (
            <article
              className="direction-career-chapter"
              key={experience.company}
              aria-labelledby={companyHeadingId}
              data-motion-reveal=""
            >
              <div className="direction-career-identity">
                <div className="direction-career-year-row" aria-hidden="true">
                  <span className="direction-career-year">{startYear}</span>
                  <span className="direction-career-index">0{index + 1}</span>
                </div>
                <h3 className="direction-career-company" id={companyHeadingId}>
                  {experience.company}
                </h3>
                <p className="direction-career-role">{experience.role}</p>
                <p className="direction-career-period">
                  {experience.period.replace(" - ", " — ")}
                </p>
                {isCurrent && (
                  <span className="direction-career-current">
                    <span aria-hidden="true" /> Current role
                  </span>
                )}
              </div>

              <div className="direction-career-body">
                <div className="direction-career-content">
                  <div className="direction-career-narrative">
                    {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>

                  {isMidota && (
                    <p className="direction-career-context">
                      VALQUA scope: selected Vue frontend modules. Ruby on Rails
                      was the application’s backend context.
                    </p>
                  )}

                  <div className="direction-career-stack-block">
                    <p className="direction-career-detail-label">Featured project stack</p>
                    <ul className="direction-career-stack" aria-label="Featured project technologies">
                      {stack.map((technology) => <li key={technology}>{technology}</li>)}
                    </ul>
                  </div>

                  {isMidota && chatMeeting && (
                    <aside className="direction-career-team-note" aria-label="Chat Meeting project role">
                      <p className="direction-career-note-label">Project role / Chat Meeting</p>
                      <h4 className="direction-career-note-heading">Web Developer &amp; Team Leader</h4>
                      <p>{chatMeeting.description}</p>
                    </aside>
                  )}

                  <div className="direction-career-projects">
                    <p className="direction-career-detail-label">Related work</p>
                    {relatedProjects.map((project) => (
                      <Link
                        className="direction-career-project-link"
                        key={project.slug}
                        href={`/work/${project.slug}/`}
                      >
                        <span>
                          <span className="direction-career-project-title">{project.title}</span>
                          <span className="direction-career-project-scope">{project.category}</span>
                        </span>
                        <ArrowUpRight size={21} strokeWidth={1.6} aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>

                {preview && (
                  <figure className="direction-career-preview">
                    <Link
                      className="direction-career-preview-link"
                      href={`/work/${preview.slug}/`}
                      aria-label={`View ${preview.title} case study`}
                    >
                      <div className="direction-career-preview-bar" aria-hidden="true">
                        <span className="direction-career-preview-dots"><i /><i /><i /></span>
                        <span>Public website</span>
                        <ArrowUpRight size={16} strokeWidth={1.6} />
                      </div>
                      <div className="direction-career-preview-image">
                        <Image
                          src={preview.image}
                          alt={preview.imageAlt}
                          width={1265}
                          height={712}
                          sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 260px, 240px"
                        />
                      </div>
                    </Link>
                    <figcaption className="direction-career-preview-caption">
                      <strong>{preview.title}</strong>
                      <span>{preview.scopeNote}</span>
                    </figcaption>
                  </figure>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
