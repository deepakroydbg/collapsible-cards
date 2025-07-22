import React, { useEffect, useState } from "react";
import CollapsableCardStacker from "./CollapsableCardStacker";

const CollapsibleCard = () => {
      const [cardWidth, setCardWidth] = useState(320);

  useEffect(() => {
    const handleResize = () => {
      setCardWidth(window.innerWidth >= 768 ? 600 : 320);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const cardList = Array(5)
    .fill(null)
    .map((_, index) => (
      <div
        key={index}
        style={{
          backgroundColor: `hsl(${240 + index * 10}, 80%, 80%)`,
          borderRadius: "16px",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>Card {index}</h2>
      </div>
    ));

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CollapsableCardStacker
        cards={cardList}
        initialPageIndex={1}
        cardWidth={cardWidth}
        cardHeight={220}
        spaceBetweenItems={250}
        scrollDirection="vertical"
        onPageChanged={(index) => console.log("Current page:", index)}
      />
    </div>
  );
};

export default CollapsibleCard;
