"use client";

import { useGLTF, Plane, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";

export default function Window() {
  const { scene } = useGLTF("/window.glb");
  const modelRef = useRef<THREE.Group>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const bloomLightRef = useRef<THREE.PointLight>(null);
  const bottomLightRef = useRef<THREE.PointLight>(null);
  const texture = useTexture("/3.3.png");

  useFrame(({ mouse }) => {
    if (modelRef.current) {
      gsap.to(modelRef.current.rotation, {
        x: mouse.y * 0.2,
        y: mouse.x * 0.2,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  });

  const handleHover = () => {
    if (modelRef.current) {
      gsap.to(modelRef.current.scale, {
        x: 0.012,
        y: 0.012,
        z: 0.012,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleUnhover = () => {
    if (modelRef.current) {
      gsap.to(modelRef.current.scale, {
        x: 0.011,
        y: 0.011,
        z: 0.01,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        position={[0, 0, 1]}
        scale={0.01}
        onPointerOver={handleHover}
        onPointerOut={handleUnhover}
      />

      <Plane ref={planeRef} args={[0.5, 0.5]} position={[0, 0, 0.2]} scale={2.5}>
        <meshBasicMaterial map={texture} />
      </Plane>

      <pointLight ref={lightRef} position={[0, 2, 1]} intensity={10} color="white" castShadow />
      <pointLight ref={bloomLightRef} position={[0, 1, 1]} intensity={5} color="gold" />
      <pointLight
        ref={bottomLightRef}
        position={[0, -1, 2]}
        intensity={1}
        color="white"
        castShadow
        rotation={[Math.PI / 2, 0, 0]}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.5} />
      </EffectComposer>
    </>
  );
}

