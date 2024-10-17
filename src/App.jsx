import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [displayAnswers, setDisplayAnswers] = useState(false);
  const [userAns, setUserAns] = useState([]);
  const optionsRef = useRef([]);

  const fetchData = async () => {
    const response = await fetch(`https://the-trivia-api.com/v2/questions`);
    const data = await response.json();
    console.log(data);
    setQuestions(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      let shuffled = [
        ...questions[index].incorrectAnswers,
        questions[index].correctAnswer,
      ].sort(() => Math.random() - 0.5);
      setOptions(shuffled);
    }
  }, [index, questions]);

  const handleNext = () => {
    if (questions.length - 1 > index) {
      const selectedOption = optionsRef.current.find(
        (item) => item && item.checked
      );
      setUserAns([...userAns, selectedOption.value]);
      questions[index].correctAnswer === selectedOption.value &&
        setResult(result + 10);
      setIndex(index + 1);
      selectedOption.checked = false;
      setIsDisabled(true);
    } else {
      const selectedOption = optionsRef.current.find(
        (item) => item && item.checked
      );
      setUserAns([...userAns, selectedOption.value]);
      questions[index].correctAnswer === selectedOption.value &&
        setResult(result + 10);
      setShowResult(true);
    }
  };

  return (
    <>
      <h1 className="text-4xl text-center font-semibold  mt-2">Quiz App</h1>
      <div className="h-[90vh] flex items-center justify-center">
        <main className="w-[520px] min-h-[380px] rounded-lg  flex shadow-lg flex-col justify-center bg-slate-300">
          {!showResult ? (
            <div className="p-4">
              {questions.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold mb-4">{`Q:${
                    index + 1
                  } ${questions[index].question.text}`}</h2>
                  <div>
                    {options.map((item, index) => (
                      <div
                        className="flex rounded-md bg-primary mb-3 p-1 py-2 items-center gap-2"
                        key={index}
                      >
                        <input
                          type="radio"
                          className="radio radio-sm"
                          id={index}
                          value={item}
                          name="options"
                          onChange={() => setIsDisabled(false)}
                          ref={(el) => (optionsRef.current[index] = el)}
                        />
                        <label
                          className="cursor-pointer text-white"
                          htmlFor={index}
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      disabled={isDisabled}
                      onClick={handleNext}
                      className="btn btn-primary m-0"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : !displayAnswers ? (
            <div className="text-center">
              <h2 className="text-3xl">
                You score : {result}/{questions.length * 10}
              </h2>
              <button
                className="btn btn-outline mt-4 btn-info"
                onClick={() => setDisplayAnswers(true)}
              >
                Show Answers
              </button>
            </div>
          ) : (
            <div className="overflow-auto p-3 h-[380px]">
              <h2 className="text-2xl text-center">
                You score : {result}/{questions.length * 10}
              </h2>
              {questions.map(({ question, correctAnswer }, index) => (
                <div className="py-2 font-medium" key={index}>
                  <h3 className="text-lg">
                    Q{index + 1}: {question.text}
                  </h3>
                  <p
                    className={
                      userAns[index] === correctAnswer
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    your answer : {userAns[index]}
                  </p>
                  <p className="text-green-500">
                    correct answer : {correctAnswer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default App;
