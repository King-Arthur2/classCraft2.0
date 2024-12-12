import React, { useState } from "react";
import "../styles/CharacterSelection.css"; // Archivo de estilos
import mago from "../assets/mago1.png";
import arquero from "../assets/arquero.png";
import caballero  from "../assets/caballero.png"
import { useNavigate} from "react-router-dom";

const characters = [
  {
    name: "Mago oscuro",
    description:
      "El mago oscuro, conocido como el 'Tejedor del Infinito', es un mago anciano de una orden perdida, cuyos miembros dedicaron sus días a estudiar las fuerzas primigenias que habitan entre las estrellas. Su sed de conocimiento lo llevó a un rito prohibido que lo ató a un fragmento del vacío, una dimensión de energía pura y caos.",
    image: mago, // Reemplazar con la ruta correcta
  },
  {
    name: "Arquero elfo",
    description:
      "El arquero es un elfo que camina en la línea entre lo mortal y lo divino, nacido bajo la luz de una luna azul en los bosques sagrados de Eldoria. Desde niño, su don innato y vista aguda lo marcaron como un prodigio entre los suyos. Entrenado por los centenarios guardianes del bosque, Lyrian perfeccionó su puntería hasta alcanzar la capacidad de acertar flechas en pleno vuelo.",
    image: arquero, // Reemplazar con la ruta correcta
  },
  {
    name: "Noble caballero",
    description:
      "Sir Aldric de Valemont nació en el seno de una de las casas nobles más antiguas del reino de Eldoria, conocida por su legado de honor y valentía. Desde joven, Aldric mostró una devoción inquebrantable por los ideales de justicia, compasión y deber. A los 16 años, lideró su primera batalla, defendiendo una aldea cercana de un ataque de bandidos, ganándose el título de caballero antes de lo habitual.",
    image: caballero, // Reemplazar con la ruta correcta
  },
];

const CharacterSelection: React.FC = () => {

  const navigate = useNavigate(); // Hook para manejar la navegación
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const handleSelectCharacter = (name: string) => {
    setSelectedCharacter(name);
  };

  const handleStartAdventure = () => {
    if (selectedCharacter) {
      alert(`¡Has seleccionado a ${selectedCharacter} para tu aventura!`);
      // Aquí podrías redirigir o comenzar la lógica de juego
      navigate("/tutorial");
    } else {
      alert("Por favor selecciona un personaje antes de comenzar la aventura.");
    }
  };

  return (
    <div className="character-selection-container">
      <h1 className="selection-title">Selecciona un personaje</h1>
      <div className="characters-container">
        {characters.map((character) => (
          <div
            key={character.name}
            className={`character-card ${
              selectedCharacter === character.name ? "selected" : ""
            }`}
            onClick={() => handleSelectCharacter(character.name)}
          >
            <img
              src={character.image}
              alt={character.name}
              className="character-image"
            />
            <h2 className="character-name">{character.name}</h2>
            <p className="character-description">{character.description}</p>
            <button className="select-button">Seleccionar</button>
          </div>
        ))}
      </div>
      <button className="start-button" onClick={handleStartAdventure}>
        Empezar aventura
      </button>
    </div>
  );
};

export default CharacterSelection;
