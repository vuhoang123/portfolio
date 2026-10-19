"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

export default function TechMarqueeMotion({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [inView, setInView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const headingId = useId();
  const hintId = useId();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setDocumentVisible(document.visibilityState === "visible");
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    const element = section.current;
    const observer = element && "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
      : null;
    if (element && observer) observer.observe(element);
    else setInView(true);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  return (
    <section
      className="tech-marquee"
      ref={section}
      aria-labelledby={headingId}
      aria-describedby={hintId}
      tabIndex={reducedMotion ? undefined : 0}
      data-running={!reducedMotion && inView && documentVisible}
    >
      <div className="tech-marquee-heading">
        <h3 id={headingId}>Tools I build with</h3>
        <span id={hintId} className="kinetic-accessible-status">Scrolling pauses on mouse hover or keyboard focus.</span>
      </div>
      <div className="tech-marquee-viewport">
        <div className="tech-marquee-track">{children}</div>
      </div>
    </section>
  );
}
