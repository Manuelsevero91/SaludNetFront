import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import saludnetqr from "../assets/saludnetqr.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-icons">
        <a href="https://www.facebook.com/" className="social-icon">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a href="https://twitter.com/" className="social-icon">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a href="https://www.instagram.com/" className="social-icon">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
     
      </div>
      
      <img src={saludnetqr} alt="QR Salud Net" className="qr" />

      <p className="footer-text">© 2024 Salud Net. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;