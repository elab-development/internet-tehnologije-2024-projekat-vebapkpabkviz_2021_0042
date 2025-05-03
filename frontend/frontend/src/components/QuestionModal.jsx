import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const QuestionModal = ({ closeModal }) => {
  const [questionData, setQuestionData] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  // Fetch data from the API endpoint
  const fetchQuestionData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.get(
        "http://127.0.0.1:8000/api/random-question"
      );
      setQuestionData(response.data);
      setOptions(
        shuffleArray([
          ...response.data.incorrect_answers,
          response.data.correct_answer,
        ])
      );
    } catch (error) {
      //console.error("Error fetching question:", error);
      // Call the API again in case of an error
      fetchQuestionData();
    }
  };

  // Handle user's answer selection
  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  // Handle user's submission
  const handleSubmit = () => {
    if (selectedAnswer === questionData.correct_answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  // Reset modal state for a new question
  const resetModal = () => {
    setQuestionData(null);
    setOptions([]);
    setSelectedAnswer("");
    setIsCorrect(null);
    fetchQuestionData(); // Fetch a new question
  };

  // Fetch initial question data on component mount
  useEffect(() => {
    fetchQuestionData();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-slate-300 border rounded-md overflow-hidden shadow-md max-w-md p-6">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold">Question</h2>
          <IoMdClose
            onClick={closeModal}
            className="cursor-pointer text-3xl ml-2"
            style={{ transition: "transform 0.2s" }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        </div>
        {questionData ? (
          <>
            <p
              className="mt-3"
              dangerouslySetInnerHTML={{ __html: questionData.Question }}
            />
            <ul className="mt-3">
              {options.map((answer, index) => (
                <li
                  key={index}
                  className={`cursor-pointer ${
                    selectedAnswer === answer ? "font-bold" : ""
                  }`}
                  onClick={() => handleAnswerSelection(answer)}
                >
                  {answer}
                </li>
              ))}
            </ul>
            <div className="flex flex-row gap-3">
              <button
                onClick={handleSubmit}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
              <button
                onClick={resetModal}
                className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Next Question
              </button>
            </div>
            {isCorrect !== null && (
              <p
                className={`mt-3 ${
                  isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {isCorrect ? "Correct!" : "Incorrect!"}
              </p>
            )}
          </>
        ) : (
          <p>Loading question...</p>
        )}
      </div>
    </div>
  );
};

export default QuestionModal;