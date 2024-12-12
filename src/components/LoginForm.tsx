import React from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginForm: React.FC = () => {
  const navigate = useNavigate(); // Hook para manejar la navegación

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    navigate("/dashboard"); // Redirige al componente GameDashboard
  };

  return (
    <form className="form" onSubmit={handleLogin}>
      <label htmlFor="email" className="form-label">
        Correo electrónico
      </label>
      <input
        type="email"
        id="email"
        placeholder="Ingresa tu correo"
        className="form-input"
      />

      <label htmlFor="password" className="form-label">
        Contraseña
      </label>
      <input
        type="password"
        id="password"
        placeholder="Ingresa tu contraseña"
        className="form-input"
      />

      <label htmlFor="confirm-password" className="form-label">
        Repite tu contraseña
      </label>
      <input
        type="password"
        id="confirm-password"
        placeholder="Vuelve a ingresar tu contraseña"
        className="form-input"
      />

      <button type="submit" className="form-button">
        Iniciar Sesión
      </button>

      <p className="form-footer">
        ¿No tienes una cuenta?{" "}
        <Link to="/signup" className="form-link">
          Crear cuenta
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
