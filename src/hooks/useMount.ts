import { EffectCallback, useEffect } from 'react';

export function useMount(f: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(f, []);
}
