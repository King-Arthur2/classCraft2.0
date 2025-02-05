//Importaciones de librerias externas
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

//Importaciones de componentes internos y estilos
import QuestionTitle from "../components/QuestionTitle";
import Answers from "../components/layouts/answers";
import { useAuth } from "../context/AuthContext";
import { getPowersUser, sendUserStats } from "../api/auth";
import { User } from "../types/user";
import { calculateExperience, calculateGold } from "../utils/functions";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/styles-GameScreen.css";

// Componente principal
const Tutorial: React.FC = () => {
  const { user, setUser } = useAuth() as {
    user: User;
    setUser: (user: User) => void;
  };
  const navigate = useNavigate();

  //Configuración de slider
  const settings = {
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: false,
    dots: true,
  };

  // Estados para manejar los modales
  const [isModalConsejosOpen, setModalConsejos] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para manejar los datos del nivel actual
  const [currentLevel, setCurrentLevel] = useState<any>(null);
  const [currentLevelIndex] = useState(0);

  // Estados para manejar el total de respuestas.
  const [totalQuestionsLevel, setTotalQuestionsLevel] = useState(0);
  const [contadorRespuestas, setContadorRespuestas] = useState(0);
  const [respuestasMalas, setRespuestasMalas] = useState(0);
  const [arrayRetro, setArrayRetro] = useState<number[]>([]);

  // Estado para manejar el tiempo y las respuestas
  const [time, setTime] = useState<number>(100);

  // Estado para manejar el estado del botón de respuestas
  const [isClickedArrayPregunta, setIsClickedArrayPregunta] = useState<
    boolean[][]
  >([]);
  const [isClickedArrayRespuesta, setIsClickedArrayRespuesta] = useState<
    boolean[][][]
  >([]);

  // Estados para los poderes del usuario
  const [disabledPowers, setDisabledPowers] = useState<boolean[]>([]);
  const [userPower, setUserPower] = useState<any>([]);
  const [bonus, setBonus] = useState<boolean>(false);
  const [bonusVida, setBonusVida] = useState<boolean>(false);
  const [bonusOro, setBonusOro] = useState<boolean>(false);
  const [bonusExp, setBonusExp] = useState<boolean>(false);
  const [gold, setGold] = useState<number>(0);
  const [experience, setExperience] = useState<number>(0);

  // Obtener los poderes del usuario
  useEffect(() => {
    const fetchPowers = async () => {
      const powers = await getPowersUser(user.powers);
      setUserPower(powers.data);
    };
    fetchPowers();
  }, [user]);

  // Cargar el archivo JSON con los datos del nivel
  useEffect(() => {
    // Cargar el archivo JSON
    fetch("data/tutorial.json")
      .then((response) => response.json())
      .then((data) => {
        // Establecer el nivel actual al primer nivel del JSON
        setCurrentLevel(data.niveles[currentLevelIndex]);

        // Inicializar `isClickedArray` como un array de arrays
        const initialClickedArray = data.niveles[
          currentLevelIndex
        ].lecturas.map((lectura: any) =>
          Array(lectura.preguntas.length).fill(false)
        );
        setIsClickedArrayPregunta(initialClickedArray);

        const initialClickedArrayRespuesta = data.niveles[
          currentLevelIndex
        ].lecturas.map((lectura: any) =>
          lectura.preguntas.map((pregunta: any) =>
            Array(pregunta.respuestas.length).fill(false)
          )
        );
        setIsClickedArrayRespuesta(initialClickedArrayRespuesta);
        setTime(data.niveles[currentLevelIndex].tiempo);

        let totalQuestions = 0;
        data.niveles[currentLevelIndex].lecturas.map((lectura: any) => {
          totalQuestions += lectura.preguntas.length;
        });
        setTotalQuestionsLevel(totalQuestions);

        const initialArrayRetro = Array(totalQuestions).fill(-1);
        setArrayRetro(initialArrayRetro);
      })
      .catch((error) => console.error("Error al cargar el JSON:", error));
  }, [currentLevelIndex]);

  // Actualizar el tiempo cada segundo
  useEffect(() => {
    // Configurar el intervalo para disminuir el tiempo
    const interval = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  // Verificar si el tiempo ha llegado a cero
  useEffect(() => {
    if (time === 0) {
      handleFinish();
    }
  }, [time]);

  useEffect(() => {
    if (respuestasMalas === 3) {
      handleFinish();
    }
  }, [respuestasMalas]);

  //Funciones para el funcionamiento de la pantalla.

  // Formatear el tiempo en minutos y segundos
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const calculateStats = () => {
    const newExp = calculateExperience(contadorRespuestas, bonus, bonusExp);
    const newGold = calculateGold(contadorRespuestas, bonus, bonusOro);
    setExperience((prevExp) => (prevExp !== newExp ? newExp : prevExp));
    setGold((prevGold) => (prevGold !== newGold ? newGold : prevGold));
  };

  const handlerPowers = (idPower: number, index: number) => {
    if (disabledPowers[index]) return;

    if (idPower === 1 || idPower === 4 || idPower === 7) {
      setTime(time + 15);
    } else if (idPower === 2) {
      setBonus(true);
    } else if (idPower === 3) {
      setBonusVida(true);
    } else if (idPower === 6 || idPower === 9) {
      setRespuestasMalas(respuestasMalas - 1);
    } else if (idPower === 5) {
      setBonusOro(true);
    } else if (idPower === 8) {
      setBonusExp(true);
    }

    // Desactiva el clic para el poder seleccionado.
    const updatedDisabledPowers = [...disabledPowers];
    updatedDisabledPowers[index] = true;
    setDisabledPowers(updatedDisabledPowers);
  };

  const handleFinish = async () => {
    calculateStats();
    setIsModalOpen(true);
  };

  const closeModal = async () => {
    const datos = await sendUserStats(user._id, experience, gold);
    setUser({
      ...user,
      experience: datos.data.experience,
      gold: datos.data.gold,
      level: datos.data.level,
      levelsUnlocked: datos.data.levelsUnlocked,
    });
    setIsModalOpen(false);
    navigate("/dashboard");
  };

  const closeModalConsejos = () => {
    setModalConsejos(false);
  };

  // Función para verificar la respuesta seleccionada --------------------------
  const checkAnswer = (
    answerIndex: number,
    questionIndex: number,
    lecturaIndex: number
  ) => {
    const question =
      currentLevel.lecturas[lecturaIndex].preguntas[questionIndex];
    const isCorrect = answerIndex === question.correcta;

    // Mostrar feedback (puedes ajustar según lo que necesites)
    if (isCorrect) {
      setContadorRespuestas(contadorRespuestas + 1);
      const updatedClickedArrayRespuesta = [...isClickedArrayRespuesta];
      updatedClickedArrayRespuesta[lecturaIndex][questionIndex][answerIndex] =
        true;

      // Actualizar el estado de las respuestas
      setIsClickedArrayRespuesta(updatedClickedArrayRespuesta);
    } else if (isCorrect === false) {
      bonusVida
        ? setRespuestasMalas(respuestasMalas)
        : setRespuestasMalas(respuestasMalas + 1);
    }

    // Desactivar el grupo de respuestas de esta pregunta
    const updatedClickedArray = [...isClickedArrayPregunta];
    updatedClickedArray[lecturaIndex][questionIndex] = true; // Desactiva solo la pregunta actual
    setIsClickedArrayPregunta(updatedClickedArray);

    const currentQuestion =
      currentLevel.lecturas[lecturaIndex].preguntas[questionIndex].numPregunta;
    const updateArrayRetro = [...arrayRetro];
    updateArrayRetro[currentQuestion - 1] = answerIndex;
    setArrayRetro(updateArrayRetro);
  };

  // -----------------------------------------------------------------------------------

  if (!currentLevel) {
    // Muestra un mensaje de carga mientras se obtienen los datos
    return <div>Cargando nivel...</div>;
  }

  return (
    <div className="flex h-screen font-poppins">
      {/* Consejos tutorial, primer modal. */}
      {isModalConsejosOpen && (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-[1000]">
          <div
            className="bg-[#e0e5ec] w-[28%] h-[70%] shadow-md z-[1001]  flex flex-col gap-2 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#C1A14A] p-4 rounded-tl-lg rounded-tr-lg h-full">
              <div className="flex justify-center items-center text-white font-bold text-lg md:text-xl ">
                <h2>Consejos Tutorial</h2>
              </div>
              <div className="flex justify-center h-[80%]">
                <Slider {...settings} className="height-[80%] justify-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center mb-4 mt-6">
                      <h3>Consejo 1</h3>
                    </div>
                    <p className="text-white text-center mb-4">
                      {" "}
                      Tienes un indicador de tiempo, debes asegurarte de leer y
                      contestar todas las respuestas en el tiempo establecido.
                    </p>
                    <div className="flex items-center justify-center text-6xl">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-4 mt-6">
                      <h3>Consejo 2</h3>
                    </div>
                    <div className="text-white text-center mb-4">
                      <p>
                        {" "}
                        Tienes 3 vidas, si respondes mal alguna pregunta pierdes
                        una, procura no equivocarte más de tres veces.
                      </p>
                    </div>
                    <div className="flex items-center justify-center text-6xl">
                      <i className="fa-solid fa-heart-circle-xmark"></i>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-4 mt-6">
                      <h3>Consejo 3</h3>
                    </div>
                    <div className="text-white text-center mb-4">
                      <p>
                        {" "}
                        Pero no te preocupes, tienes poderes que pueden ayudarte
                        a congelar el tiempo o recuperar vidas.
                      </p>
                    </div>
                    <div className="flex items-center justify-center text-6xl">
                      <i className="fa-solid fa-hat-wizard"></i>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-4 mt-6">
                      <h3>Consejo 4</h3>
                    </div>
                    <div className="text-white text-center mb-4">
                      <p>
                        {" "}
                        Para la siguientes lecciones, el tiempo puede variar,
                        las preguntas pueden ser más complejas o las lecturas
                        más largas.
                      </p>
                    </div>
                    <div className="flex items-center justify-center text-6xl">
                      <i className="fa-solid fa-align-left"></i>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-4 mt-6">
                      <h3>Consejo 5</h3>
                    </div>
                    <div className="text-white text-center mb-4">
                      <p>
                        {" "}
                        Obtendras oro y experiencia, pero para avanzar al
                        sigueinte nivel, recuerda obtener un mínimo de 80%.
                      </p>
                    </div>
                    <div className="flex items-center justify-center text-6xl">
                      <i className="fa-solid fa-circle-check"></i>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
            <div className="flex items-center justify-center p-2 ">
              <button
                className="bg-[#C1A14A] text-white hover:bg-[#e0e5ec] hover:text-[#c1a14a] hover:border-[#c1a14a] border-2 border-[#C1A14A] rounded-lg p-2"
                onClick={closeModalConsejos}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sección Izquierda */}
      <aside className="w-1/10 bg-[#274c47] text-white inline-flex flex-col p-5 gap-6 text-center">
        <div className="text-4xl">
          <p>{formatTime(time)}</p>
        </div>
        <div className="text-3xl flex gap-1 text-red-600">
          <i
            className={`${
              respuestasMalas >= 1 ? "fa-regular" : "fa-solid"
            } fa-heart`}
          ></i>
          <i
            className={`${
              respuestasMalas >= 2 ? "fa-regular" : "fa-solid"
            } fa-heart`}
          ></i>
          <i
            className={`${
              respuestasMalas >= 3 ? "fa-regular" : "fa-solid"
            } fa-heart`}
          ></i>
        </div>
        <div className="text-4xl">
          <p>
            {contadorRespuestas}/{totalQuestionsLevel}
          </p>
        </div>
      </aside>

      {/* Sección Central */}
      <main className="bg-[#f5deb3] w-4/5 p-5 overflow-y-auto">
        {/* Encabezado del Nivel */}
        <header className="flex justify-center text-center">
          <h1 className="text-4xl font-bold text-[#274c47] mb-1">
            {currentLevel.nivel}
          </h1>
        </header>

        {currentLevel.lecturas.map((lectura: any, lecturaIndex: number) => (
          <div key={lecturaIndex} className="mb-8">
            <section className="bg-white p-4 rounded-lg mb-4">
              <h2 className="text-xl font-bold text-[#274c47] mb-2">
                {lectura.titulo}
              </h2>
              <p className="text-gray-700 text-base">
                {lectura.contenido
                  .split("\n")
                  .map((line: string, index: number) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
              </p>
            </section>

            {lectura.preguntas.map((pregunta: any, preguntaIndex: number) => (
              <div key={preguntaIndex}>
                <QuestionTitle
                  title={`Pregunta ${pregunta.numPregunta}`}
                  question={pregunta.pregunta}
                />

                <Answers
                  answers={pregunta.respuestas}
                  onAnswerSelect={checkAnswer}
                  lecturaIndex={lecturaIndex}
                  indexQuestion={preguntaIndex}
                  isClickedArrayPregunta={isClickedArrayPregunta[lecturaIndex]}
                  isClickedArrayRespuesta={
                    isClickedArrayRespuesta[lecturaIndex][preguntaIndex]
                  }
                  correctAnswer={pregunta.correcta}
                />

                {arrayRetro[pregunta.numPregunta - 1] ===
                  pregunta.retroalimentacionIndex && (
                  <div
                    className={`flex flex-col justify-center  text-black p-2 rounded-lg mb-4 bg-[#f6fff8] border-[#eaf4f4] shadow-pixel`}
                  >
                    <p className="font-bold text-xl">
                      {arrayRetro[pregunta.numPregunta - 1] ===
                      pregunta.correcta
                        ? "Correcto"
                        : "Incorrecto"}
                    </p>
                    <p>{pregunta.retroalimentacion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Botón para terminar el nivel */}
        <div className="flex justify-center">
          <button
            className="mt-4 pt-3 pb-3 pl-5 pr-5 bg-[#2f4f4f] text-white border-none cursor-pointer text-base font-bold hover:bg-[#fff] hover:text-[#2f4f4f]"
            onClick={handleFinish}
          >
            Terminar
          </button>
        </div>
      </main>

      {/* Sección Derecha */}
      <aside className="w-2/12 bg-[#274c47] inline-flex flex-col pt-3 pb-3  text-center">
        <div className="text-3xl mb-10">
          <p>Poderes</p>
        </div>
        <div className=" w-full rounded-xl flex flex-col gap-4 items-center">
          {userPower.map((power: any, index: number) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center relative group w-40"
            >
              <div className="bg-beige-dark bg-opacity-50 w-24 flex items-center justify-center shadow-pixel">
                <p className="text-center texts-sm text-black">
                  {power.nombre}
                </p>
              </div>
              <div className="flex items-center w-24 h-24 bg-beige border-4 border-beige-dark shadow-pixel">
                <img
                  src={power.image}
                  alt={power.descripcion}
                  className={`block w-20 h-20 mx-auto ${
                    disabledPowers[index]
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                  onClick={() => handlerPowers(power._id, index)}
                />
              </div>
              <span className="absolute top-0 right-36 w-full transform-translate-x-1/2 mt-2 rounded-br-lg rounded-tl-lg bg-[#6D9773] border-4 border-beige-dark shadow-pixel bg-opacity-100 text-white text-center px-4 py-2 opacity-0 group-hover:opacity-100 transition duration-300">
                {power.descripcion}
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
          onClick={closeModal}
        >
          <div
            className="p-5 rounded-xl w-1/3 h-1/2 bg-[#6D9773]  border-4 border-beige-dark shadow-pixel flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className=" text-white font-bold text-2xl text-center">
              <h2>Has terminado el tutorial</h2>
            </div>
            <p className="text-[#fff] text-left">Recompensas: </p>
            <div className="flex flex-row gap-4">
              <i className="fa-brands fa-gg-circle text-lg text-[#ffab00]"></i>
              <p>
                <p>{`Oro obtenido: ${gold}`}</p>
              </p>
            </div>
            <div className="flex flex-row gap-4">
              <i className="fa-solid fa-flask text-lg text-[#5fa8d3]"></i>
              <p>Experiencia obtenida: {experience} puntos</p>
            </div>
            <div className="flex justify-center">
              <button className="close-modal-button" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
