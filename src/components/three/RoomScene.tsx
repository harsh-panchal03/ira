"use client";
/**
 * "Render to reality" — a procedural living room that is first a pencil
 * drawing, then clay volumes, then materials, then sunlight with leaf
 * shadows. Driven entirely by `sceneStore.progress` (written by GSAP).
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { sceneStore } from "@/lib/scene-store";

const PALETTE = {
  clay: new THREE.Color("#efe9df"),
  line: new THREE.Color("#745239"),
};

const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/* ------------------------------------------------------------------ */
/* Registry: every piece registers its materials so one frame loop     */
/* can drive all of them without React re-renders.                     */
/* ------------------------------------------------------------------ */
type Entry = { mesh: THREE.MeshStandardMaterial; edges: THREE.LineBasicMaterial; color: THREE.Color };
const Registry = createContext<Entry[]>([]);

function Piece({
  geometry,
  color,
  roughness = 0.9,
  position,
  rotation,
  receive = true,
  cast = true,
  edgeAngle = 25,
}: {
  geometry: THREE.BufferGeometry;
  color: string;
  roughness?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  receive?: boolean;
  cast?: boolean;
  edgeAngle?: number;
}) {
  const registry = useContext(Registry);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, edgeAngle), [geometry, edgeAngle]);
  const mats = useMemo(() => {
    const mesh = new THREE.MeshStandardMaterial({ color: PALETTE.clay.clone(), roughness, transparent: true, opacity: 0 });
    const line = new THREE.LineBasicMaterial({ color: PALETTE.line, transparent: true, opacity: 1 });
    return { mesh, line };
  }, [roughness]);

  useLayoutEffect(() => {
    const entry: Entry = { mesh: mats.mesh, edges: mats.line, color: new THREE.Color(color) };
    registry.push(entry);
    return () => {
      registry.splice(registry.indexOf(entry), 1);
    };
  }, [registry, mats, color]);

  useEffect(
    () => () => {
      edges.dispose();
      mats.mesh.dispose();
      mats.line.dispose();
    },
    [edges, mats],
  );

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry} material={mats.mesh} castShadow={cast} receiveShadow={receive} />
      <lineSegments geometry={edges} material={mats.line} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */
const rbox = (w: number, h: number, d: number, r = 0.08) => new RoundedBoxGeometry(w, h, d, 3, r);

function lathe(points: [number, number][], segments = 48) {
  return new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments);
}

function archWall() {
  const W = 14;
  const H = 7;
  const s = new THREE.Shape();
  s.moveTo(-W / 2, 0);
  s.lineTo(W / 2, 0);
  s.lineTo(W / 2, H);
  s.lineTo(-W / 2, H);
  s.closePath();
  // Tall arched window, left of centre
  const cx = -3.6;
  const w = 1.7;
  const springing = 3.0;
  const hole = new THREE.Path();
  hole.moveTo(cx - w / 2, 0.5);
  hole.lineTo(cx + w / 2, 0.5);
  hole.lineTo(cx + w / 2, springing);
  hole.absarc(cx, springing, w / 2, 0, Math.PI, false);
  hole.lineTo(cx - w / 2, 0.5);
  s.holes.push(hole);
  return new THREE.ExtrudeGeometry(s, { depth: 0.35, bevelEnabled: false, curveSegments: 32 });
}

function leafTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fff";
  g.fillRect(0, 0, 512, 512);
  g.filter = "blur(7px)";
  g.fillStyle = "#2a1c13";
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // a few arching stems with leaves
  for (let b = 0; b < 5; b++) {
    let x = 60 + rnd() * 380;
    let y = 520;
    const lean = (rnd() - 0.5) * 3;
    for (let i = 0; i < 26; i++) {
      x += lean + (rnd() - 0.5) * 6;
      y -= 16 + rnd() * 6;
      g.save();
      g.translate(x, y);
      g.rotate((i % 2 ? 1 : -1) * (0.6 + rnd() * 0.5) + lean * 0.1);
      g.beginPath();
      g.ellipse(18, 0, 22 + rnd() * 10, 6 + rnd() * 3, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ */
/* Room                                                                */
/* ------------------------------------------------------------------ */
function Room() {
  const g = useMemo(
    () => ({
      floor: new THREE.BoxGeometry(22, 0.1, 26),
      wall: archWall(),
      sky: new THREE.PlaneGeometry(2.4, 4.2),
      rug: rbox(5.2, 0.03, 3.4, 0.015),
      sofaBase: rbox(3.6, 0.42, 1.15, 0.1),
      sofaFrame: new THREE.BoxGeometry(3.7, 0.06, 1.2),
      seat: rbox(1.72, 0.24, 1.0, 0.11),
      back: rbox(3.4, 0.62, 0.3, 0.13),
      arm: rbox(0.26, 0.6, 1.15, 0.12),
      pillowA: rbox(0.68, 0.56, 0.18, 0.09),
      pillowB: rbox(0.58, 0.46, 0.16, 0.08),
      leg: new THREE.BoxGeometry(0.06, 0.18, 0.06),
      stool: lathe([[0, 0], [0.42, 0], [0.38, 0.2], [0.3, 0.45], [0.34, 0.7], [0.42, 0.84], [0, 0.84]]),
      vase: lathe([[0, 0], [0.16, 0], [0.22, 0.12], [0.24, 0.26], [0.15, 0.44], [0.08, 0.56], [0.1, 0.62], [0, 0.62]]),
      tableTop: new THREE.CylinderGeometry(1.15, 1.15, 0.09, 72),
      tableBase: new THREE.CylinderGeometry(0.55, 0.62, 0.32, 48),
      bowl: lathe([[0, 0], [0.12, 0], [0.24, 0.06], [0.3, 0.14], [0.27, 0.15], [0.2, 0.08], [0, 0.04]], 40),
      basket: new THREE.CylinderGeometry(0.22, 0.2, 0.2, 32, 1, true),
    }),
    [],
  );

  const stems = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const r = 0.15 + (i % 5) * 0.08;
      const h = 0.9 + (i % 7) * 0.12;
      pts.push(0, 0, 0, Math.cos(a) * r, h, Math.sin(a) * r * 0.6);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  useEffect(() => () => Object.values(g).forEach((x) => x.dispose()), [g]);

  return (
    <group>
      <Piece geometry={g.floor} color="#cdbfac" position={[0, -0.05, 9.6]} cast={false} />
      <Piece geometry={g.wall} color="#ddd3c4" position={[0, 0, -3.35]} />
      <mesh geometry={g.sky} position={[-3.6, 2.6, -3.8]}>
        <meshBasicMaterial name="sky" color="#fbf6ec" toneMapped={false} transparent opacity={0} />
      </mesh>
      <Piece geometry={g.rug} color="#e6ded1" position={[0.4, 0.015, 0.6]} cast={false} edgeAngle={60} />

      {/* sofa */}
      <group position={[0.2, 0, -1.9]}>
        <Piece geometry={g.sofaFrame} color="#4d3322" position={[0, 0.2, 0]} roughness={0.6} />
        {[-1.7, 1.7].map((x) =>
          [-0.5, 0.5].map((z) => <Piece key={`${x}${z}`} geometry={g.leg} color="#4d3322" position={[x, 0.09, z]} />),
        )}
        <Piece geometry={g.sofaBase} color="#d9cfbf" position={[0, 0.44, 0]} />
        <Piece geometry={g.seat} color="#e2d9cb" position={[-0.86, 0.77, 0.06]} />
        <Piece geometry={g.seat} color="#e2d9cb" position={[0.86, 0.77, 0.06]} />
        <Piece geometry={g.back} color="#ddd3c4" position={[0, 1.08, -0.4]} rotation={[-0.08, 0, 0]} />
        <Piece geometry={g.arm} color="#d9cfbf" position={[-1.72, 0.84, 0]} />
        <Piece geometry={g.arm} color="#d9cfbf" position={[1.72, 0.84, 0]} />
        <Piece geometry={g.pillowA} color="#b9a48c" position={[-0.95, 1.18, -0.16]} rotation={[-0.25, 0.15, 0.08]} />
        <Piece geometry={g.pillowB} color="#a68e75" position={[-0.35, 1.08, -0.08]} rotation={[-0.3, -0.1, -0.06]} />
        <Piece geometry={g.pillowA} color="#cbbba6" position={[0.95, 1.2, -0.16]} rotation={[-0.22, -0.2, -0.05]} />
      </group>

      {/* rattan stool + vase + dried grass */}
      <group position={[-2.75, 0, -1.7]}>
        <Piece geometry={g.stool} color="#9a7a5a" />
        <Piece geometry={g.vase} color="#c9b8a2" position={[0, 0.84, 0]} roughness={0.7} />
        <lineSegments geometry={stems} position={[0, 1.42, 0]}>
          <lineBasicMaterial color="#8a6a4c" transparent opacity={0.9} />
        </lineSegments>
      </group>

      {/* walnut coffee table */}
      <group position={[1.3, 0, 0.9]}>
        <Piece geometry={g.tableBase} color="#3f281a" position={[0, 0.16, 0]} roughness={0.55} />
        <Piece geometry={g.tableTop} color="#4a2f1f" position={[0, 0.37, 0]} roughness={0.45} edgeAngle={40} />
        <Piece geometry={g.bowl} color="#e4dccd" position={[0.45, 0.42, 0.15]} roughness={0.6} />
        <Piece geometry={g.basket} color="#8c6d50" position={[-0.35, 0.52, -0.2]} edgeAngle={60} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Lights + camera + the per-frame choreography                         */
/* ------------------------------------------------------------------ */
// p0: room floats above the headline · p0.5: room left, chapters right · p1: close, eye level
const CAM = [
  { p: new THREE.Vector3(0.4, 2.3, 11.5), t: new THREE.Vector3(-0.1, 0.6, -1.5) },
  { p: new THREE.Vector3(-0.6, 1.9, 8.2), t: new THREE.Vector3(1.6, 1.55, -1.6) },
  { p: new THREE.Vector3(0.9, 1.4, 5.6), t: new THREE.Vector3(1.0, 1.3, -1.8) },
];

function Director({ registry }: { registry: React.RefObject<Entry[]> }) {
  const { camera, scene } = useThree();
  // Found lazily: the room mounts in the same commit as the director.
  const sky = useMemo(() => {
    let m: THREE.MeshBasicMaterial | null = null;
    return {
      get: () => {
        if (!m)
          scene.traverse((o) => {
            const mat = (o as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
            if (mat && mat.name === "sky") m = mat;
          });
        return m as THREE.MeshBasicMaterial | null;
      },
    };
  }, [scene]);
  const sun = useRef<THREE.SpotLight>(null);
  const window_ = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const leaves = useMemo(() => (typeof document !== "undefined" ? leafTexture() : null), []);
  const smoothed = useRef(0);
  const ptr = useRef({ x: 0, y: 0 });
  const tmpRef = useRef({ p: new THREE.Vector3(), t: new THREE.Vector3() });

  useEffect(() => {
    const s = sun.current!;
    s.target.position.set(0.4, 1.4, -3.3);
    s.target.updateMatrixWorld();
    const w = window_.current!;
    w.target.position.set(-1.5, 0, 1.5);
    w.target.updateMatrixWorld();
    return () => leaves?.dispose();
  }, [leaves]);

  useFrame((state, dt) => {
    const k = 1 - Math.exp(-dt * 4);
    smoothed.current += (sceneStore.progress - smoothed.current) * k;
    ptr.current.x += (sceneStore.pointer.x - ptr.current.x) * k;
    ptr.current.y += (sceneStore.pointer.y - ptr.current.y) * k;
    const p = smoothed.current;

    const lineT = 1 - smooth(0.14, 0.34, p);
    const solidT = smooth(0.12, 0.3, p);
    const colorT = smooth(0.34, 0.56, p);
    const lightT = smooth(0.54, 0.8, p);

    const tmp = tmpRef.current;
    for (const e of registry.current) {
      e.edges.opacity = lineT * 0.95;
      e.edges.visible = lineT > 0.001;
      e.mesh.opacity = solidT;
      e.mesh.transparent = solidT < 0.999;
      e.mesh.depthWrite = solidT > 0.5;
      e.mesh.color.copy(PALETTE.clay).lerp(e.color, colorT);
    }

    const skyMat = sky.get();
    if (skyMat) skyMat.opacity = solidT;
    if (hemi.current) hemi.current.intensity = THREE.MathUtils.lerp(2.2, 0.9, lightT);
    if (sun.current) sun.current.intensity = lightT * 420;
    if (window_.current) window_.current.intensity = lightT * 2.4;

    // camera: two eased segments + pointer parallax + breathing
    const seg = p < 0.5 ? 0 : 1;
    const local = smooth(0, 1, seg === 0 ? p / 0.5 : (p - 0.5) / 0.5);
    tmp.p.lerpVectors(CAM[seg].p, CAM[seg + 1].p, local);
    tmp.t.lerpVectors(CAM[seg].t, CAM[seg + 1].t, local);
    const breathe = Math.sin(state.clock.elapsedTime * 0.35) * 0.05;
    tmp.p.x += ptr.current.x * 0.45;
    tmp.p.y += ptr.current.y * 0.22 + breathe;
    camera.position.copy(tmp.p);
    camera.lookAt(tmp.t);
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#fff8ee", "#b9a68f", 2.2]} />
      <spotLight
        ref={sun}
        position={[-7.5, 7.5, 5]}
        angle={0.55}
        penumbra={0.75}
        decay={1.6}
        color="#ffe3bd"
        intensity={0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-radius={6}
        map={leaves ?? undefined}
      />
      <directionalLight
        ref={window_}
        position={[-6, 6.5, -9]}
        color="#ffe8c8"
        intensity={0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
      />
    </>
  );
}

function Scene() {
  const registry = useRef<Entry[]>([]);
  return (
    <Registry.Provider value={registry.current}>
      <Room />
      <Director registry={registry} />
    </Registry.Provider>
  );
}

export default function RoomScene({ active }: { active: boolean }) {
  const [ready, setReady] = useState(false);
  return (
    <Canvas
      className="!absolute inset-0 transition-opacity duration-[1.6s]"
      style={{ opacity: ready ? 1 : 0 }}
      frameloop={active ? "always" : "never"}
      shadows="soft"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 32, near: 0.1, far: 60, position: [0.3, 2.1, 10.5] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        setReady(true);
      }}
      aria-hidden="true"
    >
      <Scene />
    </Canvas>
  );
}
