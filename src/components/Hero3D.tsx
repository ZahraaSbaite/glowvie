"use client";

import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Float, Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function GlassSculpture() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.03;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={1.6}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color="#EAD9D9"
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
          thickness={1.2}
          distort={0.25}
          speed={1.2}
          clearcoat={1}
          ior={1.4}
        />
      </mesh>
    </Float>
  );
}

function RingAccent() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z -= delta * 0.08;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.4, 0, 0]}>
      <torusGeometry args={[2.1, 0.015, 16, 100]} />
      <meshStandardMaterial color="#C9A66B" metalness={0.9} roughness={0.2} />
    </mesh>
  );
}

function CameraParallax() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    target.current.x += (pointer.x * 0.5 - target.current.x) * 0.04;
    target.current.y += (pointer.y * 0.3 - target.current.y) * 0.04;
    camera.position.x += (target.current.x - camera.position.x) * 0.06;
    camera.position.y += (target.current.y - camera.position.y) * 0.06;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene({ isTouch }: { isTouch: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#EAD9D9" />
      <pointLight position={[-4, -2, -3]} intensity={20} color="#C9A66B" />
      <directionalLight position={[0, 5, 5]} intensity={0.8} color="#ffffff" />

      <GlassSculpture />
      <RingAccent />
      <Sparkles count={40} scale={5} size={2.5} speed={0.3} color="#C9A66B" opacity={0.7} />
      <Environment preset="studio" />
      {!isTouch && <CameraParallax />}
    </>
  );
}

export function Hero3D({ fallback }: { fallback: React.ReactNode }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    setSupported(hasWebGL() && !reduceMotion);
  }, []);

  const dpr = useMemo<[number, number]>(() => [1, 1.75], []);

  if (supported === null) {
    return <div className="h-full w-full animate-pulse rounded-xl3 bg-bg-soft" />;
  }

  if (!supported) {
    return <>{fallback}</>;
  }

  return (
    <Suspense fallback={<div className="h-full w-full animate-pulse rounded-xl3 bg-bg-soft" />}>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 5.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        className="!rounded-xl3"
      >
        <Scene isTouch={isTouch} />
      </Canvas>
    </Suspense>
  );
}
