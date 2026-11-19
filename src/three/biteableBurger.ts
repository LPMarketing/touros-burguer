import * as THREE from 'three';

export interface BurgerMaterials {
  bunTop: THREE.Material;
  bunBottom: THREE.Material;
  patty: THREE.Material;
  cheese: THREE.Material;
  lettuce: THREE.Material;
  bacon: THREE.Material;
  sesame: THREE.Material;
}

type BiteStage = 0 | 1 | 2;

/**
 * Generates a closed 2D contour for the burger cross-section:
 * - stage 0: full appetizing circular burger
 * - stage 1: first big scalloped bite carved cleanly out of front-right
 * - stage 2: second big bite taken, leaving final appetizing crescent on left
 */
function createBurgerCrossSectionShape(radius: number, stage: BiteStage): THREE.Shape {
  const shape = new THREE.Shape();

  if (stage === 0) {
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    return shape;
  }

  const pts: THREE.Vector2[] = [];
  const steps = 48;

  // In Three.js ExtrudeGeometry rotated -PI/2 on X:
  // shape X -> world +X (right), shape Y -> world -Z (back), -shape Y -> world +Z (front facing camera/bull!)
  if (stage === 1) {
    // Bite taken from front-right (angles in shape coords: -0.68*PI to -0.08*PI)
    const startAngle = -0.05 * Math.PI;
    const endAngle = 1.32 * Math.PI;
    for (let i = 0; i <= steps; i++) {
      const a = startAngle + (i / steps) * (endAngle - startAngle);
      pts.push(new THREE.Vector2(Math.cos(a) * radius, Math.sin(a) * radius));
    }
    // 3 scalloped tooth curves across the bite line back to startAngle
    const pStart = pts[pts.length - 1];
    const pEnd = pts[0];
    const biteSteps = 24;
    for (let i = 1; i < biteSteps; i++) {
      const t = i / biteSteps;
      const base = new THREE.Vector2().lerpVectors(pStart, pEnd, t);
      // Push inward toward center (0,0) + 3 tooth scallops
      const inward = Math.sin(t * Math.PI) * radius * 0.42;
      const teeth = Math.abs(Math.sin(t * Math.PI * 3)) * radius * 0.08;
      const dirToCenter = base.clone().negate().normalize();
      base.addScaledVector(dirToCenter, inward + teeth);
      pts.push(base);
    }
  } else {
    // Stage 2: smaller crescent left on left side (0.55*PI to 1.25*PI)
    const startAngle = 0.56 * Math.PI;
    const endAngle = 1.26 * Math.PI;
    for (let i = 0; i <= steps; i++) {
      const a = startAngle + (i / steps) * (endAngle - startAngle);
      pts.push(new THREE.Vector2(Math.cos(a) * radius, Math.sin(a) * radius));
    }
    const pStart = pts[pts.length - 1];
    const pEnd = pts[0];
    const biteSteps = 24;
    for (let i = 1; i < biteSteps; i++) {
      const t = i / biteSteps;
      const base = new THREE.Vector2().lerpVectors(pStart, pEnd, t);
      const inward = Math.sin(t * Math.PI) * radius * 0.34;
      const teeth = Math.abs(Math.sin(t * Math.PI * 3)) * radius * 0.06;
      const dirToCenter = new THREE.Vector2(0.7, 0).normalize();
      base.addScaledVector(dirToCenter, inward + teeth);
      pts.push(base);
    }
  }

  shape.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    shape.lineTo(pts[i].x, pts[i].y);
  }
  shape.closePath();
  return shape;
}

function createExtrudedLayer(
  radius: number,
  height: number,
  bevel: number,
  stage: BiteStage,
  material: THREE.Material
): THREE.Mesh {
  const shape = createBurgerCrossSectionShape(radius, stage);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 24,
  });
  geo.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function buildBurgerStage(stage: BiteStage, mats: BurgerMaterials): THREE.Group {
  const g = new THREE.Group();
  const baseR = 0.4;

  // 1. Bottom Toasted Brioche Bun
  const bot = createExtrudedLayer(baseR * 0.94, 0.065, 0.03, stage, mats.bunBottom);
  bot.position.y = -0.17;
  g.add(bot);

  // 2. Seared Beef Patty
  const patty = createExtrudedLayer(baseR * 1.0, 0.09, 0.032, stage, mats.patty);
  patty.position.y = -0.07;
  g.add(patty);

  // 3. Melted Cheddar Layer + Unbitten Drips
  const cheese = createExtrudedLayer(baseR * 1.02, 0.025, 0.018, stage, mats.cheese);
  cheese.position.y = 0.042;
  g.add(cheese);

  // Melted cheese drips on left & back (stay visible across bites)
  const dripAngles = stage === 0 ? [0.4, 2.1, 3.6, 5.1] : stage === 1 ? [2.1, 3.6] : [2.5, 3.3];
  dripAngles.forEach((ang) => {
    const drip = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 10), mats.cheese);
    drip.scale.set(1.0, 1.85, 0.75);
    drip.position.set(Math.cos(ang) * baseR * 0.99, 0.01, -Math.sin(ang) * baseR * 0.99);
    g.add(drip);
  });

  // 4. Crispy Bacon Layer
  const bacon = createExtrudedLayer(baseR * 0.94, 0.024, 0.015, stage, mats.bacon);
  bacon.position.y = 0.082;
  g.add(bacon);

  // 5. Crisp Green Lettuce Ruffle
  const lettuce = createExtrudedLayer(baseR * 1.04, 0.022, 0.018, stage, mats.lettuce);
  lettuce.position.y = 0.118;
  g.add(lettuce);

  // 6. Domed Glossy Top Brioche Bun (multi-bevel stacked crown so it stays solid & rounded!)
  const crownBase = createExtrudedLayer(baseR * 0.96, 0.05, 0.045, stage, mats.bunTop);
  crownBase.position.y = 0.155;
  g.add(crownBase);

  const crownTop = createExtrudedLayer(baseR * 0.76, 0.045, 0.055, stage, mats.bunTop);
  crownTop.position.y = 0.215;
  g.add(crownTop);

  // Sesame Seeds on safe unbitten crown coordinates
  const seedAngles = stage === 0 ? [0.2, 1.3, 2.5, 3.7, 4.9] : stage === 1 ? [1.4, 2.4, 3.4] : [2.2, 2.9];
  seedAngles.forEach((ang, i) => {
    const rad = baseR * (0.36 + (i % 2) * 0.22);
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), mats.sesame);
    seed.scale.set(1.5, 0.6, 0.9);
    seed.position.set(Math.cos(ang) * rad, 0.312, -Math.sin(ang) * rad);
    seed.rotation.y = ang;
    g.add(seed);
  });

  return g;
}

export interface BiteableBurgerRig {
  root: THREE.Group;
  stages: [THREE.Group, THREE.Group, THREE.Group];
  setStage: (stage: 0 | 1 | 2 | 3) => void;
}

export function createBiteableBurger(mats: BurgerMaterials): BiteableBurgerRig {
  const root = new THREE.Group();
  const s0 = buildBurgerStage(0, mats);
  const s1 = buildBurgerStage(1, mats);
  const s2 = buildBurgerStage(2, mats);

  s1.visible = false;
  s2.visible = false;
  root.add(s0, s1, s2);

  return {
    root,
    stages: [s0, s1, s2],
    setStage: (stage) => {
      root.visible = stage < 3;
      s0.visible = stage === 0;
      s1.visible = stage === 1;
      s2.visible = stage === 2;
    },
  };
}
