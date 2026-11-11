/**
 * Services as evidenced by the studio's Instagram (#InteriorDesign,
 * #3DVisualization, #DesignVisualization and the render-to-reality caption).
 * TODO: confirm the final list and wording with the studio.
 */
export type Service = {
  index: string;
  title: string;
  lead: string;
  body: string;
  facets: string[];
  motif: "plan" | "cube" | "sun";
};

export const services: Service[] = [
  {
    index: "01",
    title: "Interior Design",
    lead: "Spaces shaped around how you live.",
    body: "Layout, proportion and atmosphere resolved together, so every room feels considered from the doorway to the last detail.",
    facets: ["Space planning", "Concept & mood", "Furniture & styling"],
    motif: "plan",
  },
  {
    index: "02",
    title: "3D Visualization",
    lead: "See it finished before it is built.",
    body: "Photoreal renders that read as a completed space rather than a digital image — so decisions are made with confidence, not guesswork.",
    facets: ["Photoreal stills", "Interior renders", "Design visualization"],
    motif: "cube",
  },
  {
    index: "03",
    title: "Material & Light",
    lead: "Texture, tone and the way the sun falls.",
    body: "Materials, lighting, textures and proportions are tuned until the image reflects the final vision exactly.",
    facets: ["Material palettes", "Lighting studies", "Render to reality"],
    motif: "sun",
  },
];
