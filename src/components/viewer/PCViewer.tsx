'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef, useState, useEffect } from 'react';

// ── Types ──────────────────────────────────────────────
type SelectedPart = {
    name: string;
    brand?: string;
    tdp?: number;
    length?: number;
    wattage?: number;
    modules?: number;
    ddrGeneration?: string;
};

type PCViewerProps = {
    className?: string;
    selectedComponents?: Partial<Record<string, SelectedPart>>;
    demo?: boolean;
};

// ── Demo Color Cycling Hook ────────────────────────────
const BRAND_COLORS = [0x76b900, 0xed1c24, 0x0071c5, 0x00ffff]; // NVIDIA, AMD, Intel, Cyan
const CYCLE_DURATION = 2; // seconds per color

function useDemoColor(demo: boolean): number {
    const [colorIndex, setColorIndex] = useState(0);
    const elapsed = useRef(0);

    useFrame((_, delta) => {
        if (!demo) return;
        elapsed.current += delta;
        if (elapsed.current >= CYCLE_DURATION) {
            elapsed.current = 0;
            setColorIndex((prev) => (prev + 1) % BRAND_COLORS.length);
        }
    });

    return demo ? BRAND_COLORS[colorIndex] : 0x00ffff;
}

// ── Brand Color Mapping ────────────────────────────────
function getBrandColor(brand?: string): number {
    switch (brand) {
        case 'NVIDIA': return 0x76b900;
        case 'AMD': return 0xed1c24;
        case 'Intel': return 0x0071c5;
        default: return 0x00ffff;
    }
}

// ── Components ─────────────────────────────────────────
function PCCase({ active, brand, demoColor }: { active: boolean; brand?: string; demoColor?: number }) {
    const edgesGeometry = useMemo(() => {
        const box = new THREE.BoxGeometry(2.5, 4, 2);
        return new THREE.EdgesGeometry(box);
    }, []);

    const edgeColor = demoColor ?? (active ? getBrandColor(brand) : 0x00ffff);

    return (
        <group>
            <mesh>
                <boxGeometry args={[2.5, 4, 2]} />
                <meshBasicMaterial color={edgeColor} transparent opacity={demoColor ? 0.15 : 0.08} />
            </mesh>
            <lineSegments geometry={edgesGeometry}>
                <lineBasicMaterial color={edgeColor} />
            </lineSegments>
        </group>
    );
}

function Motherboard() {
    return (
        <mesh position={[-0.2, 0, 0]}>
            <boxGeometry args={[1.8, 3.5, 0.1]} />
            <meshStandardMaterial color={0x1a1a2e} transparent opacity={0.85} />
        </mesh>
    );
}

function CPUComponent({ active, brand, demoColor }: { active: boolean; brand?: string; demoColor?: number }) {
    const isOn = active || !!demoColor;
    const color = demoColor ?? (active ? getBrandColor(brand) : 0x333333);
    return (
        <mesh position={[-0.2, 1, 0.1]}>
            <boxGeometry args={[0.4, 0.4, 0.2]} />
            <meshStandardMaterial
                color={color}
                transparent={!isOn}
                opacity={isOn ? 1 : 0.15}
                emissive={isOn ? color : 0x000000}
                emissiveIntensity={isOn ? 0.3 : 0}
            />
        </mesh>
    );
}

function RAMComponent({ active, brand, modules = 2, demoColor }: { active: boolean; brand?: string; modules?: number; demoColor?: number }) {
    const isOn = active || !!demoColor;
    const color = demoColor ?? (active ? getBrandColor(brand) : 0x333333);
    const sticks = Math.min(Math.max(modules, 1), 2);

    return (
        <group>
            <mesh position={[0.4, 1, 0.1]}>
                <boxGeometry args={[0.15, 0.8, 0.05]} />
                <meshStandardMaterial
                    color={color}
                    transparent={!isOn}
                    opacity={isOn ? 1 : 0.15}
                    emissive={isOn ? color : 0x000000}
                    emissiveIntensity={isOn ? 0.25 : 0}
                />
            </mesh>
            {sticks >= 2 && (
                <mesh position={[0.6, 1, 0.1]}>
                    <boxGeometry args={[0.15, 0.8, 0.05]} />
                    <meshStandardMaterial
                        color={color}
                        transparent={!isOn}
                        opacity={isOn ? 1 : 0.15}
                        emissive={isOn ? color : 0x000000}
                        emissiveIntensity={isOn ? 0.25 : 0}
                    />
                </mesh>
            )}
        </group>
    );
}

