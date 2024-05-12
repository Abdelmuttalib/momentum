import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type ThemeColorType =
  | 'default'
  | 'rose'
  | 'indigo'
  | 'emerald'
  | 'blue'
  | 'orange';

export type ThemeColor = {
  colorName: ThemeColorType;
};

const themeColorAtom = atomWithStorage<ThemeColor>('theme-color', {
  colorName: 'default',
});

export function useThemeColor() {
  return useAtom(themeColorAtom);
}
