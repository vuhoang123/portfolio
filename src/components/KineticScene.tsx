"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { useTheme } from "./ThemeProvider";
import type { RequestPhase, SceneNode } from "@/lib/application-scene";
export type { RequestPhase, SceneNode } from "@/lib/application-scene";

type KineticSceneProps = {
  reducedMotion?: boolean;
  animationEnabled?: boolean;
  interactionToken?: number;
  resetToken?: number;
  replayToken?: number;
  recordName?: string;
  recordCount?: number;
  inputsEnabled?: boolean;
  htmlPortal?: RefObject<HTMLElement | null>;
  selectedNode?: SceneNode | null;
  onRequest?: () => void;
  onRecordNameChange?: (value: string) => void;
  onSelectNode?: (node: SceneNode) => void;
  onPhaseChange?: (phase: RequestPhase) => void;
  onTransitionChange?: (transitioning: boolean) => void;
  onReady?: () => void;
};

type Voxel = { position: THREE.Vector3; layer: number; seed: number };
type Tone = "frame" | "surface" | "chrome" | "sidebar" | "field" | "muted" | "accent" | "metal" | "ring" | "success";
type Module = { position: THREE.Vector3; scale: THREE.Vector3; rotation: THREE.Quaternion; tone: Tone; node: SceneNode; key?: string };
type TextTone = "ink" | "muted" | "white" | "success" | "databaseInk";
type TextSpec = { text: string; width: number; height: number; font: number; tone: TextTone; mono?: boolean; centered?: boolean };
const glyphV = [
  "1100000000011", "1100000000011", "0110000000110", "0110000000110",
  "0011000001100", "0011000001100", "0001100011000", "0001100011000",
  "0001100011000", "0001100011000", "0000110110000", "0000110110000",
  "0000110110000", "0000110110000", "0000011100000", "0000011100000",
  "0000011100000",
];
const glyphU = [
  "1100000000011", "1100000000011", "1100000000011", "1100000000011",
  "1100000000011", "1100000000011", "1100000000011", "1100000000011",
  "1100000000011", "1100000000011", "1100000000011", "1100000000011",
  "1100000000011", "0110000000110", "0111000001110", "0011111111100",
  "0001111111000",
];
const tilde = ["0001100000000", "0011110001100", "0110011111000"];
const signatureRotation = new THREE.Euler(0.065, -0.16, -0.035);
const appRotation = new THREE.Euler(0.11, -0.16, -0.035);
const originRotation = new THREE.Quaternion();
const introHold = 1.15;
const introDuration = 2.7;
const requestDuration = 7.1;
const nodeNames: SceneNode[] = ["interface", "api", "database"];

function signatureVoxels(): Voxel[] {
  const points: Voxel[] = [];
  const addGlyph = (glyph: string[], offset: number, rowOffset = 0) => {
    glyph.forEach((row, y) => {
      [...row].forEach((pixel, x) => {
        if (pixel !== "1") return;
        for (let layer = 0; layer < 3; layer++) {
          points.push({
            position: new THREE.Vector3((x + offset - 14) * 0.22, (8 - y - rowOffset) * 0.22 - 0.28, (layer - 1) * 0.24),
            layer,
            seed: (((x + offset) * 17 + (y + rowOffset + 4) * 31 + layer * 13) % 101) / 101,
          });
        }
      });
    });
  };
  addGlyph(glyphV, 0);
  addGlyph(glyphU, 16);
  addGlyph(tilde, 16, -4);
  return points;
}

