import type { PlateKind } from "@/data/projects";
import { useId, type ReactNode } from "react";

/**
 * Concept plates — architectural elevations drawn in the studio palette.
 * `line`  = the idea (pencil stage)
 * `render`= the same view with material, light and shadow.
 * Used only until the original post imagery is supplied.
 */
type Mode = "line" | "render";

const C = {
  paper: "#F1ECE3",
  linen: "#E3DCCF",
  travertine: "#D7CEBF",
  stone: "#C0B4A3",
  sand: "#AB9B88",
  clay: "#846D56",
  umber: "#745239",
  walnut: "#482F1F",
};

function Shape({
  mode,
  fill,
  children,
}: {
  mode: Mode;
  fill: string;
  children: ReactNode;
}) {
  return (
    <g
      fill={mode === "render" ? fill : "none"}
      stroke={C.umber}
      strokeWidth={mode === "render" ? 0.6 : 1.6}
      strokeOpacity={mode === "render" ? 0.35 : 0.9}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {children}
    </g>
  );
}

function Room({ mode, id, wall = C.linen, floor = C.stone, children, sun = "left" }: {
  mode: Mode;
  id: string;
  wall?: string;
  floor?: string;
  sun?: "left" | "right" | "top";
  children: ReactNode;
}) {
  const r = mode === "render";
  const shaft =
    sun === "left"
      ? "M0 120 L260 0 L800 520 L800 760 Z"
      : sun === "right"
        ? "M800 140 L560 0 L0 560 L0 780 Z"
        : "M300 0 L500 0 L640 1000 L160 1000 Z";
  return (
    <svg
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="presentation"
    >
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={wall} />
          <stop offset="1" stopColor={C.travertine} />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={floor} />
          <stop offset="1" stopColor={C.sand} />
        </linearGradient>
        <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={`${id}-leaf`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <rect width="800" height="1000" fill={r ? `url(#${id}-wall)` : C.paper} />
      {r && <rect y="720" width="800" height="280" fill={`url(#${id}-floor)`} />}
      <line x1="0" y1="720" x2="800" y2="720" stroke={C.umber} strokeOpacity={r ? 0.25 : 0.8} strokeWidth={r ? 1 : 1.6} />

      {r && (
        <>
          <path d={shaft} fill={`url(#${id}-sun)`} />
          {/* leaf shadows */}
          <g filter={`url(#${id}-leaf)`} fill={C.walnut} opacity="0.1">
            {Array.from({ length: 14 }).map((_, i) => (
              <ellipse
                key={i}
                cx={(sun === "right" ? 620 : 180) + Math.sin(i * 1.7) * 90}
                cy={160 + i * 22}
                rx="34"
                ry="9"
                transform={`rotate(${(sun === "right" ? -1 : 1) * (28 + ((i * 37) % 50))} ${(sun === "right" ? 620 : 180) + Math.sin(i * 1.7) * 90} ${160 + i * 22})`}
              />
            ))}
          </g>
        </>
      )}
      {children}
      {!r && (
        <g stroke={C.umber} strokeOpacity="0.25" strokeWidth="1">
          {/* construction lines */}
          <line x1="400" y1="0" x2="400" y2="1000" strokeDasharray="4 8" />
          <line x1="0" y1="560" x2="800" y2="560" strokeDasharray="4 8" />
        </g>
      )}
    </svg>
  );
}

function Shadow({ mode, id, d }: { mode: Mode; id: string; d: string }) {
  if (mode !== "render") return null;
  return <path d={d} fill={C.walnut} opacity="0.22" filter={`url(#${id}-soft)`} />;
}

function Living({ mode, id }: { mode: Mode; id: string }) {
  return (
    <Room mode={mode} id={id}>
      <Shadow mode={mode} id={id} d="M150 860 L760 860 L780 900 L130 900 Z" />
      <Shape mode={mode} fill={C.linen}>
        <rect x="170" y="640" width="560" height="190" rx="34" />
        <rect x="200" y="560" width="500" height="130" rx="40" />
      </Shape>
      <Shape mode={mode} fill={C.sand}>
        <rect x="250" y="590" width="150" height="110" rx="26" transform="rotate(-8 325 645)" />
        <rect x="430" y="580" width="170" height="120" rx="26" transform="rotate(6 515 640)" />
      </Shape>
      <Shape mode={mode} fill={C.walnut}>
        <rect x="170" y="828" width="560" height="14" rx="4" />
      </Shape>
      <Shape mode={mode} fill={C.clay}>
        <path d="M40 560 C40 540 160 540 160 560 L150 840 C150 860 50 860 50 840 Z" />
      </Shape>
      <Shape mode={mode} fill={C.travertine}>
        <path d="M100 548 C70 520 70 470 90 450 L88 420 L112 420 L110 450 C130 470 130 520 100 548 Z" />
      </Shape>
      <g stroke={C.clay} strokeWidth="1.4" fill="none" opacity={mode === "render" ? 0.8 : 1}>
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={i} d={`M100 425 C ${60 + i * 10} 360 ${40 + i * 14} 320 ${30 + i * 16} ${300 - (i % 3) * 20}`} />
        ))}
      </g>
      <Shadow mode={mode} id={id} d="M420 950 L800 950 L800 990 L400 990 Z" />
      <Shape mode={mode} fill={C.walnut}>
        <ellipse cx="640" cy="910" rx="260" ry="48" />
      </Shape>
      <Shape mode={mode} fill={C.travertine}>
        <path d="M560 880 C560 900 660 900 660 880 L652 860 L568 860 Z" />
      </Shape>
    </Room>
  );
}

