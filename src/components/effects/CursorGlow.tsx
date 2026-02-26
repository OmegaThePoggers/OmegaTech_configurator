'use client';

import { useCallback, useRef, useEffect, useState } from 'react';

export function CursorGlow() {
    const containerRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!containerRef.current || !glowRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        glowRef.current.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
        if (!isVisible) setIsVisible(true);
    }, [isVisible]);

    const handleMouseLeave = useCallback(() => {
        setIsVisible(false);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [handleMouseMove, handleMouseLeave]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ pointerEvents: 'auto' }}
        >
            <div
                ref={glowRef}
                style={{
                    position: 'absolute',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 200, 255, 0.10) 0%, rgba(100, 120, 255, 0.05) 40%, transparent 70%)',
                    pointerEvents: 'none',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    willChange: 'transform',
                }}
            />
        </div>
    );
}