// Exactly 474 useful modules, one for every block in the signature. Nothing is
// discarded, faded out, duplicated or replaced by a different solid shell.
function applicationModules(voxels: Voxel[]): Module[] {
  const modules: Module[] = [];
  const add = (position: [number, number, number], scale: [number, number, number], tone: Tone, node: SceneNode, key?: string, rotation?: [number, number, number]) => {
    modules.push({ position: new THREE.Vector3(...position), scale: new THREE.Vector3(...scale), tone, node, key, rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(...(rotation ?? [0, 0, 0]))) });
  };
  // A close-jointed porcelain browser. The same soft edges remain visible in VŨ.
  for (let row = 0; row < 14; row++) for (let column = 0; column < 20; column++) {
    const edge = column === 0 || column === 19 || row === 0;
    const tone: Tone = row >= 12 ? "chrome" : edge ? "frame" : column < 3 ? "sidebar" : "surface";
    add([-3.13 + column * 0.24, -1.26 + row * 0.24, 0.31], [0.239, 0.239, 0.2], tone, "interface");
  }
  for (let row = 0; row < 5; row++) for (let column = 0; column < 6; column++) {
    add([2.0 + column * 0.22, 0.36 + row * 0.22, -0.29], [0.219, 0.219, 0.32], "accent", "api");
  }
  for (const offset of [-0.37, 0, 0.37]) {
    add([1.8, 0.8 + offset, -0.3], [0.18, 0.09, 0.14], "metal", "api");
    add([3.3, 0.8 + offset, -0.3], [0.18, 0.09, 0.14], "metal", "api");
    add([2.55 + offset, 1.45, -0.3], [0.09, 0.18, 0.14], "metal", "api");
    add([2.55 + offset, 0.15, -0.3], [0.09, 0.18, 0.14], "metal", "api");
  }
  for (const y of [-1.08, -1.5, -1.92]) {
    for (let segment = 0; segment < 24; segment++) {
      const angle = segment / 24 * Math.PI * 2;
      add([2.55 + Math.sin(angle) * 0.64, y, -0.3 + Math.cos(angle) * 0.64], [0.173, 0.35, 0.2], "metal", "database", undefined, [0, angle, 0]);
    }
    for (let x = -2; x <= 2; x++) for (let z = -2; z <= 2; z++) {
      if (x * x + z * z > 5) continue;
      add([2.55 + x * 0.24, y + 0.17, -0.3 + z * 0.24], [0.239, 0.035, 0.239], "ring", "database");
    }
  }
  for (const x of [-2.94, -2.72, -2.5]) add([x, 1.75, 0.47], [0.075, 0.075, 0.06], "accent", "interface");
  for (const [x, y] of [[-2.95, 1.15], [-2.73, 1.15], [-2.95, 0.93], [-2.73, 0.93]]) add([x, y, 0.46], [0.15, 0.15, 0.05], "accent", "interface");
  for (let index = 0; index < 3; index++) add([-2.84, 0.49 - index * 0.44, 0.46], [0.42, index === 0 ? 0.22 : 0.055, 0.04], index === 0 ? "accent" : "muted", "interface");
  add([-0.24, 1.75, 0.47], [2.77, 0.23, 0.05], "surface", "interface");
  add([-0.38, 0.51, 0.46], [3.1, 0.45, 0.06], "field", "interface");
  add([-0.38, -0.09, 0.46], [3.1, 0.45, 0.06], "field", "interface");
  add([-0.93, -0.91, 0.48], [2.05, 0.48, 0.09], "accent", "interface", "send");
  add([2.55, 0.45, -0.095], [0.98, 0.17, 0.04], "accent", "api", "api-status");
  add([2.55, -1.8, 0.43], [0.8, 0.055, 0.04], "metal", "database", "record-a");
  add([2.55, -1.96, 0.43], [0.8, 0.055, 0.04], "metal", "database", "record-b");
  if (modules.length !== voxels.length) throw new Error("Signature and application must use exactly the same modules");
  // Deterministic nearest destinations keep the transformation compact and legible.
  const available = [...modules];
  return voxels.map((voxel) => {
    let best = 0;
    for (let index = 1; index < available.length; index++) {
      if (voxel.position.distanceToSquared(available[index].position) < voxel.position.distanceToSquared(available[best].position)) best = index;
    }
    return available.splice(best, 1)[0];
  });
}

