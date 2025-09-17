import { Entity } from './enums';

export interface ValidationErrorOptions {
  uniqueArea?: Entity;
  skipDefaultError?: boolean;
  patternMessage?: string;
}
