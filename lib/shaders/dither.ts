// Dither Shader Collection
// Includes: Halftone, Bayer Matrix, and Noise dithering

export const ditherVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const ditherFragmentShader = `
uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform int ditherMode; // 0: bayer, 1: halftone, 2: noise
uniform float ditherStrength;
uniform float ditherScale;
uniform float time;
uniform int themeMode; // 0: light, 1: dark
uniform vec3 primaryColor;
uniform vec3 secondaryColor;

varying vec2 vUv;

// Bayer 8x8 matrix for ordered dithering
const int bayerMatrix[64] = int[64](
  0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(ivec2 coord) {
  int x = coord.x % 8;
  int y = coord.y % 8;
  return float(bayerMatrix[y * 8 + x]) / 64.0;
}

// Bayer dithering
vec3 bayerDither(vec3 color, vec2 uv) {
  ivec2 pixelCoord = ivec2(uv * resolution / ditherScale);
  float threshold = getBayerValue(pixelCoord);
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));

  float dithered = step(threshold, luminance + (ditherStrength * 0.5 - 0.25));
  return mix(secondaryColor, primaryColor, dithered);
}

// Halftone dithering
float halftonePattern(vec2 uv, float angle, float scale) {
  float s = sin(angle);
  float c = cos(angle);
  vec2 rotatedUV = vec2(
    uv.x * c - uv.y * s,
    uv.x * s + uv.y * c
  );

  vec2 nearest = 2.0 * fract(scale * rotatedUV) - 1.0;
  return length(nearest);
}

vec3 halftoneDither(vec3 color, vec2 uv) {
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  float scale = ditherScale * 0.5;

  // CMYK-style halftone with different angles
  float c = halftonePattern(uv * resolution, 0.261799, scale); // 15 degrees
  float m = halftonePattern(uv * resolution, 1.309, scale);    // 75 degrees
  float y = halftonePattern(uv * resolution, 0.0, scale);      // 0 degrees

  float avgPattern = (c + m + y) / 3.0;
  float threshold = luminance * ditherStrength + (1.0 - ditherStrength) * 0.5;

  float dithered = smoothstep(threshold - 0.1, threshold + 0.1, avgPattern);
  return mix(primaryColor, secondaryColor, dithered);
}

// Noise-based dithering
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float blueNoise(vec2 uv, float t) {
  float n1 = random(uv);
  float n2 = random(uv * 2.0 + t * 0.01);
  float n3 = random(uv * 4.0 - t * 0.02);
  return (n1 + n2 * 0.5 + n3 * 0.25) / 1.75;
}

vec3 noiseDither(vec3 color, vec2 uv) {
  vec2 pixelUV = floor(uv * resolution / ditherScale) * ditherScale / resolution;
  float noise = blueNoise(pixelUV * 100.0, time);
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));

  float threshold = luminance + (noise - 0.5) * ditherStrength;
  float dithered = step(0.5, threshold);

  return mix(secondaryColor, primaryColor, dithered);
}

void main() {
  vec4 texColor = texture2D(tDiffuse, vUv);
  vec3 color = texColor.rgb;
  vec3 dithered;

  if (ditherMode == 0) {
    dithered = bayerDither(color, vUv);
  } else if (ditherMode == 1) {
    dithered = halftoneDither(color, vUv);
  } else {
    dithered = noiseDither(color, vUv);
  }

  // Blend with original based on strength
  vec3 result = mix(color, dithered, ditherStrength);

  // Add subtle glow in dark mode
  if (themeMode == 1) {
    result += color * 0.1;
  }

  gl_FragColor = vec4(result, texColor.a);
}
`;

// Gradient mesh shader for hero background
export const gradientVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const gradientFragmentShader = `
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform float speed;
uniform vec2 mouse;

varying vec2 vUv;
varying vec3 vPosition;

// Simplex noise functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;

  // Animated noise
  float t = time * speed;
  float noise1 = snoise(uv * 2.0 + t * 0.1);
  float noise2 = snoise(uv * 3.0 - t * 0.15 + 100.0);
  float noise3 = snoise(uv * 1.5 + t * 0.05 + 200.0);

  // Mouse influence
  float mouseDist = distance(uv, mouse);
  float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.3;

  // Combine noises for organic movement
  float blend1 = smoothstep(-0.3, 0.3, noise1 + mouseInfluence);
  float blend2 = smoothstep(-0.3, 0.3, noise2);
  float blend3 = smoothstep(-0.3, 0.3, noise3);

  // Create gradient
  vec3 gradient = mix(color1, color2, blend1);
  gradient = mix(gradient, color3, blend2 * 0.5);

  // Add subtle variation
  gradient += (noise3 * 0.05);

  gl_FragColor = vec4(gradient, 1.0);
}
`;

// Shader uniform types for TypeScript
export interface DitherUniforms {
  tDiffuse: { value: THREE.Texture | null };
  resolution: { value: [number, number] };
  ditherMode: { value: number };
  ditherStrength: { value: number };
  ditherScale: { value: number };
  time: { value: number };
  themeMode: { value: number };
  primaryColor: { value: THREE.Color };
  secondaryColor: { value: THREE.Color };
}

export interface GradientUniforms {
  time: { value: number };
  color1: { value: THREE.Color };
  color2: { value: THREE.Color };
  color3: { value: THREE.Color };
  speed: { value: number };
  mouse: { value: [number, number] };
}

// Import THREE types only for type checking
import type * as THREE from "three";