function GPUComponent({ active, brand, length = 240, demoColor }: { active: boolean; brand?: string; length?: number; demoColor?: number }) {
    const isOn = active || !!demoColor;
    const color = demoColor ?? (active ? getBrandColor(brand) : 0x333333);
    // Scale X proportionally: base 1.2 for 240mm, clamped [1.0, 1.8]
    const scaleX = Math.min(Math.max((length / 240) * 1.2, 1.0), 1.8);

    return (
        <mesh position={[0.1, 0, 0.3]} scale={[scaleX, 1, 1]}>
            <boxGeometry args={[1.2, 0.2, 0.6]} />
            <meshStandardMaterial
                color={color}
                transparent={!isOn}
                opacity={isOn ? 1 : 0.15}
                emissive={isOn ? color : 0x000000}
                emissiveIntensity={isOn ? 0.4 : 0}
            />
        </mesh>
    );
}

function PSUComponent({ active, wattage = 650, demoColor }: { active: boolean; wattage?: number; demoColor?: number }) {
    const isOn = active || !!demoColor;
    const color = demoColor ? 0x555555 : (active ? 0x555555 : 0x222222);
    // Scale Y proportionally: base 0.8 for 650W, clamped [0.6, 1.2]
    const scaleY = Math.min(Math.max((wattage / 650) * 0.8, 0.6), 1.2);

    return (
        <mesh position={[0, -1.3, 0]} scale={[1, scaleY, 1]}>
            <boxGeometry args={[1.2, 0.8, 1]} />
            <meshStandardMaterial
                color={color}
                transparent={!isOn}
                opacity={isOn ? 0.9 : 0.15}
            />
        </mesh>
    );
}

function StorageComponent({ active, demoColor }: { active: boolean; demoColor?: number }) {
    const isOn = active || !!demoColor;
    const color = demoColor ?? (active ? 0x4488ff : 0x333333);
    return (
        <mesh position={[-0.5, -0.5, 0.15]}>
            <boxGeometry args={[0.3, 0.05, 0.5]} />
            <meshStandardMaterial
                color={color}
                transparent={!isOn}
                opacity={isOn ? 1 : 0.15}
                emissive={isOn ? color : 0x000000}
                emissiveIntensity={isOn ? 0.2 : 0}
            />
        </mesh>
    );
}

// ── Scene ──────────────────────────────────────────────
function Scene({ selectedComponents, demo = false }: { selectedComponents?: Partial<Record<string, SelectedPart>>; demo?: boolean }) {
    const sel = selectedComponents || {};
    const demoColor = useDemoColor(demo);
    const dc = demo ? demoColor : undefined;

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1.2} />
            <pointLight position={[-3, -2, 4]} intensity={0.4} color={0x4488ff} />

            <PCCase active={!!sel.Case || demo} brand={undefined} demoColor={dc} />
            <Motherboard />
            <CPUComponent active={!!sel.CPU} brand={sel.CPU?.brand} demoColor={dc} />
            <RAMComponent active={!!sel.RAM} brand={sel.RAM?.brand} modules={sel.RAM?.modules} demoColor={dc} />
            <GPUComponent active={!!sel.GPU} brand={sel.GPU?.brand} length={sel.GPU?.length} demoColor={dc} />
            <PSUComponent active={!!sel.PSU} wattage={sel.PSU?.wattage} demoColor={dc} />
            <StorageComponent active={!!sel.Storage} demoColor={dc} />

            <OrbitControls
                enableDamping
                dampingFactor={0.05}
                minDistance={2}
                maxDistance={10}
                autoRotate={demo}
                autoRotateSpeed={1.5}
                enableZoom={!demo}
            />
        </>
    );
}

// ── Export ──────────────────────────────────────────────
export function PCViewer({ className, selectedComponents, demo }: PCViewerProps) {
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 4], fov: 75 }}
                gl={{ alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Scene selectedComponents={selectedComponents} demo={demo} />
            </Canvas>
        </div>
    );
}
