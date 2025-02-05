import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { useAuth } from "../context/AuthContext";
import { Register } from "../types/user";
import "../styles/styles.css";

const SignupScreen: React.FC = () => {
  const navigate = useNavigate(); 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Register>(); 

  const {signUp, isAuthenticated, errors: RegisterErrors } = useAuth(); // Función signUp del contexto de autenticación

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/character-selection");
      
    }
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    signUp(values);
  });




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
        <h2 className="signup-title">Crear cuenta</h2>
        {
          RegisterErrors.map((error, i) => (
            <div key={i} className="bg-red-500 p-2 rounded-md">
              <p className="text-white">{error}</p>
            </div>
          ))
        }
        <form className="form" onSubmit={onSubmit}>
          <label className="form-label">Nombre de usuario</label>
          <input
            className="form-input"
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            {...register("username", { required: true })}
          />
          {errors.username && (
            <p className="text-red-500">El nombre de usario es requerido</p>
          )}
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
            Crear cuenta
          </button>
        </form>

        {/* Ya tienes una cuenta */}
        <p className="form-footer">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="form-link">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupScreen;
