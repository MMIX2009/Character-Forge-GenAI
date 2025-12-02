export enum AspectRatio {
  Square = "1:1",
  Standard = "4:3", // Mapping 3:2 to 4:3 for API compatibility
  Widescreen = "16:9",
  Portrait = "3:4", // Mapping 2:3 to 3:4 for API compatibility
  Tall = "9:16"
}

export enum RenderMode {
  Photo = "Photorealistic",
  Illustration = "Digital Illustration",
  Cinematic = "Cinematic Film Still"
}

export enum LightingStyle {
  Natural = "Natural Soft Lighting",
  Studio = "Studio Lighting",
  Dramatic = "Dramatic High Contrast",
  CinematicWarm = "Warm Cinematic",
  CinematicCool = "Cool Cinematic"
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  params: GenerationParams;
}

export interface GenerationParams {
  prompt: string;
  cameraAngle: string;
  aspectRatio: AspectRatio;
  renderMode: RenderMode;
  lighting: LightingStyle;
  isTransparentMode: boolean;
  resolution: "1K" | "2K" | "4K";
}

export interface ReferenceImage {
  id: string;
  data: string; // Base64
  mimeType: string;
}

export const CAMERA_ANGLES = [
  "Eye Level",
  "Low Angle",
  "High Angle",
  "Bird's-Eye View / Overhead",
  "Worm's-Eye View",
  "Dutch Angle / Canted",
  "Close-Up",
  "Extreme Close-Up",
  "Medium Shot",
  "Cowboy Shot",
  "Long Shot / Wide Shot",
  "Extreme Long Shot",
  "Over-the-Shoulder",
  "POV (Point of View)",
  "Drone Orbit",
  "Tracking Shot",
  "Macro"
];