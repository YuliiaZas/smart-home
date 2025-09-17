export interface FormControlsError {
  errors: Record<string, boolean> | null;
  controlNames: string[];
}
