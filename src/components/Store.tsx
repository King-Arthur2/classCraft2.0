import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles-Store.css";
import logo from "../assets/logo.png";
import mago from "../assets/mago1.png";
import arquero from "../assets/arquero.png";
import caballero from "../assets/caballero.png"
import corazon from "../assets/corazon.png"

const items = [
  { id: 1, name: "Túnica Morada", price: 300, image: mago},
  { id: 2, name: "Capa Verde", price: 300, image: arquero },
  { id: 3, name: "Armadura Gris", price: 300, image: caballero },
  { id: 4, name: "Capa Morada", price: 300, image: arquero },
  { id: 5, name: "Armadura Azul", price: 300, image: caballero },
  { id: 6, name: "Túnica Azul", price: 300, image: mago },
  { id: 7, name: "Capa Roja", price: 300, image: arquero },
  { id: 8, name: "Armadura Negra", price: 300, image: caballero },
  { id: 9, name: "Túnica Azul", price: 300, image: mago },
  { id: 10, name: "Capa Roja", price: 300, image: arquero },
  { id: 11, name: "Armadura Negra", price: 300, image: caballero },
];

const itemsPowers = [
  { id: 1, name: "Una vida más", price: 200, image: {corazon} },
  { id: 2, name: "Una vida más", price: 200, image: {corazon} },
  { id: 3, name: "Una vida más", price: 200, image: {corazon} },
  { id: 4, name: "Una vida más", price: 200, image: {corazon} },
  { id: 5, name: "Una vida más", price: 200, image: {corazon} },
];

const Store: React.FC = () => {
  const [activeTab, setActiveTab] = useState("personalize");
  const navigate = useNavigate();

  return (
    <div className="store-container">
      {/* Barra Superior */}
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <nav className="dashboard-nav">
          <button className="nav-link" onClick={() => navigate("/dashboard")}>
            Aventuras
          </button>
          <button className="nav-link active" onClick={() => navigate("/store")}>
            Tienda
          </button>
          <button className="nav-link" onClick={() => navigate("/leaderboard")}>
            Puntuaciones
          </button>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="store-main">
        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === "personalize" ? "active" : ""}`}
            onClick={() => setActiveTab("personalize")}
          >
            Personaliza tu personaje
          </button>
          <button
            className={`tab ${activeTab === "powers" ? "active" : ""}`}
            onClick={() => setActiveTab("powers")}
          >
            Poderes
          </button>
        </div>

        {/* Contenido según Tab Activo */}
        {activeTab === "personalize" && (
          <section className="store-section">
            <h2>Personaliza tu personaje</h2>
            <p className="player-coins">
              💰 Tus monedas: <span>200.00</span>
            </p>
            <div className="store-items">
              {items.map((item) => (
                <div key={item.id} className="item-card">
                  <div className="container-image-store">
                    <img src={item.image} alt={item.name} className="item-image" />
                  </div>
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">💰 {item.price}.00</p>
                  <button className="buy-button">Comprar</button>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeTab === "powers" && (
          <section className="store-section">
            <h2>Poderes</h2>
            <p className="player-coins">
              💰 Tus monedas: <span>200.00</span>
            </p>
            <div className="store-items">
              {itemsPowers.map((item) => (
                <div key={item.id} className="item-card">
                  <div className="container-image-store">
                    <img src={corazon} alt={item.name} className="item-image" />
                  </div>
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">💰 {item.price}.00</p>
                  <button className="buy-button">Comprar</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Store;
