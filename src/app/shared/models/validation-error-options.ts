import { Entity } from './entity.enum';

export interface ValidationErrorOptions {
  uniqueArea?: Entity;
  skipDefaultError?: boolean;
  requiredPattern?: string;
}
