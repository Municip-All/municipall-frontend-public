export const eventsTimelineVertexShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uMouseStrength;

  attribute float aIndex;
  attribute float aDay;
  attribute vec3 aColor;

  varying float vOpacity;
  varying vec3 vColor;
  varying float vGlow;

  void main() {
    vec3 pos = position;

    float timeline = aIndex / 10.0;
    float scrollOffset = uScroll * 8.0;

    pos.x = (timeline - 0.5) * 12.0 - scrollOffset;
    pos.y = sin(uTime * 0.5 + aIndex * 0.8) * 0.8;
    pos.z = cos(uTime * 0.3 + aIndex) * 1.2 + aIndex * 0.2;

    float distToCenter = length(pos.xy - uMouse);
    vGlow = max(0.3, 1.0 - distToCenter * 0.3) * (0.5 + 0.5 * sin(uTime + aIndex));

    vOpacity = mix(0.4, 1.0, sin(uTime * 0.5 + aIndex * 1.2) * 0.5 + 0.5);
    vColor = aColor;

    gl_PointSize = (8.0 + sin(uTime + aIndex * 2.0) * 3.0) * vGlow;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const eventsTimelineFragmentShader = `
  varying float vOpacity;
  varying vec3 vColor;
  varying float vGlow;

  void main() {
    vec2 uv = gl_PointCoord;
    float dist = distance(uv, vec2(0.5));

    float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
    float glow = exp(-dist * dist * 8.0) * vGlow * 0.6;

    vec3 finalColor = vColor + vec3(glow) * vColor;
    gl_FragColor = vec4(finalColor, alpha + glow * 0.3);
  }
`;

export const buildEventsParticles = (eventCount: number) => {
  const count = Math.min(eventCount * 8, 120);
  const positions = new Float32Array(count * 3);
  const indices = new Float32Array(count);
  const days = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const palette = [
    [0.2, 0.6, 1.0],
    [0.1, 0.9, 0.3],
    [1.0, 0.6, 0.0],
    [0.9, 0.2, 0.5],
    [0.3, 1.0, 0.8],
    [1.0, 0.9, 0.1],
  ];

  for (let i = 0; i < count; i++) {
    const eventIdx = Math.floor(i / 8);
    const particleIdx = i % 8;

    positions[i * 3] = (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

    indices[i] = eventIdx;
    days[i] = particleIdx / 8.0;

    const color = palette[eventIdx % palette.length];
    colors[i * 3] = color[0];
    colors[i * 3 + 1] = color[1];
    colors[i * 3 + 2] = color[2];
  }

  return { positions, indices, days, colors, count };
};
