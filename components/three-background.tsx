"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 600 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      speed: 0.001 + Math.random() * 0.003,
      offset: Math.random() * Math.PI * 2,
      scale: 0.02 + Math.random() * 0.06,
      color: Math.random() > 0.6 ? "indigo" : Math.random() > 0.5 ? "coral" : "warm",
    }));
  }, [count]);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    particles.forEach((p, i) => {
      if (p.color === "indigo") {
        arr[i * 3] = 0.35;
        arr[i * 3 + 1] = 0.30;
        arr[i * 3 + 2] = 0.65;
      } else if (p.color === "coral") {
        arr[i * 3] = 0.85;
        arr[i * 3 + 1] = 0.50;
        arr[i * 3 + 2] = 0.40;
      } else {
        arr[i * 3] = 0.92;
        arr[i * 3 + 1] = 0.90;
        arr[i * 3 + 2] = 0.88;
      }
    });
    return arr;
  }, [particles, count]);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();

    particles.forEach((p, i) => {
      const x = p.position[0] + Math.sin(t * p.speed * 10 + p.offset) * 0.5 + pointer.x * 0.3;
      const y = p.position[1] + Math.cos(t * p.speed * 8 + p.offset) * 0.5 + pointer.y * 0.3;
      const z = p.position[2] + Math.sin(t * p.speed * 5) * 0.3;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.scale * (1 + Math.sin(t * 2 + p.offset) * 0.3));
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.8} vertexColors />
    </instancedMesh>
  );
}

function NebulaOrbs() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      child.position.x = Math.sin(t * 0.1 + i * 2) * 5;
      child.position.y = Math.cos(t * 0.08 + i * 3) * 4;
    });
  });

  return (
    <group ref={group}>
      <mesh position={[-6, 2, -8]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#4338ca" transparent opacity={0.06} />
      </mesh>
      <mesh position={[7, -3, -10]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#d97756" transparent opacity={0.04} />
      </mesh>
      <mesh position={[0, 5, -12]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.03} />
      </mesh>
    </group>
  );
}

function Scene() {
  const { viewport } = useThree();

  return (
    <>
      <color attach="background" args={["#f8f6f0"]} />
      <fog attach="fog" args={["#f8f6f0", 15, 35]} />
      <Particles count={500} />
      <NebulaOrbs />
    </>
  );
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.9 }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
