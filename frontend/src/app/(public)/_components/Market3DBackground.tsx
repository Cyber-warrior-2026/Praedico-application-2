"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera, ContactShadows, Stars, Sparkles } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Group } from "three";

function Geometries() {
    const groupRef = useRef<Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle rotation for the whole group
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;

            // Mouse interaction parallax
            const { mouse } = state;
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.1, 0.05);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.2 + (state.clock.getElapsedTime() * 0.05), 0.05);
        }
    });

    const material = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: "#4f46e5", // Indigo-600
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.5, // Glass-like
        thickness: 2,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: "#312e81", // Indigo-900
        emissiveIntensity: 0.2
    }), []);

    const secondaryMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#a855f7", // Purple-500
        roughness: 0.3,
        metalness: 0.8,
        emissive: "#581c87", // Purple-900
        emissiveIntensity: 0.2
    }), []);

    return (
        <group ref={groupRef}>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                {/* Main Floating Ring */}
                <mesh position={[2, 0, -2]} rotation={[Math.PI / 3, 0, 0]}>
                    <torusGeometry args={[2.5, 0.2, 16, 100]} />
                    <primitive object={material} />
                </mesh>

                {/* Floating Icosahedron - Hero Object */}
                <mesh position={[-3, 1, -5]}>
                    <icosahedronGeometry args={[1.5, 0]} />
                    <primitive object={material} attach="material" color="#ec4899" />
                </mesh>

                {/* Small decorative spheres */}
                <mesh position={[4, 2, -5]} scale={0.5}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <primitive object={secondaryMaterial} />
                </mesh>
                <mesh position={[-4, -2, -3]} scale={0.8}>
                    <capsuleGeometry args={[0.5, 1, 4, 8]} />
                    <primitive object={secondaryMaterial} />
                </mesh>
            </Float>
        </group>
    );
}

export default function Market3DBackground() {
    return (
        <div className="fixed inset-0 -z-10 bg-slate-950">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50" />
            <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#818cf8" castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#c084fc" />

                <Geometries />

                {/* Environment & Atmosphere */}
                <Environment preset="city" />
                <ContactShadows
                    position={[0, -4.5, 0]}
                    opacity={0.4}
                    scale={40}
                    blur={2.5}
                    far={4.5}
                    color="#000000"
                    frames={1} // Fix flickering: render only once
                    resolution={256}
                />

                {/* Subtle Particles */}
                <Sparkles count={40} scale={12} size={3} speed={0.4} opacity={0.4} color="#818cf8" />
            </Canvas>
        </div>
    );
}
