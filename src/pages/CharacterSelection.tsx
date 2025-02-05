//Importacion de libreaias externas
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Howl } from "howler";

// Importación de librerías internas y estilos
import { useAuth } from "../context/AuthContext";
import { getCharactersRequest, sendCharacterClassRequest } from "../api/auth";
import { User, CharacterName } from "../types/user";

import "../styles/CharacterSelection.css"; // Archivo de estilos


// Sonidos
import soundWizard from "../assets/sounds/mago-seleccion.wav";
import soundArcher from "../assets/sounds/arquero-seleccion.wav";
import soundKnight from "../assets/sounds/caballero-seleccion.wav";
import battleSong from "../assets/sounds/battle-song.mp3";

// Modal de confirmación de personaje. Se muestra al confirmar un personaje.
const Modal: React.FC<{ message: string; onClose: () => void }> = ({
  message,
  onClose,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-[#e0e5ec] rounded-xl w-2/5 h-3/6 box-shadow p-0">
      <div className="bg-[#2f4f4f] p-4 h-2/6 flex items-center justify-center">
        <i className="fa-solid fa-book-open text-white fa-fw text-7xl"></i>
      </div>
      <div className="text-center flex flex-col items-center justify-center gap-5 p-5 text-[#2f4f4f]">
        <h2 className="text-2xl font-bold">¡Felicidades!</h2>

        <p className="text-ld">{message}</p>
        <button
          className="text-base py-2 px-4 text-white bg-[#2f4f4f] hover:bg-white hover:text-[#2f4f4f]"
          onClick={onClose}
        >
          Continuar
        </button>
      </div>
    </div>
  </div>
);

// Componente principal
const CharacterSelection: React.FC = () => {
  // Hook de autenticación y navegación
  const {user, setUser} = useAuth() as {user: User, setUser: (user: User) => void};
  const navigate = useNavigate();

  // Estados para el personaje seleccionado y su clase. 
  const [selectedCharacter, setSelectedCharacter] = useState<string>("ninguno");
  const [characterClass, setCharacterClass] = useState<string>("");

  // Estado del modal
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  const [characters, setcharacters] = useState([]); // Estado para guardar los personajes

  // Mapa de sonidos por personaje
  const sounds: Record<CharacterName, Howl> = {
    "Mago oscuro": new Howl({ src: [soundWizard], volume: 5 }),
    "Arquero elfo": new Howl({ src: [soundArcher], volume: 5 }),
    "Caballero noble": new Howl({ src: [soundKnight], volume: 5 }),
  };

  // Sonido de batalla (separado del mapa)
  const soundBattle = new Howl({ src: [battleSong], volume: 0.5 });

  useEffect(() => {
    const fetchData = async () => {
      const charactersData = await getCharactersRequest();
      setcharacters(charactersData.data);
    };
    fetchData();
  }, []);
 
  // Función que maneja la selección de personaje
  const handleSelectCharacter = (name: CharacterName, characterClass: string) => {
    console.log();
    setSelectedCharacter(name);
    setCharacterClass(characterClass);

    const selectedSound = sounds[name]; // Buscar sonido en el mapa
    if (selectedSound) {
      selectedSound.play();

      // Agregar comportamiento específico para "Arquero elfo"
      if (name === "Arquero elfo") {
        setTimeout(() => {
          selectedSound.stop();
        }, 1000);
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    soundBattle.stop();
    navigate("/tutorial");
  };

  const handleStartAdventure = async (characterClass: string) => {
    try {
      // Envía la petición POST
      const response = await sendCharacterClassRequest(characterClass, user._id);
      setUser(response.data);
      // Reproduce el sonido de batalla
      soundBattle.play();
      setTimeout(() => {
        soundBattle.stop();
      }, 7600);
  
      // Muestra el modal con el mensaje
      setModalMessage(
        `Has seleccionado al ${selectedCharacter}. ¡Prepárate para la aventura!`
      );
      setModalVisible(true);
  
      // Aquí puedes redirigir o iniciar la lógica del juego
    } catch (error) {
      // Manejo de errores
      console.error("Error al enviar la petición:", error);
      alert("Hubo un problema al seleccionar el personaje. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-10 bg-[#f5deb3]  gap-3 overflow-x-auto">
      <h1 className="text-4xl text-[#2d4d4d] font-merriweather font-bold">
        Selecciona un personaje
      </h1>
      <div className="flex justify-between gap-5 w-screen max-w-6xl max-h-full p-5">
        {characters.map((character: any, id: number) => (
          <div
            key={id}
            className={` bg-white border-4 border-black rounded-xl text-center flex-1 transition-transform ease-in-out duration-200 cursor-pointer  ${
              selectedCharacter === character.name
                ? `selected ${character.name.replace(" ", "-").toLowerCase()}`
                : ""
            }`}
            onClick={() => handleSelectCharacter(character.name, character.key)}
          >
            <div className="bg-[#2f4f4f] p-0 rounde-xl text-white h-14 flex items-center justify-center">
              <h2 className="text-2xl font-bold  mb-3">{character.name}</h2>
            </div>

            <div
              className="flex items-center justify-center bg-blue-50"
              key={character.name}
            >
              <img
                className="max-w-52 max-h-44"
                src={character.image}
                alt={character.name}
              />
            </div>

            <p className="text-sm text-[#6b705c] p-4">
              {character.description}
            </p>
            <button className="px-2 py-2 bg-[#2f4f4f] text-white border-none rounded-ld">
              Seleccionar
            </button>
          </div>
        ))}
      </div>
      <button
        className={`${
          selectedCharacter === "ninguno" ? "cursor-none" : "cursor-pointer"
        } mt-6 px-4 p-5 bg-[#2f4f4f] text-white border-none rounded-xl cursor-pointer text-ls font-bold`}
        onClick={() => handleStartAdventure(characterClass)}
        disabled={selectedCharacter === "ninguno" ? true : false}
      >
        Empezar aventura
      </button>

      {/* Modal */}
      {modalVisible && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default CharacterSelection;
