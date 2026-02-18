// UDP signaling utility — multicast to 239.255.0.1:51680

const UDP_MULTICAST_GROUP = '239.255.0.1';
const UDP_TARGET_PORT = 51680;

// Animation command sent for each category card
export const CATEGORY_UDP_CODES: Record<number, string> = {
  0: 'SBW_animation_01',
  1: 'SBW_animation_02',
  2: 'SBW_animation_03',
  3: 'SBW_animation_04',
};

/**
 * Send a UDP multicast packet with the animation command string.
 * In Electron (nodeIntegration: true), this uses Node.js `dgram`.
 * In a browser dev environment, it logs to console.
 */
export function sendUdpSignal(categoryId: number): void {
  const message = CATEGORY_UDP_CODES[categoryId] ?? `UNKNOWN_${categoryId}`;

  // Check if running in Electron (Node.js dgram available via nodeIntegration)
  if (typeof window !== 'undefined' && (window as any).require) {
    try {
      const dgram = (window as any).require('dgram');
      const client = dgram.createSocket('udp4');
      const buf = new TextEncoder().encode(message);
      client.setMulticastTTL(128);
      client.send(buf, 0, buf.length, UDP_TARGET_PORT, UDP_MULTICAST_GROUP, (err: Error | null) => {
        if (err) {
          console.error('[UDP] Send error:', err);
        } else {
          console.log(`[UDP] Sent "${message}" to ${UDP_MULTICAST_GROUP}:${UDP_TARGET_PORT}`);
        }
        client.close();
      });
    } catch (e) {
      console.warn('[UDP] dgram not available, logging instead:', message);
    }
  } else {
    // Browser fallback — just log
    console.log(`[UDP] (dev mode) Would send "${message}" to ${UDP_MULTICAST_GROUP}:${UDP_TARGET_PORT}`);
  }
}
