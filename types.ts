export interface PromptState {
  // Main Info (Required)
  subject: string;
  timePlace: string;
  action: string;

  // Styles (Optional)
  artStyles: string[];
  lighting: string[];
  environment: string;
  colorPalette: string;
  customColor: string; // Hex code
  useCustomColor: boolean;
  mood: string[];
  quality: string;
  boosters: string[];
  aspectRatio: string;
  cameraAngle: string[];
  cameraLens: string[];
  negativePrompts: string;
}

export type TabType = 'builder' | 'styles' | 'extract';

export interface StyleOption {
  label: string;
  value: string;
}
