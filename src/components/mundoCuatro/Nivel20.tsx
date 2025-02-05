//Importaciones externas
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Importaciones internas, componentes, hooks, contextos, estilos.
import PowersBar from "../layouts/powersBar"; // Componente de la barra de poderes
import Questions from "../principales/questiions";
import Answers from "../layouts/answers";
import { useAuth } from "../../context/AuthContext"; // Contexto de autenticación
import { User } from "../../types/user"; // Interface para el usuario.
import { Evaluacion } from "../../types/evaluacion";
import { sendUserStats, blockLevels, sendDataEvaluacion } from "../../api/auth"; // Funciones de petición al servidor
import { calculateGold, calculateExperience } from "../../utils/functions"; // Funciones de cálculo de recompensas

import "../../styles/styles-GameScreen.css";

//Importaciones de images informativas para los niveles
import informativa1 from "../../assets/imgInformativas/informativa-nivel18-1.png";

const imgInformativas = [informativa1];

// Componente principal
const Nivel20: React.FC = () => {
  // Estados y referencias locales del componente.
  const navigate = useNavigate();
  const { user, setUser } = useAuth() as {
    user: User;
    setUser: (user: User) => void;
  };
  // Estado para la funcionalidad de la pantalla.

  //Estados para el manejo de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para el manejo de los datos por nivel
  const [currentLevel, setCurrentLevel] = useState<any>(null);
  const [currentLevelIndex] = useState(1);

  // Estados para el manejo de los poderes
  const [powers, setPowers] = useState<number[]>([]);
  const [disabledPowers, setDisabledPowers] = useState<boolean[]>([]);
  const [bonus, setBonus] = useState<boolean>(false);
  const [bonusVida, setBonusVida] = useState<boolean>(false);
  const [bonusOro, setBonusOro] = useState<boolean>(false);
  const [bonusExp, setBonusExp] = useState<boolean>(false);

  // Estados para el manejo de las recompensas
  const [gold, setGold] = useState<number>(0);
  const [experience, setExperience] = useState<number>(0);

  // Estado para manejar el tiempo y las respuestas
  const [time, setTime] = useState<number>(100);

  // Estados para el manejo de las respuestas
  const [totalQuestionsLevel, setTotalQuestionsLevel] = useState(0);
  const [contadorRespuestas, setContadorRespuestas] = useState(0);
  const [respuestasMalas, setRespuestasMalas] = useState(0);

  // Estado para manejar el estado del botón de respuestas
  const [isClickedArrayPregunta, setIsClickedArrayPregunta] = useState<
    boolean[][]
  >([]);
  const [isClickedArrayRespuesta, setIsClickedArrayRespuesta] = useState<
    boolean[][][]
  >([]);

  //Estado que almacena los indices de las respuestas con retroalimentación.
  const [arrayRetro, setArrayRetro] = useState<number[]>([]);

   //Estados para el envío de datos del nivel
    const [evaluacion, setEvaluacion] = useState<Evaluacion>({
      evaluacion: 20,
      calificacion: 0,
      dificultad: "Avanzado",
      respuestasCorrectas: 0,
      respuestasIncorrectas: 0,
      preguntasRespuestas: [],
      tiempo: 0,
    });
    const [arrayRespuestas, setArrayRespuestas] = useState<string[]>([]);
  
    // Cargar el archivo JSON con los datos del tutorial
    useEffect(() => {
      // Cargar el archivo JSON
      fetch("data/mundo4.json")
        .then((response) => response.json())
        .then((data) => {
          // Establecer el nivel actual al primer nivel del JSON
          setCurrentLevel(data.niveles[currentLevelIndex]);
  
          // Inicializar `isClickedArray` como un array de arrays.
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
  
          // Establecer el tiempo inicial del nivel
          setTime(data.niveles[currentLevelIndex].tiempo);
  
          // Calcular el total de preguntas del nivel
          let totalQuestions = 0;
          data.niveles[currentLevelIndex].lecturas.map((lectura: any) => {
            totalQuestions += lectura.preguntas.length;
          });
          setTotalQuestionsLevel(totalQuestions);
  
          // Inicializar el array de retroalimentación
          const initialArrayRetro = Array(totalQuestions).fill(-1);
          setArrayRetro(initialArrayRetro);
          const initialArrayRespuestas = Array(totalQuestions).fill("incorrecta");
          setArrayRespuestas(initialArrayRespuestas);
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

  // Actualizar los poderes del usuario
  useEffect(() => {
    setPowers(user.powers);
  }, [user]);

  //Funciones para el manejo de la pantalla

  // Formatear el tiempo en minutos y segundos
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Calcular las recompensas del jugador
  const calculateStats = () => {
    const newExp = calculateExperience(contadorRespuestas, bonus, bonusExp);
    const newGold = calculateGold(contadorRespuestas, bonus, bonusOro)
    setExperience((prevExp) => (prevExp !== newExp ? newExp : prevExp));
    setGold((prevGold) => (prevGold !== newGold ? newGold : prevGold));
  };

   // Manejar el final del nivel
    const handleFinish = async () => {
      calculateStats();
      setIsModalOpen(true);
      await blockLevels(user._id, 20);
      setEvaluacion({
        ...evaluacion,
        calificacion: (contadorRespuestas / totalQuestionsLevel) * 10,
        respuestasCorrectas: contadorRespuestas,
        respuestasIncorrectas: respuestasMalas,
        preguntasRespuestas: arrayRespuestas,
        tiempo: currentLevel.tiempo - time,
      });
    };
  
    // Cerrar el modal de terminación del nivel y setear las recompensas.
    const closeModal = async () => {
      const datos = await sendUserStats(user._id, experience, gold);
      setUser({
        ...user,
        experience: datos.data.experience,
        gold: datos.data.gold,
        level: datos.data.level,
        levelsUnlocked: datos.data.levelsUnlocked,
      });
      const datosEvaluacion = await sendDataEvaluacion(evaluacion);
      console.log(datosEvaluacion);
      setIsModalOpen(false);
      navigate("/dashboard");
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
        const updateArrayRespuestas = [...arrayRespuestas];
        updateArrayRespuestas[question.numPregunta - 1] = "correcta";
        setArrayRespuestas(updateArrayRespuestas);
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

  // -----------------------------------------------------------------------------------

  if (!currentLevel) {
    // Muestra un mensaje de carga mientras se obtienen los datos
    return <div>Cargando nivel...</div>;
  }

  return (
    <div className="flex h-screen font-poppins">
      {/* Sección Izquierda */}
      <aside className="w-1/10 bg-[#274c47] text-white inline-flex flex-col p-5 gap-6 text-center">
        <div className="text-4xl">
          <p>{formatTime(time)}</p>
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
                      {line
                        .split("<b>")
                        .map((part: string, partIndex: number) =>
                          partIndex > 0 ? (
                            // Si no es el primer fragmento, lo envolvemos en un <b> (marcador <b>)
                            <span key={`${index}-${partIndex}`}>
                              <span className="flex justify-center">
                                <img
                                  className="w-4/6 mt-10"
                                  src={imgInformativas[Number(part.trim())]}
                                  alt=""
                                />
                              </span>
                            </span>
                          ) : (
                            // Primer fragmento antes del marcador <b>, lo tratamos como texto normal
                            <span key={`${index}-${partIndex}`}>{part}</span>
                          )
                        )}
                      <br />
                    </span>
                  ))}
              </p>
            </section>

            {lectura.preguntas.map((pregunta: any, preguntaIndex: number) => (
              <div key={preguntaIndex}>
                <Questions
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
      <aside className="w-2/12 bg-[#274c47] inline-flex flex-col items-center py-5  gap-2 text-center">
        <div className="text-3xl mb-10">
          <p>Poderes</p>
        </div>
        <PowersBar
          userPowers={powers}
          userLevel={user.level}
          handlePowers={handlerPowers}
          powersDisabled={disabledPowers}
        />
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
              <h2>Has terminado el nivel</h2>
            </div>
            <div className="flex justify-center">
              <p className="text-[#fff] text-left">
                {`Tu puntuación: ${contadorRespuestas} / ${totalQuestionsLevel}`}
              </p>
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

export default Nivel20;
