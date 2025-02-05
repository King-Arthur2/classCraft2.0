//Importaciones externas
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Importaciones internas, componentes, hooks, contextos, estilos.
import PowersBar from "../layouts/powersBar"; // Componente de la barra de poderes
import { useAuth } from "../../context/AuthContext"; // Contexto de autenticación
import { User } from "../../types/user"; // Interface para el usuario.
import { sendUserStats, unlockLevels } from "../../api/auth"; // Funciones de petición al servidor

//Importaciones de images informativas para los niveles
import informativa1 from "../../assets/imgInformativas/informativa-nivel17-1.png";
import informativa2 from "../../assets/imgInformativas/informativa-nivel17-2.png";
//Componente auxiliar: Título de la pregunta

// Componente principal
const Nivel17: React.FC = () => {
  // Estados y referencias locales del componente.
  const navigate = useNavigate();
  const { user, setUser } = useAuth() as {
    user: User;
    setUser: (user: User) => void;
  };
  //Estados para el manejo de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para el manejo de los datos por nivel
  const [currentLevel, setCurrentLevel] = useState<any>(null);
  const [currentLevelIndex] = useState(4);
  const nextLevel = 18;

  // Estados para el manejo de los poderes
  const [powers, setPowers] = useState<number[]>([]);

  // Estados para el manejo de las recompensas
  const [aprobado, setAprobado] = useState<boolean>(false);
  const [gold, setGold] = useState<number>(0);
  const [experience, setExperience] = useState<number>(0);

  // Estado para manejar el tiempo y las respuestas
  const [time, setTime] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Referencia al intervalo del tiempo

  // Cargar el archivo JSON con los datos del tutorial
  useEffect(() => {
    // Cargar el archivo JSON
    fetch("data/mundo3.json")
      .then((response) => response.json())
      .then((data) => {
        // Establecer el nivel actual al primer nivel del JSON
        setCurrentLevel(data.niveles[currentLevelIndex]);
      })
      .catch((error) => console.error("Error al cargar el JSON:", error));
  }, [currentLevelIndex]);

  // Actualizar los poderes del usuario
  useEffect(() => {
    setPowers(user.powers);
  }, [user]);

  // Formatear el tiempo en minutos y segundos
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const startTimer = () => {
    if (intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000); // Incrementa cada segundo
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Limpia el intervalo
      intervalRef.current = null; // Resetea la referencia
    }
  };

  // Manejar el final del nivel
  const handleFinish = async () => {
    stopTimer();
    time > 104 ? setAprobado(false) : setAprobado(true);
    if (!user.levelsUnlocked.includes(nextLevel)) {
      await unlockLevels(user._id, nextLevel);
    }
    setGold(100);
    setExperience(100);
    setIsModalOpen(true);
  };

  const handlerPowers = () => {
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
    setIsModalOpen(false);
    navigate("/dashboard");
  };

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
              Velocidad de lectura
            </h2>
            <p className="text-gray-700 text-base">
              La velocidad de lectura se refiere a la cantidad de palabras que
              leemos por minuto, en silencio, siguiendo un ritmo de lectura
              natural y con la intención de comprender el contenido de un texto
              determinado.
              <br />
              <br />
              ¿Qué tan rápido lees y cómo afecta esto la comprensión de lo que
              lees? Cuando hablamos de velocidad lectora, nos referimos a la
              cantidad de palabras que leemos por minuto, en silencio, siguiendo
              un ritmo de lectura natural y con la intención de comprender el
              contenido del texto.
              <br />
              <br />
              Si leemos muy rápido podemos perder detalles importantes del
              texto, y si por el contrario lo hacemos muy despacio, será fácil
              perder concentración e interés en la lectura, así que lo ideal es
              lograr una velocidad que nos permita fluidez sin perder precisión.
              Cuando leemos con fines de aprendizaje nos tardamos más que cuando
              lo hacemos por placer: se considera que una velocidad lectora
              normal “consiste en leer entre 250 y 500 palabras por minuto en la
              lengua materna y un 70% de comprensión”.
            </p>
            <br />
            <div className="flex justify-center my-2">
              <img className="w-2/6" src={informativa1} alt="" />
            </div>
            <p className="text-gray-700 text-base">
              Es muy importante saber que leemos más rápido de lo que
              vocalizamos, pues al leer tenemos puntos de fijación, esos
              pequeños detenimientos que hace el ojo, para cada fragmento que
              vamos leyendo. Tanto la duración como lo que se recupera en cada
              fijación, cambia con el tiempo.
              <br />
              <br />
              En cada fijación reconocemos muchas palabras antes de terminar de
              leerlas por completo, así que por ello es importante, si queremos
              mejorar la velocidad de lectura, evitar la costumbre de verbalizar
              mentalmente las palabras, leer palabra por palabra o regresar en
              el renglón varias veces. Para mejorar la velocidad lo que queremos
              lograr es una fijación ocular amplia, es decir, lograr que el ojo
              registre, en una sola fijación, el mayor número posible de
              palabras. Esto es una habilidad, lo cual significa que podemos
              mejorar con práctica.
            </p>
            <br />
            <div className="flex justify-center my-2">
              <img className="w-4/6" src={informativa2} alt="" />
            </div>
            <br />
            <p className="text-gray-700 text-base">
              Como verás, nivel universitario lo normal es leer entre 280 y 480
              palabras por minuto. Como vimos en el video, para los subtítulos
              que se presentan en las películas se considera una velocidad de
              180 palabras por minuto para que el espectador esté cómodo y pueda
              seguir las imágenes con tranquilidad. Seguramente, después de
              interpretar tus resultados, ahora quieres saber qué puedes hacer
              para leer más rápido. Lee a continuación algunos consejos:
            </p>
            <br />
            <br />
            <div className="flex flex-col gap-7">
              <div className="flex flex-row gap-4">
                <div className="flex text-center flex-col text-black w-full p-4 rounded-lg mb-4 bg-[#f6fff8] border-[#eaf4f4] shadow-pixel">
                  <p className="text-xl ">1</p>
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center justify-items-center">
                      Antes que todo, es indispensable verificar que nuestros
                      ojos estén funcionando correctamente, es decir, es
                      necesaria una visita al optometrista para confirmar que
                      nuestra visión sea 20/20.
                    </p>
                  </div>
                </div>
                <div className="flex text-center flex-col text-black w-full p-4 rounded-lg mb-4 bg-[#f6fff8] border-[#eaf4f4] shadow-pixel">
                  <p className="text-xl ">2</p>
                  <p>
                    Lo siguiente es reducir el número de puntos de fijación,
                    pues obviamente ganamos tiempo, de ahí que evitemos la
                    práctica de verbalizar mientras leemos. Además, mientras
                    menos regresiones hagamos para corroborar lo que leímos,
                    será mucho mejor.
                  </p>
                </div>
                <div className="flex text-center flex-col text-black w-full p-4 rounded-lg mb-4 bg-[#f6fff8] border-[#eaf4f4] shadow-pixel">
                  <p className="text-xl ">3</p>
                  <p>
                    Otra sugerencia es apoyarnos en audiolibros cuya velocidad
                    se pueda modular. Ajustamos entonces el ritmo a un nivel
                    normal para nosotros o levemente más rápido de lo que
                    consideremos cómodo, así nos obligaremos a seguir un ritmo
                    constante, lo cual es una característica de todo buen
                    lector.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex text-center flex-col text-black w-full p-4 rounded-lg mb-4 bg-[#f6fff8] border-[#eaf4f4] shadow-pixel">
                  <p className="text-xl ">4</p>
                  <div className="flex items-center justify-center ">
                    <p className="text-center justify-items-center">
                      Estar concentrados es vital. Es decir, no divaguemos. La
                      recompensa vale este esfuerzo. Recuerda que a mayor
                      fluidez, tenemos más concentración, más atención, mejor
                      memoria y mejor uso de nuestros recursos cognitivos para
                      tener una experiencia de lectura maravillosa.
                    </p>
                  </div>
                </div>
                <div className="flex text-center flex-col text-black w-full p-4 rounded-lg mb-4 bg-[#f6fff8] border-[#eaf4f4] shadow-pixel">
                  <p className="text-xl ">5</p>
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center justify-items-center">
                      Lleva un registro que muestre cómo progresa tu habilidad
                      de lectura. Sentirás mucha satisfacción al ir viendo tus
                      progresos.
                    </p>
                  </div>
                </div>
                <div className="flex text-center flex-col text-black w-full p-4 rounded-lg mb-4 bg-[#f6fff8] border-[#eaf4f4] shadow-pixel">
                  <p className="text-xl ">6</p>
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center justify-items-center">
                      Finalmente te recomendamos el uso de software específico
                      para identificar palabras a diferentes ritmos. Te
                      invitamos a practicar con uno de los muchos programas
                      libres que están disponibles en internet para este
                      propósito.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className="flex justify-center p-4 text-center">
              <p className="text-gray-700 text-base">
                Ejercicio:{" "}
                <span className="font-bold">
                  ¿Quieres saber cuántas palabras lees por minuto?
                </span>
                <br />
                Entonces realiza el siguiente test. El siguiente botón iniciará
                la lectura, se tiene un tiempo de{" "}
                <span className="font-bold">1 minuto y 44 segundos</span> como
                máximo para terminarlo.
              </p>
            </div>
            <div className="flex justify-center ">
              <button
                className="mt-4 pt-3 pb-3 pl-5 pr-5 bg-[#2f4f4f] text-white border-2 cursor-pointer text-base font-bold hover:bg-[#fff] hover:text-[#2f4f4f] hover:border-[#2f4f4f]"
                onClick={startTimer}
              >
                Iniciar
              </button>
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
          powersDisabled={[true, true, true]}
        />
      </aside>

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

export default Nivel17;
