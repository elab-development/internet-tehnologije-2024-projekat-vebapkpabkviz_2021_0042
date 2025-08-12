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

const FlagModal = ({ closeModal }) => {
  const [countryData, setCountryData] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [flag, setFlag] = useState(null);

  // Fetch data from the Restcountries API for a random country
  const fetchRandomCountry = async () => {
    try {
      const response = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name;flags"
      );
      const randomCountry =
        response.data[Math.floor(Math.random() * response.data.length)];
      setCountryData(randomCountry);

      const flagResponse = await axios.get(
        `https://restcountries.com/v3.1/name/${randomCountry.name.common}?fields=flags`
      );
      const flagData = flagResponse.data[0].flags.svg;

      setFlag(flagData);
      // Create options for the quiz
      const correctOption = {
        name: randomCountry.name.common,
        isCorrect: true,
      };

      const shuffledCountries = shuffleArray(response.data);

      const incorrectOptions = shuffledCountries
        .filter((country) => country.name.common !== randomCountry.name.common)
        .slice(0, 3)
        .map((country) => ({
          name: country.name.common,
          isCorrect: false,
        }));

      // Shuffle options
      const allOptions = [...incorrectOptions, correctOption].sort(
        () => Math.random() - 0.5
      );
      setOptions(allOptions);
    } catch (error) {
      console.error("Error fetching random country:", error);
    }
  };

  // Fetch initial random country data on component mount
  useEffect(() => {
    fetchRandomCountry();
  }, []);

  // Handle user's answer selection
  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  // Handle user's submission
  const handleSubmit = () => {
    if (selectedAnswer === countryData.name.common) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  // Reset modal state for a new question
  const resetModal = () => {
    setCountryData(null);
    setOptions([]);
    setSelectedAnswer("");
    setIsCorrect(null);
    fetchRandomCountry(); // Fetch a new random country
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-slate-300 border rounded-md overflow-hidden shadow-md max-w-xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-3 bg-slate-400">
          <h2 className="text-lg font-bold">Guess the flag</h2>
          <IoMdClose
            onClick={closeModal}
            className="cursor-pointer text-3xl ml-2"
            style={{ transition: "transform 0.2s" }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        </div>
        <div className="p-6 px-6 py-3 flex flex-col gap-3">
          {countryData ? (
            <>
              <img src={flag} alt={`Loading flag`} className="mt-3 h-40" />
              <p className="mt-3">Whose flag is it?</p>
              <ul className="mt-3">
                {options.map((answer, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer ${
                      selectedAnswer === answer.name ? "font-bold" : ""
                    }`}
                    onClick={() => handleAnswerSelection(answer.name)}
                  >
                    {answer.name}
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
                  Next Flag
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
    </div>
  );
};

export default FlagModal;
