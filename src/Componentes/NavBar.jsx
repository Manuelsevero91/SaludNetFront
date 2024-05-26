import { Link } from "react-router-dom";
import logoSN from "../assets/logosaludnet.png";
import { useAuth } from "./UserContext";

const NavBar = ({ showLinks = true }) => {
  const { isLoggedIn, username, handleLogout } = useAuth();

  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <div className="nav-container">
      <nav>
        <div className="nav-logo">
          <Link to="/">
            <img id="logoSN" src={logoSN} alt="Logo" />
          </Link>
        </div>


        <ul className="nav-links">
          {showLinks && (
            <>
              {isLoggedIn ? (
                <>
                 <li id="NombreUser">
                    {"Hola"} {username || "Nombre de usuario"}
                  </li>
                  <li>
                     <Link to="/" onClick={handleLogoutClick}>
                      Cerrar sesión
                    </Link>
                  </li>
                 
                </>
              ) : (
                <li>
                  <Link to="/login">Admin</Link>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
