import { ImageResponse } from "next/og";
import { MONOGRAM_PATH, MONOGRAM_VIEWBOX } from "@/components/layout/monogram-path";
import { site } from "@/data/site";

export const alt = `${site.name} — Interior Design & 3D Visualization`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f1ece3", color: "#745239" }}>
        <svg viewBox={MONOGRAM_VIEWBOX} width={420} height={247}>
          <path d={MONOGRAM_PATH} fill="#745239" fillRule="evenodd" />
        </svg>
        <div style={{ marginTop: 28, fontSize: 30, letterSpacing: 18, paddingLeft: 18 }}>DESIGNS</div>
        <div style={{ marginTop: 48, fontSize: 28, color: "#2a1c13", opacity: 0.7 }}>{site.tagline}</div>
      </div>
    ),
    size,
  );
}
