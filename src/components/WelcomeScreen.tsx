import React from "react";
import LoginForm from "./LoginForm";
import "../styles/styles.css";
import cabaña from "../assets/cabaña.png"; 

const WelcomeScreen: React.FC = () => {
  return (
    <div className="container">
      {/* Sección Izquierda */}
      <div className="left-section">
        <div className="logo">CLASSCRAFT</div>
        <img
          src={cabaña} // Cambia la ruta según donde guardes la imagen
          alt="Cabin in the woods"
          className="cabin-image"
        />
      </div>

      {/* Sección Derecha */}
      <div className="right-section">
        <h1 className="welcome-title">Bienvenido a Classcraft</h1>
        <h2 className="login-title">Iniciar sesión</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default WelcomeScreen;
