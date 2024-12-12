import React from "react";

interface QuestionTitleProps {
  title: string;
  question: string;
}

const QuestionTitle: React.FC<QuestionTitleProps> = ({ title, question }) => {
  return (
    <div className="question-title-container">
      <p className="question-title">{title}</p>
      <p className="question-text">{question}</p>
    </div>
  );
};

export default QuestionTitle;
