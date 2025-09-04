import { Entity } from '@shared/models';
import { ENTITY_MESSAGES } from './entity-messages';

export const EDIT_MESSAGES = {
  unsavedChanges: 'Confirm discarding unsaved changes',
  unsavedChangesMessage: 'You have unsaved changes. Do you want to discard them and leave the page?',
  editEntity: (entity: Entity, name?: string) => `Edit ${ENTITY_MESSAGES[entity]}${name ? ` "${name}"` : ''}`,
  renameEntity: (entity: Entity, name?: string) => `Rename ${ENTITY_MESSAGES[entity]}${name ? ` "${name}"` : ''}`,
  deleteEntity: (entity: Entity, name?: string) => `Delete ${ENTITY_MESSAGES[entity]}${name ? ` "${name}"` : ''}`,
  createEntity: (entity: Entity) => `Create New ${ENTITY_MESSAGES[entity]}`,
  applyButton: 'Apply',
  saveButton: 'Save',
  deleteButton: 'Delete',
  cancelButton: 'Cancel',
  discardButton: 'Discard',
  deleteConfirmation: (entity: Entity, name?: string) => ({
    title: `${ENTITY_MESSAGES[entity]} Delete Confirmation`,
    message: `Are you sure you want to delete ${ENTITY_MESSAGES[entity].toLowerCase()}${name ? ` "${name}"` : ''}? \n${DELETE_WARNING[entity]}`,
  }),
  label: {
    id: (entity: Entity) => `${ENTITY_MESSAGES[entity]} ID`,
    title: (entity: Entity) => `${ENTITY_MESSAGES[entity]} Title`,
    icon: (entity: Entity) => `${ENTITY_MESSAGES[entity]} Icon`,
    layout: 'Card Layout',
    items: 'Devices and sensors',
  },
  hint: {
    icon: 'Full list of supported icons: <a href="https://fonts.google.com/icons?icon.set=Material+Icons" target="_blank" rel="noopener noreferrer">Material Icons</a>',
    layout: 'Card layout could not be changed in the future',
  },
};

const DELETE_WARNING = {
  [Entity.DASHBOARD]: 'This action will be made immediately. \nAll associated tabs and cards will be deleted.',
  [Entity.TAB]:
    'Tab will be deleted on saving changes to the current dashboard. \nAll associated cards will be deleted.',
  [Entity.CARD]: 'Card will be deleted on saving changes to the current dashboard.',
};
