"use client";

import dynamic from "next/dynamic";
import { Braces, Database, X } from "lucide-react";
import { Component, type ReactNode, useCallback, useEffect, useId, useRef, useState } from "react";
import { phaseCopy, type RequestPhase, type SceneNode } from "@/lib/application-scene";

const KineticScene = dynamic(() => import("./KineticScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div className="application-fallback" aria-hidden="true">
      <div className="application-fallback-browser">
        <div className="application-fallback-chrome"><span><i /><i /><i /></span><span>vu.dev</span></div>
        <div className="application-fallback-body">
          <span className="application-fallback-wordmark">VŨ</span>
          <strong>Interface</strong>
          <span className="application-fallback-row" /><span className="application-fallback-row" />
          <span className="application-fallback-action">Send request</span>
        </div>
      </div>
      <div className="application-fallback-connection" />
      <div className="application-fallback-api"><Braces size={34} strokeWidth={1.5} /><strong>API</strong></div>
      <div className="application-fallback-data"><Database size={44} strokeWidth={1.5} /><strong>Data</strong></div>
    </div>
  );
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
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
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}

function browserSupportsWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
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
  const inputPortal = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [webGL, setWebGL] = useState<boolean | null>(null);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [interactionToken, setInteractionToken] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [replayToken, setReplayToken] = useState(0);
  const [transitioning, setTransitioning] = useState(true);
  const [recordName, setRecordName] = useState("Vũ");
  const [phase, setPhase] = useState<RequestPhase>("ready");
  const [selectedNode, setSelectedNode] = useState<SceneNode | null>(null);
  const [records, setRecords] = useState<{ id: number; name: string }[]>([]);
  const savedRecord = records[records.length - 1] ?? null;
  const phaseRef = useRef<RequestPhase>("ready");
  const requestLocked = useRef(false);
  const sentName = useRef("Vũ");
  const nextRecordId = useRef(1);
  const [stageVisible, setStageVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const sceneId = useId();
  const hintId = `${sceneId}-hint`;
  const handleReady = useCallback(() => setSceneReady(true), []);
  const handleFailure = useCallback(() => setSceneFailed(true), []);
  const interactiveScene = webGL === true && !sceneFailed;
  const canInteract = interactiveScene && sceneReady && !transitioning;
  const busy = phase !== "ready" && phase !== "success";
  const animationEnabled = interactiveScene && sceneReady && !reducedMotion && stageVisible && documentVisible;
  const motionState = reducedMotion ? "reduced" : animationEnabled ? "playing" : "paused";

  const handleTransitionChange = useCallback((value: boolean) => setTransitioning(value), []);
  const handlePhaseChange = useCallback((next: RequestPhase) => {
    if (next !== "ready" && !requestLocked.current) return;
    const previous = phaseRef.current;
    phaseRef.current = next;
    setPhase(next);
    if (next === "success" && previous !== "success") {
      const record = { id: nextRecordId.current++, name: sentName.current };
      setRecords((current) => [...current, record]);
      requestLocked.current = false;
    } else if (next === "ready") {
      requestLocked.current = false;
    }
  }, []);
  const runRequest = useCallback(() => {
    const name = recordName.trim();
    if (!canInteract || requestLocked.current || !name) return;
    stage.current?.focus({ preventScroll: true });
    requestLocked.current = true;
    sentName.current = name;
    phaseRef.current = "typing";
    setPhase("typing");
    setInteractionToken((token) => token + 1);
  }, [canInteract, recordName]);
  const clearRecord = () => {
    requestLocked.current = false;
    phaseRef.current = "ready";
    nextRecordId.current = 1;
    setPhase("ready");
    setRecords([]);
  };
  const resetDemo = () => {
    if (!canInteract) return;
    clearRecord();
    setResetToken((token) => token + 1);
  };
  const replayIntro = () => {
    if (!canInteract || busy) return;
    clearRecord();
    setTransitioning(!reducedMotion);
    setReplayToken((token) => token + 1);
  };
  const inspectNode = useCallback((node: SceneNode) => setSelectedNode((current) => current === node ? null : node), []);
  const closeInspector = () => {
    setSelectedNode(null);
    stage.current?.focus();
  };

  useEffect(() => {
    setWebGL(browserSupportsWebGL2());
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    const element = experience.current;
    const observer = element && "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => setStageVisible(entry.isIntersecting), { threshold: 0 })
      : null;
    if (observer && element) observer.observe(element);
    else setStageVisible(true);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const hint = !interactiveScene
    ? webGL === null ? "Preparing the application" : "Interface → API → Data → Response"
    : !sceneReady ? "Preparing the application" : null;

  return (
    <div ref={experience} className="hero-experience kinetic-experience application-experience" data-motion={motionState}>
      <div className="scene-header">
        <span className="scene-eyebrow">Inside a web app</span>
        <span className="kinetic-accessible-status" role="status">
          {!interactiveScene ? webGL === null ? "Preparing preview" : "Static application" : !sceneReady ? "Preparing preview" : transitioning ? "VŨ, assembled into an application." : phaseCopy[phase]}
        </span>
      </div>
      <div
        className="scene-stage"
        ref={stage}
        id={sceneId}
        role={interactiveScene ? "group" : "img"}
        tabIndex={canInteract ? 0 : undefined}
        aria-label={interactiveScene ? "Interactive full-stack application" : "A web application with a browser interface, API and database"}
        aria-describedby={`${hintId} ${sceneId}-keys`}
        aria-keyshortcuts="Enter Space r Escape 1 2 3"
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget || !canInteract || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
          if (event.key === "Enter" || event.key === " ") { event.preventDefault(); runRequest(); }
          else if (event.key.toLowerCase() === "r") { event.preventDefault(); replayIntro(); }
          else if (event.key === "Escape") { event.preventDefault(); if (selectedNode) closeInspector(); else resetDemo(); }
          else if (event.key === "1" || event.key === "2" || event.key === "3") {
            event.preventDefault();
            inspectNode(({ "1": "interface", "2": "api", "3": "database" } as const)[event.key]);
          }
        }}
      >
        <div className="scene-grid" aria-hidden="true" />
        <div className="scene-canvas">
          <div ref={inputPortal} className="application-input-layer" />
          {interactiveScene ? (
            <SceneErrorBoundary onError={handleFailure}>
              <KineticScene
                reducedMotion={reducedMotion}
                animationEnabled={animationEnabled}
                interactionToken={interactionToken}
                resetToken={resetToken}
                replayToken={replayToken}
                recordName={recordName}
                recordCount={records.length}
                inputsEnabled={canInteract && !busy}
                onRecordNameChange={setRecordName}
                htmlPortal={inputPortal}
                selectedNode={selectedNode}
                onRequest={runRequest}
                onSelectNode={inspectNode}
                onPhaseChange={handlePhaseChange}
                onTransitionChange={handleTransitionChange}
                onReady={handleReady}
              />
            </SceneErrorBoundary>
          ) : <SceneFallback />}
        </div>
        <span id={hintId} className="scene-interaction-hint">
          {hint ?? <>
            <span className="scene-hint-pointer">Click Send request, API or Data to explore</span>
            <span className="scene-hint-touch">Tap a component to explore</span>
            <span className="scene-hint-keyboard">Enter send · R replay · 1–3 inspect</span>
          </>}
        </span>
        <span id={`${sceneId}-keys`} className="kinetic-accessible-status">Press Enter or Space to send a request, R to replay the VŨ transition, 1 for the interface, 2 for the API, 3 for data, or Escape to reset the demo. The name field can be edited directly in the 3D application.</span>
      </div>
        {interactiveScene && selectedNode && <section className="application-inspector" aria-label={`${selectedNode} details`} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); closeInspector(); } }}>
          <header>
            <h3>{selectedNode === "api" ? "POST /records" : selectedNode === "database" ? "records" : "Your input, through the stack"}</h3>
            <button type="button" aria-label="Close inspector" onClick={closeInspector}><X size={16} aria-hidden="true" /></button>
          </header>
          <pre>{selectedNode === "database"
            ? JSON.stringify(records, null, 2)
            : selectedNode === "api"
              ? JSON.stringify(phase === "success" && savedRecord ? { status: 201, record: savedRecord } : { method: "POST", body: { name: busy ? sentName.current : recordName.trim() } }, null, 2)
              : JSON.stringify({ name: recordName.trim() }, null, 2)}</pre>
          <p>{selectedNode === "database" ? savedRecord ? "The saved record is returned to the interface." : "Send a request to create the first record." : selectedNode === "api" ? "Validate the payload, write a record, return a response." : "Edit the name, send a request, and follow it through each component."} This simulation runs in your browser.</p>
        </section>}
    </div>
  );
}
