// theme
import palette from '../../theme/palette';
//
import { ThemeColorPresetsValue } from './types';

// ----------------------------------------------------------------------

const themePalette = palette('light');

export const presets = [
  // DEFAULT
  {
    name: 'default',
    ...themePalette.primary,
  },
  // CYAN
  {
    name: 'cyan',
    lighter: '#D4F9EE',
    light: '#9BD8D4',
    main: '#008D8C',
    dark: '#006261',
    darker: '#003932',
    contrastText: '#FFFFFF',
  },
  // PURPLE (BLACK)
  {
    name: 'purple',
    lighter: '#DEE7F8',
    light: '#94A1BB',
    main: '#506184',
    dark: '#354478',
    darker: '#1B2757',
    contrastText: '#FFFFFF',
  },
  // BLUE
  {
    name: 'blue',
    lighter: '#CCF4FE',
    light: '#68CDF9',
    main: '#078DEE',
    dark: '#0351AB',
    darker: '#012972',
    contrastText: '#FFFFFF',
  },
];

export const defaultPreset = presets[0];
export const cyanPreset = presets[1];
export const purplePreset = presets[2];
export const bluePreset = presets[3];

export const presetsOption = presets.map((color) => ({
  name: color.name,
  value: color.main,
}));

export function getPresets(key: ThemeColorPresetsValue) {
  return {
    default: defaultPreset,
    cyan: cyanPreset,
    purple: purplePreset,
    blue: bluePreset,
  }[key];
}
