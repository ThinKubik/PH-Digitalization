import { useRef, useState, useCallback, useEffect } from 'react';
import './ProductPage.css';
import { sendUdpSignal } from './udp';
import ExitButton from './ExitButton';

interface Product {
  name: string;
  image: string;
  description: string;
}

interface ProductPageProps {
  categoryLabel: string;
  products: Product[];
}

const VISIBLE_COUNT = 5;
const CENTER = Math.floor(VISIBLE_COUNT / 2);
const BUFFER = 10;
const RENDER_COUNT = VISIBLE_COUNT + BUFFER * 2;
const CARD_WIDTH = 482;
const DRAG_THRESHOLD = 40;
const IDLE_TIMEOUT = 30_000; // 30 seconds
const CYCLE_INTERVAL = 5_000; // 5 seconds per product

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function ProductPage({ categoryLabel, products }: ProductPageProps) {
  const [centeredIndex, setCenteredIndex] = useState(0);
  const [animOffset, setAnimOffset] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const cycleTimer = useRef<ReturnType<typeof setInterval>>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightVisible, setHighlightVisible] = useState(true);

  // Drag state
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStarted = useRef(false);
  const draggedRef = useRef(false);  // true once movement exceeds threshold
  const dragXRef = useRef(0);        // always-current mirror of dragX state

  const resetIdleTimer = useCallback(() => {
    // User interacted  stop cycling and restart idle countdown
    setIsIdle(false);
    if (cycleTimer.current) {
      clearInterval(cycleTimer.current);
      cycleTimer.current = null;
    }
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT);
  }, []);

  const animateTo = useCallback((offset: number) => {
    if (offset === 0) return;
    setHighlightVisible(false);
    setIsAnimating(true);
    setAnimOffset(offset);
    resetIdleTimer();
  }, []);

  // Internal animate for cycling without resetting idle timer
  const animateToInternal = useCallback((offset: number) => {
    if (offset === 0) return;
    setHighlightVisible(false);
    setIsAnimating(true);
    setAnimOffset(offset);
  }, []);

  const handlePrev = () => {
    if (isAnimating) return;
    animateTo(-1);
  };

  const handleNext = () => {
    if (isAnimating) return;
    animateTo(1);
  };

  const handleSlotClick = (slot: number) => {
    const offset = slot - (CENTER + BUFFER);
    if (offset === 0 || isAnimating) return;
    animateTo(offset);
  };

  const handleTransitionEnd = () => {
    setCenteredIndex((prev) => {
      const newIndex = mod(prev + animOffset, products.length);
      // Send UDP signal for the new highlighted product
      sendUdpSignal(newIndex, products[newIndex].name);
      return newIndex;
    });
    setAnimOffset(0);
    setIsAnimating(false);
    setHighlightVisible(true);
  };

  // --- Drag/touch handlers ---
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAnimating) return;
    dragStartX.current = e.clientX;
    dragStarted.current = true;
    draggedRef.current = false;
    dragXRef.current = 0;
    setIsDragging(true);
    setDragX(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStarted.current) return;
    const dx = e.clientX - dragStartX.current;
    dragXRef.current = dx;
    if (Math.abs(dx) > DRAG_THRESHOLD) draggedRef.current = true;
    setDragX(dx);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStarted.current) return;
    dragStarted.current = false;
    setIsDragging(false);
    setDragX(0);

    if (draggedRef.current) {
      // It was a drag  snap to nearest card
      const cardsMoved = Math.round(-dragXRef.current / CARD_WIDTH);
      if (cardsMoved !== 0) {
        animateTo(cardsMoved);
      }
    } else {
      // It was a tap  determine which slot from pointer position
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const slotFromLeft = Math.floor(relX / CARD_WIDTH);
      const slot = BUFFER + slotFromLeft;
      handleSlotClick(slot);
    }
  };

  const handlePointerCancel = () => {
    dragStarted.current = false;
    draggedRef.current = false;
    dragXRef.current = 0;
    setIsDragging(false);
    setDragX(0);
  };

  // Send initial UDP signal for the default selected product on mount
  useEffect(() => {
    sendUdpSignal(0, products[0]?.name ?? 'Unknown Product');
  }, [products]);

  // Attach activity listeners and start idle countdown
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
    // Immediately advance to next product with animation
    animateToInternal(1);
    cycleTimer.current = setInterval(() => {
      animateToInternal(1);
    }, CYCLE_INTERVAL);
    return () => {
      if (cycleTimer.current) {
        clearInterval(cycleTimer.current);
        cycleTimer.current = null;
      }
    };
  }, [isIdle, animateToInternal]);

  // Render VISIBLE_COUNT + 2*BUFFER items
  const renderIndices = Array.from({ length: RENDER_COUNT }, (_, slot) =>
    mod(centeredIndex - (CENTER + BUFFER) + slot, products.length)
  );

  const selectedProduct = products[centeredIndex];

  const baseTranslate = -BUFFER * CARD_WIDTH;
  const slideTranslate = isAnimating ? -animOffset * CARD_WIDTH : 0;
  const translateX = baseTranslate + slideTranslate + (isDragging ? dragX : 0);

  return (
    <div className="product-container bg-white flex flex-col">
      <ExitButton />
      {/* ===== HEADER ===== */}
      <div className="product-header bg-[#424242] flex flex-col w-full shrink-0">
        <div className="flex items-start justify-between">
          <p className="product-header-title">{categoryLabel}</p>
        </div>

        <div className="product-header-content flex items-center w-full">
          <div className="flex flex-col">
            <p className="product-name">{selectedProduct.name}</p>
            <p className="product-description">{selectedProduct.description}</p>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="product-main flex-1 flex flex-col items-start justify-between w-full">
        {/* Slider row */}
        <div className="slider-container flex items-center">
          {/* Left arrow */}
          <div className="flex items-center justify-center shrink-0 h-full" style={{ paddingRight: '2.778rem' }}>
            <img
              src="./images/arrow.png"
              alt="Previous"
              className="slider-arrow"
              onClick={handlePrev}
            />
          </div>

          {/* Slider track */}
          <div
            className="slider-track"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            style={{ touchAction: 'none' }}
          >
            {/* Fixed highlight in center position */}
            <div
              className="slider-highlight-fixed"
              style={{ opacity: highlightVisible && !isDragging ? 1 : 0 }}
            />

            <div
              className="slider-inner"
              style={{
                transform: \	ranslateX(\px)\,
                transition: isAnimating ? 'transform 0.35s ease' : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {renderIndices.map((productIndex, slot) => {
                const product = products[productIndex];
                return (
                  <div
                    key={\\-\\}
                    className="product-card bg-white flex flex-col items-center justify-center"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-card-image"
                    />
                    <p className="product-card-label">{product.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right arrow */}
          <div className="flex items-center justify-center shrink-0 h-full" style={{ paddingLeft: '2.778rem' }}>
            <img
              src="./images/arrow.png"
              alt="Next"
              className="slider-arrow slider-arrow-right"
              onClick={handleNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
