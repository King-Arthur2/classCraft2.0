//Importaciones externas
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Importaciones internas, componentes, hooks, contextos, estilos.
import PowersBar from "../layouts/powersBar"; // Componente de la barra de poderes
import { useAuth } from "../../context/AuthContext"; // Contexto de autenticación
import { User } from "../../types/user"; // Interface para el usuario.
import { sendUserStats, unlockLevels } from "../../api/auth"; // Funciones de petición al servidor

import "../../styles/styles-GameScreen.css";

// Componente principal
const Nivel7: React.FC = () => {
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
  const [currentLevelIndex] = useState(0);
  const nextLevel = 8;

  // Estados para el manejo de los poderes
  const [powers, setPowers] = useState<number[]>([]);

  // Estados para el manejo de las recompensas
  const [aprobado, setAprobado] = useState<boolean>(false);
  const [gold, setGold] = useState<number>(0);
  const [experience, setExperience] = useState<number>(0);

  // Estado para manejar el tiempo y las respuestas
  const [time, setTime] = useState<number>(100);

  // Cargar el archivo JSON con los datos del tutorial
  useEffect(() => {
    // Cargar el archivo JSON
    fetch("data/mundo2.json")
      .then((response) => response.json())
      .then((data) => {
        // Establecer el nivel actual al primer nivel del JSON
        setCurrentLevel(data.niveles[currentLevelIndex]);


        // Establecer el tiempo inicial del nivel
        setTime(data.niveles[currentLevelIndex].tiempo);

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


  // Manejar el final del nivel
  const handleFinish = async () => {
      if (!user.levelsUnlocked.includes(nextLevel)) {
        await unlockLevels(user._id, nextLevel);
        setGold(100);
        setExperience(100);
      } 
      setAprobado(true);
      setIsModalOpen(true);
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

  //

  const handlerPowers = () => {
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
            <h2 className="text-xl font-bold text-[#274c47] mb-2">
              "Introducción"
            </h2>
            <p className="text-gray-700 text-base">
              Existe una diversidad de textos que definen su sentido y
              orientación de acuerdo con la situación comunicativa (quién habla
              o escribe, a quién se le habla o escribe, de qué tema se habla o
              escribe, en qué contexto se produce la comunicación y, sobre
              todo, con qué propósito, con qué intención se dice lo que se
              dice).
              <br />
              Todos los elementos de la situación comunicativa tienen relevancia
              como un conjunto, como una totalidad que hay que considerar cuando
              se habla o se escribe; cuando se escucha o se lee.
            </p>
            <br />
            <h2 className="text-xl font-bold text-[#274c47] mb-2">
              "Tipos de textos"
            </h2>
            <br />
            <p className="text-gray-700 text-base">
              Un tipo de texto se define por el propósito comunicativo; pide la
              elección de una forma adecuada para transmitir lo que se quiere:
              narrar, explicar, describir, exponer, convencer, dar
              instrucciones, dialogar, entre otros. Esto es, necesitamos elegir
              un tipo textual que por su caracterización nos sirva para decir lo
              que queremos sin que se preste a ninguna clase de equívoco.
              <br />
              <br />
              A continuación, veremos cada uno de ellos con más profundidad.
              <br />
              <br />
            </p>
            <h3 className="text-gray-700 text-base">
              <span className="font-bold">Texto Narrativo</span>
            </h3>
            <br />
            <p className="text-gray-700 text-base">
              ¿Qué es?
              <br />
              <br />
              Es aquel que predomina en el relato, es decir, la modalidad
              conocida como narración, que desarrolla una historia en un tiempo
              y un espacio determinados y en la que se desarrollan las acciones
              con personajes. Puede definirse como la sucesión de hechos que se
              relacionan en el tiempo (real o imaginario) y en el espacio y que
              son protagonizados por individuos (personas, animales o cosas
              humanizadas). De acuerdo a María Moliner (1998), narrar es “decir
              o escribir una historia o cómo ha ocurrido cierto suceso”.
              <br />
              <br />
              Ejemplo:
              <br />
              <br />
              <span className="italic">
                “Pedro iba por la calle cuando se topó con un afiche que tenía
                su foto y se le reportaba como ‘persona extraviada’. Pedro se
                vio asombrado ante estos hechos.”
              </span>
              <br />
              <br />
              Rasgos:
              <br />
              <br />
              Algunos rasgos que caracterizan a la narración son:
              <br />
            </p>
            <ul className="pl-5 text-gray-700 text-base">
              <li>
                1. La temporalidad. Sucesión de acontecimientos de un tiempo que
                transcurre o avanza.
              </li>
              <li>
                2. La unidad temática. Garantiza por lo menos un personaje,
                animado o inanimado, individual o colectivo, real o ficticio.
              </li>
              <li>3. La transformación. El cambio de los estados de ánimo.</li>
              <li>
                4. La unidad de acción. Hay un proceso integrador. Se llega a
                una situación final a partir de un proceso de transformación.
              </li>
              <li>
                5. La causalidad. Equivale a una forma de intriga. Es el
                resultado de las relaciones causales entre los acontecimientos
                (Adam y Revaz, 1996).
              </li>
              <li>
                6. La secuencia textual. Es una red de relaciones jerárquicas,
                una tonalidad que se puede descomponer en partes relacionadas
                entre sí y con el todo; forma parte de una construcción mayor,
                aunque tiene relativa autonomía.
              </li>
            </ul>
            <p className="text-gray-700 text-base">
              <br />
              <br />
              Elementos afines:
              <br />
              <br />
              Otros elementos afines a los textos narrativos son:
              <br />
            </p>
            <br />
            <br />
            <ul className=" text-gray-700 text-base">
              <li>
                1. Verbos en acción. Representan acciones de los personajes y le
                dan dinamismo al relato.
              </li>
              <li>2. Uso relevante del tiempo pasado.</li>
              <li>3. Marcadores y conectores temporales.</li>
              <li>
                4. Marcas lingüísticas que indican la perspectiva desde la que
                se narra. Pronombres personales, posesivos, demostrativos;
                verbos, adverbios, referencias anafóricas, entre otros.
              </li>
            </ul>
            <p className="text-gray-700 text-base">
              <br />
              <br />
              Ejemplo:
              <span className="italic">
                “Pedro iba por la calle cuando se topó con un póster que tenía
                un afiche pegado. Era un letrero con su su foto y le
                reportaba como ‘persona extraviada’. Pedro se vio asombrado ante
                estos hechos.”
              </span>
            </p>
            <br />
            <br />
            <h3 className="text-gray-700 text-base">
              <span className="font-bold">Texto Expositivo</span>
            </h3>
            <br />
            <br />
            <p className="text-gray-700 text-base">
              <span className="font-bold">¿Qué es?</span>
              <br />
              <br />
              Es una estructura textual ligada al análisis y la síntesis, a la
              necesidad de explicar o exponer algo en términos de su
              caracterización, las relaciones causa-efecto o de comparación,
              entre otros aspectos.
              <br />
              <br />
              Presenta datos, hechos o conceptos de forma inductiva, deductiva o
              yuxtapuesta. Puede contener secuencias descriptivas.
            </p>
            <p className="text-gray-700 text-base mt-4">
              <span className="font-bold">Ejemplo de texto expositivo</span>
              <br />
              <br />
            </p>
            <div className="text-gray-700 text-base text-center italic">
              <span>Sangre y Fuego</span>
              <br />
              <span>Atenayhs Castro</span>
            </div>
            <p className="text-gray-700 text-base">
              <br />
              <br />
              El inicio de la producción de pigmentos rojos orgánicos inicia en
              el siglo VIII a.C. con la extracción de lo que conocemos
              comúnmente como carmín, que se obtiene de las entrañas del gusano
              de quermes (kermes vermilio). Durante mucho tiempo ese color sació
              a artistas y fabricantes de telas hasta la llegada de los
              españoles a América. El carmín tradicional fue entonces sustituido
              por un pigmento extraído de la cochinilla (Dactylopius coccus),
              superando a su predecesor en permanencia y brillo de tonos.
              <br />
              <br />
              En cuanto a pigmentos rojos de origen mineral, los tonos terrosos,
              que se extraen del óxido de hierro y se fabrican con residuos de
              industrias químicas como el barro de alumbre, son utilizados desde
              1500 a.C. Estos rojos se conocen como rojo indio y rojo de Pompeya
              (en honor a los vestigios de pintura encontrados en esa ciudad).
              El rojo cinabrio, que da brillantes tonos naranjas y terracotas de
              larga duración, es un compuesto inocuo de azufre y mercurio.
              <br />
              <br />
              El alboroto de los alquimistas de la edad media por la
              transformación de los colores, especialmente el rojo, -creían que
              las piezas se teñían a través de magia por efecto de reacciones
              químicas de los minerales- así como la profunda atracción que
              sentían los artistas por este color, hizo que se dejara de lado la
              producción casera y se crearon pequeños negocios dedicados a la
              fabricación de pigmentos a través de complicados procesos
              químicos.
              <br />
              <br />
              Hoy por hoy se conocen alrededor de 50 rojos distintos de
              producción industrial, si bien hay quienes aún los preparan
              artesanalmente. Los tonos del rojo van desde el rosa pastel hasta
              el púrpura intenso. Entre los rojos de producción industrial se
              encuentra el rojo cadmio, preferido por su intensidad y
              permanencia, hasta ahora insuperables. Su pureza se traduce en un
              color más limpio y brillante, pero es altamente tóxico. Poco
              veneno no mata, pero, de hecho, es uno de los principales
              causantes de una enfermedad que debilita los órganos vitales del
              cuerpo de quienes se dejan llevar por el apetitoso aspecto del
              color y chupan el pincel.
            </p>
            <h3 className="text-lg font-bold text-gray-700 mt-6">Rasgos</h3>
            <ul className=" pl-5 text-gray-700 text-base mt-2">
              <li>
                1. Función referencial. El tema aparece claramente explícito,
                casi siempre, desde el título del texto.
              </li>
              <li>
                2. Modalidad de divulgación. Existen diversas formas de
                divulgación que pueden emplear diferentes soportes, como:
                <ul className="list-disc pl-8">
                  <li>
                    Publicaciones en papel (periódicos, revistas, enciclopedias,
                    etc.).
                  </li>
                  <li>Programas de radio y televisión.</li>
                  <li>Divulgación en la Red (internet).</li>
                </ul>
              </li>
              <li>
                3. Uso de la tercera persona o del modo impersonal.
                <ul className="list-disc pl-8">
                  <li>
                    Quien escribe organiza el mensaje al manejar conceptos o
                    definiciones.
                  </li>
                  <li>
                    Es frecuente el uso de la primera persona del plural
                    ("nosotros") como recurso para establecer proximidad con el
                    lector. Ejemplo: Uso de términos como “presentamos”.
                  </li>
                </ul>
              </li>
              <li>
                4. Relación entre emisor y receptor.
                <ul className="list-disc pl-8">
                  <li>El emisor siempre sabe más que el receptor.</li>
                  <li>
                    Organiza hechos, conceptos o fenómenos para exponer,
                    justificar o valorar información.
                  </li>
                  <li>
                    Se incluyen ejemplos que aclaren ideas, como los
                    relacionados con la conmutatividad de la suma.
                  </li>
                </ul>
              </li>
              <li>
                5. Predominio de formas impersonales. Uso frecuente de
                expresiones impersonales. Ejemplo: “Inclusive puedes
                experimentar”.
              </li>
              <li>
                6. Registro formal. Uso de un registro adecuado y léxico formal.
                Se evita, en lo posible, el uso de la primera persona.
              </li>
              <li>
                7. Ausencia de subjetividad. No se incluyen valoraciones o
                posturas personales. Ejemplo: Se presentan ideas objetivas como
                la suma en forma de preguntas y respuestas.
              </li>
              <li>
                8. Precisión léxica. Uso de tecnicismos, cultismos, préstamos y
                extranjerismos científicos. Ejemplo: Presentación de listas
                claras de pasos a seguir.
              </li>
              <li>
                9. Uso de verbos en indicativo. Predominan los tiempos presente
                y futuro del indicativo. Ejemplo:
                <ul className="list-disc pl-8">
                  <li>
                    “La selección natural es el proceso evolutivo por
                    excelencia”.
                  </li>
                  <li>
                    “El azar desempeña un papel importante en la evolución”.
                  </li>
                  <li>“Te puede ser útil para explotar”.</li>
                </ul>
              </li>
              <li>
                10. Reformulaciones y ejemplificaciones. Inclusión de esquemas y
                ejemplos para aclarar ideas.
              </li>
              <li>
                11. Uso de términos técnicos o científicos. Empleo de
                vocabulario específico que interioriza al lector en el texto.
              </li>
              <li>
                12. Conectores para relaciones entre ideas. Uso de conectores
                que introducen ejemplos, relaciones o finalidades entre las
                ideas expuestas.
              </li>
              <li>
                13. Indicadores dentro del texto. Uso de marcas o elementos que
                hacen referencia a otras partes del texto para facilitar la
                comprensión.
              </li>
            </ul>
            <br />
            <h3 className="text-gray-700 text-base">
              <span className="font-bold">Texto Argumentativo</span>
            </h3>
            <br />
            <p className="text-gray-700 text-base">
              <span className="font-bold">¿Qué es?</span>
              <br />
              <br />
              Es una organización textual centrada en el juicio y en la toma de
              posición respecto de algún asunto polémico. Implica la defensa de
              una tesis sustentada con argumentos. Consiste en dar una opinión
              fundamentada y crítica sobre un hecho, causa o circunstancia.
            </p>
            <h3 className="text-lg font-bold text-gray-700 mt-6">Rasgos</h3>
            <ul className=" pl-5 text-gray-700 text-base mt-2">
              <li>
                1. Plantea una situación lógica. La presencia de dos o más
                personas que dialogan de manera real o evocada. Siempre hay dos
                o más posiciones, dos o más opiniones.
              </li>
              <li>
                2. Tiene como propósitos: persuadir, convencer o demostrar.
              </li>
              <li>
                3. Los temas son polémicos. El cambio de los estados de ánimo.
              </li>
              <li>
                4. Implica la existencia de un tema o problema que tiene, por lo
                menos, dos posibles soluciones.
              </li>
              <li>
                5. Exige una situación democrática de parte de los
                contendientes.
              </li>
              <li>6. En el texto argumentativo decir es hacer.</li>
              <li>
                7. La organización textual del texto argumentativo tiene las
                siguientes partes: introducción, narración o exposición de
                hechos, argumentación y conclusión.
              </li>
              <li>
                8. La tesis es la idea fundamental en torno a la cual se debate
                y aparece entre algunas de las fases de la organización del
                texto.
              </li>
              <li>
                9. Hay diversos tipos de argumentos como los de autoridad, las
                analogías, fenómenos, datos científicos, generalización,
                mediante ejemplos; recursos como las preguntas retóricas, la
                definición, la aserción, la disyunción, la explicación, etc.
              </li>
            </ul>
            <p className="text-gray-700 text-base mt-4">
              <span className="font-bold">Ejemplo:</span>
              <br />
              <br />
              <span className="italic">FCH descarta alza de impuestos</span>
              <br />
              <br />
              <span className="font-bold">Introducción</span>
              <br />
              Señala el presidente que para el presupuesto 2011 se buscará una
              propuesta “que no significa reducir impuestos”, sino reducir
              enormemente la tramitología administrativa”.
              <br />
              <br />
              <span className="font-bold">Exposición y argumentos</span>
              <br />
              El presidente Felipe Calderón descartó que su proyecto de
              presupuesto para el próximo año incluya un alza de impuestos.
              <br />
              En entrevista con Radio Fórmula, el presidente anticipó que “no
              habrá una propuesta de alza de impuestos para el paquete fiscal
              2011”, por el contrario, dijo, se buscará una propuesta “que no
              significa reducir impuestos”, sino “buscar una propuesta que
              reduzca enormemente la tramitología administrativa”.
              <br />
              <br />
              Señaló que debido a la delicada situación de las finanzas públicas
              sería poco responsable modificar a la baja la estructura fiscal;
              ya que “incurriríamos en un riesgo financiero para México que no
              vale la pena correr”.
              <br />
              <br />
              <span className="font-bold">Conclusión</span>
              <br />
              El enfoque del presidente Felipe Calderón destaca una postura
              firme en mantener una estructura fiscal estable, priorizando la
              reducción de la tramitología administrativa como medida clave
              frente a la crisis.
            </p>
          </section>
        </div>

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

export default Nivel7;
