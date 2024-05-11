import React from "react";
import { useRef } from "react"; // Asegúrate de importar useRef desde React

// Tu código de componente Home aquí

function SpanContinue() {
  const marketingRef = useRef(null);

  const scrollToMarketing = () => {
    document
      .getElementById("final-marketing")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="span-continue-container"> {/* Contenedor adicional */}
      <div className="span-continue">
        <button className="button-span-continue" onClick={scrollToMarketing}>Continuar</button>
      </div>
      <div ref={marketingRef}></div>
    </div>
  );
};
export default SpanContinue;