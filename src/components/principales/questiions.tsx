import React from "react";

const Questions: React.FC<{ title: string; question: string }> = ({
  title,
  question,
}) => {
  return (
    <div className="bg-[#fff] p-2 rounded-lg my-8">
      <p className="text-lg text-black font-bold mb-1">{title}</p>
      <p className="text-base text-gray-600">
        {question.split("\n").map((line: string, index: number) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </p>
    </div>
  );
};

export default Questions;