//Importaciones externas.
import React, { useEffect, useState } from "react";

// Importaciones internas, componentes, hooks, contextos, estilos.
import HeaderNav from "../components/layouts/header-nav";
import { useAuth } from "../context/AuthContext";
import { getLeaderboard } from "../api/auth";
import { User } from "../types/user";
import "../styles/styles-Leaderboard.css";

// Definición de constantes, tipos e interfaces.

const Leaderboard: React.FC = () => {
  // Estados y referencias locales del componente.
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const { user } = useAuth() as { user: User };

  // Funciones y métodos del componente.
  useEffect(() => {
    async function fetchData() {
      const res = await getLeaderboard();
      setLeaderboardData(res.data);
    }
    fetchData();
  }, []);

  // Renderizado del componente.
  return (
    <div className="leaderboard-container">
      {/* Barra Superior */}
      <HeaderNav />

      {/* Contenido Principal */}
      <main className="leaderboard-main">
        <div className="top-leaderboard">
          {leaderboardData.slice(0, 3).map((user: any, index: number) => (
            <div
              key={index}
              className={`flex-1 max-w-[200px] text-center rounded-lg p-5 shadow-lg relative ${
                index === 0
                  ? "bg-[#FFD700]" // Oro
                  : index === 1
                  ? "bg-[#C0C0C0]" // Plata
                  : index === 2
                  ? "bg-[#CD7F32]" // Bronce
                  : "bg-slate-500"
              }`}
            >
              <h3>{user.username}</h3>
              <p>
                {user.experience} pts {index}
              </p>
              <div className="rank-circle">{index + 1}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-2 w-full"> 
          <div className="rest-leaderboard w-full">
            {leaderboardData.slice(4, 8).map((user: any, index: number) => (
              <div key={index} className="rest-user">
                <div className="rest-rank">{index + 4}</div>
                <div className="rest-name">{user.username}</div>
                <div className="rest-score">{user.experience} pts</div>
              </div>
            ))}
          </div>
          <div className="rest-leaderboard w-full">
            {leaderboardData.slice(7).map((user: any, index: number) => (
              <div key={index} className="rest-user">
                <div className="rest-rank">{index + 8}</div>
                <div className="rest-name">{user.username}</div>
                <div className="rest-score">{user.experience} pts</div>
              </div>
            ))}
          </div>
        </div>

        <footer className="user-score">
          Tu puntuación: <span>{user.experience}</span>
        </footer>
      </main>
    </div>
  );
};

export default Leaderboard;
