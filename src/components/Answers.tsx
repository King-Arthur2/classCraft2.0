import React from "react";

interface AnswersProps {
  answers: string[];
}

const Answers: React.FC<AnswersProps> = ({ answers }) => {
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

export default Answers;
