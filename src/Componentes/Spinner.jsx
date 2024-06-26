import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import "../Styles/Spinner.css"
const Spinner = ({ loading }) => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    setShowSpinner(loading);

    const timeOut = setTimeout(() => {
      setShowSpinner(false);
    }, 2000);

    return () => clearTimeout(timeOut);
  }, [loading]);

  if (!showSpinner) return null;

  return (
    <div className="spinner-container">
      <div className="spinner-overlay">
        <Oval
          height={80}
          width={80}
          color="#4fa94d"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    </div>
  );
};

export default Spinner;