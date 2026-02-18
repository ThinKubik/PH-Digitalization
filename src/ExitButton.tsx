import { useRef } from 'react';

const TAP_REQUIRED = 5;
const TAP_WINDOW_MS = 3000;

function exitApp() {
  if (typeof window !== 'undefined' && (window as any).require) {
    try {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('quit-app');
    } catch (e) {
      console.warn('[ExitButton] Could not send quit signal');
    }
  } else {
    console.log('[ExitButton] (dev mode) Would quit app');
  }
}

export default function ExitButton() {
  const tapsRef = useRef<number[]>([]);

  const handleTap = () => {
    const now = Date.now();
    // Discard taps older than the window
    tapsRef.current = tapsRef.current.filter((t) => now - t < TAP_WINDOW_MS);
    tapsRef.current.push(now);
    if (tapsRef.current.length >= TAP_REQUIRED) {
      tapsRef.current = [];
      exitApp();
    }
  };

  return (
    <div
      onClick={handleTap}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        // 300x300 CSS px → ~133 physical px at 0.444 zoom — big enough to tap reliably
        width: 300,
        height: 300,
        zIndex: 9999,
        opacity: 0,
        cursor: 'default',
      }}
    />
  );
}
