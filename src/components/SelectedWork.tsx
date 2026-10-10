import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects";

const scopeByProject: Record<string, string[]> = {
  evisa: [
    "Order management from customer application forms.",
    "Database development and project setup.",
    "Admin configuration for blogs, pricing, FAQs, and public content.",
  ],
  skyservice: [
    "Full-stack implementation with Next.js and Laravel.",
    "Major contribution across a team-built airport-services website.",
  ],
  valqua: [
    "Daily equipment readings and report photos.",
    "OCR-assisted input workflows in Vue 2 / 3.",
    "Flange-parameter reporting interfaces.",
  ],
  offshore: [
    "UI implementation for international corporate services.",
    "Customer-facing pages within a Next.js and Laravel project.",
  ],
};

export default function SelectedWork() {
  return (
    <section id="work" className="selected-section container" aria-labelledby="work-heading">
      <div className="selected-heading">
        <div>
          <span className="eyebrow">01 / Selected work</span>
          <h2 id="work-heading">The work, inside out.<span>04</span></h2>
        </div>
        <p>Public interfaces. Internal tools.<br />A closer look at what I built.</p>
      </div>
      <div className="selected-list">
        {projects.map((project) => (
          <article className={`selected-row selected-${project.slug}`} key={project.slug}>
            <Link
              href={`/work/${project.slug}/`}
              className="selected-preview"
              style={{ "--preview-accent": project.accent } as CSSProperties}
              aria-label={`View ${project.title} case study`}
            >
              <div className="selected-preview-top">
                <span>{project.slug === "valqua" ? "Product introduction" : "Public website"}</span>
                <ArrowUpRight size={21} />
              </div>
              <div className="selected-browser">
                <div className="selected-browser-bar">
                  <span aria-hidden="true"><i /><i /><i /></span>
                  <span>{new URL(project.externalUrl).hostname}</span>
                </div>
                <Image src={project.image} alt={project.imageAlt} width={1265} height={712} sizes="(max-width: 800px) 92vw, 670px" />
              </div>
              <span className="selected-preview-note">
                {project.slug === "valqua"
                  ? "Public introduction; my work was inside the application."
                  : project.slug === "evisa"
                    ? "Public website; my main contribution was the admin system."
                    : "A live product built with the development team."}
              </span>
            </Link>
            <div className="selected-copy">
              <div className="selected-kicker"><span>{project.number}</span><span>{project.category}</span></div>
              <h3><Link href={`/work/${project.slug}/`}>{project.title}</Link></h3>
              <p className="selected-role">{project.role}<span>{project.company}</span></p>
              <div className="selected-scope">
                <span className="eyebrow">My scope</span>
                <ul>{scopeByProject[project.slug].map((scope) => <li key={scope}>{scope}</li>)}</ul>
              </div>
              <div className="selected-bottom">
                <div className="selected-stack">{project.stack.slice(0, 2).map((item) => <span key={item}>{item}</span>)}</div>
                <Link href={`/work/${project.slug}/`} className="selected-case-link">View case study <ArrowUpRight size={18} /></Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