const textSpecs = {
  address: { text: "app.vu.dev", width: 2.15, height: 0.25, font: 0.17, tone: "ink", mono: true },
  title: { text: "New request", width: 3, height: 0.46, font: 0.3, tone: "ink" },
  name: { text: "Your name", width: 2.65, height: 0.32, font: 0.18, tone: "muted" },
  project: { text: "A better web app", width: 2.65, height: 0.32, font: 0.18, tone: "ink" },
  button: { text: "Send request", width: 1.85, height: 0.34, font: 0.18, tone: "white", centered: true },
  result: { text: "Saved", width: 2.9, height: 0.3, font: 0.18, tone: "success" },
  api: { text: "API", width: 1.13, height: 0.6, font: 0.43, tone: "white", centered: true, mono: true },
  apiStatus: { text: "READY", width: 1.14, height: 0.2, font: 0.115, tone: "white", centered: true, mono: true },
  data: { text: "DATA", width: 1.1, height: 0.4, font: 0.26, tone: "databaseInk", centered: true, mono: true },
  dataStatus: { text: "0 RECORDS", width: 1.1, height: 0.2, font: 0.12, tone: "databaseInk", centered: true, mono: true },
  payload: { text: "{ }", width: 0.25, height: 0.18, font: 0.14, tone: "white", centered: true, mono: true },
} satisfies Record<string, TextSpec>;
type TextKey = keyof typeof textSpecs;

function makeText(spec: TextSpec) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(spec.width * 320);
  canvas.height = Math.ceil(spec.height * 320);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false });
  return { spec, canvas, texture, material, text: spec.text, tone: spec.tone };
}

function redrawText(label: ReturnType<typeof makeText>, dark: boolean) {
  const { canvas, spec, texture } = label;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const tones = { ink: dark ? "#eef4ff" : "#182c4c", muted: dark ? "#bac8d9" : "#63758f", white: "#ffffff", success: dark ? "#8ce2c2" : "#147453", databaseInk: "#182c4c" };
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = tones[label.tone];
  ctx.font = `650 ${spec.font * 320}px ${spec.mono ? '"IBM Plex Mono", monospace' : '"Manrope Variable", Arial, sans-serif'}`;
  ctx.textAlign = spec.centered ? "center" : "left";
  ctx.textBaseline = "middle";
  ctx.fillText(label.text, spec.centered ? canvas.width / 2 : 5, canvas.height / 2 + 1, canvas.width - 10);
  texture.needsUpdate = true;
}

function createResources() {
  const labels = Object.fromEntries(Object.entries(textSpecs).map(([key, spec]) => [key, makeText(spec)])) as Record<TextKey, ReturnType<typeof makeText>>;
  const palette = Object.fromEntries(["frame", "surface", "chrome", "sidebar", "field", "muted", "accent", "metal", "ring", "success"].map((key) => [key, new THREE.Color()])) as Record<Tone, THREE.Color>;
  const uiRoute = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.16, -0.91, 0.61), new THREE.Vector3(1.64, -0.91, 0.61),
    new THREE.Vector3(1.79, -0.73, 0.56), new THREE.Vector3(1.79, 0.61, -0.06),
    new THREE.Vector3(1.93, 0.8, -0.06),
  ], false, "catmullrom", 0.12);
  const dataRoute = new THREE.LineCurve3(new THREE.Vector3(2.55, 0.14, -0.06), new THREE.Vector3(2.55, -0.8, -0.06));
  const geometry = {
    box: new RoundedBoxGeometry(1, 1, 1, 2, 0.075), plane: new THREE.PlaneGeometry(1, 1),
    uiRoute: new THREE.TubeGeometry(uiRoute, 52, 0.019, 7, false), dataRoute: new THREE.TubeGeometry(dataRoute, 12, 0.019, 7, false),
  };
  const materials = {
    // This opaque material and geometry draw both the entire signature and app.
    modules: new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.12 }),
    route: new THREE.MeshStandardMaterial({ color: "#6487e8", emissive: "#2858ff", emissiveIntensity: 0.1, roughness: 0.45, transparent: true }),
    packet: new THREE.MeshStandardMaterial({ color: "#2858ff", emissive: "#2858ff", emissiveIntensity: 0.4, roughness: 0.3, transparent: true }),
    hit: new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  };
  return { geometry, materials, labels, palette, uiRoute, dataRoute, sourceColor: new THREE.Color(), highlight: new THREE.Color() };
}

