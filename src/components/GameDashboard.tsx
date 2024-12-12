import React from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import "../styles/styles-GameDashboard.css";
import mapa1 from "../assets/mapa 1.webp";
import logo from "../assets/logo.png";
import avatar from "../assets/mago1.png"; 
import powerIcon from "../assets/corazon.png";

const GameDashboard: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegar

  const handleStartLevel = () => {
    navigate("/game-screen"); // Navegar al componente GameScreen
  };

  return (
    <div className="game-dashboard-container">
      {/* Barra Superior */}
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <nav className="dashboard-nav">
        <button className="nav-link active" onClick={() => navigate("/dasboard")}>
            Aventuras
          </button>
          <button className="nav-link" onClick={() => navigate("/store")}>
            Tienda
          </button>
          <button className="nav-link" onClick={() => navigate("/leaderboard")}>
            Puntuaciones
          </button>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="dashboard-main">
        {/* Sección del Mapa */}
        <section className="map-section">
          <div className="map-container">
            <img src={mapa1} alt="Mapa de aventura" className="map-image" />
            <button className="map-point point-yellow" style={{ top: "81%", left: "35%" }}>1</button>
            <button className="map-point point-gray" style={{ top: "34%", left: "10%" }}>2</button>
            <button className="map-point point-gray" style={{ top: "25%", left: "36%" }}>3</button>
            <button className="map-point point-gray" style={{ top: "33%", left: "48%" }}>4</button>
            <button className="map-point point-gray" style={{ top: "50%", left: "62%" }}>5</button>
            <button className="map-point point-gray" style={{ top: "33%", left: "85%" }}>6</button>
          </div>

          <section className="level-info">
            <div className="level-header">
              <div className="level-world">Mundo 1</div>
              <div className="level-number">Nivel 1</div>
              <div className="level-time">⏱️ 10 minutos</div>
            </div>
            <h3 className="level-title">Cuatro olas de calor en la península Antártica</h3>
            <p className="level-description">
            Desde enero a primeros de octubre, la península antártica ha sufrido cuatro olas de calor.
 La primera de ellas, en febrero pasado, como ya conté entonces, pero es que después ha
 habido otras tres olas más: una en el verano austral y dos más durante el invierno que
 ahora está terminando. La última, entre el 9 y el 11 de julio. Los datos, recogidos en la isla
Rey Jorge y analizados por los investigadores de la Universidad de Chile, revelan que
 está siendo el año más caluroso en esta zona del inmenso continente de hielo desde hace
 tres décadas y ello no augura nada bueno […].
 
            </p>
            {/* Botón para Comenzar Nivel */}
            <button className="start-level-button" onClick={handleStartLevel}>
              Comenzar Nivel
            </button>
          </section>
        </section>

        {/* Sección de Detalles del Jugador */}
        <aside className="player-details">
          <h3 className="player-name">Arthur</h3>
          <div className="player-avatar">
            <img src={avatar} alt="Avatar del personaje" className="avatar-image" />
          </div>
          <p className="character-name">Mago Oscuro</p>
          <div className="player-stats">
            <p><span className="stat-title">Vidas:</span> ❤️❤️❤️</p>
            <p><span className="stat-title">Oro:</span> 💰 200.00</p>
            <p><span className="stat-title">Nivel:</span> 10</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: "75%" }}></div>
            </div>
          </div>
          <div className="player-powers">
            <h3 className="powers-title">Poderes</h3>
            <ul className="powers-list">
              <li className="power-item">
                <img src={powerIcon} alt="Ícono de poder" className="power-icon" />
                <div>
                  <p className="power-title">Más vida</p>
                  <p className="power-description">Un poder que te otorga una vida extra</p>
                </div>
              </li>
              <li className="power-item">
                <img src={powerIcon} alt="Ícono de poder" className="power-icon" />
                <div>
                  <p className="power-title">Más vida</p>
                  <p className="power-description">Un poder que te otorga una vida extra</p>
                </div>
              </li>
              <li className="power-item">
                <img src={powerIcon} alt="Ícono de poder" className="power-icon" />
                <div>
                  <p className="power-title">Más vida</p>
                  <p className="power-description">Un poder que te otorga una vida extra</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default GameDashboard;
