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

// Componente principal
const Nivel4: React.FC = () => {
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
  const nextLevel = currentLevelIndex + 2;

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
    leccion: 4,
    aprobada: false,
    dificultad: "Introducción",
    respuestasCorrectas: 0,
    respuestasIncorrectas: 0,
    preguntasRespuestas: [],
    tiempo: 0,
  }); 
  const [arrayRespuestas, setArrayRespuestas] = useState<string[]>([]);

   // Cargar el archivo JSON con los datos del tutorial
   useEffect(() => {
    // Cargar el archivo JSON
    fetch("data/mundo1.json")
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

        <div className="mb-8">
          <section className="bg-white p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold text-[#274c47] mb-2">
              La lectura crítica
            </h2>
            <p className="text-gray-700 text-base">
              Un lector eficiente puede seleccionar rápidamente lo que le
              interesa, pero su lectura no será efectiva si no entiende lo que
              el texto dice o si no reflexiona y evalúa el contenido de la
              lectura. Un buen lector es eficiente (capaz de seleccionar) y
              efectivo. La efectividad en la lectura consiste en saber leer
              críticamente.
            </p>
            <br />
            <p className="text-gray-700 text-base">
              El lector crítico, al tiempo que lee, se plantea las siguientes
              preguntas:
            </p>
            <br />
            <ul className="pl-5 text-gray-700">
              <li>1. ¿Cuál es la fuente? ¿Es veraz? ¿Está actualizada?</li>
              <li>2. ¿Cuál es el propósito y objetivo del autor?</li>
              <li>
                3. ¿Cómo presenta el autor la información? (hechos, inferencias
                u opiniones)
              </li>
              <li>4. ¿Qué tono utiliza el autor?</li>
              <li>5. ¿Qué lenguaje utiliza el autor?</li>
              <li>6. ¿Cuál es la hipótesis o tesis que el autor propone?</li>
              <li>7. ¿Es coherente y sólida la argumentación del autor?</li>
              <li>8. ¿Cambió mi opinión el texto? ¿Me hizo reflexionar?</li>
            </ul>
            <br />
            <span className="text-base font-bold text-[#274c47] mb-2">
              La confiabilidad o credibilidad de la fuente
            </span>
            <br />
            <br />
            <p className="text-gray-700 text-base">
              Para juzgar la confiabilidad o credibilidad de un texto, un lector
              crítico comienza con una lectura selectiva o prelectura, que
              incluye hojear y examinar el texto de manera general. Luego,
              presta atención a varios aspectos:
            </p>
            <ul className="pl-5 text-gray-700">
              <li>
                <span className="font-bold">Autor</span>
                <ul className="pl-5">
                  <li>¿Quién escribió el texto?</li>
                  <li>
                    ¿Cuenta con experiencia o conocimientos sólidos sobre el
                    tema?
                  </li>
                  <li>
                    ¿Sus otros trabajos son reconocidos por su calidad y
                    objetividad?
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Editorial</span>
                <ul className="pl-5">
                  <li>
                    ¿Fue publicado por una editorial con buena reputación?
                  </li>
                  <li>
                    ¿La editorial o el autor reciben financiamiento de algún
                    grupo con intereses específicos?
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Fecha de publicación</span>
                <ul className="pl-5">
                  <li>¿Está actualizado el texto?</li>
                  <li>
                    A veces la fecha no es lo más relevante: una biografía de
                    Benito Juárez de 1940 puede ser más confiable que una de
                    1993.
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Lugar de publicación</span>
                <ul className="pl-5">
                  <li>
                    En traducciones, el lugar adquiere importancia porque el
                    lenguaje varía según el país (no es lo mismo una traducción
                    hecha en Argentina, en España o en México).
                  </li>
                </ul>
              </li>
            </ul>
            <br />
            <p className="text-gray-700 text-base">
              Al revisar todos estos puntos —autor, editorial, fecha y lugar de
              publicación— podrás determinar cuán confiable es la fuente y si el
              texto merece tu confianza. Así, al integrar el análisis de la
              fuente con las preguntas clave de la lectura crítica, te
              asegurarás de comprender y evaluar el contenido de manera
              profunda, reflexiva y efectiva.
            </p>
            <br />
            <h3 className="text-lg font-bold text-[#274c47] mb-2">
              Estrategias
            </h3>
            <p className="text-gray-700 text-base">
              La confiabilidad o credibilidad de la fuente es esencial, aun más
              cuando nos enfrentamos a textos anónimos o cuando desconocemos
              quién es el autor. En estos casos, es necesario aplicar
              estrategias adicionales para determinar si la información merece
              nuestra confianza:
            </p>
            <br />
            <ul className="pl-5 text-gray-700">
              <li>
                <span className="font-bold">
                  1. Evalúa la editorial y el lugar de publicación
                </span>
                <ul className="pl-5">
                  <li>
                    Verifica quién publica el texto. Puede tratarse de una
                    revista, un periódico o un boletín de una organización
                    específica.
                  </li>
                  <li>
                    Algunas publicaciones tienen reputaciones definidas:
                    conservadoras, progresistas, objetivas o tendenciosas. Tu
                    propia experiencia como lector te servirá para juzgar su
                    confiabilidad.
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">
                  2. Observa la fecha de publicación
                </span>
                <ul className="pl-5">
                  <li>
                    En los libros y algunas revistas, la fecha de impresión
                    suele aparecer en la página siguiente a la portada (llamada
                    “portadilla”).
                  </li>
                  <li>
                    En otras publicaciones, se encuentra al final, en el “pie de
                    imprenta”.
                  </li>
                  <li>
                    Allí también se menciona información como editorial, país,
                    tiraje e imprenta encargada de la edición.
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">
                  3. Aplica estas estrategias en textos anónimos o de autor
                  desconocido
                </span>
                <ul className="pl-5">
                  <li>
                    Si no puedes identificar al autor, busca pistas en la
                    editorial y la fecha de publicación para tener una idea de
                    la confiabilidad y la credibilidad del contenido.
                  </li>
                </ul>
              </li>
            </ul>
            <br />
            <p className="text-gray-700 text-base">
              En resumen, cuando desconozcas la autoría de un texto, presta
              especial atención a quién lo publica, cuándo se publicó y la línea
              editorial de la fuente. Así podrás formarte un criterio sólido
              sobre la confiabilidad del documento.
            </p>
            <br />
            <h3 className="text-lg font-bold text-[#274c47] mb-2">
              Cómo presenta el autor la información
            </h3>
            <p className="text-gray-700 text-base">
              Al leer un texto de manera crítica, resulta fundamental
              identificar cómo el autor presenta la información. Para ello,
              podemos clasificar el contenido en hechos, inferencias y
              opiniones, y también analizar el lenguaje que se utiliza.
            </p>
            <br />
            <h4 className="text-md font-bold text-[#274c47] mb-2">
              Hechos, inferencias y opiniones
            </h4>
            <ul className="pl-5 text-gray-700">
              <li>
                <span className="font-bold">1. Hechos (H):</span> Son datos o
                afirmaciones que pueden verificarse a través de la experiencia o
                de la lógica.
                <ul className="pl-5">
                  <li>Ejemplo: “Está lloviendo.” Puedo salir y comprobarlo.</li>
                </ul>
              </li>
              <li>
                <span className="font-bold">2. Inferencias (I):</span> Son
                consecuencias que se obtienen de un hecho o de un razonamiento
                lógico.
                <ul className="pl-5">
                  <li>
                    Ejemplo: “El cielo está nublado, así que infiero que va a
                    llover.”
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">3. Opiniones (O):</span> Son juicios
                de valor, percepciones personales que pueden variar de una
                persona a otra.
                <ul className="pl-5">
                  <li>Ejemplo: “Creo que mañana lloverá.”</li>
                </ul>
              </li>
            </ul>
            <br />
            <h4 className="text-md font-bold text-[#274c47] mb-2">
              El lenguaje
            </h4>
            <p className="text-gray-700 text-base">
              La forma en que el autor se expresa revela si su postura es
              objetiva o subjetiva, y permite notar si su actitud es positiva,
              negativa o neutra.
            </p>
            <ul className="pl-5 text-gray-700">
              <li>
                <span className="font-bold">1. Lenguaje objetivo:</span> El
                autor no se deja llevar por sus sentimientos o emociones; la
                información presentada se puede verificar.
                <ul className="pl-5">
                  <li>
                    Ejemplo: “En 1985 hubo un terremoto en la Ciudad de México.”
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">2. Lenguaje subjetivo:</span> El
                autor expresa su forma personal de pensar y sentir; sus
                emociones influyen en la manera de narrar o describir un suceso.
                <ul className="pl-5">
                  <li>
                    Ejemplo: “En 1985, dolorosa y consternadamente vivimos un
                    terremoto en la Ciudad de México.”
                  </li>
                </ul>
              </li>
            </ul>
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

export default Nivel4;