function fittedDistance(voxels: Voxel[], modules: Module[], aspect: number) {
  const tangent = Math.tan(THREE.MathUtils.degToRad(38) / 2);
  const point = new THREE.Vector3();
  let distance = 5;
  const contain = (position: THREE.Vector3, rotation: THREE.Euler, padding: number) => {
    point.copy(position).applyEuler(rotation);
    distance = Math.max(distance, (Math.abs(point.x) + padding) / (tangent * Math.max(aspect, 0.42)) + point.z, (Math.abs(point.y) + padding) / tangent + point.z);
  };
  voxels.forEach((voxel) => contain(voxel.position, signatureRotation, 0.17));
  const corner = new THREE.Vector3();
  modules.forEach((part) => {
    for (const x of [-0.5, 0.5]) for (const y of [-0.5, 0.5]) for (const z of [-0.5, 0.5]) {
      corner.set(x * part.scale.x, y * part.scale.y, z * part.scale.z).applyQuaternion(part.rotation).add(part.position);
      contain(corner, appRotation, 0.1);
    }
  });
  return distance + 0.12;
}

function phaseAt(age: number): RequestPhase {
  if (age < 1.35) return "typing";
  if (age < 2.65) return "sending";
  if (age < 3.85) return "processing";
  if (age < 5.3) return "writing";
  if (age < requestDuration) return "returning";
  return "success";
}

