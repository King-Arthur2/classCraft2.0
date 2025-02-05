//Importación de librerías externas
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

// Importación librerías internas y estilos 
import { useAuth } from "../context/AuthContext";
import { Login } from "../types/user";
import "../styles/styles.css";

const WelcomeScreen: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { singIn, isAuthenticated, errors: LoginErrors } = useAuth();

  const onSubmit = handleSubmit((data) => {
    singIn(data as Login);
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <div className="container">
      {/* Sección Izquierda */}
      <div className="left-section">
        <div className="logo">CLASS</div>
        <img
          src="https://res.cloudinary.com/dkaqcz1mp/image/upload/v1738275240/book_welcomePAGE.png"
          alt="Cabin in the woods"
          className="cabin-image"
        />
      </div>

      {/* Sección Derecha */}
      <div className="right-section">
        <h1 className="welcome-title">Bienvenido a Class</h1>
        <h2 className="login-title">Iniciar sesión</h2>
        {LoginErrors.map((error, i) => (
          <div key={i} className="bg-red-500 p-2 rounded-md">
            <p className="text-white">{error}</p>
          </div>
        ))}
        <form className="form" onSubmit={onSubmit}>
          <label className="form-label">Correo electrónico</label>
          <input
            className="form-input"
            type="email"
            placeholder="Ingresa tu correo electrónico"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500">El correo es requerido</p>
          )}
          <label className="form-label">Contraseña</label>
          <input
            className="form-input"
            type="password"
            placeholder="Crea una contraseña"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-red-500">La contraseña es requerido</p>
          )}
          <button type="submit" className="form-button">
            Iniciar Sesión
          </button>
        </form>
        <p className="form-footer">
          ¿No tienes una cuenta?{" "}
          <Link to="/signup" className="form-link">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
