import React from "react";
import "../styles/styles.css";
import cabaña from "../assets/cabaña.png"; 
import { useNavigate} from "react-router-dom";

const SignupScreen: React.FC = () => {

  const navigate = useNavigate(); // Hook para manejar la navegación

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    navigate("/character-selection"); // Redirige al componente GameDashboard
  };

  return (
    
    <div className="container">
      {/* Sección Izquierda */}
      <div className="left-section">
        <div className="logo">CLASSCRAFT</div>
        <img
          src={cabaña} // Cambia esta ruta según donde almacenes tu imagen
          alt="Cabin in the woods"
          className="cabin-image"
        />
      </div>

      {/* Sección Derecha */}
      <div className="right-section">
        <h1 className="welcome-title">Bienvenido a Classcraft</h1>
        <h2 className="signup-title">Crear cuenta</h2>
        <form className="form" onSubmit={handleLogin}>
          {/* Correo Electrónico */}
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            className="form-input"
          />

          {/* Nombre de Usuario */}
          <label htmlFor="username" className="form-label">
            Nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            placeholder="Tu nombre de usuario"
            className="form-input"
          />

          {/* Contraseña */}
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            className="form-input"
          />

          {/* Confirmar Contraseña */}
          <label htmlFor="confirm-password" className="form-label">
            Repite tu contraseña
          </label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Vuelve a ingresar tu contraseña"
            className="form-input"
          />

          {/* Botón de Crear Cuenta */}
          <button type="submit" className="form-button">
            Crear Cuenta
          </button>

          {/* Ya tienes una cuenta */}
          <p className="form-footer">
            ¿Ya tienes una cuenta?{" "}
            <a href="/" className="form-link">
              Iniciar Sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupScreen;
