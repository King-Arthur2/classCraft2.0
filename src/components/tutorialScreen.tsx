import React, { useState } from "react";
import "../styles/styles-GameScreen.css"; // Archivo de estilos
import powerIcon from "../assets/corazon.png";
import { useNavigate} from "react-router-dom";

const QuestionTitle: React.FC<{ title: string; question: string }> = ({ title, question }) => {
  return (
    <div className="question-title-container">
      <p className="question-title">{title}</p>
      <p className="question-text">{question}</p>
    </div>
  );
};

const Answers: React.FC<{ answers: string[] }> = ({ answers }) => {

  return (
    <div className="answers">
      {answers.map((answer, index) => (
        <button key={index} className="answer">
          {answer}
        </button>
      ))}
    </div>
  );
};

const GameScreen: React.FC = () => {
const navigate = useNavigate(); // Hook para manejar la navegación
const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(true);
const [isModalOpen, setIsModalOpen] = useState(false);

  const questions = [
    { title: "Pregunta 1", question: "¿Qué función cumple el párrafo subrayado en el texto?", answers: ["Contiene el tema central que se aborda a lo largo de la noticia", 
        "Contiene el tema central que se aborda a lo largo de la noticia", 
        "Invita al lector a tomar medidas ante la situación en la Antártida"] },
    { title: "Pregunta 2", question: "¿Cuál es el tema central de la noticia?", answers: [
        "La comparación de los efectos que el cambio climático está provocando en la Antártida frente a otraszonas gélidas del mundo", 
        "Los resultados que han arrojado los estudios de investigadores chilenos respecto a los efectos del cambio climático en la Antártida", 
        "La polémica que ha surgido debido a las investigaciones de científicos chilenos, las cuales secontraponen con los datos de la NASA"] },
    { title: "Pregunta 3", question: "Los científicos “_______” detectaron primero el cambio en la tendencia climática gracias a la observación de lugares como “_______”.", 
        answers: ["chilenos - la isla Rey Jorge", 
            "españoles - el mar de Amundsen", "argentinos - la bahía Fildes"] },
  ];

  const handleFinish = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/dashboard");
  };

  const closeTutorialModal = () => {
    setIsTutorialModalOpen(false);
  };


  return (
    <div className="game-screen-container">

{/* Modal de Tutorial */}
{isTutorialModalOpen && (
  <div className="tutorial-modal-overlay" onClick={closeTutorialModal}>
    <div className="tutorial-modal" onClick={(e) => e.stopPropagation()}>
      <h2>Consejos Tutorial</h2>
      <p>
        Tienes un indicador de tiempo, debes asegurarte de leer y contestar todas las
        respuestas en el tiempo establecido.
      </p>
      <p>
        Cuando te equivoques con alguna respuesta, perderás 1 de tus tres corazones. Si pierdes los 3,
        perderás el nivel y tendrás que volverlo a intentar.
      </p>
      <p>
        Pero no te preocupes, también tienes poderes que pueden ayudarte a congelar el tiempo
        o ayudarte a descifrar la respuesta correcta.
      </p>
      <button className="close-modal-button" onClick={closeTutorialModal}>
        Entendido
      </button>
    </div>
  </div>
)}

      {/* Sección Izquierda */}
      <aside className="left-section">
        <div className="time-counter">
          <p>10:00</p>
        </div>
        <div className="hearts">❤️❤️❤️</div>
        <div className="score-counter">
          <p>00/10</p>
        </div>
      </aside>

      {/* Sección Central */}
      <main className="central-section">
        {/* Encabezado del Nivel */}
        <header className="level-header">
          <h1>Nivel 1</h1>
        </header>

        {/* Contenido de la Lectura */}
        <section className="reading-section">
          <h2>Cuatro olas de calor en la península Antártica</h2>
          <p>
          <p>
            Desde enero a primeros de octubre, la península antártica ha sufrido cuatro olas de calor.
            La primera de ellas, en febrero pasado, como ya conté entonces, pero es que después ha
            habido otras tres olas más: una en el verano austral y dos más durante el invierno que
 ahora está terminando. La última, entre el 9 y el 11 de julio. Los datos, recogidos en la isla
Rey Jorge y analizados por los investigadores de la Universidad de Chile, revelan que
 está siendo el año más caluroso en esta zona del inmenso continente de hielo desde hace
 tres décadas y ello no augura nada bueno […]. <br></br>


 

Son muchos los datos que aporta el trabajo, que se centra en el sur de la península
 antártica porque es allí, sobre todo en la isla Rey Jorge, donde hay una mayor concentración de bases científicas que han tomado los registros. Por cierto, no lejos de
 las bases españolas situadas en isla Livingston e isla Decepción. Y estos datos, que han
 confirmado con los recogidos por la NASA, nos cuentan que pese a que en agosto hubo
 un bajón en las temperaturas –también por debajo de la media–, no bastó para
 compensar los 34 días de calor (en términos antárticos, claro) que llegó a haber en la
 zona en meses anteriores. De hecho, este 2020 ni siquiera se ha llegado a helar la bahía
 Fildes, que da acceso a Rey Jorge.<br></br>
 

Así, la apreciación de que en la Antártida no se notaba el cambio climático […] da paso a
 una preocupante tendencia: “Sabemos que en la segunda mitad del siglo XX hubo un
 intenso calentamiento en la Antártida, alcanzándose los récords en los años ochenta […].
Ahora vemos que se están cumpliendo los modelos climáticos que decían que la situación
 en el continente iba a empeorar”, argumenta Cordero.<br></br>

En realidad, que esa tendencia estaba cambiando ya lo habían detectado científicos
 españoles en los glaciares, en el aumento de especies invasoras, en la disminución del
 krill […] y es visible en el debilitamiento de gigantes continentales como el glaciar
 Thwaites o el Pine Island, ambos en el mar de Amundsen […]. Para el científico chileno,
 “lo que se ve ahora en la Antártida es la consecuencia de lo que hemos hecho al
 clima en los últimos 20 años […]. Este año de temperaturas tan altas nos indica
 ahora una tendencia muy preocupante” [...].<br></br>

En la isla Rey Jorge ha nevado incluso tres veces más que hace medio siglo. ¿Significa
 eso que habrá más hielo? La respuesta de estos investigadores es que no. “Ese
incremento de precipitaciones tiene también un reflejo del cambio climático. Si sube la
 temperatura superficial del mar, nieva más, pero eso no supone que vaya a haber más
 hielo porque se pierde por las temperaturas más de lo que cae. En 40 años, el ritmo de
 pérdida se ha sextuplicado. También hemos visto que más al sur, el mar de Weddell ha
 estado en 2020 más frío que otros años; sin embargo, el mar de Amudsen estuvo más
cálido”, explica Cordero […].<br></br>
          </p>
          </p>
        </section>

        {/* Preguntas y Respuestas */}
        <section className="questions-section">
          {questions.map((q, index) => (
            <div className="question-block" key={index}>
              <QuestionTitle title={q.title} question={q.question} />
              <Answers answers={q.answers} />
            </div>
          ))}
        </section>
          <div className="finish-button-container">
            <button className="finish-button" onClick={handleFinish}>
            Terminar
            </button>
          </div>
      </main>

      {/* Sección Derecha */}
      <aside className="right-section">
      <div className="time-counter">
          <p>Poderes</p>
        </div>
        <div className="powers">
          <img src={powerIcon} alt="Poder 1" />
          <img src={powerIcon} alt="Poder 2" />
          <img src={powerIcon} alt="Poder 3" />
        </div>
      </aside>


      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Has terminado el nivel</h2>
            <p>Oro obtenido: 13 monedas</p>
            <p>Experiencia obtenida 10 puntos</p>
            <button className="close-modal-button" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
