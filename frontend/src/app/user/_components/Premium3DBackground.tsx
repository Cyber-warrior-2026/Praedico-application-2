"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

function Stars(props: any) {
    const ref = useRef<any>();

    // Generate 5000 random points in a sphere
    // @ts-ignore
    const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#6366f1" // Indigo-500
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

function FloatingShape() {
    const mesh = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3;
            mesh.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2;
        }
    });

    return (
        <mesh ref={mesh} position={[2, 0, 0]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#6366f1" wireframe transparent opacity={0.3} />
        </mesh>
    );
}

export default function Premium3DBackground() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ambientLight intensity={0.5} />
                <Stars />
                {/* <FloatingShape />  -- Optional: Add geometric shapes if needed */}
            </Canvas>
        </div>
    );
}
