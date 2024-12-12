import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles-Leaderboard.css"; // Archivo CSS específico
import logo from "../assets/logo.png";

const leaderboardData = [
  { rank: 2, name: "Usuario 2", score: 1000, color: "#C0C0C0" }, 
  { rank: 1, name: "Arthur", score: 1200, color: "#FFD700" }, // Oro
  { rank: 3, name: "Usuario prueba", score: 900, color: "#CD7F32" }, // Bronce
  { rank: 4, name: "Prueba usuario 2", score: 500 },
  { rank: 5, name: "Prueba usuario 4", score: 200 },
  { rank: 6, name: "Prueba usuario 3", score: 100 },
  { rank: 7, name: "Prueba usuario 6", score: 0 },
];

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="leaderboard-container">
      {/* Barra Superior */}
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <nav className="dashboard-nav">
          <button className="nav-link" onClick={() => navigate("/dashboard")}>
            Aventuras
          </button>
          <button className="nav-link" onClick={() => navigate("/store")}>
            Tienda
          </button>
          <button className="nav-link active" onClick={() => navigate("/leaderboard")}>
            Puntuaciones
          </button>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="leaderboard-main">
        <div className="top-leaderboard">
          {leaderboardData.slice(0, 3).map((user) => (
            <div key={user.rank} className="top-user" style={{ backgroundColor: user.color || "#F5DEB3" }}>
              <h3>{user.name}</h3>
              <p>{user.score.toLocaleString()} pts</p>
              <div className="rank-circle">{user.rank}</div>
            </div>
          ))}
        </div>

        <div className="rest-leaderboard">
          {leaderboardData.slice(3).map((user) => (
            <div key={user.rank} className="rest-user">
              <div className="rest-rank">{user.rank}</div>
              <div className="rest-name">{user.name}</div>
              <div className="rest-score">{user.score.toLocaleString()} pts</div>
            </div>
          ))}
        </div>

        <footer className="user-score">
          Tu puntuación: <span>1,200 pts</span>
        </footer>
      </main>
    </div>
  );
};

export default Leaderboard;
