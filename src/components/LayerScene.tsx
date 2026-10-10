"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  createLayerMarkerTexture,
  createPanelShadowTexture,
  createPanelTexture,
  type LayerKind,
} from "./scene-textures";

type LayerSceneProps = {
  progress?: number;
  reducedMotion?: boolean;
  animationEnabled?: boolean;
  onSelectLayer?: (index: 0 | 1 | 2) => void;
};
type Point = [number, number, number];
type Pose = { position: Point; rotation: Point; scale: number };
type SceneTextures = {
  panels: THREE.CanvasTexture[];
  markers: THREE.CanvasTexture[];
  shadow: THREE.CanvasTexture;
};

const layerKinds: LayerKind[] = ["data", "admin", "interface"];
const assemblyRotation: Point = [-0.11, -0.22, -0.035];
// Each chapter brings its own layer forward while leaving the other two visible.
const chapters: Pose[][] = [
  [
    { position: [0.28, -0.86, -0.85], rotation: [0.045, -0.10, 0.055], scale: 0.92 },
    { position: [0.55, -0.20, -0.02], rotation: [-0.025, 0.10, 0.055], scale: 0.97 },
    { position: [-0.32, 0.62, 1.15], rotation: [0.015, -0.08, -0.07], scale: 1.08 },
  ],
  [
    { position: [-0.52, -0.83, -0.75], rotation: [0.03, -0.10, -0.055], scale: 0.92 },
    { position: [-0.10, 0.12, 1.45], rotation: [-0.015, 0.04, 0.025], scale: 1.08 },
    { position: [0.52, 0.93, -0.55], rotation: [0.04, -0.06, -0.095], scale: 0.94 },
  ],
  [
    { position: [0.00, -0.10, 1.55], rotation: [0.025, 0.08, -0.035], scale: 1.08 },
    { position: [-0.51, -0.72, -0.60], rotation: [-0.025, 0.05, 0.075], scale: 0.96 },
    { position: [0.53, 0.97, -0.65], rotation: [0.04, -0.06, -0.095], scale: 0.90 },
  ],
];

function chapterTransition(progress: number) {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  const from = p <= 0.55 ? 0 : 1;
  const segment = from === 0 ? p / 0.55 : (p - 0.55) / 0.45;
  return { from, to: from + 1, amount: segment * segment * (3 - 2 * segment) };
}

function fitCameraDistance(aspect: number, progress: number) {
  const tangent = Math.tan(THREE.MathUtils.degToRad(38) / 2);
  const assemblyMatrix = new THREE.Matrix4().makeRotationFromEuler(
    new THREE.Euler(...assemblyRotation),
  );
  let distance = 6;
  const vertex = new THREE.Vector3();
  const poseMatrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const { from, to, amount } = chapterTransition(progress);
  // Fit the visible composition, with room for tags, float and pointer movement.
  for (let i = 0; i < layerKinds.length; i++) {
    const a = chapters[from][i];
    const b = chapters[to][i];
    const rotation = a.rotation.map((value, axis) => THREE.MathUtils.lerp(value, b.rotation[axis], amount)) as Point;
    const position = a.position.map((value, axis) => THREE.MathUtils.lerp(value, b.position[axis], amount)) as Point;
    quaternion.setFromEuler(new THREE.Euler(...rotation));
    poseMatrix.compose(new THREE.Vector3(...position), quaternion, scale.setScalar(THREE.MathUtils.lerp(a.scale, b.scale, amount)));
    for (const x of [-2.72, 2.72]) {
      for (const y of [-1.86, 2.08]) {
        vertex.set(x, y, 0.18).applyMatrix4(poseMatrix).applyMatrix4(assemblyMatrix);
        distance = Math.max(
          distance,
          Math.abs(vertex.x) / (tangent * Math.max(aspect, 0.5)) + vertex.z,
          Math.abs(vertex.y) / tangent + vertex.z,
        );
      }
    }
  }
  return distance;
}

