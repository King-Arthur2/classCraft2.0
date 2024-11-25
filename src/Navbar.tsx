import React from "react";
import "./Navbar.css";


const Navbar: React.FC = () => {
  return (
    <div style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem} className="nav-item">Aventuras</li>
        <li style={styles.navItem} className="nav-item">Tienda</li>
        <li style={styles.navItem} className="nav-item">Competencia</li>
      </ul>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    width: "80%", // Más pequeño, ocupa el 80% del ancho
    height: "70%", // Ajustado al 70% del contenedor padre
    backgroundColor: "#8B4513", // Madera oscura
    borderRadius: "12px", // Bordes redondeados
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Sombra para elevar el diseño
    border: "2px solid #C1A14A", // Borde oro viejo
  },
  navList: {
    display: "flex",
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  navItem: {
    margin: "0 15px",
    fontSize: "16px",
    color: "#FAF9F6", // Blanco hueso para el texto
    cursor: "pointer",
    fontWeight: "bold",
    padding: "10px 20px", // Espaciado interno
    borderRadius: "8px", // Bordes redondeados para las secciones
    transition: "all 0.3s ease-in-out", // Suaviza el cambio de color
  },
};

export default Navbar;
