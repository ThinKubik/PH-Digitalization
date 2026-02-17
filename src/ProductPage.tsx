import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductPage.css';

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

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function ProductPage({ categoryLabel, products }: ProductPageProps) {
  const navigate = useNavigate();
  const [centeredIndex, setCenteredIndex] = useState(0);
  const [animOffset, setAnimOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightVisible, setHighlightVisible] = useState(true);

  // Drag state
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStarted = useRef(false);

  const animateTo = useCallback((offset: number) => {
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
    setCenteredIndex((prev) => mod(prev + animOffset, products.length));
    setAnimOffset(0);
    setIsAnimating(false);
    setHighlightVisible(true);
  };

  // --- Drag/touch handlers ---
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAnimating) return;
    dragStartX.current = e.clientX;
    dragStarted.current = true;
    setIsDragging(true);
    setDragX(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStarted.current) return;
    const dx = e.clientX - dragStartX.current;
    setDragX(dx);
  };

  const handlePointerUp = () => {
    if (!dragStarted.current) return;
    dragStarted.current = false;
    setIsDragging(false);

    const cardsMoved = Math.round(-dragX / CARD_WIDTH);
    setDragX(0);

    if (cardsMoved !== 0) {
      animateTo(cardsMoved);
    }
  };

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
      {/* ===== HEADER ===== */}
      <div className="product-header bg-[#424242] flex flex-col w-full shrink-0">
        <div className="flex items-start justify-between">
          <a
            className="select-system-button"
            onClick={() => navigate('/')}
          >
            <span className="select-system-button-text">Select New System</span>
          </a>
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
          <div className="flex items-center justify-center shrink-0 h-full" style={{ paddingRight: 50 }}>
            <img
              src="/images/arrow.png"
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
            onPointerCancel={handlePointerUp}
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
                transform: `translateX(${translateX}px)`,
                transition: isAnimating ? 'transform 0.35s ease' : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {renderIndices.map((productIndex, slot) => {
                const product = products[productIndex];
                return (
                  <div
                    key={`${centeredIndex}-${slot}`}
                    className="product-card bg-white flex flex-col items-center justify-center"
                    onClick={() => {
                      if (Math.abs(dragX) < DRAG_THRESHOLD) handleSlotClick(slot);
                    }}
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
          <div className="flex items-center justify-center shrink-0 h-full" style={{ paddingLeft: 50 }}>
            <img
              src="/images/arrow.png"
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
