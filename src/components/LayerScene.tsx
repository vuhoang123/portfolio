"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
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
};
type Point = [number, number, number];
type Pose = { position: Point; rotation: Point; scale: number };
type SceneTextures = {
  panels: THREE.CanvasTexture[];
  markers: THREE.CanvasTexture[];
  shadow: THREE.CanvasTexture;
};

const layerKinds: LayerKind[] = ["data", "admin", "interface"];
const assemblyRotation: Point = [-0.14, -0.28, -0.055];
// Each chapter brings its own layer forward while leaving the other two visible.
const chapters: Pose[][] = [
  [
    { position: [-0.20, -1.44, -0.95], rotation: [0.03, -0.10, -0.035], scale: 0.94 },
    { position: [0.60, -0.49, 0.03], rotation: [-0.025, 0.10, 0.055], scale: 0.96 },
    { position: [-0.46, 0.83, 1.00], rotation: [0.015, -0.08, -0.085], scale: 1 },
  ],
  [
    { position: [-0.52, -1.36, -0.84], rotation: [0.03, -0.10, -0.055], scale: 0.91 },
    { position: [-0.30, 0.08, 1.10], rotation: [-0.015, 0.04, 0.04], scale: 1 },
    { position: [0.91, 1.28, -0.65], rotation: [0.04, -0.06, -0.12], scale: 0.82 },
  ],
  [
    { position: [-0.04, -0.13, 1.21], rotation: [0.025, 0.08, -0.035], scale: 1 },
    { position: [-0.71, -1.14, -0.68], rotation: [-0.025, 0.05, 0.085], scale: 0.84 },
    { position: [0.84, 1.34, -0.84], rotation: [0.04, -0.06, -0.115], scale: 0.79 },
  ],
];

function chapterTransition(progress: number) {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  const from = p <= 0.55 ? 0 : 1;
  const segment = from === 0 ? p / 0.55 : (p - 0.55) / 0.45;
  return { from, to: from + 1, amount: segment * segment * (3 - 2 * segment) };
}

function fitCameraDistance(aspect: number) {
  const tangent = Math.tan(THREE.MathUtils.degToRad(38) / 2);
  const assemblyMatrix = new THREE.Matrix4().makeRotationFromEuler(
    new THREE.Euler(...assemblyRotation),
  );
  let distance = 8.5;
  const vertex = new THREE.Vector3();
  const poseMatrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  // Fit every chapter, including the floating tags, so the camera stays still.
  for (const chapter of chapters) {
    for (const pose of chapter) {
      quaternion.setFromEuler(new THREE.Euler(...pose.rotation));
      poseMatrix.compose(new THREE.Vector3(...pose.position), quaternion, scale.setScalar(pose.scale));
      for (const x of [-2.57, 2.57]) {
        for (const y of [-1.76, 1.98]) {
          vertex.set(x, y, 0.18).applyMatrix4(poseMatrix).applyMatrix4(assemblyMatrix);
          distance = Math.max(
            distance,
            Math.abs(vertex.x) / (tangent * Math.max(aspect, 0.5)) + vertex.z,
            Math.abs(vertex.y) / tangent + vertex.z,
          );
        }
      }
    }
  }
  return distance * 1.045;
}

function SceneContents({ progress = 0, reducedMotion = false }: LayerSceneProps) {
  const assembly = useRef<THREE.Group>(null);
  const panels = useRef<(THREE.Group | null)[]>([]);
  const hover = useRef(false);
  const [textures, setTextures] = useState<SceneTextures | null>(null);
  const invalidate = useThree((state) => state.invalidate);
  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera);

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
    camera.position.z = fitCameraDistance(size.width / Math.max(size.height, 1));
    camera.updateMatrixWorld();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);

  useEffect(() => invalidate(), [progress, reducedMotion, textures, invalidate]);

  useFrame((state, delta) => {
    if (!assembly.current) return;
    const { from, to, amount } = chapterTransition(progress);
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-7.5 * Math.min(delta, 0.1));
    const pointer = !reducedMotion && hover.current ? state.pointer : { x: 0, y: 0 };
    const targetRotation = [
      assemblyRotation[0] + pointer.y * 0.045,
      assemblyRotation[1] + pointer.x * 0.075,
      assemblyRotation[2] + pointer.x * 0.015,
    ];
    let distance = 0;
    const axes = ["x", "y", "z"] as const;
    axes.forEach((axis, index) => {
      distance += Math.abs(assembly.current!.rotation[axis] - targetRotation[index]);
      assembly.current!.rotation[axis] = THREE.MathUtils.lerp(assembly.current!.rotation[axis], targetRotation[index], alpha);
    });

    panels.current.forEach((panel, i) => {
      if (!panel) return;
      const a = chapters[from][i];
      const b = chapters[to][i];
      axes.forEach((axis, index) => {
        const targetPosition = THREE.MathUtils.lerp(a.position[index], b.position[index], amount);
        const targetAngle = THREE.MathUtils.lerp(a.rotation[index], b.rotation[index], amount);
        distance += Math.abs(panel.position[axis] - targetPosition) + Math.abs(panel.rotation[axis] - targetAngle);
        panel.position[axis] = THREE.MathUtils.lerp(panel.position[axis], targetPosition, alpha);
        panel.rotation[axis] = THREE.MathUtils.lerp(panel.rotation[axis], targetAngle, alpha);
      });
      const targetScale = THREE.MathUtils.lerp(a.scale, b.scale, amount);
      distance += Math.abs(panel.scale.x - targetScale);
      panel.scale.setScalar(THREE.MathUtils.lerp(panel.scale.x, targetScale, alpha));
    });
    if (distance > 0.00015 && !reducedMotion) invalidate();
  });

  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight position={[-3, 5, 7]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[4, -2, 2]} intensity={1} color="#99afff" />
      <group rotation={[0.12, 0.15, -0.32]} position={[0, -0.13, -2.6]}>
        <mesh>
          <torusGeometry args={[3.32, 0.012, 6, 128, Math.PI * 1.65]} />
          <meshBasicMaterial color="#2858ff" transparent opacity={0.48} toneMapped={false} />
        </mesh>
        <mesh rotation={[0, 0, 0.68]}>
          <torusGeometry args={[3.52, 0.007, 5, 128, Math.PI * 1.28]} />
          <meshBasicMaterial color="#8c9dbd" transparent opacity={0.28} toneMapped={false} />
        </mesh>
        <mesh position={[3.32, 0, 0]}>
          <sphereGeometry args={[0.105, 16, 12]} />
          <meshBasicMaterial color="#2858ff" toneMapped={false} />
        </mesh>
        <mesh position={[-2.07, -2.60, 0]}>
          <sphereGeometry args={[0.042, 12, 8]} />
          <meshBasicMaterial color="#2858ff" toneMapped={false} />
        </mesh>
      </group>
      <group
        ref={assembly}
        rotation={assemblyRotation}
        onPointerOver={() => { hover.current = true; invalidate(); }}
        onPointerOut={() => { hover.current = false; invalidate(); }}
        onPointerMove={() => invalidate()}
      >
        {layerKinds.map((kind, i) => (
          <group
            key={kind}
            ref={(instance) => { panels.current[i] = instance; }}
            position={chapters[0][i].position}
            rotation={chapters[0][i].rotation}
            scale={chapters[0][i].scale}
          >
            {textures && (
              <mesh position={[0.07, -0.10, -0.145]}>
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

export default function LayerScene({ progress = 0, reducedMotion = false }: LayerSceneProps) {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 10], fov: 38, near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <SceneContents progress={progress} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
