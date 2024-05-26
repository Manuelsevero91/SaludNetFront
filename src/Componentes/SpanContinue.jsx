import React from "react";
import { useRef } from "react"; 

function SpanContinue({ marketingRef }) {
  const scrollToMarketing = () => {
    if (marketingRef.current) {
      marketingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="span-continue-container"> 
      <div className="span-continue">
        <button button className="button-span-continue span-continue-button" onClick={scrollToMarketing}>Continuar</button>
      </div>
   
    </div>
  );
};
export default SpanContinue;