function KineticApplication({ reducedMotion = false, animationEnabled = true, interactionToken = 0, resetToken = 0, replayToken = 0, recordName = "Vũ", recordCount = 0, inputsEnabled = false, htmlPortal, selectedNode = null, onReady, onRequest, onRecordNameChange, onSelectNode, onPhaseChange, onTransitionChange, dark }: KineticSceneProps & { dark: boolean }) {
  const blocks = useRef<THREE.InstancedMesh>(null);
  const sculpture = useRef<THREE.Group>(null);
  const uiDetails = useRef<THREE.Group>(null);
  const apiDetails = useRef<THREE.Group>(null);
  const dataDetails = useRef<THREE.Group>(null);
  const traces = useRef<THREE.Group>(null);
  const packet = useRef<THREE.Group>(null);
  const buttonText = useRef<THREE.Mesh>(null);
  const { camera, size, invalidate, gl, pointer: pointerNdc } = useThree();
  const voxels = useMemo(signatureVoxels, []);
  const modules = useMemo(() => applicationModules(voxels), [voxels]);
  const resources = useMemo(createResources, []);
  const helper = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const hovered = useRef<SceneNode | null>(null);
  const hover = useRef({ interface: 0, api: 0, database: 0 });
  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, strength: 0 });
  const morph = useRef(reducedMotion ? 1 : 0);
  const introAge = useRef(0);
  const replayAge = useRef<number | null>(null);
  const replayFrom = useRef(1);
  const requestAge = useRef<number | null>(null);
  const submittedName = useRef("");
  const requestBaseCount = useRef(recordCount);
  const phase = useRef<RequestPhase>("ready");
  const reportedPhase = useRef<RequestPhase | null>(null);
  const reportedTransition = useRef<boolean | null>(null);
  const previous = useRef({ interactionToken, resetToken, replayToken });
  const needsStaticFrame = useRef(true);
  const ready = useRef(false);
  const callbacks = useRef({ onReady, onRequest, onRecordNameChange, onSelectNode, onPhaseChange, onTransitionChange });

  useLayoutEffect(() => { callbacks.current = { onReady, onRequest, onRecordNameChange, onSelectNode, onPhaseChange, onTransitionChange }; }, [onReady, onRequest, onRecordNameChange, onSelectNode, onPhaseChange, onTransitionChange]);
  const reportPhase = useCallback((next: RequestPhase) => {
    phase.current = next;
    if (reportedPhase.current === next) return;
    reportedPhase.current = next;
    callbacks.current.onPhaseChange?.(next);
  }, []);
  const reportTransition = useCallback((value: boolean) => {
    if (reportedTransition.current === value) return;
    reportedTransition.current = value;
    callbacks.current.onTransitionChange?.(value);
  }, []);

  useLayoutEffect(() => {
    const values: Record<Tone, string> = dark
      ? { frame: "#3e526d", surface: "#26364b", chrome: "#3b4d65", sidebar: "#213047", field: "#415873", muted: "#91a9cb", accent: "#3767ff", metal: "#a9bbd2", ring: "#d1dded", success: "#69cfa9" }
      : { frame: "#aebed6", surface: "#edf3fc", chrome: "#cddbed", sidebar: "#d9e5f5", field: "#d1dff1", muted: "#879dbb", accent: "#2858ee", metal: "#b7c9e1", ring: "#d9e4f3", success: "#26916c" };
    Object.entries(values).forEach(([key, value]) => resources.palette[key as Tone].set(value));
    resources.sourceColor.set(dark ? "#3c6bff" : "#2858ee");
    resources.highlight.set(dark ? "#a7c1ff" : "#527ceb");
    resources.materials.route.color.set(dark ? "#95b1ff" : "#4569c4");
    resources.materials.route.emissiveIntensity = dark ? 0.35 : 0.08;
    Object.values(resources.labels).forEach((label) => redrawText(label, dark));
    needsStaticFrame.current = true;
    invalidate();
  }, [dark, resources, invalidate]);

  useEffect(() => {
    let mounted = true;
    document.fonts.ready.then(() => {
      if (!mounted) return;
      Object.values(resources.labels).forEach((label) => redrawText(label, dark));
      needsStaticFrame.current = true;
      invalidate();
    });
    return () => { mounted = false; };
  }, [dark, resources, invalidate]);

  useEffect(() => () => {
    Object.values(resources.geometry).forEach((geometry) => geometry.dispose());
    Object.values(resources.materials).forEach((material) => material.dispose());
    Object.values(resources.labels).forEach(({ texture, material }) => { texture.dispose(); material.dispose(); });
  }, [resources]);

  useLayoutEffect(() => { blocks.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage); invalidate(); }, [invalidate]);

  useEffect(() => {
    if (interactionToken !== previous.current.interactionToken) {
      submittedName.current = [...recordName.trim()].slice(0, 24).join("") || "Vũ";
      requestBaseCount.current = recordCount;
      requestAge.current = reducedMotion ? requestDuration : 0;
      reportPhase(reducedMotion ? "success" : "typing");
    }
    if (resetToken !== previous.current.resetToken || replayToken !== previous.current.replayToken) {
      requestAge.current = null;
      submittedName.current = "";
      reportPhase("ready");
      if (replayToken !== previous.current.replayToken && !reducedMotion) {
        replayFrom.current = morph.current;
        replayAge.current = 0;
        reportTransition(true);
      } else {
        replayAge.current = null;
        morph.current = 1;
        reportTransition(false);
      }
    }
    previous.current = { interactionToken, resetToken, replayToken };
    needsStaticFrame.current = true;
    invalidate();
  }, [interactionToken, resetToken, replayToken, recordName, recordCount, reducedMotion, reportPhase, reportTransition, invalidate]);

  useEffect(() => {
    if (reducedMotion) {
      morph.current = 1;
      replayAge.current = null;
      if (requestAge.current !== null) { requestAge.current = requestDuration; reportPhase("success"); }
      reportTransition(false);
    }
    if (!animationEnabled || reducedMotion) { hovered.current = null; gl.domElement.style.cursor = "auto"; }
    needsStaticFrame.current = true;
    invalidate();
    return () => { gl.domElement.style.cursor = "auto"; };
  }, [animationEnabled, reducedMotion, gl, invalidate, reportPhase, reportTransition]);

  useEffect(() => {
    camera.position.z = fittedDistance(voxels, modules, size.width / Math.max(size.height, 1));
    needsStaticFrame.current = true;
    invalidate();
  }, [camera, size.width, size.height, voxels, modules, invalidate]);
  useEffect(() => { needsStaticFrame.current = true; invalidate(); }, [selectedNode, inputsEnabled, invalidate]);

  useFrame((_, rawDelta) => {
    const mesh = blocks.current;
    const group = sculpture.current;
    const marker = packet.current;
    if (!mesh || !group || !marker) return;
    const moving = animationEnabled && !reducedMotion;
    if (!moving && !needsStaticFrame.current) return;
    const delta = Math.min(rawDelta, 0.04);
    if (moving) {
      if (replayAge.current !== null) {
        replayAge.current += delta;
        const age = replayAge.current;
        morph.current = age < 1.55 ? replayFrom.current * (1 - THREE.MathUtils.smoothstep(age, 0, 1.55))
          : age < 2.15 ? 0 : THREE.MathUtils.smoothstep(age, 2.15, 4.85);
        if (age >= 4.85) { replayAge.current = null; morph.current = 1; }
      } else if (morph.current < 1) {
        introAge.current += delta;
        morph.current = THREE.MathUtils.smoothstep(introAge.current, introHold, introHold + introDuration);
      }
      if (requestAge.current !== null && morph.current >= 1) requestAge.current = Math.min(requestDuration, requestAge.current + delta);
    }
    const amount = morph.current;
    const transitioning = amount < 1 || replayAge.current !== null;
    reportTransition(transitioning);
    reportPhase(requestAge.current === null ? "ready" : phaseAt(requestAge.current));
    const stage = phase.current;
    const age = requestAge.current ?? 0;
    const details = THREE.MathUtils.smoothstep(amount, 0.94, 1);
    const ease = moving ? 1 - Math.exp(-delta * 9) : 1;
    for (const node of nodeNames) hover.current[node] = THREE.MathUtils.lerp(hover.current[node], !reducedMotion && hovered.current === node ? 1 : 0, ease);
    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, pointer.current.targetX, ease);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, pointer.current.targetY, ease);
    pointer.current.strength = THREE.MathUtils.lerp(pointer.current.strength, hovered.current ? 1 : 0, ease);
    group.rotation.set(
      THREE.MathUtils.lerp(signatureRotation.x, appRotation.x, amount) - pointer.current.y * pointer.current.strength * 0.035,
      appRotation.y + pointer.current.x * pointer.current.strength * 0.055,
      appRotation.z - pointer.current.x * pointer.current.strength * 0.01,
    );
    const press = stage === "sending" ? 1 - THREE.MathUtils.smoothstep(age, 1.35, 1.62) : 0;
    const write = stage === "writing" ? THREE.MathUtils.smoothstep(age, 4.25, 5.0) : stage === "returning" || stage === "success" ? 1 : 0;
    const apiProcess = stage === "processing" ? Math.sin((age - 2.65) / 1.2 * Math.PI) : 0;
    for (let index = 0; index < voxels.length; index++) {
      const voxel = voxels[index];
      const target = modules[index];
      const local = THREE.MathUtils.smoothstep(amount, voxel.seed * 0.055, 0.945 + voxel.seed * 0.055);
      helper.position.lerpVectors(voxel.position, target.position, local);
      helper.position.z += Math.sin(local * Math.PI) * (voxel.seed - 0.5) * 0.28;
      helper.position.y += Math.sin(local * Math.PI) * 0.08;
      helper.quaternion.slerpQuaternions(originRotation, target.rotation, local);
      helper.scale.set(0.205, 0.205, 0.205).lerp(target.scale, local);
      const focus = Math.max(hover.current[target.node], selectedNode === target.node ? 0.75 : 0) * details;
      helper.position.y += focus * (target.node === "interface" ? 0.035 : 0.07);
      helper.position.z += focus * 0.05;
      if (target.node === "api") helper.position.z += apiProcess * 0.025 * details;
      if (target.key === "send") { helper.position.z -= press * 0.055; helper.scale.x *= 1 - press * 0.025; }
      const record = target.key === "record-a" || target.key === "record-b";
      if (record) helper.position.z -= (1 - write) * 0.55 * local;
      helper.updateMatrix();
      mesh.setMatrixAt(index, helper.matrix);
      color.copy(resources.sourceColor).multiplyScalar(voxel.layer === 0 ? 0.92 : voxel.layer === 1 ? 0.97 : 1);
      color.lerp(record && write > 0 ? resources.palette.success : resources.palette[target.tone], local);
      if (focus > 0) color.lerp(resources.highlight, focus * 0.16);
      if (target.node === "api") color.lerp(resources.highlight, apiProcess * 0.22);
      if (target.node === "database" && stage === "writing") color.lerp(resources.palette.success, write * 0.1);
      mesh.setColorAt(index, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    const detailGroups = { interface: uiDetails.current, api: apiDetails.current, database: dataDetails.current };
    for (const node of nodeNames) {
      const detail = detailGroups[node];
      if (!detail) continue;
      const focus = Math.max(hover.current[node], selectedNode === node ? 0.75 : 0);
      detail.visible = details > 0.001;
      detail.position.set(0, focus * (node === "interface" ? 0.035 : 0.07), focus * 0.05 + (node === "api" ? apiProcess * 0.025 : 0));
    }
    if (traces.current) traces.current.visible = details > 0.001;
    const { labels } = resources;
    Object.values(labels).forEach(({ material }) => { material.opacity = details; });
    if (inputsEnabled) labels.name.material.opacity = 0;
    resources.materials.route.opacity = details * 0.72;
    resources.materials.packet.opacity = details;
    if (buttonText.current) buttonText.current.position.z = 0.54 - press * 0.055;
    const updateText = (key: TextKey, text: string, tone: TextTone = labels[key].spec.tone) => {
      if (labels[key].text === text && labels[key].tone === tone) return;
      labels[key].text = text;
      labels[key].tone = tone;
      redrawText(labels[key], dark);
    };
    const chars = [...submittedName.current];
    const typed = stage === "typing" ? chars.slice(0, Math.floor(THREE.MathUtils.clamp(age / 1.12, 0, 1) * chars.length)).join("") : submittedName.current;
    updateText("name", stage === "ready" ? "Your name" : `${typed}${stage === "typing" ? "▏" : ""}`, stage === "ready" ? "muted" : "ink");
    updateText("button", stage === "ready" || stage === "success" ? "Send request" : stage === "typing" ? "Preparing…" : "Sending…");
    updateText("apiStatus", stage === "processing" ? "VALIDATING" : stage === "writing" ? "POST /SAVE" : stage === "returning" || stage === "success" ? "201 CREATED" : "READY");
    const displayedCount = write >= 1 ? Math.max(recordCount, requestBaseCount.current + 1) : recordCount;
    updateText("dataStatus", stage === "writing" && write < 1 ? "WRITING…" : `${displayedCount} ${displayedCount === 1 ? "RECORD" : "RECORDS"}`);
    updateText("result", `✓ Saved · ${submittedName.current}`);
    labels.result.material.opacity = stage === "success" ? details : 0;
    marker.visible = !reducedMotion && details >= 0.99 && (stage === "sending" || stage === "writing" && age < 4.35 || stage === "returning");
    const sample = (curve: THREE.Curve<THREE.Vector3>, progress: number) => curve.getPointAt(THREE.MathUtils.clamp(progress, 0, 1), marker.position);
    if (stage === "sending") sample(resources.uiRoute, (age - 1.5) / 1.15);
    else if (stage === "writing") sample(resources.dataRoute, (age - 3.85) / 0.5);
    else if (stage === "returning") {
      if (age < 5.85) sample(resources.dataRoute, 1 - (age - 5.3) / 0.55);
      else sample(resources.uiRoute, 1 - (age - 5.85) / 1.25);
    }
    resources.materials.packet.color.copy(stage === "returning" ? resources.palette.success : resources.palette.accent);
    needsStaticFrame.current = false;
    if (!ready.current) { ready.current = true; callbacks.current.onReady?.(); }
    if (moving) invalidate();
  });

  const pointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (reducedMotion || morph.current < 1) return;
    const target = event.instanceId === undefined ? null : modules[event.instanceId];
    hovered.current = target?.node ?? "interface";
    pointer.current.targetX = THREE.MathUtils.clamp(pointerNdc.x, -1, 1);
    pointer.current.targetY = THREE.MathUtils.clamp(pointerNdc.y, -1, 1);
    gl.domElement.style.cursor = "pointer";
    invalidate();
  };
  const pointerOut = () => { hovered.current = null; gl.domElement.style.cursor = "auto"; invalidate(); };
  const { geometry, materials, labels } = resources;
  const label = (key: TextKey, position: [number, number, number]) => <mesh key={`label-${key}`} geometry={geometry.plane} material={labels[key].material} position={position} scale={[labels[key].spec.width, labels[key].spec.height, 1]} dispose={null} />;

  return (
    <>
      <ambientLight intensity={dark ? 1.3 : 1.5} />
      <directionalLight position={[-4, 7, 8]} intensity={dark ? 2.4 : 2.6} color="#ffffff" />
      <directionalLight position={[5, -1, 4]} intensity={dark ? 1.3 : 0.9} color="#aac6ff" />
      <directionalLight position={[0, 4, -6]} intensity={dark ? 2 : 1.5} color="#ddeaff" />
      <group ref={sculpture} rotation={signatureRotation}>
        <instancedMesh ref={blocks} args={[geometry.box, materials.modules, voxels.length]} dispose={null} frustumCulled={false}
          onPointerMove={pointerMove} onPointerOut={pointerOut}
          onClick={(event) => { if (morph.current < 1 || event.instanceId === undefined) return; event.stopPropagation(); callbacks.current.onSelectNode?.(modules[event.instanceId].node); }} />
        <group ref={uiDetails}>
          {label("address", [-0.43, 1.75, 0.58])}
          {label("title", [-0.54, 1.06, 0.46])}
          {label("name", [-0.43, 0.51, 0.505])}
          <Html portal={htmlPortal as RefObject<HTMLElement> | undefined} center distanceFactor={size.height / 100} position={[-0.43, 0.51, 0.6]} className="application-inline-input-wrap" zIndexRange={[12, 10]} style={{ visibility: inputsEnabled ? "visible" : "hidden", pointerEvents: inputsEnabled ? "auto" : "none" }}>
            <input
              className="application-inline-input"
              aria-label="Record name"
              type="text"
              value={recordName}
              maxLength={24}
              disabled={!inputsEnabled}
              tabIndex={inputsEnabled ? 0 : -1}
              autoComplete="off"
              spellCheck={false}
              placeholder="Your name"
              onChange={(event) => { event.stopPropagation(); callbacks.current.onRecordNameChange?.(event.currentTarget.value); }}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key !== "Enter" || event.repeat || event.nativeEvent.isComposing) return;
                event.preventDefault();
                callbacks.current.onRequest?.();
              }}
              onKeyUp={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
              onPointerMove={(event) => event.stopPropagation()}
              onFocus={() => { hovered.current = "interface"; invalidate(); }}
              onBlur={pointerOut}
            />
          </Html>
          {label("project", [-0.43, -0.09, 0.505])}
          <mesh ref={buttonText} geometry={geometry.plane} material={labels.button.material} position={[-0.93, -0.91, 0.54]} scale={[1.85, 0.34, 1]} dispose={null} />
          {label("result", [-0.39, -0.53, 0.51])}
          <mesh geometry={geometry.plane} material={materials.hit} position={[-0.93, -0.91, 0.59]} scale={[2.05, 0.48, 1]} dispose={null}
            onPointerMove={pointerMove} onPointerOut={pointerOut}
            onClick={(event) => { event.stopPropagation(); if (morph.current >= 1 && (phase.current === "ready" || phase.current === "success")) callbacks.current.onRequest?.(); }} />
        </group>
        <group ref={apiDetails}>{label("api", [2.55, 0.95, -0.08])}{label("apiStatus", [2.55, 0.45, -0.055])}</group>
        <group ref={dataDetails}>{label("data", [2.55, -1.41, 0.46])}{label("dataStatus", [2.55, -1.67, 0.46])}</group>
        <group ref={traces}><mesh geometry={geometry.uiRoute} material={materials.route} dispose={null} /><mesh geometry={geometry.dataRoute} material={materials.route} dispose={null} /></group>
        <group ref={packet} visible={false}>
          <mesh geometry={geometry.box} material={materials.packet} scale={[0.3, 0.22, 0.14]} dispose={null} />
          {label("payload", [0, 0, 0.075])}
        </group>
      </group>
    </>
  );
}

export default memo(function KineticScene(props: KineticSceneProps) {
  const { theme } = useTheme();
  return <Canvas frameloop="demand" camera={{ position: [0, 0, 9], fov: 38, near: 0.1, far: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} onCreated={({ gl }) => gl.domElement.setAttribute("aria-hidden", "true")} style={{ background: "transparent", width: "100%", height: "100%" }}><KineticApplication {...props} dark={theme === "dark"} /></Canvas>;
});
