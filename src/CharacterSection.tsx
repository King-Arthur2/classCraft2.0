import React from "react";
import avatar from "./assets/mago.png"; // Reemplazar con tu imagen local

const CharacterSection: React.FC = () => {
  return (
    <div style={styles.characterContainer}>
      <h2 style={styles.characterName}>Mago oscuro</h2>
      
      {/* Avatar */}
      <div style={styles.avatarContainer}>
        <img
          src={avatar} // Usa la imagen local
          alt="User Avatar"
          style={styles.avatarImage}
        />
      </div>

      

      {/* Detalles del personaje */}
      <div style={styles.characterDetails}>
        {/* Vidas */}
        <div style={styles.statSection}>
          <p style={styles.statTitle}>Vidas</p>
          <div style={styles.heartsContainer}>
            <span style={styles.heart}>❤️</span>
            <span style={styles.heart}>❤️</span>
            <span style={styles.heart}>❤️</span>
          </div>
        </div>

        {/* Experiencia */}
        <div style={styles.statSection}>
          <p style={styles.statTitle}>Experiencia</p>
          <p style={styles.statValue}>150/200 exp</p>
          <div style={styles.progressBarContainer}>
            <div style={styles.progressBarFill}></div>
          </div>
        </div>

        {/* Oro */}
        <div style={styles.statSection}>
          <p style={styles.statTitle}>
            Oro <span style={styles.goldIcon}>💰</span>
          </p>
          <p style={styles.statValue}>500</p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  characterContainer: {
    flex: 2, // Menor ancho que el mapa
    backgroundColor: "#F5DEB3", // Parchment beige
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // Centra el contenido verticalmente
    padding: "20px",
    borderRadius: "12px", // Bordes redondeados
    border: "2px solid #8B4513", // Borde madera oscura
    margin: "20px", // Más separación de los bordes
    height: "450px",
  },
  characterName: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#8B4513",
  },
  avatarContainer: {
    width: "100px", // Tamaño del círculo
    height: "100px",
    borderRadius: "50%", // Hace el contenedor circular
    border: "2px solid #8B4513", // Mismo color que el characterContainer
    overflow: "hidden", // Asegura que la imagen no sobresalga del contenedor
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px", // Espaciado entre el avatar y los detalles del personaje
    backgroundColor: "#F5DEB3", // Fondo igual al contenedor
  },
  avatarImage: {
    width: "100%", // Imagen ocupa todo el círculo
    height: "100%",
    objectFit: "cover", // La imagen se adapta para llenar el círculo sin distorsionarse
  },
  characterDetails: {
    width: "100%",
    textAlign: "left",
    padding: "10px",
  },
  statSection: {
    marginBottom: "15px", // Espaciado entre las secciones
  },
  statTitle: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#8B4513", // Madera oscura
    marginBottom: "5px",
  },
  statValue: {
    fontSize: "14px",
    color: "#2F4F4F", // Verde bosque profundo
  },
  heartsContainer: {
    display: "flex",
    gap: "6px", // Espaciado entre los corazones
  },
  heart: {
    fontSize: "20px",
    color: "#800020", // Rojo borgoña
  },
  progressBarContainer: {
    width: "100%",
    height: "10px",
    backgroundColor: "#696969", // Gris piedra
    borderRadius: "5px",
    overflow: "hidden",
    marginTop: "5px",
  },
  progressBarFill: {
    width: "75%", // Representa la experiencia actual (150/200)
    height: "100%",
    backgroundColor: "#4682B4", // Azul acero
  },
  goldIcon: {
    fontSize: "16px",
    color: "#C1A14A", // Oro viejo
  },
};

export default CharacterSection;
