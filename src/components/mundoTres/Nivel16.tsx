//Importaciones externas
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Importaciones internas, componentes, hooks, contextos, estilos.
import PowersBar from "../layouts/powersBar"; // Componente de la barra de poderes
import Questions from "../principales/questiions";
import Answers from "../layouts/answers";
import { useAuth } from "../../context/AuthContext"; // Contexto de autenticación
import { User } from "../../types/user"; // Interface para el usuario.
import { Leccion } from "../../types/leccion"; // Interface para las lecciones.
import { sendUserStats, unlockLevels, sendDataLeccion } from "../../api/auth"; // Funciones de petición al servidor
import { calculateGold, calculateExperience } from "../../utils/functions"; // Funciones de cálculo de recompensas

import "../../styles/styles-GameScreen.css";

//Importaciones de images informativas para los niveles
import informativa1 from "../../assets/imgInformativas/informativa-nivel16-1.png";
import informativa2 from "../../assets/imgInformativas/informativa-nivel16-2.png";
import informativa3 from "../../assets/imgInformativas/informativa-nivel16-3.png";
import informativa4 from "../../assets/imgInformativas/informativa-nivel16-4.png";
import informativa5 from "../../assets/imgInformativas/informativa-nivel16-5.png";
import informativa6 from "../../assets/imgInformativas/informativa-nivel16-6.png";
import informativa7 from "../../assets/imgInformativas/informativa-nivel16-7.png";
import informativa8 from "../../assets/imgInformativas/informativa-nivel16-8.png";
import informativa9 from "../../assets/imgInformativas/informativa-nivel16-9.png";
import informativa10 from "../../assets/imgInformativas/informativa-nivel16-10.png";

