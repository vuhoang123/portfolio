"use client";

import dynamic from "next/dynamic";
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
    description: "The experience people see and use.",
  },
  {
    title: "Admin",
    label: "ADMIN",
    progress: 0.55,
    description: "The tools that keep everyday operations moving.",
  },
  {
    title: "Data",
    label: "DATA",
    progress: 1,
    description: "The logic that connects all the pieces.",
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
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
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
  const stage = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [webGL, setWebGL] = useState<boolean | null>(null);
  const sceneId = useId();
  const activeChapter = progress >= 0.8 ? 2 : progress >= 0.25 ? 1 : 0;

  useEffect(() => {
    setWebGL(browserSupportsWebGL());
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let animationFrame = 0;
    const update = () => {
      animationFrame = 0;
      if (!stage.current) return;
      const bounds = stage.current.getBoundingClientRect();
      const start = Math.min(140, window.innerHeight * 0.2);
      const travel = Math.max(260, Math.min(440, bounds.height * 0.8));
      const next = Math.max(0, Math.min(1, (start - bounds.top) / travel));
      setProgress((current) =>
        Math.abs(current - next) > 0.002 ? next : current,
      );
    };
    const scheduleUpdate = () => {
      if (!animationFrame)
        animationFrame = window.requestAnimationFrame(update);
    };
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [reducedMotion]);

  return (
    <div className="hero-experience">
      <div className="scene-header">
        <span className="scene-eyebrow">A PRODUCT, IN LAYERS</span>
        <span className="scene-status">
          <i />
          {webGL === false ? "Concept preview" : "Explore the layers"}
        </span>
      </div>
      <div
        className="scene-stage"
        ref={stage}
        id={sceneId}
        style={{ "--scene-progress": progress } as CSSProperties}
        aria-label="An illustrative product, from interface to operations and data"
      >
        <div className="scene-grid" aria-hidden="true" />
        <div className="scene-canvas" aria-hidden="true">
          {webGL ? (
            <SceneErrorBoundary fallback={<SceneFallback />}>
              <LayerScene progress={progress} reducedMotion={reducedMotion} />
            </SceneErrorBoundary>
          ) : (
            <SceneFallback loading={webGL === null} />
          )}
        </div>
        <span className="scene-layer-label scene-layer-label--ui">01 / UI</span>
        <span className="scene-layer-label scene-layer-label--admin">
          02 / ADMIN
        </span>
        <span className="scene-layer-label scene-layer-label--data">
          03 / DATA
        </span>
        <span className="scene-axis" aria-hidden="true">
          X<br />Y<br />Z
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
            onClick={() => setProgress(chapter.progress)}
          >
            <span className="scene-control-number">0{index + 1}</span>
            <span>{chapter.title}</span>
          </button>
        ))}
      </div>
      <div className="scene-caption">
        <span aria-live="polite">{chapters[activeChapter].description}</span>
        <span className="scene-caption-note">
          Illustrative UI · sample data
        </span>
      </div>
    </div>
  );
}
