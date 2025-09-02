import { Entity } from '@shared/models';

export const NOTIFICATION_MESSAGES = {
  message: {
    redirect: (entity: Entity) => {
      const area = entity ? AREA[entity] || DEFAULT_AREA : DEFAULT_AREA;
      return `You were redirected to the first available ${area}`;
    },
    unauthorized: 'You are not logged in or your session has expired. Please log in to continue',
  },
  actionButtonText: 'Ok',
  duration: 5000,
};

const AREA: Partial<Record<Entity, string>> = {
  [Entity.DASHBOARD]: 'dashboard',
  [Entity.TAB]: 'tab for the dashboard',
};

const DEFAULT_AREA = 'item';
