/* eslint-disable react/no-unknown-property */
'use client';

import * as THREE from 'three';
import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Text, Environment, Grid } from '@react-three/drei';
import { easing } from 'maath';
import { usePathname } from 'next/navigation';

// ── Glass Lens that follows the pointer ────────────────
function GlassLens() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const { viewport, camera } = useThree();

    useFrame((state, delta) => {
        const { pointer } = state;
        const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

        // Smooth follow cursor
        const destX = (pointer.x * v.width) / 2;
        const destY = (pointer.y * v.height) / 2;
        easing.damp3(meshRef.current.position, [destX, destY, 15], 0.15, delta);

        // Slow rotation
        meshRef.current.rotation.z += delta * 0.1;

        // Target scale for home page
        const targetScale = 0.225;
        easing.damp3(meshRef.current.scale, [targetScale, targetScale, targetScale], 0.2, delta);
    });

    return (
        <>
            <Particles />
            {/* The glass lens */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshTransmissionMaterial
                    transmission={1}
                    roughness={0}
                    thickness={3}
                    ior={1.2}
                    chromaticAberration={0.06}
                    anisotropy={0.1}
                    distortion={0.2}
                    distortionScale={0.15}
                    temporalDistortion={0.1}
                />
            </mesh>
        </>
    );
}

// ── Floating particles for depth ───────────────────────
function Particles() {
    const count = 40;
    const meshRef = useRef<THREE.InstancedMesh>(null!);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: [
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 2,
                ],
                speed: 0.01 + Math.random() * 0.02,
                scale: 0.01 + Math.random() * 0.03,
                phase: Math.random() * Math.PI * 2,
            });
        }
        return temp;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        particles.forEach((p, i) => {
            dummy.position.set(
                p.position[0] + Math.sin(t * p.speed * 10 + p.phase) * 0.3,
                p.position[1] + Math.cos(t * p.speed * 8 + p.phase) * 0.2,
                p.position[2]
            );
            dummy.scale.setScalar(p.scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#6366f1" transparent opacity={0.4} />
        </instancedMesh>
    );
}

// ── Export ──────────────────────────────────────────────
export function FluidCursor() {
    const pathname = usePathname();
    const [eventSource, setEventSource] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setEventSource(document.body);
    }, []);

    if (pathname !== '/') return null;

    return (
        <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 0, 20], fov: 15 }}
                gl={{ alpha: true }}
                style={{ background: 'transparent' }}
                eventSource={eventSource || undefined}
                eventPrefix="client"
            >
                {/* 3D Grid for Refraction */}
                <Grid
                    position={[0, 0, -5]}
                    args={[50, 50]}
                    cellSize={0.5}
                    cellThickness={1}
                    cellColor="#ffffff10"
                    sectionSize={2.5}
                    sectionThickness={1.5}
                    sectionColor="#ffffff15"
                    fadeDistance={30}
                    fadeStrength={1}
                    rotation={[Math.PI / 2, 0, 0]}
                />
                <Environment preset="city" />
                <GlassLens />
            </Canvas>
        </div>
    );
}
