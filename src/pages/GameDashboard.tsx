// Importar librearías externas
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importar librerías internas y estilos
import ModalTutorialMainPage from "../components/layouts/ModalTutorialMainPage.tsx";
import HeaderNav from "../components/layouts/header-nav.tsx";
import { evaluacionModal } from "../utils/modals.ts";
import { useAuth } from "../context/AuthContext";
import {
  getAvatar,
  getPowersUser,
  getAvatarComprados,
  updateAvatar,
} from "../api/auth";
import { calculateExperienceForLevel } from "../utils/functions.ts";
import { User } from "../types/user";
import "../styles/styles-GameDashboard.css";

// Importar imágenes
import soundOpenLevel from "../assets/sounds/page-flip.mp3";
import soundMusic from "../assets/sounds/musica.mp3";

type modalLevelProps = {
  isOpen: boolean;
  data?: {
    mundo: number;
    nivel: number;
    tiempo: string;
    titulo: string;
    objetivos: string[];
    contenido: string[];
  };
  onClose: () => void;
  handleStartLevel: (nivel: number) => void;
};

const ModalLevel: React.FC<modalLevelProps> = ({
  isOpen,
  data,
  onClose,
  handleStartLevel,
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-5 text-cent  max-h-96 min-w-96 w-6/12 border-[#eaf4f4] shadow-pixel">
        <section className="bg-[#F5DEB3] px-3 py-4 rounded-xl flex-shrink-0 h-auto gap-4 flex flex-col max-h-72  overflow-y-auto">
          <div className="flex justify-between items-center font-bold text-[#343a40] text-xl">
            <div className="">Mundo {data.mundo}</div>
            <div className="">Nivel {data.nivel}</div>
            <div className="">⏱️ {data.tiempo}</div>
          </div>
          <h3 className="text-black">{data.titulo}</h3>
          <ul className="text-sm">
            <li>
              <b className="text-black">Objetivos:</b>
              <ul className="pl-5 flex flex-col gap-2">
                {data.objetivos.map((objetivo, i) => (
                  <li key={i} className="objective-item text-black">
                    {`• ${objetivo}`}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <ul className="text-sm">
            <li>
              <b className="text-black">Contenido:</b>
              <ul className="pl-5 flex flex-col gap-2">
                {data.contenido.map((contenido, i) => (
                  <li key={i} className="objective-item text-black">
                    {`${i + 1}  ${contenido}`}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <div className="flex flex-row items-center justify-center">
            <button
              className="start-level-button"
              onClick={() => handleStartLevel(data.nivel)}
            >
              Comenzar Nivel
            </button>
            <button className="start-level-button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const GameDashboard: React.FC = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const musicaRef = useRef<Howl | null>(null);

  if (!musicaRef.current) {
    musicaRef.current = new Howl({
      src: [soundMusic],
      volume: 0.4,
      loop: true,
    });
  }

  const soundOpen = new Howl({ src: [soundOpenLevel], volume: 0.5 });

  //Información de los mapas
  const maps = [
    {
      src: "https://res.cloudinary.com/dkaqcz1mp/image/upload/v1738680669/mapa1_sda6z3.webp",
      titulo: "Mundo 1",
      points: [
        { top: "86%", left: "35%", label: 1, className: "point-yellow" },
        { top: "36%", left: "10%", label: 2, className: "point-gray" },
        { top: "27%", left: "35%", label: 3, className: "point-gray" },
        { top: "34%", left: "48%", label: 4, className: "point-gray" },
        { top: "53%", left: "62%", label: 5, className: "point-gray" },
        { top: "35%", left: "87%", label: 6, className: "point-yellow" },
      ],
    },
    {
      src: "https://res.cloudinary.com/dkaqcz1mp/image/upload/v1738680681/mapa2_v8kzfh.png",
      titulo: "Mundo 2",
      points: [
        { top: "23%", left: "19%", label: 7, className: "point-yellow" },
        { top: "22%", left: "38%", label: 8, className: "point-gray" },
        { top: "36%", left: "75%", label: 9, className: "point-gray" },
        { top: "60%", left: "55%", label: 10, className: "point-gray" },
        { top: "80%", left: "34%", label: 11, className: "point-gray" },
        { top: "62%", left: "90%", label: 12, className: "point-yellow" },
      ],
    },
    {
      src: "https://res.cloudinary.com/dkaqcz1mp/image/upload/v1738680680/mapa3_qpoine.png",
      titulo: "Mundo 3",
      points: [
        { top: "53%", left: "8%", label: 13, className: "point-yellow" },
        { top: "91%", left: "40%", label: 14, className: "point-gray" },
        { top: "65%", left: "63%", label: 15, className: "point-gray" },
        { top: "39%", left: "53%", label: 16, className: "point-gray" },
        { top: "15%", left: "72%", label: 17, className: "point-gray" },
        { top: "39%", left: "85%", label: 18, className: "point-yellow" },
      ],
    },
    {
      src: "https://res.cloudinary.com/dkaqcz1mp/image/upload/v1738680680/mapa4_jhxdaz.png",
      titulo: "Nivel Final",
      points: [
        { top: "80%", left: "35%", label: 19, className: "point-yellow" },
        { top: "80%", left: "62%", label: 20, className: "point-yellow" },
      ],
    },
  ];

  const { user, setUser } = useAuth() as {
    user: User;
    setUser: (user: User) => void
  };



  const experienceNextLevel = calculateExperienceForLevel(user.level);
  const experiencePrevLevel = calculateExperienceForLevel(user.level - 1);

  const nivelesDesbloqueados: number[] = user.levelsUnlocked;

  // Estados para la selección de niveles
  const [currentDatosIndex] = useState(0);
  const [selectData, setSelectData] = useState<any>(null);
  const [currentDatos, setCurrentDatos] = useState<any>(null);

  const [modalOpenLevel, setModalOpenLevel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [avatarUser, setAvatarUser] = useState<any>(null);
  const [powersUser, setPowersUser] = useState<any>(null);
  const [avatarsUnlocked, setAvatarsUnlocked] = useState<any>(null);
  const [musicaId, setMusicaId] = useState<number>(0);

  useEffect(() => {
    if (musicaRef.current) {
      const musicaId = musicaRef.current.play();
      setMusicaId(musicaId);
    }

    return () => {
      if (musicaRef.current) {
        musicaRef.current.stop(); // Detener música al desmontar el componente
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log(user);
      const powersResponse = await getPowersUser(user.powers);
      setPowersUser(powersResponse.data);
      const avatar = await getAvatar(user.avatar);
      setAvatarUser(avatar.data);
      const avatarsUnlocked = await getAvatarComprados(user.avatarsUnlocked);
      setAvatarsUnlocked(avatarsUnlocked.data);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    // Cargar el archivo JSON
    fetch("data/datosMundo1.json")
      .then((response) => response.json())
      .then((data) => {
        // Establecer el nivel actual al primer nivel del JSON
        setCurrentDatos(data);
      })
      .catch((error) => console.error("Error al cargar el JSON:", error));
  }, [currentDatosIndex]);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenModal");

    if (!hasSeenModal) {
      setShowModal(true);
      localStorage.setItem("hasSeenModal", "true"); // Guarda que el usuario ya vio el modal
    }
  }, []);

  //Función para abrir el modal de niveles.
  const handleButtonLevel = (id: number) => {
    if (currentDatos) {
      const nivelSeleccionado = currentDatos.datos.find(
        (nivel: { nivel: number }) => nivel.nivel === id
      );
      if (nivelSeleccionado) {
        setSelectData(nivelSeleccionado);
        soundOpen.play();
        setModalOpenLevel(true);
      } else {
        console.log("No se encontró el nivel seleccionado");
      }
      if (id === 6 || id === 12 || id === 18 || id === 19 || id === 20) {
        evaluacionModal();
      }
    }
  };
  //Función para cerrar el modal de niveles.
  const closeModalLevel = () => {
    setModalOpenLevel(false);
    setSelectData(null);
  };

  const controlMusic = () => {
    if (musicaRef.current) {
      musicaRef.current.mute(!musicaRef.current.mute());
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const navigate = useNavigate(); // Hook para navegar

  const handleStartLevel = (nivel: number) => {
    navigate(`/nivel${nivel}`); // Navegar al componente GameScreen
  };

  const handleSelectAvatar = async (id: number) => {
    try {
      const fetchNewAvatar = await updateAvatar(id, user._id); // Actualiza el avatar en el backend
      setUser({ ...user, avatar: fetchNewAvatar.data.avatar }); // Actualiza el avatar en el estado global
      setIsModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error("Error al actualizar el avatar:", error);
    }
  };

  return (
    <div className="game-dashboard-container">
      {/* Barra Superior */}
      <HeaderNav />

      {/* Contenido Principal */}
      <main className="dashboard-main">
        {/* Sección del Mapa */}

        <section className="map-section">
          <div className="">
            <Slider {...settings}>
              {maps.map((mapa, index) => (
                <div key={index} className="container-slide">
                  <img
                    src={mapa.src}
                    alt={`Slide ${index + 1}`}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <h3
                    className="map-title"
                    style={{
                      position: "absolute",
                      top: "1%",
                      left: "11%",
                      transform: "translateX(-50%)",
                      color: "#fff",
                      backgroundColor: "#C1A14A",
                      padding: "10px 20px",
                      borderRadius: "10px",
                    }}
                  >
                    {mapa.titulo}
                  </h3>
                  {mapa.points.map((point, i) => (
                    <button
                      key={i}
                      className={`map-point ${
                        nivelesDesbloqueados.find(
                          (nivel) => nivel === point.label
                        )
                          ? "point-yellow"
                          : "bg-gray-400"
                      }`}
                      style={{ top: point.top, left: point.left }}
                      onClick={() => handleButtonLevel(point.label)}
                      disabled={
                        !nivelesDesbloqueados.find(
                          (nivel) => nivel === point.label
                        )
                      }
                    >
                      {point.label}
                    </button>
                  ))}
                </div>
              ))}
            </Slider>
            <i
              className="fa-solid fa-volume-xmark map-point top-[19%] left-[75%]"
              onClick={() => {
                controlMusic();
              }}
            ></i>
          </div>
        </section>

        {/* Sección de Detalles del Jugador */}
        <aside className="player-details border-8 border-[#7f5539]">
          <div className="flex flex-row items-center justify-between w-full gap-12 ">
            <h2 className="text-base text-[#343a40] font-bold font-merriweather">
              {user.username}
            </h2>
            <p className="text-black font-bold font-merriweather">
              Nivel: {user.level}
            </p>
          </div>
          {avatarUser && (
            <div className="player-avatar border-4 border-[#7f5539] bg-red-500 flex flex-col items-center justify-center">
              <img
                src={avatarUser.image}
                alt="Avatar del personaje"
                className="w-32 h-32"
              />
              <button className="edit-avatar-button" onClick={toggleModal}>
                ✏️
              </button>
            </div>
          )}

          <div className="player-stats">
            <div className="flex flex-row items-center justify-between border-2 mt-1 border-[#7f5539] bg-[#b08968]">
              <p className="flex flex-row items-center gap-2">
                <i className="fa-solid fa-coins text-[#FFD43B]"></i>
                <span className="">Oro:</span>
                {user.gold}
              </p>
            </div>
            <div className="flex flex-col border-2 mt-1 border-[#7f5539] bg-[#b08968] p-1">
              <p className="flex flex-row items-center gap-2">
                <i className="fa-solid fa-bolt-lightning text-[#74C0FC]"></i>
                <span className="">Exp:</span>{" "}
                {user.experience - experiencePrevLevel} /{" "}
                {experienceNextLevel - experiencePrevLevel}
              </p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${
                      ((user.experience - experiencePrevLevel) /
                        (experienceNextLevel - experiencePrevLevel)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="player-powers">
            <h3 className="powers-title text-[#343a40] font-merriweather">
              Poderes
            </h3>
            {powersUser && (
              <ul className="powers-list">
                {powersUser.map((power: any, index: number) => (
                  <li key={index} className="power-item">
                    <div key={power.id} className="power-item  ">
                      <img
                        src={power.image}
                        alt="Ícono de poder"
                        className={`power-icon`}
                      />
                      <div>
                        <p className="power-title ">{power.label}</p>
                        <p className="power-description text-[#343a40] font-merriweather">
                          {power.descripcion}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Modal Editar Avatar*/}
          {isModalOpen && avatarsUnlocked && (
            <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
              <div className="bg-[#bb9457] rounded-lg p-5 text-center items-center max-h-96 max-w-[70vw] shadow-md overflow-y-auto flex flex-col gap-4">
                <h2 className="text-white font-merriweather text-2xl font-bold ">
                  Editar Avatar
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {avatarsUnlocked.map((avatarUser: any, index: number) => (
                    <div
                      key={index}
                      className="h-96 flex flex-col items-center bg-[#bb9457] border-8 border-[#7a4419] shadow-pixel "
                    >
                      <div className="bg-[#ede0d4] flex items-center justify-center w-full h-15 rounded-b-2xl border-2 border-[#7a4419]">
                        <h3 className="item-name font-merriweather text-3xl">
                          {avatarUser.label}
                        </h3>
                      </div>
                      <div className="bg-[#bb9457] flex items-center justify-center]">
                        <img
                          src={avatarUser.image}
                          alt={avatarUser.label}
                          className="w-56 h-56 mb-6 "
                        />
                      </div>

                      <button
                        className="bg-[#7a4419] text-white p-2 rounded-lg hover:bg-[#ede0d4] hover:text-[#7a4419]"
                        onClick={() => handleSelectAvatar(avatarUser._id)}
                      >
                        Seleccionar
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="bg-white text-[#7a4419] text-bold hover:bg-[#7a4419] hover:text-white"
                  onClick={toggleModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </aside>

        <ModalLevel
          isOpen={modalOpenLevel}
          data={selectData}
          onClose={closeModalLevel}
          handleStartLevel={handleStartLevel}
        />
        {showModal && <ModalTutorialMainPage />}
      </main>
    </div>
  );
};

export default GameDashboard;
