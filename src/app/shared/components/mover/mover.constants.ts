export enum MoverDirection {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum MoverButtonStyle {
  ARROWS = 'arrows',
  DEFAULT = 'default',
}

export const moverIcons = {
  [MoverButtonStyle.ARROWS]: {
    [MoverDirection.LEFT]: 'arrow_back',
    [MoverDirection.RIGHT]: 'arrow_forward',
  },
  [MoverButtonStyle.DEFAULT]: {
    [MoverDirection.LEFT]: 'remove',
    [MoverDirection.RIGHT]: 'add',
  },
};

export const moverLabels = {
  [MoverDirection.LEFT]: 'Backward',
  [MoverDirection.RIGHT]: 'Forward',
};
