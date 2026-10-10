"use client";

import { useEffect, useRef } from "react";

const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value));

/** Progressive enhancement for the nearest design-study root; renders no UI. */
export default function DirectionMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>("[data-direction-root]");
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reveals = [...root.querySelectorAll<HTMLElement>("[data-motion-reveal]")];
    const parallax = [...root.querySelectorAll<HTMLElement>("[data-motion-parallax]")];
    const completed = new Set<HTMLElement>();
    let stopMotion = () => {};

    const configure = () => {
      stopMotion();
      if (reduced.matches) return;

      const disposers: (() => void)[] = [];
      const activeParallax = new Set<HTMLElement>();
      let scrollFrame = 0;

      const updateParallax = () => {
        scrollFrame = 0;
        if (document.hidden) return;
        const viewport = Math.max(window.innerHeight, 1);
        activeParallax.forEach((element) => {
          const bounds = element.getBoundingClientRect();
          const offset = (bounds.top + bounds.height / 2 - viewport / 2) / viewport;
          element.style.setProperty("--parallax-y", `${clamp(-offset * 32, 16).toFixed(2)}px`);
        });
      };
      const scheduleParallax = () => {
        if (activeParallax.size && !scrollFrame && !document.hidden)
          scrollFrame = window.requestAnimationFrame(updateParallax);
      };

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const element = entry.target as HTMLElement;
            if (element.hasAttribute("data-motion-parallax")) {
              if (entry.isIntersecting) activeParallax.add(element);
              else activeParallax.delete(element);
            }
            if (entry.isIntersecting && element.hasAttribute("data-motion-reveal")) {
              completed.add(element);
              element.classList.remove("direction-reveal-pending");
              element.classList.add("direction-revealed");
              if (!element.hasAttribute("data-motion-parallax")) observer.unobserve(element);
            }
          });
          scheduleParallax();
        }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });

        reveals.forEach((element) => {
          // First-fold and already-visible content stays visible after hydration.
          const bounds = element.getBoundingClientRect();
          if (completed.has(element) || bounds.top < window.innerHeight) {
            completed.add(element);
            element.classList.add("direction-revealed");
          } else {
            element.classList.add("direction-reveal-pending");
            observer.observe(element);
          }
        });
        parallax.forEach((element) => observer.observe(element));
        root.classList.add("direction-motion-ready");
        disposers.push(() => observer.disconnect());
        window.addEventListener("scroll", scheduleParallax, { passive: true });
        window.addEventListener("resize", scheduleParallax, { passive: true });
        document.addEventListener("visibilitychange", scheduleParallax);
        disposers.push(() => {
          window.cancelAnimationFrame(scrollFrame);
          window.removeEventListener("scroll", scheduleParallax);
          window.removeEventListener("resize", scheduleParallax);
          document.removeEventListener("visibilitychange", scheduleParallax);
          parallax.forEach((element) => element.style.removeProperty("--parallax-y"));
        });
      }

      if (finePointer.matches) {
        const bindPointer = (element: HTMLElement, update: (x: number, y: number) => void, reset: () => void) => {
          let frame = 0;
          let pointerX = 0;
          let pointerY = 0;
          const move = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;
            pointerX = event.clientX;
            pointerY = event.clientY;
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
              frame = 0;
              const bounds = element.getBoundingClientRect();
              update(
                clamp((pointerX - bounds.left) / Math.max(bounds.width, 1) * 2 - 1, 1),
                clamp((pointerY - bounds.top) / Math.max(bounds.height, 1) * 2 - 1, 1),
              );
            });
          };
          const leave = () => {
            window.cancelAnimationFrame(frame);
            frame = 0;
            reset();
          };
          element.addEventListener("pointermove", move, { passive: true });
          element.addEventListener("pointerleave", leave);
          element.addEventListener("pointercancel", leave);
          disposers.push(() => {
            element.removeEventListener("pointermove", move);
            element.removeEventListener("pointerleave", leave);
            element.removeEventListener("pointercancel", leave);
            leave();
          });
        };

        root.querySelectorAll<HTMLElement>("[data-motion-tilt]").forEach((element) => {
          const reset = () => {
            ["--tilt-x", "--tilt-y", "--glow-x", "--glow-y"].forEach((name) => element.style.removeProperty(name));
          };
          bindPointer(element, (x, y) => {
            element.style.setProperty("--tilt-x", `${(-y * 2).toFixed(2)}deg`);
            element.style.setProperty("--tilt-y", `${(x * 2).toFixed(2)}deg`);
            element.style.setProperty("--glow-x", `${((x + 1) * 50).toFixed(1)}%`);
            element.style.setProperty("--glow-y", `${((y + 1) * 50).toFixed(1)}%`);
          }, reset);
        });

        root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((element) => {
          const content = element.querySelector<HTMLElement>("[data-magnetic-content]");
          if (!content) return;
          bindPointer(element, (x, y) => {
            content.style.setProperty("--magnetic-x", `${(x * 6).toFixed(2)}px`);
            content.style.setProperty("--magnetic-y", `${(y * 6).toFixed(2)}px`);
          }, () => {
            content.style.removeProperty("--magnetic-x");
            content.style.removeProperty("--magnetic-y");
          });
        });
      }

      stopMotion = () => {
        disposers.forEach((dispose) => dispose());
        root.classList.remove("direction-motion-ready");
        reveals.forEach((element) => element.classList.remove("direction-reveal-pending"));
      };
    };

    configure();
    reduced.addEventListener("change", configure);
    finePointer.addEventListener("change", configure);
    return () => {
      stopMotion();
      reduced.removeEventListener("change", configure);
      finePointer.removeEventListener("change", configure);
      reveals.forEach((element) => element.classList.remove("direction-revealed"));
    };
  }, []);

  return <span ref={marker} hidden aria-hidden="true" />;
}
