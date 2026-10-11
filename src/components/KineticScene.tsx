"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export type KineticProgressSource = {
  get: () => number;
  subscribe: (listener: () => void) => () => void;
};

type KineticSceneProps = {
  progressSource: KineticProgressSource;
  reducedMotion?: boolean;
  animationEnabled?: boolean;
  pulseToken?: number;
};

type Voxel = { position: THREE.Vector3; color: string; seed: number };
type Pose = { position: THREE.Vector3; rotation: THREE.Quaternion; scale: number; terrainHeight?: number };

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
const sculptureRotation = new THREE.Euler(0.065, -0.16, -0.035);
const waveTilt = new THREE.Euler(0.91, 0.10, -0.13);
const waveHeightDirection = new THREE.Vector3(0, 1, 0).applyEuler(waveTilt);
const worldWaveHeightDirection = waveHeightDirection.clone().applyEuler(sculptureRotation);
const waveColumns = 25;
const pitch = 0.22;

function terrainHeight(x: number, z: number, time = 0) {
  return Math.sin(x * 1.02 + z * 0.62 - time * 0.90) * 0.52 + Math.cos(z * 1.30 + time * 0.65) * 0.20;
}

function signatureVoxels(): Voxel[] {
  const points: Voxel[] = [];
  const addGlyph = (glyph: string[], offset: number, rowOffset = 0) => {
    glyph.forEach((row, y) => {
      [...row].forEach((pixel, x) => {
        if (pixel !== "1") return;
        for (let layer = 0; layer < 3; layer++) {
          const seed = ((x + offset) * 17 + (y + rowOffset + 4) * 31 + layer * 13) % 101;
          const color = layer === 2
            ? seed < 7 ? "#dce5ff" : seed > 87 ? "#182d62" : "#2858ff"
            : seed < 21 ? "#9db6ff" : seed > 73 ? "#182d62" : "#1945d9";
          points.push({
            position: new THREE.Vector3((x + offset - 14) * pitch, (8 - y - rowOffset) * pitch - 0.28, (layer - 1) * 0.24),
            color,
            seed: seed / 101,
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

function buildPoses(voxels: Voxel[]): Pose[][] {
  const signature = voxels.map((voxel) => ({ position: voxel.position, rotation: new THREE.Quaternion(), scale: 0.205 }));
  const half = Math.ceil(voxels.length / 2);
  const segments = Math.ceil(half / 4);
  const orbit = voxels.map((voxel, i) => {
    const ribbon = i < half ? 0 : 1;
    const local = i % half;
    const angle = (local % segments) / segments * Math.PI * 2 + ribbon * Math.PI;
    const band = Math.floor(local / segments) - 1.5;
    const radius = 2.62 + band * 0.18;
    const twist = new THREE.Euler(ribbon === 0 ? 0.60 : -0.60, ribbon === 0 ? -0.22 : 0.22, -0.24);
    const position = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * 1.48 + Math.sin(angle * 2) * 0.18,
      Math.sin(angle * 2 + ribbon * Math.PI) * 0.58 + band * 0.17,
    ).applyEuler(twist);
    const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(angle * 0.35, angle + ribbon * 0.5, angle + band * 0.16));
    return { position, rotation, scale: 0.192 + voxel.seed * 0.02 };
  });
  const rows = Math.ceil(voxels.length / waveColumns);
  const wave = voxels.map((voxel, i) => {
    const x = (i % waveColumns - (waveColumns - 1) / 2) * 0.265;
    const z = (Math.floor(i / waveColumns) - (rows - 1) / 2) * 0.265;
    const height = terrainHeight(x, z);
    return {
      position: new THREE.Vector3(x, height, z).applyEuler(waveTilt),
      rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.91 + Math.cos(x + z) * 0.12, 0.10, -0.13)),
      scale: 0.195 + voxel.seed * 0.016,
      terrainHeight: height,
    };
  });
  return [signature, orbit, wave];
}

function poseTransition(progress: number, reducedMotion: boolean) {
  if (reducedMotion) {
    const chapter = progress < 0.25 ? 0 : progress < 0.8 ? 1 : 2;
    return { from: chapter, to: chapter, amount: 0 };
  }
  const from = progress <= 0.55 ? 0 : 1;
  const amount = THREE.MathUtils.clamp(from === 0 ? progress / 0.55 : (progress - 0.55) / 0.45, 0, 1);
  return { from, to: from + 1, amount: THREE.MathUtils.smoothstep(amount, 0, 1) };
}

function fittedDistance(poses: Pose[][], progress: number, aspect: number, reducedMotion: boolean) {
  const { from, to, amount } = poseTransition(progress, reducedMotion);
  const tangent = Math.tan(THREE.MathUtils.degToRad(38) / 2);
  const point = new THREE.Vector3();
  const edge = new THREE.Vector3();
  let distance = 6.8;
  for (let i = 0; i < poses[0].length; i++) {
    point.lerpVectors(poses[from][i].position, poses[to][i].position, amount).applyEuler(sculptureRotation);
    distance = Math.max(
      distance,
      (Math.abs(point.x) + 0.23) / (tangent * Math.max(aspect, 0.45)) + point.z + 0.18,
      (Math.abs(point.y) + 0.23) / tangent + point.z + 0.18,
    );
    if (to === 2 && !reducedMotion) {
      // Fit every phase of the rolling terrain, rather than zooming each frame.
      for (const extreme of [-0.72, 0.72]) {
        edge.copy(point).addScaledVector(worldWaveHeightDirection, (extreme - (poses[2][i].terrainHeight ?? 0)) * amount);
        distance = Math.max(
          distance,
          (Math.abs(edge.x) + 0.23) / (tangent * Math.max(aspect, 0.45)) + edge.z + 0.18,
          (Math.abs(edge.y) + 0.23) / tangent + edge.z + 0.18,
        );
      }
    }
  }
  return distance;
}

function KineticSculpture({ progressSource, reducedMotion = false, animationEnabled = true, pulseToken = 0 }: KineticSceneProps) {
  const blocks = useRef<THREE.InstancedMesh>(null);
  const sculpture = useRef<THREE.Group>(null);
  const { camera, size, invalidate, gl } = useThree();
  const voxels = useMemo(signatureVoxels, []);
  const poses = useMemo(() => buildPoses(voxels), [voxels]);
  const waveRows = Math.ceil(voxels.length / waveColumns);
  const geometry = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 1, 0.12), []);
  const helper = useMemo(() => new THREE.Object3D(), []);
  const rotationOffset = useMemo(() => new THREE.Quaternion(), []);
  const rotationEuler = useMemo(() => new THREE.Euler(), []);
  const fitProgress = useRef(-1);
  const targetProgress = useRef(THREE.MathUtils.clamp(progressSource.get(), 0, 1));
  const renderedProgress = useRef(targetProgress.current);
  const cameraDistance = useRef(fittedDistance(poses, targetProgress.current, size.width / size.height, reducedMotion));
  const motionTime = useRef(0);
  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, inside: false });
  const pulse = useRef({ age: 2, x: 0, y: 0 });
  const previousPulse = useRef(pulseToken);

  useLayoutEffect(() => {
    if (!blocks.current) return;
    const color = new THREE.Color();
    blocks.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    voxels.forEach((voxel, index) => blocks.current?.setColorAt(index, color.set(voxel.color)));
    if (blocks.current.instanceColor) blocks.current.instanceColor.needsUpdate = true;
    invalidate();
  }, [voxels, invalidate]);

  useEffect(() => () => { geometry.dispose(); }, [geometry]);

  useEffect(() => {
    const sync = () => {
      targetProgress.current = THREE.MathUtils.clamp(progressSource.get(), 0, 1);
      invalidate();
    };
    sync();
    return progressSource.subscribe(sync);
  }, [progressSource, invalidate]);

  useEffect(() => {
    fitProgress.current = -1;
    cameraDistance.current = fittedDistance(poses, targetProgress.current, size.width / Math.max(size.height, 1), reducedMotion);
    if (!animationEnabled || reducedMotion) camera.position.z = cameraDistance.current;
    invalidate();
  }, [animationEnabled, reducedMotion, size.width, size.height, poses, camera, invalidate]);

  useEffect(() => {
    if (pulseToken !== previousPulse.current && animationEnabled && !reducedMotion) {
      pulse.current = { age: 0, x: 0, y: 0 };
      invalidate();
    }
    previousPulse.current = pulseToken;
  }, [pulseToken, animationEnabled, reducedMotion, invalidate]);

  useEffect(() => {
    if (!animationEnabled || reducedMotion) {
      pointer.current.strength = 0;
      pointer.current.inside = false;
      pulse.current.age = 2;
      gl.domElement.style.cursor = "auto";
    }
    invalidate();
    return () => { gl.domElement.style.cursor = "auto"; };
  }, [animationEnabled, reducedMotion, gl, invalidate]);

  useFrame((_, rawDelta) => {
    const mesh = blocks.current;
    const group = sculpture.current;
    if (!mesh || !group) return;
    const delta = Math.min(rawDelta, 0.04);
    const moving = animationEnabled && !reducedMotion;
    const blend = 1 - Math.exp(-delta * 8);
    renderedProgress.current = moving
      ? THREE.MathUtils.lerp(renderedProgress.current, targetProgress.current, blend)
      : targetProgress.current;
    if (Math.abs(renderedProgress.current - targetProgress.current) < 0.0005) renderedProgress.current = targetProgress.current;
    const progress = renderedProgress.current;
    const { from, to, amount } = poseTransition(progress, reducedMotion);
    if (Math.abs(fitProgress.current - progress) > 0.002) {
      cameraDistance.current = fittedDistance(poses, progress, size.width / Math.max(size.height, 1), reducedMotion);
      fitProgress.current = progress;
    }
    camera.position.z = moving ? THREE.MathUtils.lerp(camera.position.z, cameraDistance.current, blend) : cameraDistance.current;
    if (moving) motionTime.current += delta;
    const time = motionTime.current;
    const ambientPose = !reducedMotion;
    const cursor = pointer.current;
    cursor.x = THREE.MathUtils.lerp(cursor.x, cursor.targetX, blend);
    cursor.y = THREE.MathUtils.lerp(cursor.y, cursor.targetY, blend);
    cursor.strength = moving ? THREE.MathUtils.lerp(cursor.strength, cursor.inside ? 1 : 0, blend) : 0;
    if (moving && pulse.current.age < 2) pulse.current.age += delta;
    const ripple = pulse.current;
    const orbitWeight = from === 0 ? amount : 1 - amount;
    const waveWeight = from === 1 ? amount : 0;
    group.rotation.set(
      sculptureRotation.x + (ambientPose ? Math.sin(time * 0.36) * 0.026 : 0),
      sculptureRotation.y + (ambientPose ? Math.sin(time * 0.28) * (0.025 + orbitWeight * 0.08) : 0),
      sculptureRotation.z + (ambientPose ? Math.sin(time * 0.30) * orbitWeight * 0.055 : 0),
    );
    for (let i = 0; i < voxels.length; i++) {
      const a = poses[from][i];
      const b = poses[to][i];
      const seed = voxels[i].seed;
      helper.position.lerpVectors(a.position, b.position, amount);
      helper.quaternion.slerpQuaternions(a.rotation, b.rotation, amount);
      if (ambientPose) {
        helper.position.z += Math.sin(time * 0.88 + seed * 5) * 0.035;
        if (waveWeight > 0) {
          const x = (i % waveColumns - (waveColumns - 1) / 2) * 0.265;
          const z = (Math.floor(i / waveColumns) - (waveRows - 1) / 2) * 0.265;
          const heightChange = terrainHeight(x, z, time) - (poses[2][i].terrainHeight ?? 0);
          helper.position.addScaledVector(waveHeightDirection, heightChange * waveWeight);
        }
      }
      const dx = helper.position.x - cursor.x;
      const dy = helper.position.y - cursor.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const repel = Math.exp(-distance * distance / 1.05) * cursor.strength;
      helper.position.x += dx / Math.max(distance, 0.15) * repel * 0.28;
      helper.position.y += dy / Math.max(distance, 0.15) * repel * 0.28;
      helper.position.z += repel * 0.52;
      let energy = 0;
      if (moving && ripple.age < 2) {
        const px = helper.position.x - ripple.x;
        const py = helper.position.y - ripple.y;
        const radius = Math.sqrt(px * px + py * py);
        energy = Math.exp(-Math.pow((radius - ripple.age * 5.5) * 2.5, 2)) * Math.exp(-ripple.age * 0.65);
        helper.position.x += px / Math.max(radius, 0.1) * energy * 0.25;
        helper.position.y += py / Math.max(radius, 0.1) * energy * 0.25;
        helper.position.z += energy * (0.68 + seed * 0.28);
      }
      rotationOffset.setFromEuler(rotationEuler.set(energy * 0.55 + repel * 0.12, energy * seed * 0.35, energy * 0.40));
      helper.quaternion.multiply(rotationOffset);
      helper.scale.setScalar(THREE.MathUtils.lerp(a.scale, b.scale, amount) * (1 + energy * 0.10));
      helper.updateMatrix();
      mesh.setMatrixAt(i, helper.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (moving) invalidate();
  });

  const movePointer = (event: ThreeEvent<PointerEvent>) => {
    if (!animationEnabled || reducedMotion) return;
    pointer.current.targetX = event.point.x;
    pointer.current.targetY = event.point.y;
    pointer.current.inside = true;
    gl.domElement.style.cursor = "crosshair";
    invalidate();
  };

  return (
    <>
      <ambientLight intensity={1.55} />
      <directionalLight
        position={[-4, 7, 8]} intensity={3.2} color="#ffffff" castShadow
        shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004}
        shadow-camera-left={-5} shadow-camera-right={5}
        shadow-camera-top={5} shadow-camera-bottom={-5}
        shadow-camera-near={0.1} shadow-camera-far={24}
      />
      <directionalLight position={[5, -1, 4]} intensity={1.4} color="#94b2ff" />
      <directionalLight position={[0, 4, -6]} intensity={2.0} color="#d7e4ff" />
      <group ref={sculpture} rotation={sculptureRotation}>
        <instancedMesh ref={blocks} args={[geometry, undefined, voxels.length]} castShadow receiveShadow frustumCulled={false}>
          <meshStandardMaterial roughness={0.32} metalness={0.14} />
        </instancedMesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.85, 0]} receiveShadow raycast={() => undefined}>
        <planeGeometry args={[24, 24]} />
        <shadowMaterial transparent opacity={0.11} depthWrite={false} />
      </mesh>
      <mesh
        onPointerMove={movePointer}
        onPointerOut={() => { pointer.current.inside = false; gl.domElement.style.cursor = "auto"; invalidate(); }}
        onClick={(event) => {
          if (!animationEnabled || reducedMotion) return;
          pulse.current = { age: 0, x: event.point.x, y: event.point.y };
          invalidate();
        }}
      >
        <planeGeometry args={[30, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

export default memo(function KineticScene(props: KineticSceneProps) {
  return (
    <Canvas
      shadows="percentage"
      frameloop="demand"
      camera={{ position: [0, 0, 8.6], fov: 38, near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <KineticSculpture {...props} />
    </Canvas>
  );
});
