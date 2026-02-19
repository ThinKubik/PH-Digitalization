// UDP signaling utility — broadcast to PixLite MK3 at 169.254.255.255:51680
// Actual dgram work happens in the Electron main process (electron/main.cjs).
// The renderer sends an IPC message; in dev/browser mode we just log.

// Animation command sent for each category card
export const CATEGORY_UDP_CODES: Record<number, string> = {
  0: 'SBW_animation_01',
  1: 'SBW_animation_02',
  2: 'SBW_animation_03',
  3: 'SBW_animation_04',
};

/**
 * Send a UDP packet with the animation command string to the PixLite MK3.
 * In Electron the renderer forwards the request to the main process via IPC,
 * where Node.js `dgram` sends a broadcast UDP datagram with a CR terminator.
 * In a browser dev environment it just logs to console.
 */
export function sendUdpSignal(categoryId: number): void {
  const message = CATEGORY_UDP_CODES[categoryId] ?? `UNKNOWN_${categoryId}`;

  // Electron renderer — forward to main process via IPC
  if (typeof window !== 'undefined' && (window as any).require) {
    try {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('send-udp', message);
      console.log(`[UDP] IPC → main process: "${message}"`);
    } catch (e) {
      console.warn('[UDP] ipcRenderer not available, logging instead:', message);
    }
  } else {
    // Browser fallback — just log
    console.log(`[UDP] (dev mode) Would send "${message}" to 169.254.255.255:51680`);
  }
}
