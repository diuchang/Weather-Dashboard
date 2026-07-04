import { useCallback, useRef, useState } from 'react';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import MainPanel from './components/MainPanel';

const MIN_WIDTH = 240;
const MAX_WIDTH = 560;
const DEFAULT_WIDTH = 320;

export default function App() {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const draggingRef = useRef(false);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!draggingRef.current) return;
    const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX));
    setSidebarWidth(width);
  }, []);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  const handlePointerDown = useCallback(() => {
    draggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove, handlePointerUp]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-navy-900">
      <Header />
      <div className="flex flex-1 min-h-0">
        <div className="h-full flex-none" style={{ width: sidebarWidth }}>
          <LeftPanel />
        </div>
        <div
          onPointerDown={handlePointerDown}
          className="w-1.5 h-full flex-none cursor-col-resize bg-white/5 hover:bg-orange-500/40 active:bg-orange-500/60 transition-colors"
        />
        <MainPanel />
      </div>
    </div>
  );
}
