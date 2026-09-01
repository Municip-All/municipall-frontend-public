
export const homeStatsVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uMouse;
  uniform float uMouseStrength;

  attribute float aSeed;
  attribute float aValue;
  attribute float aCategory;

  varying float vOpacity;
  varying float vValue;
  varying vec3 vColor;

  vec3 hash(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 340.122));
    p += dot(p, p.yzx + 19.19);
    return fract((p.xxy + p.yxx)*p.zyx);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n = mix(
      mix(mix(hash(i + vec3(0,0,0)).x, hash(i + vec3(1,0,0)).x, f.x),
          mix(hash(i + vec3(0,1,0)).x, hash(i + vec3(1,1,0)).x, f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)).x, hash(i + vec3(1,0,1)).x, f.x),
          mix(hash(i + vec3(0,1,1)).x, hash(i + vec3(1,1,1)).x, f.x), f.y), f.z);
    return n;
  }

  void main() {
    vec3 pos = position;

    // Particle oscillation based on category
    float catNoise = noise(vec3(aSeed + aCategory * 0.5, uTime * 0.3, aValue * 2.0));
    pos.z += sin(uTime * 0.5 + aSeed * 6.28) * aValue * 0.3 + catNoise * 0.2;
    pos.x += cos(uTime * 0.4 + aSeed * 6.28 + aCategory) * aValue * 0.2;

    // Mouse influence
    vec3 delta = uMouse - pos;
    float dist = length(delta);
    if (dist < 3.0) {
      pos += normalize(delta) * (1.0 - dist / 3.0) * uMouseStrength * 0.5;
    }

    vOpacity = mix(0.2, 1.0, aValue);
    vValue = aValue;

    // Color by category
    if (aCategory < 1.5) {
      vColor = mix(vec3(0.2, 0.6, 1.0), vec3(0.5, 0.8, 1.0), aValue); // Signalements - blue
    } else if (aCategory < 2.5) {
      vColor = mix(vec3(0.1, 0.9, 0.3), vec3(0.3, 1.0, 0.5), aValue); // Résolus - green
    } else {
      vColor = mix(vec3(1.0, 0.6, 0.0), vec3(1.0, 0.8, 0.2), aValue); // En cours - orange
    }

    gl_PointSize = (aValue * 8.0 + 2.0) * (3.0 - uMouseStrength * 0.5);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const homeStatsFragmentShader = `
  varying float vOpacity;
  varying float vValue;
  varying vec3 vColor;
  uniform sampler2D uTexture;

  void main() {
    vec2 uv = gl_PointCoord;
    float dist = distance(uv, vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

export const buildStatsParticles = (stats: { total: number; active: number; resolved: number }) => {
  const total = Math.min(stats.total, 200);
  const active = Math.min(stats.active, 60);
  const resolved = Math.min(stats.resolved, 60);

  const positions = new Float32Array((total + active + resolved) * 3);
  const seeds = new Float32Array(total + active + resolved);
  const values = new Float32Array(total + active + resolved);
  const categories = new Float32Array(total + active + resolved);

  let idx = 0;

  // Signalements - Total (category 1)
  for (let i = 0; i < total; i++) {
    const angle = (i / total) * Math.PI * 2;
    const radius = 1.5 + Math.random() * 1.2;
    positions[idx * 3] = Math.cos(angle) * radius;
    positions[idx * 3 + 1] = (Math.random() - 0.5) * 2;
    positions[idx * 3 + 2] = Math.sin(angle) * radius;
    seeds[idx] = Math.random();
    values[idx] = 0.5 + Math.random() * 0.5;
    categories[idx] = 1;
    idx++;
  }

  // Résolus (category 2)
  for (let i = 0; i < resolved; i++) {
    const angle = (i / resolved) * Math.PI * 2;
    const radius = 3.2 + Math.random() * 1.0;
    positions[idx * 3] = Math.cos(angle) * radius;
    positions[idx * 3 + 1] = (Math.random() - 0.5) * 1.5;
    positions[idx * 3 + 2] = Math.sin(angle) * radius;
    seeds[idx] = Math.random();
    values[idx] = 0.6 + Math.random() * 0.4;
    categories[idx] = 2;
    idx++;
  }

  // En cours (category 3)
  for (let i = 0; i < active; i++) {
    const angle = (i / active) * Math.PI * 2;
    const radius = 2.3 + Math.random() * 1.5;
    positions[idx * 3] = Math.cos(angle) * radius;
    positions[idx * 3 + 1] = (Math.random() - 0.5) * 2.2;
    positions[idx * 3 + 2] = Math.sin(angle) * radius;
    seeds[idx] = Math.random();
    values[idx] = 0.7 + Math.random() * 0.3;
    categories[idx] = 3;
    idx++;
  }

  return {
    positions,
    seeds,
    values,
    categories,
    count: idx,
  };
};
