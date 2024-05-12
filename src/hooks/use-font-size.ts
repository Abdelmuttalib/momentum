import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type FontSizeValue = 'default' | 'small' | 'large';

export type FontSize = {
  fontSize: FontSizeValue;
};

const fontSizeAtom = atomWithStorage<FontSize>('fontSize', {
  fontSize: 'default',
});

export function useFontSize() {
  return useAtom(fontSizeAtom);
}
