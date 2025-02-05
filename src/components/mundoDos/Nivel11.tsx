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
const Nivel11: React.FC = () => {
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
  const [currentLevelIndex] = useState(4);
  const nextLevel = 12;

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
    leccion: 11,
    aprobada: false,
    dificultad: "Intermedio",
    respuestasCorrectas: 0,
    respuestasIncorrectas: 0,
    preguntasRespuestas: [],
    tiempo: 0,
  }); 
  const [arrayRespuestas, setArrayRespuestas] = useState<string[]>([]);

   // Cargar el archivo JSON con los datos del tutorial
   useEffect(() => {
    // Cargar el archivo JSON
    fetch("data/mundo2.json")
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
              Reconocimiento de la estructura de textos
            </h2>
            <p className="text-gray-700 text-base">
              Los textos varían según su propósito comunicativo, lo que
              determina su estructura y estilo. Entre los principales tipos de
              textos destacan:
            </p>
            <ul className="list-disc pl-5 text-gray-700 text-base">
              <li>
                <span className="font-bold">Texto Narrativo:</span>
                <ul className="list-disc pl-5">
                  <li>
                    Desarrolla una historia con un tiempo, espacio y personajes
                    específicos.
                  </li>
                  <li>
                    Rasgos clave:
                    <ul className="list-disc pl-8">
                      <li>
                        <span className="italic">Temporalidad:</span> Sucesión
                        de eventos.
                      </li>
                      <li>
                        <span className="italic">Unidad temática:</span> Un
                        personaje o conjunto de personajes que protagonizan la
                        acción.
                      </li>
                      <li>
                        <span className="italic">Transformación:</span> Cambios
                        en estados o situaciones.
                      </li>
                      <li>
                        <span className="italic">Causalidad:</span> Relación
                        lógica entre eventos.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span className="italic">Ejemplo:</span> Historias, cuentos
                    y anécdotas.
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Texto Expositivo:</span>
                <ul className="list-disc pl-5">
                  <li>
                    Presenta información objetiva para explicar o describir
                    conceptos, hechos o fenómenos.
                  </li>
                  <li>
                    Características:
                    <ul className="list-disc pl-8">
                      <li>Uso de tercera persona o modalidad impersonal.</li>
                      <li>
                        Organización lógica con introducción, desarrollo y
                        conclusión.
                      </li>
                      <li>Uso de tecnicismos, conectores y ejemplos.</li>
                    </ul>
                  </li>
                  <li>
                    <span className="italic">Ejemplo:</span> Artículos
                    científicos, informes técnicos.
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Texto Argumentativo:</span>
                <ul className="list-disc pl-5">
                  <li>
                    Estructura textual orientada a la defensa de una idea o
                    postura.
                  </li>
                  <li>
                    Elementos esenciales:
                    <ul className="list-disc pl-8">
                      <li>Introducción que plantea un problema.</li>
                      <li>
                        Argumentos basados en datos, analogías o autoridad.
                      </li>
                      <li>Conclusión que refuerza la tesis propuesta.</li>
                    </ul>
                  </li>
                  <li>
                    <span className="italic">Ejemplo:</span> Editoriales,
                    ensayos críticos.
                  </li>
                </ul>
              </li>
            </ul>

            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              Uso adecuado de la gramática
            </h2>
            <p className="text-gray-700 text-base">
              El manejo correcto de la gramática y la ortografía es crucial para
              la claridad y efectividad del texto.
            </p>
            <ul className="list-disc pl-5 text-gray-700 text-base">
              <li>
                <span className="font-bold">
                  Clasificación de palabras según acentuación:
                </span>
                <ul className="list-disc pl-8">
                  <li>
                    <span className="italic">Agudas:</span> Llevan tilde si
                    terminan en vocal, "n" o "s".{" "}
                    <span className="italic">Ejemplo:</span> canción.
                  </li>
                  <li>
                    <span className="italic">Graves:</span> Llevan tilde si no
                    terminan en vocal, "n" o "s".{" "}
                    <span className="italic">Ejemplo:</span> árbol.
                  </li>
                  <li>
                    <span className="italic">Esdrújulas:</span> Siempre llevan
                    tilde. <span className="italic">Ejemplo:</span> matemática.
                  </li>
                  <li>
                    <span className="italic">Sobresdrújulas:</span> Llevan tilde
                    en la sílaba anterior a la antepenúltima.{" "}
                    <span className="italic">Ejemplo:</span> dígaselo.
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">
                  Errores comunes y su corrección:
                </span>
                <ul className="list-disc pl-8">
                  <li>Confusión en la conjugación verbal.</li>
                  <li>
                    Uso incorrecto de homófonos (por ejemplo: tú/tu, él/el).
                  </li>
                  <li>
                    Aplicación de reglas de puntuación para evitar ambigüedad.
                  </li>
                </ul>
              </li>
            </ul>

            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              Comprensión de vocabulario en contexto
            </h2>
            <p className="text-gray-700 text-base">
              Un vocabulario amplio y bien utilizado enriquece la comunicación
              escrita y oral.
            </p>
            <ul className="list-disc pl-5 text-gray-700 text-base">
              <li>
                <span className="font-bold">Sinonimia:</span>
                <ul className="list-disc pl-8">
                  <li>
                    <span className="italic">Sinonimia total:</span> Palabras
                    con el mismo significado en cualquier contexto.{" "}
                    <span className="italic">Ejemplo:</span> extinto/extinguido.
                  </li>
                  <li>
                    <span className="italic">Sinonimia parcial:</span> Palabras
                    que comparten significado en contextos específicos.{" "}
                    <span className="italic">Ejemplo:</span> médico/doctor.
                  </li>
                  <li>
                    <span className="italic">
                      Sinonimia con diferencia de grado:
                    </span>{" "}
                    Palabras con significado similar pero diferente intensidad.{" "}
                    <span className="italic">Ejemplo:</span> casa/residencia.
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Antonomía:</span>
                <ul className="list-disc pl-8">
                  <li>
                    <span className="italic">Graduales:</span> Hay niveles
                    intermedios. <span className="italic">Ejemplo:</span>{" "}
                    visible/invisible (translúcido).
                  </li>
                  <li>
                    <span className="italic">Complementarios:</span> Uno elimina
                    al otro. <span className="italic">Ejemplo:</span>{" "}
                    hablar/callar.
                  </li>
                  <li>
                    <span className="italic">Recíprocos:</span> Dependen uno del
                    otro. <span className="italic">Ejemplo:</span> entrar/salir.
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">
                  Deducción de significados por contexto:
                </span>
                <ul className="list-disc pl-8">
                  <li>Uso del entorno textual para inferir significados.</li>
                  <li>
                    Ejercicios prácticos con sustitución de palabras por
                    sinónimos o antónimos adecuados.
                  </li>
                </ul>
              </li>
            </ul>

            <h2 className="text-xl font-bold text-[#274c47] mt-6 mb-4">
              Coherencia y cohesión en los textos
            </h2>
            <p className="text-gray-700 text-base">
              Estas son cualidades fundamentales para garantizar que un texto
              sea comprensible y eficaz.
            </p>
            <ul className="list-disc pl-5 text-gray-700 text-base">
              <li>
                <span className="font-bold">Coherencia:</span>
                <ul className="list-disc pl-8">
                  <li>
                    Relación lógica y ordenada entre ideas dentro del texto.
                  </li>
                  <li>
                    Unidad temática: Cada párrafo debe centrarse en una idea
                    principal, complementada con ideas secundarias.
                  </li>
                  <li>
                    <span className="italic">Ejemplo:</span> "Una idea inicial
                    se desarrolla de manera que los párrafos se relacionan y
                    apoyan la temática general."
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">Cohesión:</span>
                <ul className="list-disc pl-8">
                  <li>
                    Uso de elementos gramaticales y léxicos que conectan las
                    partes del texto.
                  </li>
                  <li>
                    Herramientas principales:
                    <ul className="list-disc pl-10">
                      <li>Conectores: Además, sin embargo, por lo tanto.</li>
                      <li>
                        Repetición controlada: Referencia a conceptos clave.
                      </li>
                      <li>
                        Pronombres: Relacionan ideas con claridad.{" "}
                        <span className="italic">Ejemplo:</span> este, aquel,
                        cuyo.
                      </li>
                      <li>
                        Puntuación: Facilita la separación y conexión de ideas.
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-bold">
                  Diferencia entre coherencia y cohesión:
                </span>
                <ul className="list-disc pl-8">
                  <li>
                    La coherencia se refiere al contenido lógico del texto.
                  </li>
                  <li>
                    La cohesión está relacionada con la estructura lingüística
                    que articula las ideas.
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

export default Nivel11;
