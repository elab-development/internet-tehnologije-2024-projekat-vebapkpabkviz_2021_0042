import React, { useState, useEffect, useRef } from "react";
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
  const [errorMsg, setErrorMsg] = useState("");

  const mountedRef = useRef(true);

  const fetchQuestionData = async () => {
    try {
      await new Promise((r) => setTimeout(r, 300));
      const { data } = await axios.get("http://localhost:8000/api/random-question");

      const question = data?.question;
      const correct = data?.correct_answer;
      const incorrect = data?.incorrect_answers;

      if (!question || !correct || !Array.isArray(incorrect)) {
        throw new Error("Bad payload shape");
      }

      if (!mountedRef.current) return;

      setQuestionData({ question, correct_answer: correct });
      setOptions(shuffleArray([...incorrect, correct]));
      setSelectedAnswer("");
      setIsCorrect(null);
      setErrorMsg("");
    } catch (err) {
      if (!mountedRef.current) return;
      console.error("Error fetching question:", err);
      setErrorMsg("Failed to load question. Try again.");
    }
  };

  const handleAnswerSelection = (answer) => setSelectedAnswer(answer);

  const handleSubmit = () => {
    if (!questionData) return;
    setIsCorrect(selectedAnswer === questionData.correct_answer);
  };

  const resetModal = () => {
    setQuestionData(null);
    setOptions([]);
    setSelectedAnswer("");
    setIsCorrect(null);
    setErrorMsg("");
    fetchQuestionData();
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchQuestionData();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-slate-300 border rounded-md overflow-hidden shadow-md max-w-xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-3 bg-slate-400">
          <h2 className="text-lg font-bold">Question</h2>
          <IoMdClose
            onClick={closeModal}
            className="cursor-pointer text-3xl ml-2"
            style={{ transition: "transform 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          />
        </div>

        <div className="px-6 py-3 flex flex-col gap-3">
          {errorMsg && (
            <p className="text-red-600">
              {errorMsg} <button className="underline" onClick={fetchQuestionData}>Retry</button>
            </p>
          )}

          {questionData ? (
            <>
              <p
                className="mt-3"
                dangerouslySetInnerHTML={{ __html: questionData.question }}
              />
              <ul className="mt-3">
                {options.map((answer, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer ${selectedAnswer === answer ? "font-bold" : ""}`}
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
                  disabled={!selectedAnswer}
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
                <p className={`mt-3 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "Correct!" : "Incorrect!"}
                </p>
              )}
            </>
          ) : !errorMsg ? (
            <p>Loading question...</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
