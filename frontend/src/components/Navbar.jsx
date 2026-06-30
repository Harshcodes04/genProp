import { Link, useNavigate } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import "./navbar.scss";

const NavBar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">PrepWise</Link>
      </div>
      <div className="navbar__links">
        {user ? (
          <>
            <span className="navbar__user">{user.username}</span>
            <button className="navbar__logout" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link">
              Login
            </Link>
            <Link to="/register" className="navbar__link navbar__link--primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
