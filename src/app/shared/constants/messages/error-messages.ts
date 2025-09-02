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
    notUnique: (entity?: Entity) => {
      const uniqueArea = entity ? UNIQUE_AREA[entity] || '' : '';
      return 'This value must be unique' + (uniqueArea ? ` within ${uniqueArea}` : '');
    },
    invalidCredentials: 'Invalid username or password',
    defaultError: 'Invalid value',
  },
  notFound: {
    title: '404 - Page Not Found',
    description: 'Sorry, the page you are looking for does not exist.',
    homeLink: 'Return to Home Page',
  },
  defaultError: 'Something went wrong. Please try again later.',
  unauthorized: 'You are not logged in or your session has expired. Please log in to continue',
};

const UNIQUE_AREA: Partial<Record<Entity, string>> = {
  [Entity.DASHBOARD]: 'your dashboards IDs',
  [Entity.TAB]: 'dashboard tabs',
};
