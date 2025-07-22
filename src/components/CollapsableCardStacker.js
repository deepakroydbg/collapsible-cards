import React, { useState, useEffect, useRef } from "react";

const CollapsableCardStacker = ({
  cards,
  initialPageIndex = 0,
  cardWidth = 300,
  cardHeight = 300,
  initialOffset = 40,
  spaceBetweenItems = 400,
  scrollDirection = "vertical",
  onPageChanged,
  animationDuration = 600,
}) => {
  const [pageValue, setPageValue] = useState(initialPageIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);
  const scrollDebounceRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      animateToPage(initialPageIndex);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  const animateToPage = (targetPage) => {
    const start = pageValue;
    const change = targetPage - start;
    const startTime = performance.now();
    setIsAnimating(true);

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const easedProgress = easeInOut(progress);
      const newValue = start + change * easedProgress;

      setPageValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsAnimating(false);
        if (onPageChanged) onPageChanged(Math.round(newValue));
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleWheel = (e) => {
    console.log("Wheel event:", e);
    if (isAnimating || scrollDebounceRef.current) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    const currentPage = Math.round(pageValue);
    const targetPage = Math.max(0, Math.min(currentPage + direction, cards.length - 1));

    if (targetPage !== currentPage) {
      animateToPage(targetPage);
      scrollDebounceRef.current = setTimeout(() => {
        scrollDebounceRef.current = null;
      }, 2000);
    }
  };

  const handleTouchStart = (e) => {
    if (isAnimating) return;
    const touch = e.touches[0];
    const startY = touch.clientY;
    const startX = touch.clientX;
    const startPage = pageValue;

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const delta = scrollDirection === "vertical" ? touch.clientY - startY : touch.clientX - startX;
      const newValue = startPage - delta * 0.01;
      setPageValue(Math.max(0, Math.min(newValue, cards.length - 1)));
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      animateToPage(Math.round(pageValue));
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      className="stack-container"
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        touchAction: scrollDirection === "vertical" ? "pan-y" : "pan-x",
      }}
    >
      {cards.map((card, index) => {
        let positionOffset = -initialOffset;
        if (pageValue < index) {
          positionOffset += (pageValue - index) * spaceBetweenItems;
        }

        const top = scrollDirection === "vertical" ? `${-positionOffset}px` : "50%";
        const left = scrollDirection === "horizontal" ? `${-positionOffset}px` : "50%";
        const transform = scrollDirection === "vertical" ? "translate(-50%, 0)" : "translate(0, -50%)";

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top,
              left,
              transform,
              width: cardWidth,
              height: cardHeight,
              transformOrigin: "center",
              transition: isAnimating ? "none" : "top 0.2s ease-out, left 0.2s ease-out",
            }}
          >
            {card}
          </div>
        );
      })}
    </div>
  );
};

export default CollapsableCardStacker;