function Bedroom({ mode, id }: { mode: Mode; id: string }) {
  return (
    <Room mode={mode} id={id} sun="right">
      <Shape mode={mode} fill={C.travertine}>
        <path d="M180 720 L180 380 A220 220 0 0 1 620 380 L620 720 Z" />
      </Shape>
      <Shadow mode={mode} id={id} d="M120 860 L700 860 L720 900 L100 900 Z" />
      <Shape mode={mode} fill={C.sand}>
        <rect x="140" y="760" width="520" height="90" rx="10" />
      </Shape>
      <Shape mode={mode} fill={C.linen}>
        <path d="M150 770 C150 700 650 700 650 770 L660 830 L140 830 Z" />
        <rect x="220" y="640" width="160" height="90" rx="30" />
        <rect x="420" y="640" width="160" height="90" rx="30" />
      </Shape>
      <Shape mode={mode} fill={C.umber}>
        <path d="M300 790 C380 770 520 770 650 790 L655 830 L300 830 Z" opacity="0.85" />
      </Shape>
      <Shape mode={mode} fill={C.clay}>
        <rect x="680" y="740" width="90" height="110" rx="8" />
      </Shape>
      <Shape mode={mode} fill={C.paper}>
        <path d="M715 740 L700 690 L750 690 L735 740 Z" />
      </Shape>
      <Shape mode={mode} fill="#ffffff">
        <rect x="660" y="230" width="110" height="200" rx="55" opacity="0.7" />
      </Shape>
    </Room>
  );
}

function Dining({ mode, id }: { mode: Mode; id: string }) {
  return (
    <Room mode={mode} id={id} sun="top" wall={C.travertine} floor={C.sand}>
      <line x1="400" y1="0" x2="400" y2="380" stroke={C.walnut} strokeWidth="1.5" />
      {mode === "render" && <ellipse cx="400" cy="720" rx="320" ry="80" fill="#fff6e6" opacity="0.35" filter={`url(#${id}-soft)`} />}
      <Shape mode={mode} fill={C.walnut}>
        <path d="M330 420 C330 370 470 370 470 420 Z" />
      </Shape>
      <Shadow mode={mode} id={id} d="M100 900 L700 900 L740 950 L60 950 Z" />
      <Shape mode={mode} fill={C.clay}>
        <path d="M150 640 C150 560 230 560 230 640 L232 900 L148 900 Z" />
        <path d="M570 640 C570 560 650 560 650 640 L652 900 L568 900 Z" />
      </Shape>
      <Shape mode={mode} fill={C.travertine}>
        <rect x="110" y="690" width="580" height="60" rx="6" />
        <rect x="200" y="750" width="120" height="160" />
        <rect x="480" y="750" width="120" height="160" />
      </Shape>
      <Shape mode={mode} fill={C.stone}>
        <path d="M360 690 C360 650 440 650 440 690 Z" />
      </Shape>
    </Room>
  );
}

