import { Entity } from '@shared/models';

export const ERROR_MESSAGES = {
  emptyHomeData: {
    [Entity.DASHBOARD]: 'You don’t have any dashboards yet.',
    [Entity.TAB]: 'You don’t have any tabs in this dashboard.',
    [Entity.CARD]: 'You don’t have any cards in this tab.',
    create: 'They’ll appear here as soon as you create them.',
  },
  formValidation: {
    required: 'This field is required',
    minlength: (minLength: number) => `Minimum length is ${minLength}`,
    maxlength: (maxLength: number) => `Maximum length is ${maxLength}`,
    notUnique: (uniqueArea?: string) => 'This value must be unique' + (uniqueArea ? ` within ${uniqueArea}` : ''),
    invalidCredentials: 'Invalid username or password',
    defaultError: 'Invalid value',
  },
  notFound: {
    title: '404 - Page Not Found',
    description: 'Sorry, the page you are looking for does not exist.',
    homeLink: 'Return to Home Page',
  },
  defaultError: 'Something went wrong. Please try again later.',
};

export const UNIQUE_AREA: Partial<Record<Entity, string>> = {
  [Entity.DASHBOARD]: 'your dashboards IDs',
  [Entity.TAB]: 'dashboard tabs',
};
