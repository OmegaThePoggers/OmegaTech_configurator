'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

function PCCase() {
    const edgesGeometry = useMemo(() => {
        const box = new THREE.BoxGeometry(2.5, 4, 2);
        return new THREE.EdgesGeometry(box);
    }, []);

    return (
        <group>
            {/* Transparent case body */}
            <mesh>
                <boxGeometry args={[2.5, 4, 2]} />
                <meshBasicMaterial color={0x00ffff} transparent opacity={0.1} />
            </mesh>
            {/* Wireframe edges */}
            <lineSegments geometry={edgesGeometry}>
                <lineBasicMaterial color={0x00ffff} />
            </lineSegments>
        </group>
    );
}

function Motherboard() {
    return (
        <mesh position={[-0.2, 0, 0]}>
            <boxGeometry args={[1.8, 3.5, 0.1]} />
            <meshBasicMaterial color={0x222222} transparent opacity={0.8} />
        </mesh>
    );
}

function CPU() {
    return (
        <mesh position={[-0.2, 1, 0.1]}>
            <boxGeometry args={[0.4, 0.4, 0.2]} />
            <meshBasicMaterial color={0x00aaaa} />
        </mesh>
    );
}

function RAM() {
    return (
        <group>
            <mesh position={[0.4, 1, 0.1]}>
                <boxGeometry args={[0.15, 0.8, 0.05]} />
                <meshBasicMaterial color={0x00cccc} />
            </mesh>
            <mesh position={[0.6, 1, 0.1]}>
                <boxGeometry args={[0.15, 0.8, 0.05]} />
                <meshBasicMaterial color={0x00cccc} />
            </mesh>
        </group>
    );
}

function GPU() {
    return (
        <mesh position={[0.1, 0, 0.3]}>
            <boxGeometry args={[1.2, 0.2, 0.6]} />
            <meshBasicMaterial color={0x008888} />
        </mesh>
    );
}

function PSU() {
    return (
        <mesh position={[0, -1.3, 0]}>
            <boxGeometry args={[1.2, 0.8, 1]} />
            <meshBasicMaterial color={0x333333} />
        </mesh>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.7} />
            <pointLight position={[5, 5, 5]} intensity={1} />
            <PCCase />
            <Motherboard />
            <CPU />
            <RAM />
            <GPU />
            <PSU />
            <OrbitControls
                enableDamping
                dampingFactor={0.05}
                minDistance={2}
                maxDistance={10}
            />
        </>
    );
}

export function PCViewer({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 4], fov: 75 }}
                gl={{ alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
