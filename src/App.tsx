import React from "react";
import Navbar from "./Navbar";
import MapSection from "./MapSection";
import CharacterSection from "./CharacterSection";

const App: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.navbarWrapper}>
        <Navbar />
      </div>
      <div style={styles.mainContent}>
        <MapSection />
        <CharacterSection />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    backgroundColor: "#2F4F4F", // Fondo principal
    padding: "20px", // Espaciado general
    boxSizing: "border-box",
  },
  navbarWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "15%",
  },
  mainContent: {
    display: "flex",
    flex: 1, // Rellena el espacio restante bajo el navbar
    gap: "20px", // Más separación entre el mapa y el personaje
  },
};

export default App;
