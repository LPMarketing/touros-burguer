import * as THREE from 'three';

function gaussianFalloff(dx: number, dy: number, dz: number, radius: number): number {
  const distSq = dx * dx + dy * dy + dz * dz;
  return Math.exp(-distSq / (2 * radius * radius));
}

/**
 * Continuous organic sculpted bull head geometry (no boxy shapes or hard seams).
 * Includes brow ridges, recessed eye sockets, sculpted cheekbones, protruding muzzle, and mouth arch.
 */
export function createSculptedBullHeadGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.48, 56, 42);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Base cranium proportions (athletic stylized character)
    x *= 1.06;
    y *= 1.04;
    z *= 1.02;

    // Subtle taper at top of forehead & fuller lower cheeks
    if (y > 0.1) {
      const topTaper = 1 - Math.min(0.16, (y - 0.1) * 0.35);
      x *= topTaper;
    }

    // Cheekbone / jowl fullness
    const cheekL = gaussianFalloff(x + 0.32, y + 0.08, z - 0.24, 0.22);
    const cheekR = gaussianFalloff(x - 0.32, y + 0.08, z - 0.24, 0.22);
    x += (cheekR - cheekL) * 0.08;
    z += (cheekL + cheekR) * 0.05;

    // Strong expressive brow ridges
    const browL = gaussianFalloff(x + 0.18, y - 0.19, z - 0.35, 0.15);
    const browR = gaussianFalloff(x - 0.18, y - 0.19, z - 0.35, 0.15);
    z += (browL + browR) * 0.075;
    y += (browL + browR) * 0.025;

    // Recessed orbital eye sockets so eyeballs nestle cleanly
    const sockL = gaussianFalloff(x + 0.185, y - 0.07, z - 0.39, 0.11);
    const sockR = gaussianFalloff(x - 0.185, y - 0.07, z - 0.39, 0.11);
    z -= (sockL + sockR) * 0.095;

    // Organic protruding muzzle bridge & broad upper lip
    const muzzle = gaussianFalloff(x * 0.85, y + 0.12, z - 0.34, 0.26);
    z += muzzle * 0.28;
    y -= muzzle * 0.04;

    // Gentle mouth cavity recess underneath muzzle so jaw opens cleanly
    const mouthRecess = gaussianFalloff(x * 0.9, y + 0.27, z - 0.42, 0.17);
    z -= mouthRecess * 0.14;
    y += mouthRecess * 0.05;

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Smooth rounded bull nose pad with organic twin nostril dimples.
 */
export function createSculptedNosePadGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.28, 40, 28);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i) * 1.24;
    let y = pos.getY(i) * 0.66;
    let z = pos.getZ(i) * 0.72;

    // Upper bridge dip in center
    const centerDip = gaussianFalloff(x, y - 0.1, z - 0.14, 0.12);
    y -= centerDip * 0.035;

    // Twin rounded nostril lobes & dark dimples
    const nosL = gaussianFalloff(x + 0.15, y + 0.01, z - 0.17, 0.065);
    const nosR = gaussianFalloff(x - 0.15, y + 0.01, z - 0.17, 0.065);
    z -= (nosL + nosR) * 0.085;

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Smooth sculpted U-shaped lower jaw & chin (zero box geometry).
 */
export function createSculptedJawGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.27, 36, 24);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i) * 1.04;
    let y = pos.getY(i) * 0.44;
    let z = pos.getZ(i) * 1.18;

    // Push chin forward & scoop top slightly for tongue/teeth bed
    const front = Math.max(0, z);
    y += front * 0.04;
    if (y > 0.02 && z > -0.05) {
      const innerScoop = gaussianFalloff(x, y - 0.08, z - 0.05, 0.16);
      y -= innerScoop * 0.06;
    }

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Sculpted muscular torso via LatheGeometry + pectoral & shoulder fullness.
 */
