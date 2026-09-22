export const portraitStyles = [
  "Classic Fantasy",
  "Illustrated Realism",
  "Cinematic Realism",
] as const;

export type PortraitStyle = (typeof portraitStyles)[number];
export function isPortraitStyle(style: unknown): style is PortraitStyle | "Fantasy" | "Historical" | "Photorealistic" {
  return typeof style === "string" && [
    ...portraitStyles,
    "Fantasy",
    "Historical",
    "Photorealistic",
  ].includes(style as string);
}

export function normalizePortraitStyle(style: string): PortraitStyle {
  switch (style) {
    case "Fantasy":
      return "Classic Fantasy";
    case "Historical":
      return "Illustrated Realism";
    case "Photorealistic":
      return "Cinematic Realism";
    case "Classic Fantasy":
    case "Illustrated Realism":
    case "Cinematic Realism":
      return style;
    default:
      return "Classic Fantasy";
  }
}
