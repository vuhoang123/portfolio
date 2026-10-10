"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createPanelTexture, type LayerKind } from "./scene-textures";

type LayerSceneProps = {
  progress?: number;
  reducedMotion?: boolean;
};

const layerKinds: LayerKind[] = ["data", "admin", "interface"];
const positions = [
  { closed: [0.34, -0.27, -0.64], open: [0.96, -0.73, -0.68] },
  { closed: [0.16, -0.13, -0.22], open: [0.18, -0.02, -0.08] },
  { closed: [-0.04, 0.03, 0.24], open: [-0.78, 0.72, 0.7] },
];

function SceneContents({
  progress = 0,
  reducedMotion = false,
}: LayerSceneProps) {
  const assembly = useRef<THREE.Group>(null);
  const panels = useRef<(THREE.Group | null)[]>([]);
  const hover = useRef(false);
  const [textures, setTextures] = useState<THREE.CanvasTexture[]>([]);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const created = layerKinds.map(createPanelTexture);
    setTextures(created);
    return () => created.forEach((texture) => texture.dispose());
  }, []);

  useEffect(() => {
    invalidate();
  }, [progress, reducedMotion, textures, invalidate]);

  useFrame((state, delta) => {
    if (!assembly.current) return;
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    const eased = t * t * (3 - 2 * t);
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-8 * Math.min(delta, 0.1));
    const pointer =
      !reducedMotion && hover.current ? state.pointer : { x: 0, y: 0 };
    const targetX = -0.07 + pointer.y * 0.035;
    const targetY = -0.29 + pointer.x * 0.06;
    let distance =
      Math.abs(assembly.current.rotation.x - targetX) +
      Math.abs(assembly.current.rotation.y - targetY);
    assembly.current.rotation.x = THREE.MathUtils.lerp(
      assembly.current.rotation.x,
      targetX,
      alpha,
    );
    assembly.current.rotation.y = THREE.MathUtils.lerp(
      assembly.current.rotation.y,
      targetY,
      alpha,
    );

    panels.current.forEach((panel, i) => {
      if (!panel) return;
      const { closed, open } = positions[i];
      for (let axis = 0; axis < 3; axis++) {
        const target = THREE.MathUtils.lerp(closed[axis], open[axis], eased);
        const key = axis === 0 ? "x" : axis === 1 ? "y" : "z";
        distance += Math.abs(panel.position[key] - target);
        panel.position[key] = THREE.MathUtils.lerp(
          panel.position[key],
          target,
          alpha,
        );
      }
      const targetRotation =
        i === 0 ? -0.026 - eased * 0.016 : i === 2 ? 0.025 + eased * 0.018 : 0;
      distance += Math.abs(panel.rotation.z - targetRotation);
      panel.rotation.z = THREE.MathUtils.lerp(
        panel.rotation.z,
        targetRotation,
        alpha,
      );
    });
    if (distance > 0.00015 && !reducedMotion) invalidate();
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[-3, 5, 7]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[4, -2, 2]} intensity={0.8} color="#a8b8ff" />
      <group
        ref={assembly}
        rotation={[-0.07, -0.29, -0.065]}
        position={[0, 0.03, 0]}
        onPointerOver={() => {
          hover.current = true;
          invalidate();
        }}
        onPointerOut={() => {
          hover.current = false;
          invalidate();
        }}
        onPointerMove={() => invalidate()}
      >
        {layerKinds.map((kind, i) => (
          <group
            key={kind}
            ref={(instance) => {
              panels.current[i] = instance;
            }}
            position={positions[i].closed as [number, number, number]}
          >
            <RoundedBox args={[4.9, 3.13, 0.12]} radius={0.06} smoothness={4}>
              <meshStandardMaterial
                color={kind === "data" ? "#283247" : "#eef0f5"}
                roughness={0.56}
                metalness={0.08}
              />
            </RoundedBox>
            {textures[i] && (
              <mesh position={[0, 0, 0.065]}>
                <planeGeometry args={[4.76, 2.975]} />
                <meshBasicMaterial map={textures[i]} toneMapped={false} />
              </mesh>
            )}
            <mesh position={[2.39, 0.24, 0.075]}>
              <boxGeometry args={[0.023, 0.54, 0.02]} />
              <meshBasicMaterial color="#254bff" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

export default function LayerScene({
  progress = 0,
  reducedMotion = false,
}: LayerSceneProps) {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 8.7], fov: 38, near: 0.1, far: 30 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <SceneContents progress={progress} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
