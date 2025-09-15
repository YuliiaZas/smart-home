export const VALIDATION_LIMITS = {
  DASHBOARD_ID_MAX_LENGTH: 30,
  DASHBOARD_TITLE_MAX_LENGTH: 50,
  TAB_TITLE_MAX_LENGTH: 50,
  USERNAME_MIN_LENGTH: 2,
  FULL_NAME_MIN_LENGTH: 2,
  PATTERN: {
    ID: '^[a-zA-Z0-9-_]+$',
    PASSWORD: String.raw`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};'"\\|,.<>/?]).{4,}$`,
  },
} as const;

export const PATTERN_VALIDATION_MESSAGES = {
  ID: 'only letters, numbers, hyphens or underscores',
  PASSWORD: 'uppercase and lowercase letters, numbers, and special characters',
} as const;
