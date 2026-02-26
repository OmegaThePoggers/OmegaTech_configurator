/* eslint-disable react/no-unknown-property */
'use client';

import * as THREE from 'three';
import { useRef, useState, useMemo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Text, Environment } from '@react-three/drei';
import { easing } from 'maath';

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
    });

    return (
        <>
            <Particles />
            {/* The glass lens */}
            <mesh ref={meshRef} scale={0.3}>
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
    return (
        <div className="absolute inset-0 z-0" style={{ pointerEvents: 'auto' }}>
            <Canvas
                camera={{ position: [0, 0, 20], fov: 15 }}
                gl={{ alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Environment preset="city" />
                <GlassLens />
            </Canvas>
        </div>
    );
}
