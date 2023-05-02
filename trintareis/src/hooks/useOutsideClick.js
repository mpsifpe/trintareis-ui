import { useEffect } from 'react';

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handler = (event) => {
      const elementRef = ref.current;

      if (!elementRef || elementRef.contains(event.target)) {
        return;
      }

      if (callback) callback();
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [ref, callback]);
};

export default useOutsideClick;