function Reading({ mode, id }: { mode: Mode; id: string }) {
  return (
    <Room mode={mode} id={id} sun="left">
      <Shape mode={mode} fill={C.walnut}>
        <rect x="430" y="300" width="300" height="10" />
        <rect x="430" y="440" width="300" height="10" />
      </Shape>
      <Shape mode={mode} fill={C.clay}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={450 + i * 22} y={220 + (i % 2) * 10} width="18" height={80 - (i % 2) * 10} />
        ))}
        <rect x="620" y="360" width="70" height="80" rx="35" />
      </Shape>
      <Shadow mode={mode} id={id} d="M120 880 L560 880 L590 930 L90 930 Z" />
      <Shape mode={mode} fill={C.umber}>
        <path d="M150 600 C140 520 300 500 360 560 L380 760 C380 800 360 820 320 820 L190 820 C150 820 140 790 140 760 Z" />
      </Shape>
      <Shape mode={mode} fill={C.linen}>
        <rect x="170" y="700" width="230" height="90" rx="30" />
      </Shape>
      <Shape mode={mode} fill={C.walnut}>
        <path d="M170 820 L160 900 M360 820 L372 900" />
      </Shape>
      <g stroke={C.walnut} strokeWidth="2">
        <line x1="520" y1="560" x2="520" y2="900" />
        <line x1="480" y1="900" x2="560" y2="900" />
      </g>
      <Shape mode={mode} fill={C.paper}>
        <path d="M470 560 L570 560 L550 500 L490 500 Z" />
      </Shape>
      {mode === "render" && <ellipse cx="520" cy="580" rx="110" ry="40" fill="#fff4dc" opacity="0.5" filter={`url(#${id}-soft)`} />}
    </Room>
  );
}

function Bath({ mode, id }: { mode: Mode; id: string }) {
  return (
    <Room mode={mode} id={id} sun="top" wall={C.stone} floor={C.travertine}>
      <Shape mode={mode} fill={C.travertine}>
        <path d="M120 720 L120 300 A280 280 0 0 1 680 300 L680 720 Z" />
      </Shape>
      {mode === "render" && (
        <g stroke={C.stone} strokeWidth="1" opacity="0.6">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="120" y1={360 + i * 48} x2="680" y2={360 + i * 48} />
          ))}
        </g>
      )}
      <Shadow mode={mode} id={id} d="M170 870 L640 870 L670 920 L140 920 Z" />
      <Shape mode={mode} fill={C.paper}>
        <path d="M180 690 C180 660 620 660 620 690 C620 800 560 860 480 860 L320 860 C240 860 180 800 180 690 Z" />
      </Shape>
      <Shape mode={mode} fill={C.walnut}>
        <rect x="660" y="800" width="90" height="16" rx="3" />
        <path d="M672 816 L672 900 M738 816 L738 900" />
      </Shape>
      <Shape mode={mode} fill={C.sand}>
        <rect x="675" y="770" width="60" height="30" rx="6" />
      </Shape>
      <Shape mode={mode} fill={C.clay}>
        <path d="M400 380 L400 640 M380 380 L420 380" />
      </Shape>
    </Room>
  );
}

const plates = { living: Living, bedroom: Bedroom, dining: Dining, reading: Reading, bath: Bath };

export default function ProjectPlate({ kind, mode = "render" }: { kind: PlateKind; mode?: Mode }) {
  const id = useId().replace(/:/g, "");
  const Plate = plates[kind];
  return <Plate mode={mode} id={`p${id}`} />;
}
