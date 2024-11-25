import React from "react";

const ReadingPage: React.FC = () => {
  // Datos de ejemplo: texto principal, preguntas y respuestas
  const readingText =
    "En un mundo medieval, los aventureros se enfrentaban a desafíos diarios. Cada decisión que tomaban influía en sus destinos. Este texto describe el viaje de un caballero en busca de un tesoro perdido, enfrentándose a dragones, acertijos y pruebas de valor.";

  const questions = [
    {
      question: "¿Cuál es el objetivo principal del caballero?",
      options: ["Encontrar un tesoro", "Huir de los dragones", "Proteger su reino", "Viajar por diversión"],
      correct: 0, // Índice de la respuesta correcta
    },
    {
      question: "¿Qué desafíos enfrenta el caballero?",
      options: ["Dragones", "Ríos", "Gigantes", "Nada"],
      correct: 0,
    },
    {
      question: "¿Qué influencia tienen sus decisiones?",
      options: ["Cambian su destino", "Nada", "Lo hacen más fuerte", "Son irrelevantes"],
      correct: 0,
    },
  ];

  return (
    <div style={styles.container}>
      {/* Texto principal */}
      <div style={styles.textContainer}>
        <h1 style={styles.title}>Lectura Principal</h1>
        <p style={styles.text}>{readingText}</p>
      </div>

      {/* Preguntas */}
      <div style={styles.questionsContainer}>
        {questions.map((question, index) => (
          <div key={index} style={styles.questionSection}>
            <h2 style={styles.question}>{question.question}</h2>
            <div style={styles.optionsContainer}>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} style={styles.option}>
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#F5DEB3", // Parchment beige
    minHeight: "100%", // Altura mínima de la página
    width: "1220px",
  },
  textContainer: {
    maxWidth: "800px",
    backgroundColor: "#FAF9F6", // Blanco hueso
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "40px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#8B4513", // Madera oscura
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    color: "#2F4F4F", // Verde bosque profundo
    lineHeight: "1.5",
  },
  questionsContainer: {
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  questionSection: {
    backgroundColor: "#FAF9F6", // Blanco hueso
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
  },
  question: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: "20px",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
  },
  option: {
    flex: 1,
    backgroundColor: "#C1A14A", // Oro viejo
    color: "#FAF9F6", // Blanco hueso
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease",
  },
  optionHover: {
    backgroundColor: "#8B4513", // Madera oscura al pasar el cursor
  },
};

export default ReadingPage;
