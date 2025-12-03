export interface PromptState {
    // Primary (Mandatory)
    subject: string;
    timePlace: string;
    actionJob: string;
  
    // Secondary (Styles)
    styles: string[];
    lighting: string[];
    environment: string; // Text input
    palette: string[]; // Multi-select
    customColor: string; // Color picker
    mood: string[];
    quality: string[];
    accelerators: string[];
    negativeWords: string; // Text area
    aspectRatio: string;
    cameraAngles: string[];
    cameraLenses: string[];
  }
  
  export interface TabProps {
    isActive: boolean;
    onClick: () => void;
    label: string;
    icon: React.ReactNode;
  }
  
  export type PageType = 'builder' | 'manager' | 'extractor';