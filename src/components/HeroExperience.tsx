"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import {
  Component,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const LayerScene = dynamic(() => import("./LayerScene"), {
  ssr: false,
  loading: () => <SceneFallback loading />,
});

const chapters = [
  {
    title: "Interface",
    label: "UI",
    progress: 0,
    helper: "Customer touchpoints",
    description: "The experience people see, understand, and use.",
    href: "/work/skyservice/",
    relatedProject: "Vietnam Sky Service",
  },
  {
    title: "Admin",
    label: "ADMIN",
    progress: 0.55,
    helper: "Everyday operations",
    description: "The tools that keep everyday operations moving.",
    href: "/work/evisa/",
    relatedProject: "Global eVisa",
  },
  {
    title: "Data",
    label: "DATA",
    progress: 1,
    helper: "Connected information",
    description: "The information that connects an interface to its operations.",
    href: "/work/evisa/",
    relatedProject: "Global eVisa",
  },
] as const;

function SceneFallback({ loading = false }: { loading?: boolean }) {
  return (
    <div
      className={`scene-fallback${loading ? " scene-fallback--loading" : ""}`}
      aria-hidden="true"
    >
      <div className="fallback-window fallback-window--data">
        <div className="fallback-window-bar">
          <i />
          <i />
          <i />
          <span>architecture / concept</span>
        </div>
        <div className="fallback-panel fallback-panel--data">
          <span>SYSTEMS</span>
          <strong>A system that connects.</strong>
          <pre>
            {
              'interface → application → data\n\nconst product = {\n  experience: "thoughtful",\n  architecture: "maintainable"\n};'
            }
          </pre>
        </div>
      </div>
      <div className="fallback-window fallback-window--admin">
        <div className="fallback-window-bar">
          <i />
          <i />
          <i />
          <span>operations / demo</span>
        </div>
        <div className="fallback-panel fallback-panel--admin">
          <span>CONTROL ROOM</span>
          <strong>Service requests</strong>
          <div className="fallback-metrics">
            <b>
              24<small>Active requests</small>
            </b>
            <b>
              08<small>In progress</small>
            </b>
          </div>
          <div className="fallback-row">
            <span>DEMO-0042</span>
            <span>In progress</span>
          </div>
          <div className="fallback-row">
            <span>DEMO-0041</span>
            <span>Completed</span>
          </div>
        </div>
      </div>
      <div className="fallback-window fallback-window--interface">
        <div className="fallback-window-bar">
          <i />
          <i />
          <i />
          <span>interface / concept</span>
        </div>
        <div className="fallback-panel fallback-panel--interface">
          <span>SKY / SERVICE</span>
          <strong>
            Arrive with
            <br />
            confidence.
          </strong>
          <p>
            A smoother journey,
            <br />
            from the very first step.
          </p>
          <span className="fallback-button">Explore services ↗</span>
          <div className="fallback-plane">↗</div>
        </div>
      </div>
    </div>
  );
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function browserSupportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function HeroExperience() {
  const experience = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const manualProgress = useRef(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [webGL, setWebGL] = useState<boolean | null>(null);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const sceneId = useId();
  const captionId = `${sceneId}-caption`;
  const scrubberId = `${sceneId}-scrubber`;
  const activeChapter = progress >= 0.8 ? 2 : progress >= 0.25 ? 1 : 0;
  const currentChapter = chapters[activeChapter];
  const percentage = Math.round(progress * 100);
  const interactiveScene = webGL === true && !sceneFailed;
  const animationEnabled =
    interactiveScene && motionEnabled && !reducedMotion && heroVisible && documentVisible;
  const motionState = reducedMotion
    ? "reduced"
    : animationEnabled
      ? "playing"
      : "paused";
  const selectProgress = (next: number) => {
    manualProgress.current = true;
    setProgress(next);
  };

  useEffect(() => {
    setWebGL(browserSupportsWebGL());
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () =>
      setDocumentVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    const element = experience.current;
    const observer =
      element && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => setHeroVisible(entry.isIntersecting),
            { threshold: 0 },
          )
        : null;

    if (observer && element) observer.observe(element);
    else setHeroVisible(true);

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let animationFrame = 0;
    const update = () => {
      animationFrame = 0;
      if (manualProgress.current || !stage.current) return;
      const bounds = stage.current.getBoundingClientRect();
      const start = Math.min(140, window.innerHeight * 0.2);
      const travel = Math.max(260, Math.min(440, bounds.height * 0.8));
      const next = Math.max(0, Math.min(1, (start - bounds.top) / travel));
      setProgress((current) =>
        !manualProgress.current && Math.abs(current - next) > 0.002
          ? next
          : current,
      );
    };
    const scheduleUpdate = () => {
      if (!manualProgress.current && !animationFrame)
        animationFrame = window.requestAnimationFrame(update);
    };
    const isEditableTarget = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(
        target.closest(
          'input, textarea, select, [contenteditable="true"], [contenteditable=""], [role="textbox"], [role="slider"]',
        ),
      );
    const resumeFromPointerScroll = (event: WheelEvent | TouchEvent) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) return;
      if (event instanceof WheelEvent && event.deltaY === 0) return;
      manualProgress.current = false;
      scheduleUpdate();
    };
    const resumeFromKeyboardScroll = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isEditableTarget(event.target)
      ) {
        return;
      }
      if (
        !["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(
          event.key,
        )
      ) {
        return;
      }
      if (
        event.key === " " &&
        event.target instanceof Element &&
        event.target.closest("button, a, summary, [role='button']")
      ) {
        return;
      }
      manualProgress.current = false;
      scheduleUpdate();
    };
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("wheel", resumeFromPointerScroll, { passive: true });
    window.addEventListener("touchmove", resumeFromPointerScroll, { passive: true });
    window.addEventListener("keydown", resumeFromKeyboardScroll);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("wheel", resumeFromPointerScroll);
      window.removeEventListener("touchmove", resumeFromPointerScroll);
      window.removeEventListener("keydown", resumeFromKeyboardScroll);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [reducedMotion]);

  return (
    <div
      className="hero-experience"
      ref={experience}
      data-chapter={currentChapter.label.toLowerCase()}
      data-motion={motionState}
      style={{ "--scene-progress": progress } as CSSProperties}
    >
      <div className="scene-header">
        <span className="scene-eyebrow">Inside the web / 3 layers</span>
        <div className="scene-header-actions">
          <span className="scene-status">
            <i aria-hidden="true" />
            {webGL === null
              ? "Preparing preview"
              : !interactiveScene
                ? "Concept preview"
                : reducedMotion
                  ? "Reduced motion"
                  : !motionEnabled
                    ? "Motion paused"
                    : "Motion on"}
          </span>
          <button
            type="button"
            className="scene-motion-toggle"
            aria-label={reducedMotion ? "Animation disabled by reduced motion preference" : motionEnabled ? "Pause animation" : "Resume animation"}
            aria-controls={sceneId}
            disabled={reducedMotion || !interactiveScene}
            title={reducedMotion ? "Animation follows your reduced motion preference" : undefined}
            onClick={() => setMotionEnabled((enabled) => !enabled)}
          >
            {motionEnabled && !reducedMotion ? (
              <Pause size={14} aria-hidden="true" />
            ) : (
              <Play size={14} aria-hidden="true" />
            )}
            <span>{motionEnabled && !reducedMotion ? "Pause animation" : "Resume animation"}</span>
          </button>
        </div>
      </div>
      <div
        className="scene-stage"
        ref={stage}
        id={sceneId}
        role="img"
        style={{ "--scene-progress": progress } as CSSProperties}
        aria-label="An illustrative product, from interface to operations and data"
        aria-describedby={captionId}
      >
        <div className="scene-grid" aria-hidden="true" />
        <div className="scene-canvas" aria-hidden="true">
          {webGL && !sceneFailed ? (
            <SceneErrorBoundary
              fallback={<SceneFallback />}
              onError={() => setSceneFailed(true)}
            >
              <LayerScene
                progress={progress}
                reducedMotion={reducedMotion}
                animationEnabled={animationEnabled}
                onSelectLayer={(index: 0 | 1 | 2) => selectProgress(chapters[index].progress)}
              />
            </SceneErrorBoundary>
          ) : (
            <SceneFallback loading={webGL === null} />
          )}
        </div>
        {chapters.map((chapter, index) => (
          <span
            key={chapter.label}
            className={`scene-layer-label scene-layer-label--${chapter.label.toLowerCase()}${activeChapter === index ? " is-active" : ""}`}
            aria-hidden="true"
          >
            <span className="scene-layer-number">0{index + 1}</span>
            <span>{chapter.title}</span>
          </span>
        ))}
        <span className="scene-axis" aria-hidden="true">
          X<br />Y<br />Z
        </span>
        <span className="scene-interaction-hint" aria-hidden="true">
          {reducedMotion && interactiveScene ? (
            "Reduced motion · Select a layer"
          ) : interactiveScene ? (
            <>
              <span className="scene-hint-pointer">{motionEnabled ? "Move to tilt · Click a layer" : "Motion paused · Click a layer"}</span>
              <span className="scene-hint-touch">{motionEnabled ? "Tap a layer to explore" : "Motion paused · Tap a layer"}</span>
            </>
          ) : (
            "Use the controls to explore"
          )}
        </span>
      </div>
      <div
        className="scene-controls"
        role="group"
        aria-label="Explore the product layers"
      >
        {chapters.map((chapter, index) => (
          <button
            key={chapter.label}
            type="button"
            className={`scene-control${activeChapter === index ? " is-active" : ""}`}
            aria-pressed={activeChapter === index}
            aria-controls={sceneId}
            onPointerDown={() => { manualProgress.current = true; }}
            onClick={() => selectProgress(chapter.progress)}
          >
            <span className="scene-control-number">0{index + 1}</span>
            <span className="scene-control-copy">
              <strong>{chapter.title}</strong>
              <span>{chapter.helper}</span>
            </span>
            <span className="scene-control-indicator" aria-hidden="true">
              {activeChapter === index ? "●" : "↗"}
            </span>
          </button>
        ))}
      </div>
      <div className="scene-progress">
        <div className="scene-progress-label">
          <label htmlFor={scrubberId}>Explore layer depth</label>
          <span aria-hidden="true">{percentage}%</span>
        </div>
        <input
          id={scrubberId}
          className="scene-scrubber"
          type="range"
          min={0}
          max={100}
          step={1}
          value={percentage}
          aria-controls={sceneId}
          aria-valuetext={`${percentage} percent through the layers, ${currentChapter.title} view`}
          onPointerDown={() => { manualProgress.current = true; }}
          onKeyDown={(event) => {
            if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)
            ) {
              manualProgress.current = true;
            }
          }}
          onChange={(event) => selectProgress(Number(event.currentTarget.value) / 100)}
        />
      </div>
      <div className="scene-caption">
        <div className="scene-caption-copy" aria-live="polite" aria-atomic="true">
          <span className="scene-caption-current">
            0{activeChapter + 1} / {currentChapter.title}
          </span>
          <span id={captionId} className="scene-caption-description">
            {currentChapter.description}
          </span>
        </div>
        <div className="scene-caption-actions">
          <Link
            href={currentChapter.href}
            className="scene-related-work scene-evidence-link"
            aria-label={`View related work: ${currentChapter.relatedProject}`}
          >
            View related work <span aria-hidden="true">↗</span>
          </Link>
          <span className="scene-caption-note">Illustrative UI · sample data</span>
        </div>
      </div>
    </div>
  );
}
