import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutRequest } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

const HeaderNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const logout = () => { 
    logoutRequest().then(() => {
      window.location.reload();
      navigate("/login");
    });
  }

  return (
    <header className="dashboard-header">
      <img
        src="https://res.cloudinary.com/dkaqcz1mp/image/upload/v1738681334/logo_rezfkn.png"
        alt="Logo"
        className="dashboard-logo"
      />
      <nav className="dashboard-nav flex items-center flex-row ">
        <button
          className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          Inicio
        </button>
        <button
          className={`nav-link ${location.pathname === "/store" ? "active" : ""}`}
          onClick={() => navigate("/store")}
        >
          Tiendita
        </button>
        <button
          className={`nav-link ${location.pathname === "/leaderboard" ? "active" : ""}`}
          onClick={() => navigate("/leaderboard")}
        >
          Puntuaciones
        </button>
        <i className="fa-solid fa-right-from-bracket text-3xl hover:text-red-500"
        onClick={logout}></i>
      </nav>
    </header>
  );
};

export default HeaderNav;