function SceneContents({ progress = 0, reducedMotion = false, animationEnabled = true, onSelectLayer }: LayerSceneProps) {
  const assembly = useRef<THREE.Group>(null);
  const orbit = useRef<THREE.Group>(null);
  const particles = useRef<(THREE.Mesh | null)[]>([]);
  const panels = useRef<(THREE.Group | null)[]>([]);
  const hoveredPanel = useRef<number | null>(null);
  const motionTime = useRef(0);
  const entranceTime = useRef(0);
  const [textures, setTextures] = useState<SceneTextures | null>(null);
  const invalidate = useThree((state) => state.invalidate);
  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera);
  const canvas = useThree((state) => state.gl.domElement);
  const motionAllowed = animationEnabled && !reducedMotion;
  const targetCameraDistance = useMemo(() => fitCameraDistance(size.width / Math.max(size.height, 1), progress), [size.width, size.height, progress]);
  const cameraDistance = useRef(targetCameraDistance);

  useEffect(() => { cameraDistance.current = targetCameraDistance; invalidate(); }, [targetCameraDistance, invalidate]);

  useEffect(() => {
    const created: SceneTextures = {
      panels: layerKinds.map(createPanelTexture),
      markers: layerKinds.map(createLayerMarkerTexture),
      shadow: createPanelShadowTexture(),
    };
    setTextures(created);
    return () => {
      created.panels.forEach((texture) => texture.dispose());
      created.markers.forEach((texture) => texture.dispose());
      created.shadow.dispose();
    };
  }, []);

  useEffect(() => {
    camera.position.z = cameraDistance.current;
    camera.updateMatrixWorld();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);

  useEffect(() => invalidate(), [progress, motionAllowed, textures, invalidate]);

  useFrame((state, delta) => {
    if (!assembly.current) return;
    const { from, to, amount } = chapterTransition(progress);
    const step = Math.min(delta, 0.05);
    const alpha = motionAllowed ? 1 - Math.exp(-8 * step) : 1;
    if (motionAllowed && textures) {
      motionTime.current += step;
      entranceTime.current = Math.min(1.6, entranceTime.current + step);
    }
    const time = motionTime.current;
    const pointer = motionAllowed && hoveredPanel.current !== null ? state.pointer : { x: 0, y: 0 };
    const targetRotation = [
      assemblyRotation[0] + pointer.y * 0.13 + (motionAllowed ? Math.sin(time * 0.55) * 0.025 : 0),
      assemblyRotation[1] + pointer.x * 0.20 + (motionAllowed ? Math.sin(time * 0.42) * 0.045 : 0),
      assemblyRotation[2] + pointer.x * 0.025,
    ];
    const axes = ["x", "y", "z"] as const;
    axes.forEach((axis, index) => {
      assembly.current!.rotation[axis] = THREE.MathUtils.lerp(assembly.current!.rotation[axis], targetRotation[index], alpha);
    });

    const nextCameraZ = THREE.MathUtils.lerp(camera.position.z, cameraDistance.current, alpha);
    camera.position.z = nextCameraZ;

    panels.current.forEach((panel, i) => {
      if (!panel) return;
      const a = chapters[from][i];
      const b = chapters[to][i];
      const reveal = motionAllowed ? THREE.MathUtils.clamp((entranceTime.current - (2 - i) * 0.13) / 1.1, 0, 1) : 1;
      const entrance = 1 - Math.pow(1 - reveal, 3);
      const isHovered = motionAllowed && hoveredPanel.current === i;
      axes.forEach((axis, index) => {
        let targetPosition = THREE.MathUtils.lerp(a.position[index], b.position[index], amount);
        let targetAngle = THREE.MathUtils.lerp(a.rotation[index], b.rotation[index], amount);
        if (axis === "y") targetPosition += motionAllowed ? Math.sin(time * 0.95 + i * 1.8) * 0.11 - (1 - entrance) * 0.7 : 0;
        if (axis === "x") targetPosition += motionAllowed ? Math.cos(time * 0.65 + i * 1.6) * 0.065 : 0;
        if (axis === "z") {
          targetPosition += (isHovered ? 0.22 : 0) - (1 - entrance) * 2.2;
          targetAngle += motionAllowed ? Math.sin(time * 0.7 + i * 2) * 0.018 : 0;
        }
        panel.position[axis] = THREE.MathUtils.lerp(panel.position[axis], targetPosition, alpha);
        panel.rotation[axis] = THREE.MathUtils.lerp(panel.rotation[axis], targetAngle, alpha);
      });
      const targetScale = THREE.MathUtils.lerp(a.scale, b.scale, amount) * (0.82 + entrance * 0.18) * (isHovered ? 1.02 : 1);
      panel.scale.setScalar(THREE.MathUtils.lerp(panel.scale.x, targetScale, alpha));
    });
    if (orbit.current) {
      orbit.current.rotation.z = -0.32 + time * 0.075;
      particles.current.forEach((particle, i) => {
        if (!particle) return;
        const angle = time * (i === 1 ? -0.42 : 0.34) + i * 2.3;
        const radius = i === 1 ? 3.52 : 3.32;
        particle.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        particle.scale.setScalar(1 + Math.sin(time * 2.2 + i) * 0.18);
      });
    }
    if (motionAllowed) invalidate();
  });

  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[-3, 5, 7]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[4, -2, 2]} intensity={1} color="#99afff" />
      <group ref={orbit} rotation={[0.12, 0.15, -0.32]} position={[0, -0.13, -2.6]}>
        <mesh>
          <torusGeometry args={[3.32, 0.012, 6, 128, Math.PI * 1.65]} />
          <meshBasicMaterial color="#2858ff" transparent opacity={0.48} toneMapped={false} />
        </mesh>
        <mesh rotation={[0, 0, 0.68]}>
          <torusGeometry args={[3.52, 0.007, 5, 128, Math.PI * 1.28]} />
          <meshBasicMaterial color="#8c9dbd" transparent opacity={0.28} toneMapped={false} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} ref={(instance) => { particles.current[i] = instance; }}>
            <sphereGeometry args={[i === 0 ? 0.085 : 0.045, 12, 8]} />
            <meshBasicMaterial color={i === 1 ? "#819bfa" : "#2858ff"} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <group
        ref={assembly}
        rotation={assemblyRotation}
        visible={textures !== null}
      >
        {layerKinds.map((kind, i) => (
          <group
            key={kind}
            ref={(instance) => { panels.current[i] = instance; }}
            position={chapters[0][i].position}
            rotation={chapters[0][i].rotation}
            scale={chapters[0][i].scale}
            onPointerOver={(event) => { event.stopPropagation(); hoveredPanel.current = i; canvas.style.cursor = "pointer"; invalidate(); }}
            onPointerOut={() => { if (hoveredPanel.current === i) { hoveredPanel.current = null; canvas.style.cursor = "auto"; } invalidate(); }}
            onPointerMove={() => invalidate()}
            onClick={(event) => { event.stopPropagation(); onSelectLayer?.((2 - i) as 0 | 1 | 2); }}
          >
            {textures && (
              <mesh position={[0.07, -0.10, -0.145]} raycast={() => undefined}>
                <planeGeometry args={[5.38, 3.70]} />
                <meshBasicMaterial map={textures.shadow} transparent opacity={0.57} depthWrite={false} />
              </mesh>
            )}
            <RoundedBox args={[4.99, 3.20, 0.06]} radius={0.07} smoothness={4} position={[0.026, -0.035, -0.078]}>
              <meshStandardMaterial color={kind === "admin" ? "#232c3f" : "#2858ff"} roughness={0.38} metalness={0.12} />
            </RoundedBox>
            <RoundedBox args={[4.90, 3.13, 0.12]} radius={0.06} smoothness={4}>
              <meshStandardMaterial color={kind === "data" ? "#283247" : "#f7f8fb"} roughness={0.50} metalness={0.05} />
            </RoundedBox>
            {textures && (
              <>
                <mesh position={[0, 0, 0.065]}>
                  <planeGeometry args={[4.76, 2.975]} />
                  <meshBasicMaterial map={textures.panels[i]} toneMapped={false} />
                </mesh>
                <mesh position={[-1.54, 1.78, 0.15]}>
                  <planeGeometry args={[1.58, 0.37]} />
                  <meshBasicMaterial map={textures.markers[i]} transparent toneMapped={false} />
                </mesh>
              </>
            )}
            <mesh position={[-2.48, 0.12, 0.01]}>
              <boxGeometry args={[0.035, 0.55, 0.05]} />
              <meshBasicMaterial color="#2858ff" toneMapped={false} />
            </mesh>
            <mesh position={[2.44, -0.92, 0.078]}>
              <boxGeometry args={[0.02, 0.34, 0.01]} />
              <meshBasicMaterial color="#2858ff" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

export default function LayerScene({ progress = 0, reducedMotion = false, animationEnabled = true, onSelectLayer }: LayerSceneProps) {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 10], fov: 38, near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <SceneContents progress={progress} reducedMotion={reducedMotion} animationEnabled={animationEnabled} onSelectLayer={onSelectLayer} />
    </Canvas>
  );
}