// Componente principal
const Nivel2: React.FC = () => {
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
  const [currentLevelIndex] = useState(3);
  const nextLevel = 17;

  // Estados para el manejo de los poderes
  const [powers, setPowers] = useState<number[]>([]);
  const [disabledPowers, setDisabledPowers] = useState<boolean[]>([]);
  const [bonus, setBonus] = useState<boolean>(false);
  const [bonusVida, setBonusVida] = useState<boolean>(false);
  const [bonusOro, setBonusOro] = useState<boolean>(false);
  const [bonusExp, setBonusExp] = useState<boolean>(false);

  // Estados para el manejo de las recompensas
  const [aprobado, setAprobado] = useState<boolean>(false);
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
     const [leccion, setLeccion] = useState<Leccion>({
      leccion: 16,
      aprobada: false,
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
      fetch("data/mundo3.json")
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

  // Verificar si el jugador ha fallado 3 preguntas
  useEffect(() => {
    if (respuestasMalas === 3) {
      handleFinish();
    }
  }, [respuestasMalas]);

  // Actualizar los poderes del usuario
  useEffect(() => {
    setPowers(user.powers);
  }, [user]);

  // Verificar si el jugador ha terminado el nivel
  useEffect(() => {
    if (aprobado) {
      calculateStats();
      setIsModalOpen(true);
    }
  }, [aprobado]);

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
    const newGold = aprobado
      ? calculateGold(contadorRespuestas, bonus, bonusOro)
      : 0;
    setExperience((prevExp) => (prevExp !== newExp ? newExp : prevExp));
    setGold((prevGold) => (prevGold !== newGold ? newGold : prevGold));
  };

  // Manejar el final del nivel
  const handleFinish = async () => {
    if (contadorRespuestas / totalQuestionsLevel === 1) {
      if (!user.levelsUnlocked.includes(nextLevel)) {
        await unlockLevels(user._id, nextLevel);
      }
      setAprobado(true);
      setLeccion({
        ...leccion,
        aprobada: true,
        respuestasCorrectas: contadorRespuestas,
        respuestasIncorrectas: respuestasMalas,
        preguntasRespuestas: arrayRespuestas,
        tiempo: currentLevel.tiempo - time, 
      });
    } else {
      calculateStats(); 
      setLeccion({
        ...leccion,
        aprobada: false,
        respuestasCorrectas: contadorRespuestas,
        respuestasIncorrectas: respuestasMalas,
        preguntasRespuestas: arrayRespuestas,
        tiempo: currentLevel.tiempo - time, 
      });
      setIsModalOpen(true);
    }
  }

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
    const dataLeccion  = await sendDataLeccion(leccion);
    console.log(dataLeccion);
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

    if (isCorrect) {
      setContadorRespuestas(contadorRespuestas + 1);
      const updatedClickedArrayRespuesta = [...isClickedArrayRespuesta];
      updatedClickedArrayRespuesta[lecturaIndex][questionIndex][answerIndex] =
        true;

      setIsClickedArrayRespuesta(updatedClickedArrayRespuesta);
      const updateArrayRespuestas = [...arrayRespuestas];
      updateArrayRespuestas[question.numPregunta - 1] = "correcta";
      setArrayRespuestas(updateArrayRespuestas);
    } else if (isCorrect === false) {
      bonusVida
        ? setRespuestasMalas(respuestasMalas)
        : setRespuestasMalas(respuestasMalas + 1);
    }

    const updatedClickedArray = [...isClickedArrayPregunta];
    updatedClickedArray[lecturaIndex][questionIndex] = true; 
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

        {/* Contenido del Nivel */}
        <div className="mb-8">
          <section className="bg-white p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold text-[#274c47] mb-4">
              Signos ortográficos
            </h2>
            <p className="text-gray-700 text-base mb-4">
              Son todas aquellas marcas gráficas que, no siendo números ni
              letras, aparecen en los textos escritos con el fin de contribuir a
              su correcta lectura e interpretación. Cada uno de ellos tiene una
              función propia y unos usos establecidos por convención. Hay signos
              de puntuación y signos auxiliares.
            </p>
            <ul className="list-disc pl-5 text-gray-700 text-base gap-3 mb-4">
              <li>
                I. Marcan las pausas y la entonación con que deben leerse los
                enunciados.
              </li>
              <li>II. Organizan el discurso y facilitan su comprensión.</li>
              <li>
                III. Evitan posibles ambigüedades en textos que, sin su empleo,
                podrían tener interpretaciones diferentes.
              </li>
              <li>
                IV. Señalan el carácter especial de determinados fragmentos de
                texto como citas, incisos, intervenciones de distintos
                interlocutores en un diálogo, etc.
              </li>
            </ul>
            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              El punto /. / Clases: el punto y seguido, el punto y aparte y el
              punto final.
            </h2>
            <ul className="list-disc pl-5 text-gray-700 text-base gap-3 mb-4">
              <li>
                Se utiliza después de las abreviaturas: Sr., Ej., etc.
                Excepciones:
              </li>
              <ul className="pl-5 list-disc">
                <li>
                  Los símbolos de los elementos químicos y de las unidades de
                  peso y de medida, se escriben sin punto: kg, Na;
                </li>
                <li>Los puntos cardinales N (Norte), S (Sur).</li>
              </ul>
              <li>
                No se escribe punto al final de títulos y subtítulos de libros,
                artículos, capítulos, obras de arte, etc., cuando aparezcan
                aislados.
              </li>
            </ul>
            <div className="flex justify-center my-2">
              <img className="w-4/6" src={informativa1} alt="" />
            </div>
            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              La coma /, /
            </h2>
            <p className="text-gray-700 text-base mb-4">
              La coma /, / indica una pausa breve que se produce dentro del
              enunciado.
            </p>
            <div className="flex justify-center my-2">
              <img className="w-4/6" src={informativa2} alt="" />
            </div>
            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              El punto y coma /; /
            </h2>
            <p className="text-gray-700 text-base mb-4">
              El punto y coma /; / indica una pausa superior a la marcada por la
              coma e inferior a la señalada por el punto. El punto y coma se
              utiliza:
            </p>
            <div className="flex justify-center my-2">
              <img className="w-4/6" src={informativa3} alt="" />
            </div>
            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              Los dos puntos /: /
            </h2>
            <p className="text-gray-700 text-base mb-4">
              Los dos puntos /: / detienen el discurso para llamar la atención
              sobre lo que sigue.
            </p>
            <div className="flex justify-center my-2">
              <img className="w-4/6" src={informativa4} alt="" />
            </div>
            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              Los puntos suspensivos / ... /
            </h2>
            <p className="text-gray-700 text-base mb-4">
              Los puntos suspensivos / ... / suponen una interrupción de la
              oración o un final impreciso.
            </p>
            <div className="flex justify-center my-2">
              <img className="w-4/6" src={informativa5} alt="" />
            </div>
            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              Los signos de interrogación / ¿? / y de exclamación / ¡! /
            </h2>
            <p className="text-gray-700 text-base mb-4">
              Se emplean para delimitar enunciados interrogativos o exclamativos
              directos e interjecciones.
            </p>
            <div className="flex justify-center my-2">
              <img className="w-4/6" src={informativa6} alt="" />
            </div>
            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              Los paréntesis / ( ) / y los corchetes / [ ] /
            </h2>
            <p className="text-gray-700 text-base mb-4">
              Los paréntesis / ( ) / y los corchetes / [ ] / se emplean para
              encerrar elementos incidentales o aclaratorios que se intercalan
              en un enunciado. o que incorporan información complementaria o
              aclaratoria.
            </p>
            <div className="flex justify-center my-2">
              <img className="w-4/6" src={informativa7} alt="" />
            </div>
            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              La raya / ‒ /, el guion / - / y el guion largo / — /
            </h2>
            <div className="flex justify-center my-2">
              <img className="w-4/6" src={informativa8} alt="" />
            </div>
            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              La división de palabras a final de renglón
            </h2>
            <p className="text-gray-700 text-base mb-4">
              La Academia establece las siguientes reglas para el corte silábico
              de las palabras cuando no quepan a final de renglón.
            </p>
            <div className="flex justify-center my-2">
              <img className="w-4/6" src={informativa9} alt="" />
            </div>
            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              Las comillas
            </h2>
            <p className="text-gray-700 text-base mb-4">
              Hay distintos tipos de comillas, que se emplean indistintamente, y
              se alternan cuando deben usarse en un texto ya entrecomillado.
            </p>
            <div className="flex justify-center my-2">
              <img className="w-4/6" src={informativa10} alt="" />
            </div>
          </section>
        </div>

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
      <aside className="w-2/12 bg-[#274c47] inline-flex flex-col pt-3 pb-3 gap-2 text-center">
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
            <p
              className={`${
                aprobado ? "text-[#ffba00]" : "text-red-600"
              } font-bold text-center`}
            >
              {aprobado
                ? "Has terminado el Nivel con éxito"
                : "No has pasado el nivel"}
            </p>
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

export default Nivel2;
