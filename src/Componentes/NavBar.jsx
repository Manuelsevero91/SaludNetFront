import { Link } from "react-router-dom";
import logoSN from "../assets/logosaludnet.png";
import { useAuth } from "./UserContext";

function NavBar({ showButtons }) {
  const { isLoggedIn, username, handleLogout } = useAuth();

  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <>
      <div className="nav-container">
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">
                <img id="logoSN" src={logoSN} alt="Logo" />
              </Link>
            </li>
            {!showButtons && (
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            )}
            {showButtons && isLoggedIn ? (
              <>
                <Link to="/" onClick={handleLogoutClick}>
                  Cerrar sesión
                </Link>
                <li id="NombreUser">
                  {"Hola"} {username || "Nombre de usuario"}
                </li>
                <li></li>
              </>
            ) : (
              <li>
                <Link to="/login">Inicio</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default NavBar;