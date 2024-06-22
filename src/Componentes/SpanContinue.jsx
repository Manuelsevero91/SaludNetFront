import React from "react";
import { useRef } from "react";

function SpanContinue({ marketingRef }) {
  const scrollToMarketing = () => {
    if (marketingRef.current) {
      marketingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button className="spanContinue" onClick={scrollToMarketing}>
      Continuar
    </button>
  );
}
export default SpanContinue;
