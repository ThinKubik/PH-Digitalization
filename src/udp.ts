// UDP signaling utility
// Placeholder IP and port — update these when deploying as Electron app

const UDP_TARGET_IP = '192.168.1.100';
const UDP_TARGET_PORT = 5000;

// Custom code sent for each category card
export const CATEGORY_UDP_CODES: Record<number, string> = {
  0: 'CAT3_PLD_SBW',
  1: 'CAT2_PLD_SBW',
  2: 'CATB_SBW',
  3: 'CAT3_PLD_BBW',
};

/**
 * Send a UDP packet with the given payload.
 * In Electron, this will use Node.js `dgram`.
 * In a browser dev environment, it logs to console.
 */
export function sendUdpSignal(categoryId: number): void {
  const code = CATEGORY_UDP_CODES[categoryId] ?? `UNKNOWN_${categoryId}`;
  const message = JSON.stringify({ category: code, id: categoryId });

  // Check if running in Electron (Node.js available)
  if (typeof window !== 'undefined' && (window as any).require) {
    try {
      const dgram = (window as any).require('dgram');
      const client = dgram.createSocket('udp4');
      const buf = new TextEncoder().encode(message);
      client.send(buf, 0, buf.length, UDP_TARGET_PORT, UDP_TARGET_IP, (err: Error | null) => {
        if (err) {
          console.error('[UDP] Send error:', err);
        } else {
          console.log(`[UDP] Sent "${code}" to ${UDP_TARGET_IP}:${UDP_TARGET_PORT}`);
        }
        client.close();
      });
    } catch (e) {
      console.warn('[UDP] dgram not available, logging instead:', message);
    }
  } else {
    // Browser fallback — just log
    console.log(`[UDP] (dev mode) Would send to ${UDP_TARGET_IP}:${UDP_TARGET_PORT}:`, message);
  }
}
