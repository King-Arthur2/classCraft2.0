// Componente auxiliar: Respuestas
const Answers: React.FC<{
  answers: string[];
  indexQuestion: number;
  lecturaIndex: number;
  isClickedArrayPregunta: boolean[];
  isClickedArrayRespuesta: boolean[];
  correctAnswer: number;
  onAnswerSelect: (
    indexAnswer: number,
    indexQuestion: number,
    lecturaIndex: number
  ) => void;
}> = ({
  answers,
  onAnswerSelect,
  indexQuestion,
  lecturaIndex,
  isClickedArrayPregunta,
  isClickedArrayRespuesta,
}) => {
  const isClicked = isClickedArrayPregunta[indexQuestion]; // Estado individual por pregunta

  return (
    <div className="flex direction-row gap-3 justify-between my-8">
      {answers.map((answer, index) => {
        return (
          <button
            key={index}
            className={`flex-1 p-2 text-black border-none rounded-xl cursor-pointer text-base text-left h-auto min-h-10 hover:bg-[#88c576]
              ${
                isClicked === false
                  ? "bg-white"
                  : isClickedArrayRespuesta[index]
                  ? true
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-red-500"
              }`}
            onClick={() => onAnswerSelect(index, indexQuestion, lecturaIndex)}
            disabled={isClicked}
          >
            {answer}
          </button>
        );
      })}
    </div>
  );
};

export default Answers;