import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { sendUdpSignal } from './udp';

const CARDS = [
  { id: 0, label: 'Category 3, PLd Steer by Wire System', route: '/cat3-pld-sbw' },
  { id: 1, label: 'Category 2, PLd Steer by Wire System', route: '/cat2-pld-sbw' },
  { id: 2, label: 'Category B, Steer by Wire System', route: '/catb-sbw' },
  { id: 3, label: 'Category 3, PLd Brake By Wire System', route: '/cat3-pld-bbw' },
];

const IDLE_TIMEOUT = 30_000; // 30 seconds
const CYCLE_INTERVAL = 5_000; // 5 seconds per card

function cardLabelToJsx(label: string) {
  const parts = label.split(', ');
  return (
    <>
      {parts[0]},<br />
      {parts[1]}
    </>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const cycleTimer = useRef<ReturnType<typeof setInterval>>(null);
  const selectedCard = CARDS[selectedId];

  const resetIdleTimer = useCallback(() => {
    // User interacted — stop cycling and restart idle countdown
    if (isIdle) setIsIdle(false);
    if (cycleTimer.current) {
      clearInterval(cycleTimer.current);
      cycleTimer.current = null;
    }
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);
  }, [isIdle]);

  // Attach activity listeners
  useEffect(() => {
    const events = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));
    // Start initial idle countdown
    idleTimer.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (cycleTimer.current) clearInterval(cycleTimer.current);
    };
  }, [resetIdleTimer]);

  // Start cycling when idle
  useEffect(() => {
    if (!isIdle) return;
    // Immediately advance to next card
    setSelectedId((prev) => {
      const next = (prev + 1) % CARDS.length;
      sendUdpSignal(next);
      return next;
    });
    cycleTimer.current = setInterval(() => {
      setSelectedId((prev) => {
        const next = (prev + 1) % CARDS.length;
        sendUdpSignal(next);
        return next;
      });
    }, CYCLE_INTERVAL);
    return () => {
      if (cycleTimer.current) {
        clearInterval(cycleTimer.current);
        cycleTimer.current = null;
      }
    };
  }, [isIdle]);

  const handleCardClick = (id: number) => {
    setSelectedId(id);
    sendUdpSignal(id);
    resetIdleTimer();
  };

  return (
    <div className="sbw-container bg-white flex flex-col">
      {/* ===== HEADER ===== */}
      <div className="header bg-[#424242] flex flex-col w-full shrink-0">
        <p className="header-title">STEER-BY-WIRE</p>

        <div className="header-bottom flex items-end justify-between">
          <div className="flex flex-col">
            <p className="header-heading">Ready to learn more?</p>
            <p className="header-subtitle">
              See the products for the highlighted system: {selectedCard.label}
            </p>
          </div>

          <a
            className="header-button shrink-0 cursor-pointer flex items-center justify-center"
            onClick={() => navigate(selectedCard.route)}
          >
            <span className="header-button-text">View Products</span>
          </a>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-content flex-1 flex flex-col items-center justify-start bg-white">
        <div className="cards-row flex items-start justify-center">
          {CARDS.map((card) => {
            const isSelected = card.id === selectedId;
            return (
              <div key={card.id} className="flex flex-col items-center">
                <div
                  className={`card bg-[#424242] flex items-center justify-center cursor-pointer ${isSelected ? 'card-selected' : ''}`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <p className="card-text">{cardLabelToJsx(card.label)}</p>
                </div>
                <div
                  className={`connector-line ${isSelected ? 'connector-line-selected' : 'connector-line-default'}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
