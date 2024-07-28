// import { Link } from "react-router-dom";
// import logoSN from "../assets/logosaludnet.png";
// import { useAuth } from "./UserContext";

// const NavBar = ({ showLinks = true }) => {
//   const { isLoggedIn, username, handleLogout } = useAuth();

//   const handleLogoutClick = () => {
//     handleLogout();
//   };

//   return (
//     <div className="nav-container">
//       <nav>
//         <div className="nav-logo">
//           <Link to="/">
//             <img id="logoSN" src={logoSN} alt="Logo" />
//           </Link>
//         </div>


//         <ul className="nav-links">
//           {showLinks && (
//             <>
//               {isLoggedIn ? (
//                 <>

//                  {/* <li id="NombreUser">
//                     {"Hola"} {username || "Nombre de usuario"}
//                   </li> */}


//                   <li>
//                      <Link to="/" onClick={handleLogoutClick}>
//                       Cerrar sesión
//                     </Link>
//                   </li>
                 
//                 </>
//               ) : (
//                 <li>
//                   <Link to="/login">Admin</Link>
//                 </li>
//               )}
//             </>
//           )}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default NavBar;

import { Link, useLocation } from "react-router-dom";
import logoSN from "../assets/logosaludnet.png";
import { useAuth } from "./UserContext";
import { removeToken } from "../Auth/tokenUtils";
import Swal from "sweetalert2";

const NavBar = ({ showLinks = true }) => {
  const { isLoggedIn, username, handleLogout } = useAuth();
  const location = useLocation();

  const handleLogoutClick = () => {
    handleLogout();
    removeToken();

    Swal.fire({
      imageUrl: logoSN,
      imageHeight: 250,
      imageWidth: 250,
      html: `<p>Usted <b>${username}</b> ha cerrado sesion.</p>`,
      timer: 3000,
    });
  };

  return (
    <div className="nav-container">
      <nav>
        <div className="nav-logo">
          {/* Condicionamos el enlace del logo */}
          {isLoggedIn ? (
            <Link to="/admin">
              <img id="logoSN" src={logoSN} alt="Logo" />
            </Link>
          ) : (
            <Link to="/">
              <img id="logoSN" src={logoSN} alt="Logo" />
            </Link>
          )}
        </div>

        <ul className="nav-links">
          {showLinks && (
            <>
              {isLoggedIn ? (
                <>
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

