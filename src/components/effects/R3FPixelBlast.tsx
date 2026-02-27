import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

const SHAPE_MAP: any = {
    square: 0,
    circle: 1,
    triangle: 2,
    diamond: 3
};

const VERTEX_SRC = `
void main() {
  // Pass through NDC coordinates directly
  gl_Position = vec4(position.xy, 0.99, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;

uniform vec2  uClickPos[10];
uniform float uClickTimes[10];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / uResolution)) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;
  vec3 srgbColor = mix(
    color * 12.92,
    1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, color)
  );

  fragColor = vec4(srgbColor, M);
}
`;

export function R3FPixelBlast({
    variant = 'square',
    pixelSize = 4,
    color = '#B19EEF',
    patternScale = 2,
    patternDensity = 1,
    pixelSizeJitter = 0,
    enableRipples = true,
    rippleIntensityScale = 1.5,
    rippleThickness = 0.12,
    rippleSpeed = 0.4,
    edgeFade = 0.25,
    speed = 0.5,
}: any) {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);
    const { gl, size, viewport } = useThree();
    const clickIx = useRef(0);
    const timeOffset = useRef(Math.random() * 1000);

    const uniforms = useMemo(() => {
        return {
            uResolution: { value: new THREE.Vector2(0, 0) },
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(color) },
            uClickPos: {
                value: Array.from({ length: 10 }, () => new THREE.Vector2(-1, -1))
            },
            uClickTimes: { value: new Float32Array(10) },
            uShapeType: { value: SHAPE_MAP[variant] ?? 0 },
            uPixelSize: { value: pixelSize },
            uScale: { value: patternScale },
            uDensity: { value: patternDensity },
            uPixelJitter: { value: pixelSizeJitter },
            uEnableRipples: { value: enableRipples ? 1 : 0 },
            uRippleSpeed: { value: rippleSpeed },
            uRippleThickness: { value: rippleThickness },
            uRippleIntensity: { value: rippleIntensityScale },
            uEdgeFade: { value: edgeFade }
        };
    }, []);

    // Sync props
    useEffect(() => {
        if (!materialRef.current) return;
        const u = materialRef.current.uniforms;
        u.uColor.value.set(color);
        u.uShapeType.value = SHAPE_MAP[variant] ?? 0;
        u.uPixelSize.value = pixelSize * gl.getPixelRatio();
        u.uScale.value = patternScale;
        u.uDensity.value = patternDensity;
        u.uPixelJitter.value = pixelSizeJitter;
        u.uEnableRipples.value = enableRipples ? 1 : 0;
        u.uRippleIntensity.value = rippleIntensityScale;
        u.uRippleThickness.value = rippleThickness;
        u.uRippleSpeed.value = rippleSpeed;
        u.uEdgeFade.value = edgeFade;
    }, [
        color, variant, pixelSize, patternScale, patternDensity, pixelSizeJitter,
        enableRipples, rippleIntensityScale, rippleThickness, rippleSpeed, edgeFade, gl
    ]);

    useFrame((state) => {
        if (!materialRef.current) return;
        const u = materialRef.current.uniforms;
        u.uTime.value = timeOffset.current + state.clock.getElapsedTime() * speed;
        u.uResolution.value.set(gl.domElement.width, gl.domElement.height);
    });

    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            const rect = gl.domElement.getBoundingClientRect();
            const scaleX = gl.domElement.width / rect.width;
            const scaleY = gl.domElement.height / rect.height;
            const fx = (e.clientX - rect.left) * scaleX;
            const fy = (rect.height - (e.clientY - rect.top)) * scaleY;

            const ix = clickIx.current;
            uniforms.uClickPos.value[ix].set(fx, fy);
            if (materialRef.current) {
                uniforms.uClickTimes.value[ix] = materialRef.current.uniforms.uTime.value;
            }
            clickIx.current = (ix + 1) % 10;
        };

        // Attach to the whole document so ripples happen everywhere
        document.body.addEventListener('pointerdown', handlePointerDown);
        return () => document.body.removeEventListener('pointerdown', handlePointerDown);
    }, [gl, uniforms]);

    return (
        <mesh renderOrder={-1}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={VERTEX_SRC}
                fragmentShader={FRAGMENT_SRC}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                depthTest={false}
                glslVersion={THREE.GLSL3}
            />
        </mesh>
    );
}
