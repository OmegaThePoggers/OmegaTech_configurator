import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export function R3FLightPillar({
    topColor = '#5227FF',
    bottomColor = '#FF9FFC',
    intensity = 1.0,
    rotationSpeed = 0.3,
    interactive = false,
    glowAmount = 0.002,
    pillarWidth = 3.0,
    pillarHeight = 0.4,
    noiseIntensity = 0.5,
    pillarRotation = 25,
}: any) {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);
    const { size } = useThree();

    const uniforms = useMemo(() => {
        const pillarRotRad = (pillarRotation * Math.PI) / 180;
        return {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(size.width, size.height) },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uTopColor: { value: new THREE.Color(topColor) },
            uBottomColor: { value: new THREE.Color(bottomColor) },
            uIntensity: { value: intensity },
            uInteractive: { value: interactive },
            uGlowAmount: { value: glowAmount },
            uPillarWidth: { value: pillarWidth },
            uPillarHeight: { value: pillarHeight },
            uNoiseIntensity: { value: noiseIntensity },
            uRotCos: { value: 1.0 },
            uRotSin: { value: 0.0 },
            uPillarRotCos: { value: Math.cos(pillarRotRad) },
            uPillarRotSin: { value: Math.sin(pillarRotRad) },
            uWaveSin: { value: Math.sin(0.4) },
            uWaveCos: { value: Math.cos(0.4) }
        };
        // eslint-disable-next-selected-line react-hooks/exhaustive-deps
    }, [topColor, bottomColor, intensity, interactive, glowAmount, pillarWidth, pillarHeight, noiseIntensity, pillarRotation]);

    useFrame((state) => {
        if (!materialRef.current) return;

        const t = state.clock.getElapsedTime() * rotationSpeed;

        materialRef.current.uniforms.uTime.value = t;
        materialRef.current.uniforms.uRotCos.value = Math.cos(t * 0.3);
        materialRef.current.uniforms.uRotSin.value = Math.sin(t * 0.3);
        materialRef.current.uniforms.uResolution.value.set(size.width, size.height);

        if (interactive) {
            materialRef.current.uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);
        }
    });

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uRotCos;
      uniform float uRotSin;
      uniform float uPillarRotCos;
      uniform float uPillarRotSin;
      uniform float uWaveSin;
      uniform float uWaveCos;
      varying vec2 vUv;

      const float STEP_MULT = 1.0;
      const int MAX_ITER = 60;
      const int WAVE_ITER = 3;

      void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
        uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);

        vec3 ro = vec3(0.0, 0.0, -10.0);
        vec3 rd = normalize(vec3(uv, 1.0));

        float rotC = uRotCos;
        float rotS = uRotSin;
        if(uInteractive && (uMouse.x != 0.0 || uMouse.y != 0.0)) {
          float a = uMouse.x * 6.283185;
          rotC = cos(a);
          rotS = sin(a);
        }

        vec3 col = vec3(0.0);
        float t = 0.1;
        
        for(int i = 0; i < MAX_ITER; i++) {
          vec3 p = ro + rd * t;
          p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);

          vec3 q = p;
          q.y = p.y * uPillarHeight + uTime;
          
          float freq = 1.0;
          float amp = 1.0;
          for(int j = 0; j < WAVE_ITER; j++) {
            q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
            q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
            freq *= 2.0;
            amp *= 0.5;
          }
          
          float d = length(cos(q.xz)) - 0.2;
          float bound = length(p.xz) - uPillarWidth;
          float k = 4.0;
          float h = max(k - abs(d - bound), 0.0);
          d = max(d, bound) + h * h * 0.0625 / k;
          d = abs(d) * 0.15 + 0.01;

          float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
          col += mix(uBottomColor, uTopColor, grad) / d;

          t += d * STEP_MULT;
          if(t > 50.0) break;
        }

        float widthNorm = uPillarWidth / 3.0;
        col = tanh(col * uGlowAmount / widthNorm);
        
        col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;
        
        gl_FragColor = vec4(col * uIntensity, 1.0);
      }
    `;

    return (
        <mesh renderOrder={-1}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                depthTest={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}
