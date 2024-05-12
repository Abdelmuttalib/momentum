import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type FontName = 'General Sans' | 'Inter' | 'Plus Jakarta' | 'Onest';
export type FontValue = 'general-sans' | 'inter' | 'plus-jakarta' | 'onest';

export type Font = {
  font: FontValue;
};

const fontAtom = atomWithStorage<Font>('font', {
  font: 'general-sans',
});

export function useFont() {
  return useAtom(fontAtom);
}
