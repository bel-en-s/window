"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import Window from "./window";
import { OrbitControls } from "@react-three/drei";

import * as THREE from "three";

const FogShader = {
  uniforms: {
    uTime: { value: 0 },
    uLightPos: { value: new THREE.Vector3(0, 0, 2) },
    uColor: { value: new THREE.Color(0x111111) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uLightPos;
    uniform vec3 uColor;

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec2 pos = vUv * 2.0 - 1.0;
      float dist = length(pos - uLightPos.xy * 0.2);
      
      float fog = noise(pos * 10.0 + uTime * 0.1);
      fog = mix(fog, 1.0 - dist * 0.5, 0.5);
      
      vec3 color = mix(vec3(0.0), uColor, fog);
      
      gl_FragColor = vec4(color, fog * 0.6); // Adjust alpha for transparency
    }
  `
};

function Fog() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock, mouse }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uLightPos.value.set(mouse.x, mouse.y, 2);
    }
  });

  return (
    <mesh position={[0, 0, 0.1]}>
      <planeGeometry args={[5, 5]} />
      <shaderMaterial ref={materialRef} {...FogShader} transparent />
    </mesh>
  );
}

function Flashlight() {
  const lightRef = useRef<THREE.SpotLight>(null);

  useFrame(({ mouse, viewport }) => {
    if (lightRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      lightRef.current.position.set(x, y, 1);
    }
  });

  return (
    <spotLight
      ref={lightRef}
      intensity={30}
      distance={10}
      angle={Math.PI / 6}
      penumbra={0.5}
      decay={2}
      color="white"
      position={[0, 0, 2]}
      castShadow
    />
  );
}

function Background() {
  const texture = useTexture("/9.png");
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ viewport }) => {
    if (meshRef.current && texture.image) {
      const imageAspect = texture.image.width / texture.image.height;
      const viewportAspect = viewport.width / viewport.height;

      const scaleX = viewportAspect > imageAspect ? viewport.width : viewport.height * imageAspect;
      const scaleY = viewportAspect > imageAspect ? viewport.width / imageAspect : viewport.height;

      meshRef.current.scale.set(scaleX, scaleY, 1);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div style={{ position: "absolute", width: "100vw", height: "100vh" }}>
      <Canvas shadows camera={{ position: [0, 0, 2.5] }}>
        <ambientLight intensity={0.1} />
        <Window />
        <Flashlight />
        <Fog /> 
        <Background />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
