import { useEffect, useRef } from 'react';

const CursorStalker = () => {
  const stalkerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateStalkerPosition = (e: MouseEvent) => {
      stalkerRef.current!.style.transform = `translate(${e.clientX - 5}px, ${
        e.clientY - 5
      }px)`;

      if (stalkerRef.current!.style.display === 'none') {
        stalkerRef.current!.style.display = 'block';
      }
    };

    const onMouseDown = () => {
      stalkerRef.current!.style.backgroundColor = 'transparent';
    };

    const onMouseUp = () => {
      stalkerRef.current!.style.backgroundColor = '#fafaf9';
    };

    const onMouseLeave = () => {
      stalkerRef.current!.style.display = 'none';
    };

    document.addEventListener('mousemove', updateStalkerPosition);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updateStalkerPosition);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      style={{ transition: 'transform 0.1s linear', display: 'none' }}
      ref={stalkerRef}
      className="pointer-events-none fixed top-0 left-0 w-[10px] h-[10px]
      bg-purple-200 rounded-full"
    />
  );
};

export default CursorStalker;
