import { useEffect, useRef } from 'react';

const CursorStalker = () => {
  const stalkerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateStalkerPosition = (e: MouseEvent) => {
      stalkerRef.current!.style.transform = `translate(${e.clientX - 5}px, ${
        e.clientY - 5
      }px)`;
    };

    const onMouseDown = (e: MouseEvent) => {
      stalkerRef.current!.style.backgroundColor = '#1c1917';
    };

    const onMouseUp = (e: MouseEvent) => {
      stalkerRef.current!.style.backgroundColor = '#fafaf9';
    };

    document.addEventListener('mousemove', updateStalkerPosition);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', updateStalkerPosition);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div
      style={{ transition: 'transform 0.1s linear' }}
      ref={stalkerRef}
      className="pointer-events-none fixed top-0 left-0 w-[10px] h-[10px]
      bg-stone-50 rounded-full z-50"
    />
  );
};

export default CursorStalker;
