export const contactFormVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform int uFocusedField;

  attribute float aFieldId;
  attribute vec3 aFieldColor;
  attribute float aSeed;

  varying vec3 vColor;
  varying float vOpacity;
  varying float vPulse;

  void main() {
    vec3 pos = position;

    float fieldNorm = aFieldId / 5.0;
    pos.y += fieldNorm * 3.0;

    float focus = float(int(aFieldId) == uFocusedField);
    float freq = mix(0.3, 1.2, focus);
    pos.x += sin(uTime * freq + aSeed * 6.28) * mix(0.15, 0.4, focus);
    pos.z += cos(uTime * freq * 0.7 + aSeed) * mix(0.1, 0.3, focus);

    vec3 toMouse = uMouse - pos;
    float distToMouse = length(toMouse);
    if (distToMouse < 2.0) {
      pos += normalize(toMouse) * (1.0 - distToMouse / 2.0) * uMouseStrength * 0.3;
    }

    vColor = aFieldColor;
    vOpacity = mix(0.3, 1.0, focus) * (0.5 + 0.5 * sin(uTime + aSeed));
    vPulse = focus;

    gl_PointSize = mix(3.0, 8.0, focus) * (1.0 + sin(uTime + aSeed * 2.0) * 0.4);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const contactFormFragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;
  varying float vPulse;

  void main() {
    vec2 uv = gl_PointCoord;
    float dist = distance(uv, vec2(0.5));

    float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
    float glow = exp(-dist * dist * 10.0) * vPulse * 0.5;

    gl_FragColor = vec4(vColor + vec3(glow * 0.5), alpha + glow * 0.2);
  }
`;

export const buildContactFormParticles = () => {
  const fields = 5;
  const particlesPerField = 20;
  const totalParticles = fields * particlesPerField;

  const positions = new Float32Array(totalParticles * 3);
  const fieldIds = new Float32Array(totalParticles);
  const seeds = new Float32Array(totalParticles);
  const colors = new Float32Array(totalParticles * 3);

  const fieldColors = [
    [0.3, 0.7, 1.0],
    [0.7, 0.4, 1.0],
    [1.0, 0.7, 0.3],
    [0.3, 1.0, 0.7],
    [0.9, 0.3, 0.5],
  ];

  let idx = 0;
  for (let f = 0; f < fields; f++) {
    for (let p = 0; p < particlesPerField; p++) {
      const angle = (p / particlesPerField) * Math.PI * 2;
      const radius = 0.8 + Math.random() * 0.5;

      positions[idx * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.3;
      positions[idx * 3 + 1] = (Math.random() - 0.5) * 0.4;
      positions[idx * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.3;

      fieldIds[idx] = f;
      seeds[idx] = Math.random();

      const color = fieldColors[f];
      colors[idx * 3] = color[0];
      colors[idx * 3 + 1] = color[1];
      colors[idx * 3 + 2] = color[2];

      idx++;
    }
  }

  return { positions, fieldIds, seeds, colors, count: totalParticles };
};
