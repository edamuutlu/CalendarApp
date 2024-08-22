import { RefObject, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const useOgeGenislik = (ref: RefObject<Element>) => {
  const [ogeGenislik, setOgeGenislik] = useState<number>(50);

  const debGenislikSet = useDebouncedCallback(
    (genislik: number) => {
      setOgeGenislik(genislik);
    },
    100,
    {
      trailing: true,
      maxWait: 999999,
    },
  );
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        debGenislikSet(entry.contentRect.width);
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref]);

  return ogeGenislik;
};
