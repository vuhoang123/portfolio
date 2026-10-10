"use client";

import Link from "next/link";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { additionalWork, experiences, projects } from "@/lib/projects";

export default function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const chatMeeting = additionalWork.find((work) => work.title === "Chat Meeting");

  return (
    <section
      id="experience"
      className="career-section container"
      aria-labelledby="experience-heading"
    >
      <div className="career-header">
        <div>
          <p className="career-kicker">Experience / 2022 — now</p>
          <h2 id="experience-heading" className="career-heading">
            Where I’ve built.
          </h2>
        </div>
        <p className="career-intro">
          From industrial reporting interfaces to customer-facing websites and
          the admin systems behind them.
        </p>
      </div>

      <div className="career-timeline">
        {experiences.map((experience, index) => {
          const isOpen = activeIndex === index;
          const isCurrent = experience.period.includes("Present");
          const isMidota = experience.company.startsWith("Midota");
          const relatedProjects = projects.filter(
            (project) => project.company === experience.company,
          );
          const stack = [...new Set(relatedProjects.flatMap((project) => project.stack))];
          const startYear = experience.period.match(/\d{4}/)?.[0];
          const buttonId = `career-employer-${index}`;
          const panelId = `career-panel-${index}`;
          const description = isMidota && chatMeeting
            ? experience.description.slice(0, 2)
            : experience.description;

          return (
            <article
              key={experience.company}
              className={`career-item${isOpen ? " career-item-open" : ""}`}
            >
              <div className="career-year" aria-hidden="true">
                <span className="career-year-value">{startYear}</span>
                <span className="career-index">
                  {String(index + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}
                </span>
              </div>

              <div className="career-employer">
                <h3 className="career-employer-heading">
                  <button
                    id={buttonId}
                    type="button"
                    className="career-toggle"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setActiveIndex(isOpen ? null : index)}
                  >
                    <span className="career-company-block">
                      <span className="career-company">{experience.company}</span>
                      <span className="career-role">{experience.role}</span>
                    </span>
                    <span className="career-period-block">
                      <span className="career-period">
                        {experience.period.replace(" - ", " — ")}
                      </span>
                      <span className="career-status">
                        {isCurrent && <span className="career-status-dot" aria-hidden="true" />}
                        {isCurrent ? "Current role" : "Previous role"}
                      </span>
                    </span>
                    <span className="career-toggle-icon" aria-hidden="true">
                      {isOpen ? <Minus size={24} strokeWidth={1.6} /> : <Plus size={24} strokeWidth={1.6} />}
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  className="career-panel"
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                >
                  <div className="career-story">
                    {description.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {isMidota && chatMeeting && (
                      <div className="career-project-note">
                        <p className="career-note-label">Team Leader · Chat Meeting</p>
                        <p>{chatMeeting.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="career-details">
                    <div>
                      <p className="career-detail-label">Featured project stack</p>
                      <ul className="career-stack" aria-label="Featured project technologies">
                        {stack.map((technology) => (
                          <li key={technology}>{technology}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="career-related">
                      <p className="career-detail-label">Explore the work</p>
                      {relatedProjects.map((project) => (
                        <Link
                          key={project.slug}
                          className="career-project-link"
                          href={`/work/${project.slug}/`}
                        >
                          <span>{project.title}</span>
                          <ArrowUpRight size={20} aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
