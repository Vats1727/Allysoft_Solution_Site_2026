import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cursor, scrollState, isTouch, prefersReducedMotion } from "../lib/engine";

// Impulse bus for click reactions
const impulses = [];
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a, input, textarea")) return;
    impulses.push({ t: performance.now(), x: cursor.x, y: cursor.y });
  });
}

// Network nodes with wide Z distribution
const NODE_POSITIONS = [
  [1.6, 0.9, 2],
  [2.9, 0.2, -2.6],
  [2.6, -1.1, 1.4],
  [-1.5, 1.2, -4],
  [-2.2, -0.8, -1.5],
  [0.4, -0.2, 3.6],
  [1.3, 1.6, -6.4],
  [-3.1, -1.9, 5.0],
];

// Camera controller for dramatic 3D Z-direction fly-in on site load and scroll depth
function CameraRig({ isLoaded }) {
  const { camera } = useThree();
  const targetZ = useRef(22); // Start far away in Z direction

  useFrame((state, delta) => {
    // Fly-in lerp on site load from Z = 22 to Z = 5
    const goalZ = isLoaded ? 5 - scrollState.eased * 10 : 22;
    targetZ.current += (goalZ - targetZ.current) * 0.04;

    camera.position.z = targetZ.current;
    camera.position.x += (cursor.x * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (-cursor.y * 1.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, -5);
  });

  return null;
}

function Floating3DObjects() {
  const groupRef = useRef(null);

  // Scattered 3D shapes in Z depth
  const shapes = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 30 - 5,
      size: Math.random() * 0.4 + 0.15,
      rotSpeedX: (Math.random() - 0.5) * 0.8,
      rotSpeedY: (Math.random() - 0.5) * 0.8,
      type: i % 3, // 0 = icosahedron, 1 = torus, 2 = octahedron
    }));
  }, []);

  const meshRefs = useRef([]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = scrollState.eased;

    shapes.forEach((s, i) => {
      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.rotation.x += delta * s.rotSpeedX;
        mesh.rotation.y += delta * s.rotSpeedY;

        // Move shapes through Z axis based on scroll (fly-through effect)
        let zPos = s.z + p * 18;
        if (zPos > 8) zPos -= 35; // Loop back into depth
        mesh.position.z = zPos;
        mesh.position.y = s.y + Math.sin(t * 0.5 + i) * 0.2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]} ref={(m) => (meshRefs.current[i] = m)}>
          {s.type === 0 ? (
            <icosahedronGeometry args={[s.size, 0]} />
          ) : s.type === 1 ? (
            <torusGeometry args={[s.size, s.size * 0.3, 12, 24]} />
          ) : (
            <octahedronGeometry args={[s.size]} />
          )}
          <meshBasicMaterial color="#f5a623" wireframe transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function NetworkCluster() {
  const group = useRef(null);
  const pulseRefs = useRef([]);
  const nodeRefs = useRef([]);
  const speed = useRef(1);

  const hub = useMemo(() => new THREE.Vector3(0, 0, -2), []);
  const nodes = useMemo(() => NODE_POSITIONS.map((p) => new THREE.Vector3(...p)), []);

  const lineGeometries = useMemo(
    () =>
      nodes.map((n) => {
        const g = new THREE.BufferGeometry().setFromPoints([hub, n]);
        return g;
      }),
    [nodes, hub]
  );

  useFrame((state, delta) => {
    scrollState.eased += (scrollState.progress - scrollState.eased) * 0.15;
    const p = scrollState.eased;
    const t = state.clock.elapsedTime;

    const now = performance.now();
    while (impulses.length && now - impulses[0].t > 900) impulses.shift();
    const boost = impulses.length ? impulses.length * 0.8 : 0;
    speed.current += (1 + boost - speed.current) * 0.06;

    if (group.current) {
      group.current.rotation.y = cursor.x * 0.35 + t * 0.05;
      group.current.rotation.x = cursor.y * 0.2;
      // Fly along Z-axis as user scrolls
      group.current.position.z = -2 + p * 8;
      group.current.position.y = -p * 2;
    }

    nodes.forEach((n, i) => {
      const mesh = nodeRefs.current[i];
      if (mesh) {
        mesh.position.y = n.y + Math.sin(t * 0.8 + i * 1.3) * 0.12;
        mesh.position.x = n.x + Math.cos(t * 0.6 + i * 1.7) * 0.1;
      }
      const pulse = pulseRefs.current[i];
      if (pulse) {
        const local = (t * 0.35 * speed.current + i * 0.17) % 1;
        pulse.position.lerpVectors(hub, n, local);
        const fade = Math.sin(local * Math.PI);
        pulse.material.opacity = 0.85 * fade;
        pulse.scale.setScalar(0.6 + fade * 0.5);
      }
    });
  });

  return (
    <group ref={group} position={[0, 0, -2]}>
      {/* Central Hub */}
      <mesh position={hub}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial color="#f5a623" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh position={hub}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#ffcf5c" transparent opacity={0.6} />
      </mesh>

      {/* Network Edges */}
      {lineGeometries.map((g, i) => (
        <lineSegments key={i} geometry={g}>
          <lineBasicMaterial color="#f5a623" transparent opacity={0.25} />
        </lineSegments>
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <mesh key={i} position={n} ref={(m) => (nodeRefs.current[i] = m)}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#f5a623" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Travelling Pulses */}
      {nodes.map((_, i) => (
        <mesh key={`pulse-${i}`} ref={(m) => (pulseRefs.current[i] = m)}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshBasicMaterial color="#ffcf5c" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function MassiveSwarm() {
  const count = 22000;
  const pointsRef = useRef(null);

  // Buffer arrays
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    return [pos, col];
  }, [count]);

  // Reusable objects for zero garbage collection inside loop
  const tempTarget = useMemo(() => new THREE.Vector3(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // UI Control sliders mock
  const controls = useRef({});
  const addControl = (id, label, min, max, initialValue) => {
    if (controls.current[id] === undefined) {
      controls.current[id] = initialValue;
    }
    return controls.current[id];
  };

  const setInfo = () => {};
  const annotate = () => {};

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const geo = pointsRef.current?.geometry;
    if (!geo) return;

    const posAttr = geo.attributes.position;
    const colAttr = geo.attributes.color;

    // Simulation loop
    for (let i = 0; i < count; i++) {
      const target = tempTarget;
      const color = tempColor;

      // --- Generative Code Body ---
      const scale = addControl("scale", "Breathing Scale", 1, 8, 4.0);
      const speed = addControl("speed", "Simulation Speed", 0.1, 2.0, 0.7);
      const morph = addControl("morph", "Tesseract Morphing", 0.5, 4.0, 1.8);

      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const wave = Math.sin(time * speed + phi * morph) * 0.35 + 1.05;
      const r = scale * wave;

      const x = Math.sin(phi) * Math.cos(theta + time * 0.4) * r;
      const y = Math.sin(phi) * Math.sin(theta + time * 0.4) * r;
      const z = Math.cos(phi) * r + Math.sin(time * 0.8 + theta) * 0.5;

      target.set(x, y, z);

      const h = 0.03 + (Math.sin(phi * 2.0 + time * 0.15) * 0.5 + 0.5) * 0.12;
      color.setHSL(h, 0.95, 0.55);

      if (i === 0) {
        setInfo("Quantum Tesseract Swarm", "A hyper-dimensional breathing particle field.");
        annotate("core", target, "Core Singularity");
      }
      // ----------------------------

      posAttr.array[i * 3] = target.x;
      posAttr.array[i * 3 + 1] = target.y;
      posAttr.array[i * 3 + 2] = target.z;

      colAttr.array[i * 3] = color.r;
      colAttr.array[i * 3 + 1] = color.g;
      colAttr.array[i * 3 + 2] = color.b;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // Connect to scroll and slow rotation
    pointsRef.current.rotation.y = time * 0.04 + scrollState.eased * 0.5;
    pointsRef.current.rotation.x = time * 0.02;
    pointsRef.current.position.z = scrollState.eased * 6;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.06} // Lowered opacity further to make it extremely subtle and elegant
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function ClickRipples() {
  const groupRef = useRef(null);
  const ringsRef = useRef([]);
  const [, force] = useState(0);

  useEffect(() => {
    function onDown(e) {
      if (e.target.closest("button, a, input, textarea")) return;
      const x = cursor.x * 5;
      const y = -cursor.y * 3;
      ringsRef.current.push({ x, y, born: performance.now(), mesh: null });
      force((v) => v + 1);
    }
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  useFrame(() => {
    const now = performance.now();
    ringsRef.current = ringsRef.current.filter((r) => now - r.born < 1200);
    ringsRef.current.forEach((r) => {
      if (!r.mesh) return;
      const t = (now - r.born) / 1200;
      r.mesh.scale.setScalar(0.2 + t * 2.5);
      r.mesh.material.opacity = Math.max(0, 0.7 * (1 - t));
    });
  });

  return (
    <group ref={groupRef}>
      {ringsRef.current.map((r, i) => (
        <mesh key={r.born + i} position={[r.x, r.y, 0]} ref={(m) => (r.mesh = m)}>
          <ringGeometry args={[0.5, 0.58, 48]} />
          <meshBasicMaterial color="#f5a623" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene3D({ isLoaded = true }) {
  const reduced = prefersReducedMotion;
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 22], fov: 55 }}
        dpr={[1, isTouch ? 1 : 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraRig isLoaded={isLoaded} />
        <MassiveSwarm />
        {!reduced && <ClickRipples />}
      </Canvas>
    </div>
  );
}
