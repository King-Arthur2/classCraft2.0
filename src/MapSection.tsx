import React from "react";
import mapImage from "./assets/mapa 1.webp"; // Reemplaza con tu imagen local
import mapImage2 from "./assets/mapa 2.webp"; // Reemplaza con tu imagen local

const MapSection: React.FC = () => {
  return (
    <div style={styles.mapContainer}>
      <img
        src={mapImage2} // Imagen del mapa
        alt="Mapa principal"
        style={styles.mapImage}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  mapContainer: {
    flex: 8, // Ocupa la mayor parte del espacio horizontal
    backgroundColor: "#2F4F4F", // Fondo principal (en caso de que no haya imagen)
    display: "flex",
    
    
    
    borderRadius: "8px",
    border: "2px solid #8B4513", // Borde madera oscura
    overflow: "hidden", // Asegura que no se desborde el contenido
  },
  mapImage: {
    width: "100%", // La imagen ocupa todo el ancho del contenedor
    height: "100%", // La imagen ocupa toda la altura del contenedor
    objectFit: "cover", // Asegura que la imagen se ajuste al contenedor sin distorsión
    borderRadius: "8px", // Coincide con los bordes del contenedor
  },
};

export default MapSection;
