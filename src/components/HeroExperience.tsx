"use client";

import dynamic from "next/dynamic";
import { Orbit, Pause, Play, Sparkles, Type, Waves } from "lucide-react";
import {
  Component,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { KineticProgressSource } from "./KineticScene";

const KineticScene = dynamic(() => import("./KineticScene"), {
  ssr: false,
  loading: () => <SceneFallback loading />,
});

const chapters = [
  {
    title: "Signature",
    label: "SIGNATURE",
    progress: 0,
    helper: "Assemble",
    description: "A signature built from moving blocks.",
    icon: Type,
  },
  {
    title: "Orbit",
    label: "ORBIT",
    progress: 0.55,
    helper: "Unfold",
    description: "The same blocks become an orbital ribbon.",
    icon: Orbit,
  },
  {
    title: "Wave",
    label: "WAVE",
    progress: 1,
    helper: "Flow",
    description: "A flowing surface shaped by your cursor.",
    icon: Waves,
  },
] as const;

function SceneFallback({ loading = false }: { loading?: boolean }) {
  return (
    <div
      className={`kinetic-fallback${loading ? " kinetic-fallback--loading" : ""}`}
      aria-hidden="true"
    >
      <span className="kinetic-fallback-signature">VŨ</span>
      <span className="kinetic-fallback-orbit" />
      <span className="kinetic-fallback-orbit kinetic-fallback-orbit--second" />
      <div className="kinetic-fallback-blocks">
        {Array.from({ length: 16 }, (_, index) => <i key={index} style={{ left: `${8 + (index * 19) % 84}%`, top: `${5 + (index * 31) % 88}%` }} />)}
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
  const scrubber = useRef<HTMLInputElement>(null);
  const progressLabel = useRef<HTMLSpanElement>(null);
  const manualProgress = useRef(false);
  const progress = useRef(0);
  const progressListeners = useRef(new Set<() => void>());
  const activeChapterRef = useRef(0);
  const [activeChapter, setActiveChapter] = useState(0);
  // Continuous input stays outside React. The canvas subscribes to redraws,
  // while chapter changes remain state for the accessible text and controls.
  const progressSource = useMemo<KineticProgressSource>(() => ({
    get: () => progress.current,
    subscribe: (listener) => {
      progressListeners.current.add(listener);
      return () => { progressListeners.current.delete(listener); };
    },
  }), []);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [webGL, setWebGL] = useState<boolean | null>(null);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [pulseToken, setPulseToken] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const sceneId = useId();
  const captionId = `${sceneId}-caption`;
  const scrubberId = `${sceneId}-scrubber`;
  const currentChapter = chapters[activeChapter];
  const interactiveScene = webGL === true && !sceneFailed;
  const animationEnabled =
    interactiveScene && motionEnabled && !reducedMotion && heroVisible && documentVisible;
  const motionState = reducedMotion
    ? "reduced"
    : animationEnabled
      ? "playing"
      : "paused";
  const updateProgress = useCallback((next: number) => {
    const value = Math.max(0, Math.min(1, next));
    if (value === progress.current) return;
    progress.current = value;
    const chapter = value >= 0.8 ? 2 : value >= 0.25 ? 1 : 0;
    const percentage = Math.round(value * 100);
    experience.current?.style.setProperty("--scene-progress", String(value));
    if (progressLabel.current) progressLabel.current.textContent = `${percentage}%`;
    if (scrubber.current) {
      scrubber.current.value = String(percentage);
      scrubber.current.setAttribute(
        "aria-valuetext",
        `${percentage} percent transformed, ${chapters[chapter].title} form`,
      );
    }
    if (chapter !== activeChapterRef.current) {
      activeChapterRef.current = chapter;
      setActiveChapter(chapter);
    }
    progressListeners.current.forEach((listener) => listener());
  }, []);
  const selectProgress = useCallback((next: number) => {
    manualProgress.current = true;
    updateProgress(next);
  }, [updateProgress]);
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
    if (!interactiveScene) {
      updateProgress(0);
      return;
    }
    if (reducedMotion) return;
    let animationFrame = 0;
    const update = () => {
      animationFrame = 0;
      if (manualProgress.current || !stage.current) return;
      const bounds = stage.current.getBoundingClientRect();
      const start = Math.min(140, window.innerHeight * 0.2);
      const travel = Math.max(260, Math.min(440, bounds.height * 0.8));
      const next = window.scrollY < 20 ? 0 : Math.max(0, Math.min(1, (start - bounds.top) / travel));
      if (!manualProgress.current && Math.abs(progress.current - next) > 0.002)
        updateProgress(next);
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
  }, [interactiveScene, reducedMotion, updateProgress]);

  return (
    <div
      className="hero-experience kinetic-experience"
      ref={experience}
      data-chapter={currentChapter.label.toLowerCase()}
      data-motion={motionState}
      style={{ "--scene-progress": 0 } as CSSProperties}
    >
      <div className="scene-header">
        <span className="scene-eyebrow">A signature in motion</span>
        <div className="scene-header-actions">
          <span className="scene-status">
            <i aria-hidden="true" />
            {webGL === null
              ? "Preparing preview"
              : !interactiveScene
                ? "Static artwork"
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
        aria-label={interactiveScene ? `A kinetic sculpture of VŨ, currently in ${currentChapter.title.toLowerCase()} form` : "A static typographic artwork of VŨ"}
        aria-describedby={captionId}
      >
        <div className="scene-grid" aria-hidden="true" />
        <div className="scene-canvas" aria-hidden="true">
          {webGL && !sceneFailed ? (
            <SceneErrorBoundary
              fallback={<SceneFallback />}
              onError={() => setSceneFailed(true)}
            >
              <KineticScene
                progressSource={progressSource}
                reducedMotion={reducedMotion}
                animationEnabled={animationEnabled}
                pulseToken={pulseToken}
              />
            </SceneErrorBoundary>
          ) : (
            <SceneFallback loading={webGL === null} />
          )}
        </div>
        <span className="scene-interaction-hint" aria-hidden="true">
          {reducedMotion && interactiveScene ? (
            "Reduced motion · Choose a form"
          ) : interactiveScene ? (
            <>
              <span className="scene-hint-pointer">{motionEnabled ? "Move to bend · Click to pulse" : "Paused · Choose a form"}</span>
              <span className="scene-hint-touch">{motionEnabled ? "Tap to send a pulse" : "Paused · Choose a form"}</span>
            </>
          ) : (
            "A signature in blocks"
          )}
        </span>
      </div>
      <div
        className="scene-controls"
        role="group"
        aria-label="Choose an artwork form"
      >
        {chapters.map((chapter, index) => (
          <button
            key={chapter.label}
            type="button"
            className={`scene-control${activeChapter === index ? " is-active" : ""}`}
            aria-pressed={activeChapter === index}
            aria-controls={sceneId}
            disabled={!interactiveScene}
            onPointerDown={() => { manualProgress.current = true; }}
            onClick={() => selectProgress(chapter.progress)}
          >
            <chapter.icon className="kinetic-mode-icon" size={18} strokeWidth={1.5} aria-hidden="true" />
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
          <label htmlFor={scrubberId}>Transformation</label>
          <span ref={progressLabel} aria-hidden="true">0%</span>
        </div>
        <input
          id={scrubberId}
          ref={scrubber}
          className="scene-scrubber"
          type="range"
          min={0}
          max={100}
          step={1}
          disabled={!interactiveScene}
          defaultValue={0}
          aria-controls={sceneId}
          aria-valuetext="0 percent transformed, Signature form"
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
            {interactiveScene ? `${currentChapter.title} form` : "Signature preview"}
          </span>
          <span id={captionId} className="scene-caption-description">
            {interactiveScene ? currentChapter.description : webGL === null ? "Preparing the kinetic sculpture." : "A static signature preview."}
          </span>
        </div>
        <div className="scene-caption-actions">
          <button
            type="button"
            className="kinetic-pulse"
            aria-controls={sceneId}
            disabled={!animationEnabled}
            onClick={() => setPulseToken((token) => token + 1)}
          >
            <Sparkles size={15} aria-hidden="true" /> Send pulse
          </button>
        </div>
      </div>
    </div>
  );
}