export function createSculptedTorsoGeometry(): THREE.BufferGeometry {
  const profile = [
    new THREE.Vector2(0.01, -0.72),
    new THREE.Vector2(0.46, -0.7),
    new THREE.Vector2(0.54, -0.45),
    new THREE.Vector2(0.58, -0.15),
    new THREE.Vector2(0.72, 0.25),
    new THREE.Vector2(0.74, 0.46),
    new THREE.Vector2(0.62, 0.62),
    new THREE.Vector2(0.42, 0.72),
    new THREE.Vector2(0.01, 0.74),
  ];
  const geo = new THREE.LatheGeometry(profile, 40);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i) * 1.12;
    const y = pos.getY(i);
    let z = pos.getZ(i) * 0.76;

    // Pectoral fullness on front chest
    const pecL = gaussianFalloff(x + 0.26, y - 0.26, z - 0.45, 0.28);
    const pecR = gaussianFalloff(x - 0.26, y - 0.26, z - 0.45, 0.28);
    z += (pecL + pecR) * 0.09;

    pos.setXYZ(i, x, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Organic muscular limb (LatheGeometry with bicep/forearm taper — no rigid capsule look).
 */
export function createMuscularLimbGeometry(
  length: number,
  topRadius: number,
  midSwell: number,
  bottomRadius: number
): THREE.BufferGeometry {
  const pts = [
    new THREE.Vector2(0.005, 0),
    new THREE.Vector2(topRadius * 0.88, -length * 0.04),
    new THREE.Vector2(topRadius, -length * 0.16),
    new THREE.Vector2(midSwell, -length * 0.48),
    new THREE.Vector2(bottomRadius * 1.06, -length * 0.82),
    new THREE.Vector2(bottomRadius, -length * 0.96),
    new THREE.Vector2(0.005, -length),
  ];
  const geo = new THREE.LatheGeometry(pts, 24);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Curved stylized bull ear (flattened tapered teardrop).
 */
export function createSculptedEarGeometry(): THREE.BufferGeometry {
  const pts = [
    new THREE.Vector2(0.005, 0),
    new THREE.Vector2(0.075, 0.07),
    new THREE.Vector2(0.115, 0.19),
    new THREE.Vector2(0.085, 0.31),
    new THREE.Vector2(0.008, 0.4),
  ];
  const geo = new THREE.LatheGeometry(pts, 20);
  geo.scale(1.0, 1.0, 0.42);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Tapered majestic horn with subtle natural keratin growth ripples.
 */
export function createTaperedHornGeometry(
  curve: THREE.CatmullRomCurve3,
  tubularSegments = 36,
  radialSegments = 18,
  baseRadius = 0.15,
  tipRadius = 0.015
): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const point = curve.getPointAt(t);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    const ridge = t < 0.55 ? Math.sin(t * 48) * 0.0045 * (1 - t) : 0;
    const radius = THREE.MathUtils.lerp(baseRadius, tipRadius, Math.pow(t, 0.8)) + ridge;

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2;
      const sin = Math.sin(v);
      const cos = -Math.cos(v);

      const nx = cos * N.x + sin * B.x;
      const ny = cos * N.y + sin * B.y;
      const nz = cos * N.z + sin * B.z;

      normals.push(nx, ny, nz);
      positions.push(point.x + radius * nx, point.y + radius * ny, point.z + radius * nz);
      uvs.push(t, j / radialSegments);
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = (i + 1) * (radialSegments + 1) + j;
      const c = (i + 1) * (radialSegments + 1) + (j + 1);
      const d = i * (radialSegments + 1) + (j + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

/**
 * Stylized 4-finger sculpted bull hand (palm + 3 curled fingers + articulated thumb).
 */
export function createStylizedHand(
  palmMat: THREE.Material,
  hoofTipMat: THREE.Material,
  side: 'left' | 'right'
): { group: THREE.Group; thumbPivot: THREE.Group; fingersPivot: THREE.Group } {
  const s = side === 'left' ? 1 : -1;
  const group = new THREE.Group();

  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.145, 20, 16), palmMat);
  palm.scale.set(1.05, 0.85, 1.18);
  palm.castShadow = true;
  group.add(palm);

  // Curled fingers group (can curl into fist for Thumbs-Up or grip burger)
  const fingersPivot = new THREE.Group();
  fingersPivot.position.set(0, 0, 0.08);
  group.add(fingersPivot);

  const fingerOffsets = [-0.075, 0, 0.075];
  fingerOffsets.forEach((fx, idx) => {
    const fLen = idx === 1 ? 0.14 : 0.12;
    const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.038, fLen, 8, 12), palmMat);
    finger.position.set(fx, -0.02, 0.08);
    finger.rotation.x = Math.PI * 0.42;
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 10), hoofTipMat);
    tip.position.set(0, -fLen * 0.55, 0);
    finger.add(tip);
    fingersPivot.add(finger);
  });

  // Articulated thumb
  const thumbPivot = new THREE.Group();
  thumbPivot.position.set(s * 0.11, 0.05, 0.03);
  group.add(thumbPivot);

  const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.044, 0.13, 8, 12), palmMat);
  thumb.position.set(s * 0.03, 0.06, 0.04);
  thumb.rotation.z = -s * 0.45;
  const thumbTip = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), hoofTipMat);
  thumbTip.position.set(0, 0.08, 0);
  thumb.add(thumbTip);
  thumbPivot.add(thumb);

  return { group, thumbPivot, fingersPivot };
}
