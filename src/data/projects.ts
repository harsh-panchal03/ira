/**
 * Portfolio entries.
 *
 * `warm-minimal-living` is a real IRA Designs post (instagram.com/p/DZiNoqJsa_e).
 * The other four are concept plates drawn in code while the original post
 * files are collected. To swap one in: drop the files into
 * /public/assets/projects/<slug>/, set `image` paths, set `pending: false`
 * and `source` to the post URL. The plate art is used only while `image` is null.
 */
export type PlateKind = "living" | "bedroom" | "dining" | "reading" | "bath";

export type ProjectImage = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  title: string;
  category: string;
  room: string;
  summary: string;
  pending: boolean;
  source: string | null;
  plate: PlateKind;
  /** Final render. null → concept plate is drawn instead. */
  image: ProjectImage | null;
  /** Line drawing of the same view, for the idea → render comparison. */
  linework: ProjectImage | null;
  details: ProjectImage[];
  palette: { name: string; hex: string }[];
  concept: string;
  exploration: string;
  application: string;
  facts: { label: string; value: string }[];
  /** Section tone for the detail page hero. */
  tone: "paper" | "linen" | "travertine" | "walnut";
};

const wml = "/assets/projects/warm-minimal-living";

export const projects: Project[] = [
  {
    slug: "warm-minimal-living",
    title: "Warm Minimal Living",
    category: "3D Visualization",
    room: "Living room",
    summary:
      "A sunlit living room in travertine, linen and walnut — rendered with such precision that it reads as a completed space rather than a digital image.",
    pending: false,
    source: "https://www.instagram.com/p/DZiNoqJsa_e/",
    plate: "living",
    image: {
      src: `${wml}/render.webp`,
      alt: "Photoreal render of a living room: linen sofa against a travertine wall, rattan side table with a vase of dried grass, and a round walnut coffee table in afternoon sun.",
      width: 783,
      height: 813,
    },
    linework: {
      src: `${wml}/linework.webp`,
      alt: "Line drawing of the same living room, showing the sofa, side table, vase and coffee table as outlines.",
      width: 783,
      height: 813,
    },
    details: [
      { src: `${wml}/detail-vase.webp`, alt: "Detail: rattan side table and ceramic vase with dried pampas.", width: 313, height: 366 },
      { src: `${wml}/detail-sofa.webp`, alt: "Detail: linen cushions on a low walnut-framed sofa.", width: 509, height: 390 },
      { src: `${wml}/detail-wall.webp`, alt: "Detail: leaf shadows falling across a travertine wall.", width: 392, height: 260 },
      { src: `${wml}/detail-table.webp`, alt: "Detail: woven basket and stone bowl on a walnut table.", width: 391, height: 244 },
    ],
    palette: [
      { name: "Travertine", hex: "#D7CEBF" },
      { name: "Linen", hex: "#E3DCCF" },
      { name: "Sand", hex: "#AB9B88" },
      { name: "Rattan", hex: "#846D56" },
      { name: "Walnut", hex: "#482F1F" },
    ],
    concept:
      "Materials and lighting to textures and proportions — every element crafted to reflect the final vision. A quiet palette lets daylight do the composing.",
    exploration:
      "The scene starts as line: sofa, side table, vessel, table. Proportions are fixed before a single material is applied, so the space is right before it is beautiful.",
    application:
      "Low sun rakes across the stone wall and leaves throw soft shadows, giving the render the stillness of a photograph taken in a finished home.",
    facts: [
      { label: "Discipline", value: "3D Visualization" },
      { label: "Space", value: "Living room" },
      { label: "Materials", value: "Travertine · Linen · Rattan · Walnut" },
      { label: "Source", value: "Instagram post" },
    ],
    tone: "travertine",
  },
  {
    slug: "arched-bedroom",
    title: "Arched Bedroom",
    category: "Interior Design",
    room: "Bedroom",
    summary: "A soft-arched sleeping room — plaster, oak and a single low window.",
    pending: true,
    source: null,
    plate: "bedroom",
    image: null,
    linework: null,
    details: [],
    palette: [
      { name: "Plaster", hex: "#E3DCCF" },
      { name: "Stone", hex: "#C0B4A3" },
      { name: "Oak", hex: "#AB9B88" },
      { name: "Umber", hex: "#745239" },
    ],
    concept: "An arch frames the bed like a niche, turning the headboard wall into the quietest part of the room.",
    exploration: "Elevation first: the arch, the bed and the window are balanced on one centreline.",
    application: "Morning light enters low and travels across the floor rather than the bed.",
    facts: [
      { label: "Discipline", value: "Interior Design" },
      { label: "Space", value: "Bedroom" },
      { label: "Status", value: "Final visual coming soon" },
    ],
    tone: "linen",
  },
  {
    slug: "travertine-dining",
    title: "Travertine Dining",
    category: "3D Visualization",
    room: "Dining",
    summary: "A monolithic stone table under a single pendant — weight below, light above.",
    pending: true,
    source: null,
    plate: "dining",
    image: null,
    linework: null,
    details: [],
    palette: [
      { name: "Travertine", hex: "#D7CEBF" },
      { name: "Clay", hex: "#846D56" },
      { name: "Walnut", hex: "#482F1F" },
    ],
    concept: "One heavy material, one point of light. The table becomes an object rather than furniture.",
    exploration: "The pendant height and table length are tuned until the composition reads as a still life.",
    application: "Warm pendant light pools on the stone while the walls fall into soft shadow.",
    facts: [
      { label: "Discipline", value: "3D Visualization" },
      { label: "Space", value: "Dining" },
      { label: "Status", value: "Final visual coming soon" },
    ],
    tone: "walnut",
  },
  {
    slug: "quiet-reading-nook",
    title: "Quiet Reading Nook",
    category: "Interior Design",
    room: "Reading corner",
    summary: "A lounge chair, a shelf and a slant of afternoon sun.",
    pending: true,
    source: null,
    plate: "reading",
    image: null,
    linework: null,
    details: [],
    palette: [
      { name: "Linen", hex: "#E3DCCF" },
      { name: "Sand", hex: "#AB9B88" },
      { name: "Umber", hex: "#745239" },
    ],
    concept: "A corner designed around one ritual: sitting down with a book at four in the afternoon.",
    exploration: "Chair, lamp and shelf are placed against the path of the sun across the day.",
    application: "Sunlight is the main material — everything else stays low and soft.",
    facts: [
      { label: "Discipline", value: "Interior Design" },
      { label: "Space", value: "Reading corner" },
      { label: "Status", value: "Final visual coming soon" },
    ],
    tone: "paper",
  },
  {
    slug: "stone-linen-bath",
    title: "Stone & Linen Bath",
    category: "3D Visualization",
    room: "Bathroom",
    summary: "A freestanding tub in a stone niche — the calm of a spa, at home.",
    pending: true,
    source: null,
    plate: "bath",
    image: null,
    linework: null,
    details: [],
    palette: [
      { name: "Stone", hex: "#C0B4A3" },
      { name: "Travertine", hex: "#D7CEBF" },
      { name: "Walnut", hex: "#482F1F" },
    ],
    concept: "Bathing as a slow ritual — a single sculptural tub held by a niche of stone.",
    exploration: "The niche, tub and stool are drawn as one composition before any texture is applied.",
    application: "Diffused light from above keeps the stone soft and the shadows gentle.",
    facts: [
      { label: "Discipline", value: "3D Visualization" },
      { label: "Space", value: "Bathroom" },
      { label: "Status", value: "Final visual coming soon" },
    ],
    tone: "linen",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
