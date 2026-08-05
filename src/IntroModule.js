import React, { useMemo, useState } from "react";
import "./IntroModule.css";
import { useProgress } from "./ProgressContext";

const tracerSteps = [
  {
    id: 0,
    label: "Starting qubit",
    state: "|0⟩",
    title: "The qubit starts in state |0⟩",
    description:
      "Before we apply a gate, our qubit is definitely in the 0 state. If we measured it now, the result would always be 0.",
    zeroProbability: 100,
    oneProbability: 0,
  },
  {
    id: 1,
    label: "Apply Hadamard",
    state: "H|0⟩",
    title: "The Hadamard gate is applied",
    description:
      "The Hadamard gate, written as H, changes the qubit from one definite state into a balanced superposition.",
    zeroProbability: 100,
    oneProbability: 0,
  },
  {
    id: 2,
    label: "Superposition",
    state: "(|0⟩ + |1⟩) / √2",
    title: "The qubit is now in superposition",
    description:
      "The qubit now has an equal chance of being measured as 0 or 1. It is not simply switching quickly between them. It is in a quantum combination of both possibilities.",
    zeroProbability: 50,
    oneProbability: 50,
  },
  {
    id: 3,
    label: "Measure",
    state: "0 or 1",
    title: "Measurement gives one result",
    description:
      "When we measure the qubit, the superposition ends. We see either 0 or 1. Because the chances are equal, each result has a 50% probability.",
    zeroProbability: 50,
    oneProbability: 50,
  },
];

const quizQuestions = [
  {
    id: 1,
    question: "What does a classical bit store?",
    options: [
      "Only 0 or 1",
      "0 and 1 at the same time",
      "Any number from 0 to 100",
      "Only letters",
    ],
    answer: 0,
    explanation:
      "A classical bit has one definite value at a time: either 0 or 1.",
  },
  {
    id: 2,
    question: "What is a qubit?",
    options: [
      "A very small classical computer",
      "The basic unit of quantum information",
      "A type of quantum gate",
      "A computer screen pixel",
    ],
    answer: 1,
    explanation:
      "A qubit is the basic unit of information used by a quantum computer.",
  },
  {
    id: 3,
    question: "What does superposition mean in this lesson?",
    options: [
      "A qubit is broken",
      "A qubit has possibilities for both 0 and 1 before measurement",
      "A qubit always equals 1",
      "A computer is running two websites",
    ],
    answer: 1,
    explanation:
      "Superposition allows a qubit to contain quantum possibilities for both 0 and 1 before it is measured.",
  },
  {
    id: 4,
    question:
      "What happens when a Hadamard gate is applied to a qubit starting in |0⟩?",
    options: [
      "The qubit is deleted",
      "The qubit becomes a classical bit",
      "The qubit enters an equal superposition of |0⟩ and |1⟩",
      "The qubit must become |1⟩",
    ],
    answer: 2,
    explanation:
      "Applying a Hadamard gate to |0⟩ creates a balanced superposition, giving equal measurement probabilities for 0 and 1.",
  },
  {
  id: 5,
  question: "Which type of computer is used for most everyday tasks today?",
  options: [
    "A quantum computer",
    "An entangled computer",
    "A classical computer",
    "A measurement computer",
  ],
  answer: 2,
  explanation:
    "Phones, laptops, game consoles, and most current devices are classical computers.",
},
{
  id: 6,
  question: "What usually happens when a qubit is measured?",
  options: [
    "It always becomes 0",
    "It gives a result such as 0 or 1",
    "It turns into a quantum gate",
    "It produces every possible answer at once",
  ],
  answer: 1,
  explanation:
    "Measurement produces a classical result, such as 0 or 1, from the qubit's quantum state.",
},
{
  id: 7,
  question: "Why is a light switch a useful analogy for a classical bit?",
  options: [
    "It creates entanglement",
    "It performs quantum measurements",
    "It can be either off or on",
    "It can be in every position at once",
  ],
  answer: 2,
  explanation:
    "A light switch has two clear states, off and on, similar to the classical values 0 and 1.",
},
{
  id: 8,
  question: "Why is a spinning coin sometimes used as a qubit analogy?",
  options: [
    "It proves that qubits are made from coins",
    "It always lands on heads",
    "It stores computer files",
    "It helps represent more than one possible outcome before observation",
  ],
  answer: 3,
  explanation:
    "A spinning coin helps beginners imagine multiple possible outcomes before a final result is observed, although the analogy is not exact.",
},
{
  id: 9,
  question: "What is a quantum gate?",
  options: [
    "A measurement result",
    "An operation that changes a qubit",
    "A physical door on a computer",
    "A type of classical memory",
  ],
  answer: 1,
  explanation:
    "A quantum gate is an operation or instruction that changes the state of one or more qubits.",
},
{
  id: 10,
  question:
    "If a qubit has a 50% chance of being measured as 0 and a 50% chance of being measured as 1, what does that describe?",
  options: [
    "A guaranteed result of 1",
    "A broken qubit",
    "A balanced superposition",
    "A classical bit equal to 0",
  ],
  answer: 2,
  explanation:
    "Equal measurement probabilities for 0 and 1 describe a balanced superposition.",
},
{
  id: 11,
  question: "Which statement about quantum computers is most accurate?",
  options: [
    "They have already replaced all laptops",
    "They are designed to approach certain problems differently",
    "They do not use instructions",
    "They are faster than classical computers for every task",
  ],
  answer: 1,
  explanation:
    "Quantum computers are not simply faster versions of classical computers. They use a different model that may help with certain specialized problems.",
},
{
  id: 12,
  question: "Which idea comes from quantum physics?",
  options: [
    "A computer keyboard",
    "Superposition",
    "A web browser tab",
    "A classical light switch",
  ],
  answer: 1,
  explanation:
    "Superposition is a quantum idea that allows a qubit to contain multiple quantum possibilities before measurement.",
},
];

function IntroModule() {
  const { addPoints, completeModule, isModuleCompleted } = useProgress();
  const [tracerStep, setTracerStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const currentTracerStep = tracerSteps[tracerStep];

  const answeredCount = Object.keys(selectedAnswers).length;

  const correctCount = useMemo(() => {
    return quizQuestions.reduce((total, question) => {
      return selectedAnswers[question.id] === question.answer
        ? total + 1
        : total;
    }, 0);
  }, [selectedAnswers]);

  const handleAnswer = (questionId, optionIndex) => {
    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionIndex,
    }));

    setShowSummary(false);
  };

  const handleNextTracerStep = () => {
    setTracerStep((currentStep) =>
      Math.min(currentStep + 1, tracerSteps.length - 1)
    );
  };

  const handlePreviousTracerStep = () => {
    setTracerStep((currentStep) => Math.max(currentStep - 1, 0));
  };

  const resetTracer = () => {
    setTracerStep(0);
  };

  const checkQuiz = () => {
    setShowSummary(true);
    if (!isModuleCompleted(1)) {
    addPoints(1, 20);
    completeModule(1);
  }

    document
      .getElementById("quiz-summary")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowSummary(false);
  };

  return (
    <div className="intro-module-page">
      <header className="intro-module-navbar">
        <a className="intro-module-brand" href="/" aria-label="QuantumPath home">
          <span className="intro-module-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <nav className="intro-module-nav" aria-label="Lesson navigation">
          <a href="/modules">Modules</a>
          <a href="#lesson">Lesson</a>
          <a href="#tracer">Interactive</a>
          <a href="#quiz">Quiz</a>
        </nav>

        <div className="intro-module-progress">
          <span>Module 1</span>
          <strong>Introduction</strong>
        </div>
      </header>

      <main>
        <section className="intro-module-hero">
          <div className="intro-module-hero-glow intro-glow-one" />
          <div className="intro-module-hero-glow intro-glow-two" />

          <div className="intro-module-hero-content">
            <a className="back-to-modules" href="/modules">
              <span aria-hidden="true">←</span>
              Back to modules
            </a>

            <div className="intro-module-label">
              <span>MODULE 01</span>
              <span className="intro-difficulty">Beginner</span>
            </div>

            <h1>
              Introduction to
              <span> Quantum Computing</span>
            </h1>

            <p>
              Learn what makes quantum computers different, meet the qubit, and
              explore your first quantum gate.
            </p>

            <div className="intro-module-details">
              <span>⏱ 10–15 minutes</span>
              <span>📖 Beginner friendly</span>
              <span>✨ Interactive activity</span>
            </div>
          </div>

          <div className="intro-hero-visual" aria-hidden="true">
            <div className="intro-orbit intro-orbit-one" />
            <div className="intro-orbit intro-orbit-two" />

            <div className="intro-qubit-core">
              <span>|ψ⟩</span>
              <small>Your first qubit</small>
            </div>

            <div className="intro-floating-card intro-card-zero">
              <strong>|0⟩</strong>
              <span>Zero state</span>
            </div>

            <div className="intro-floating-card intro-card-one">
              <strong>|1⟩</strong>
              <span>One state</span>
            </div>
          </div>
        </section>

        <section className="lesson-section" id="lesson">
          <div className="lesson-section-heading">
            <p className="intro-section-label">LESSON 1</p>
            <h2>What is quantum computing?</h2>
            <p>
              Let us begin with the big idea before learning any complicated
              symbols or code.
            </p>
          </div>

          <div className="lesson-content-grid">
            <article className="lesson-text-card">
              <span className="lesson-card-number">01</span>

              <div>
                <h3>A new way of processing information</h3>

                <p>
                  A computer solves problems by storing information and
                  following instructions. The phone, laptop, or game console
                  you use every day is a <strong>classical computer</strong>.
                </p>

                <p>
                  A <strong>quantum computer</strong> also stores information
                  and follows instructions, but it uses ideas from quantum
                  physics. These ideas describe how extremely small things,
                  such as atoms and particles, behave.
                </p>

                <div className="analogy-box">
                  <span className="analogy-icon" aria-hidden="true">
                    🧭
                  </span>

                  <div>
                    <strong>Think of it like choosing a route</strong>
                    <p>
                      A classical computer explores routes using definite
                      choices. A quantum computer can represent several
                      possibilities in a special quantum way before producing
                      an answer.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="lesson-text-card">
              <span className="lesson-card-number">02</span>

              <div>
                <h3>Classical computers and quantum computers</h3>

                <p>
                  Classical computers are excellent for everyday tasks:
                  browsing the internet, playing videos, writing documents,
                  and running games.
                </p>

                <p>
                  Quantum computers are not simply faster versions of normal
                  computers. They are designed to approach certain problems in
                  a different way.
                </p>

                <div className="simple-list">
                  <div>
                    <span>✓</span>
                    <p>
                      Classical computers use <strong>bits</strong>.
                    </p>
                  </div>

                  <div>
                    <span>✓</span>
                    <p>
                      Quantum computers use <strong>qubits</strong>.
                    </p>
                  </div>

                  <div>
                    <span>✓</span>
                    <p>
                      Quantum computers use effects such as{" "}
                      <strong>superposition</strong> and{" "}
                      <strong>entanglement</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="lesson-text-card lesson-wide-card">
              <span className="lesson-card-number">03</span>

              <div>
                <h3>Meet the qubit</h3>

                <p>
                  A <strong>qubit</strong>, short for quantum bit, is the basic
                  unit of quantum information.
                </p>

                <p>
                  A normal bit is like a light switch. It is either off,
                  represented by 0, or on, represented by 1. A qubit is more
                  like a dimmer control with special quantum rules. Before we
                  measure it, it can contain possibilities for both 0 and 1.
                </p>

                <div className="analogy-box analogy-box-purple">
                  <span className="analogy-icon" aria-hidden="true">
                    🪙
                  </span>

                  <div>
                    <strong>The spinning coin analogy</strong>
                    <p>
                      A coin resting on a table is clearly heads or tails. A
                      spinning coin can help us imagine a qubit before
                      measurement because both outcomes are possible. The
                      analogy is not perfect, but it is a useful starting point.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="comparison-section">
          <div className="lesson-section-heading">
            <p className="intro-section-label">VISUAL COMPARISON</p>
            <h2>Classical bit vs. qubit</h2>
            <p>
              Compare one definite classical value with a quantum
              superposition.
            </p>
          </div>

          <div className="comparison-grid">
            <article className="comparison-card classical-comparison-card">
              <div className="comparison-card-header">
                <span className="comparison-icon">💡</span>

                <div>
                  <p>CLASSICAL COMPUTING</p>
                  <h3>Classical Bit</h3>
                </div>
              </div>

              <div className="bit-visual">
                <div className="bit-choice bit-choice-zero">
                  <strong>0</strong>
                  <span>Off</span>
                </div>

                <span className="bit-or">OR</span>

                <div className="bit-choice bit-choice-one">
                  <strong>1</strong>
                  <span>On</span>
                </div>
              </div>

              <p className="comparison-description">
                A classical bit has one definite value at a time. It is either
                0 or 1.
              </p>

              <div className="comparison-example">
                <span>Example</span>
                <p>A classroom light switch is either off or on.</p>
              </div>
            </article>

            <article className="comparison-card quantum-comparison-card">
              <div className="comparison-card-header">
                <span className="comparison-icon">⚛️</span>

                <div>
                  <p>QUANTUM COMPUTING</p>
                  <h3>Qubit</h3>
                </div>
              </div>

              <div className="qubit-visual">
                <div className="qubit-sphere">
                  <span className="sphere-label sphere-zero">|0⟩</span>
                  <span className="sphere-label sphere-one">|1⟩</span>
                  <span className="sphere-arrow">↗</span>
                </div>

                <div className="superposition-formula">
                  <span>Superposition</span>
                  <strong>α|0⟩ + β|1⟩</strong>
                </div>
              </div>

              <p className="comparison-description">
                Before measurement, a qubit can contain possibilities for both
                0 and 1.
              </p>

              <div className="comparison-example">
                <span>Beginner analogy</span>
                <p>A spinning coin has possible heads and tails outcomes.</p>
              </div>
            </article>
          </div>

          <div className="important-note">
            <span aria-hidden="true">!</span>

            <p>
              A qubit is not literally a spinning coin. The coin is only an
              analogy that helps us imagine multiple possible outcomes.
            </p>
          </div>
        </section>

        <section className="tracer-section" id="tracer">
          <div className="lesson-section-heading">
            <p className="intro-section-label">INTERACTIVE TRACER</p>
            <h2>Apply your first quantum gate</h2>
            <p>
              Move through each step to see what happens when a Hadamard gate
              acts on a qubit.
            </p>
          </div>

          <div className="tracer-container">
            <div className="tracer-step-navigation" aria-label="Tracer steps">
              {tracerSteps.map((step, index) => (
                <button
                  className={`tracer-step-button ${
                    index === tracerStep ? "active" : ""
                  } ${index < tracerStep ? "complete" : ""}`}
                  type="button"
                  key={step.id}
                  onClick={() => setTracerStep(index)}
                  aria-current={index === tracerStep ? "step" : undefined}
                >
                  <span>{index < tracerStep ? "✓" : index + 1}</span>
                  <small>{step.label}</small>
                </button>
              ))}
            </div>

            <div className="tracer-workspace">
              <div className="tracer-circuit-panel">
                <div className="tracer-circuit">
                  <span className="circuit-input">|0⟩</span>
                  <div className="circuit-wire" />

                  <div
                    className={`hadamard-gate ${
                      tracerStep >= 1 ? "gate-active" : ""
                    }`}
                  >
                    H
                  </div>

                  <div className="circuit-wire circuit-wire-right" />

                  <div
                    className={`measurement-gate ${
                      tracerStep >= 3 ? "measurement-active" : ""
                    }`}
                  >
                    <span>⌁</span>
                  </div>
                </div>

                <div className="tracer-state-display">
                  <span>Current state</span>
                  <strong>{currentTracerStep.state}</strong>
                </div>

                <div className="probability-display">
                  <div className="probability-item">
                    <div className="probability-heading">
                      <span>Probability of 0</span>
                      <strong>{currentTracerStep.zeroProbability}%</strong>
                    </div>

                    <div className="probability-track">
                      <div
                        className="probability-fill probability-zero-fill"
                        style={{
                          width: `${currentTracerStep.zeroProbability}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="probability-item">
                    <div className="probability-heading">
                      <span>Probability of 1</span>
                      <strong>{currentTracerStep.oneProbability}%</strong>
                    </div>

                    <div className="probability-track">
                      <div
                        className="probability-fill probability-one-fill"
                        style={{
                          width: `${currentTracerStep.oneProbability}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="tracer-explanation-panel">
                <span className="tracer-step-count">
                  Step {tracerStep + 1} of {tracerSteps.length}
                </span>

                <h3>{currentTracerStep.title}</h3>
                <p>{currentTracerStep.description}</p>

                {tracerStep === 1 && (
                  <div className="gate-info-box">
                    <strong>What is a quantum gate?</strong>
                    <p>
                      A quantum gate is an operation that changes a qubit. It is
                      similar to an instruction in a normal computer program.
                    </p>
                  </div>
                )}

                {tracerStep === 2 && (
                  <div className="gate-info-box">
                    <strong>Why 50% and 50%?</strong>
                    <p>
                      The Hadamard gate creates an equal superposition when it
                      is applied to |0⟩.
                    </p>
                  </div>
                )}

                <div className="tracer-controls">
                  <button
                    className="tracer-secondary-button"
                    type="button"
                    onClick={handlePreviousTracerStep}
                    disabled={tracerStep === 0}
                  >
                    ← Previous
                  </button>

                  {tracerStep < tracerSteps.length - 1 ? (
                    <button
                      className="tracer-primary-button"
                      type="button"
                      onClick={handleNextTracerStep}
                    >
                      Next step →
                    </button>
                  ) : (
                    <button
                      className="tracer-primary-button"
                      type="button"
                      onClick={resetTracer}
                    >
                      Replay tracer ↻
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="quiz-section" id="quiz">
          <div className="lesson-section-heading">
            <p className="intro-section-label">KNOWLEDGE CHECK</p>
            <h2>Test what you learned</h2>
            <p>
              Choose an answer for each question. You will see immediate
              feedback after making a selection.
            </p>
          </div>

          <div className="quiz-layout">
            <div className="quiz-questions">
              {quizQuestions.map((question, questionIndex) => {
                const selectedAnswer = selectedAnswers[question.id];
                const hasAnswered = selectedAnswer !== undefined;
                const isCorrect = selectedAnswer === question.answer;

                return (
                  <article className="quiz-card" key={question.id}>
                    <div className="quiz-question-heading">
                      <span>{questionIndex + 1}</span>
                      <h3>{question.question}</h3>
                    </div>

                    <div className="quiz-options">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selectedAnswer === optionIndex;
                        const isCorrectOption =
                          hasAnswered && optionIndex === question.answer;
                        const isWrongSelection =
                          hasAnswered &&
                          isSelected &&
                          optionIndex !== question.answer;

                        return (
                          <button
                            className={`quiz-option ${
                              isSelected ? "selected" : ""
                            } ${isCorrectOption ? "correct" : ""} ${
                              isWrongSelection ? "wrong" : ""
                            }`}
                            type="button"
                            key={option}
                            onClick={() =>
                              handleAnswer(question.id, optionIndex)
                            }
                          >
                            <span className="quiz-option-letter">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>

                            <span className="quiz-option-text">{option}</span>

                            {isCorrectOption && (
                              <span
                                className="quiz-result-icon"
                                aria-label="Correct answer"
                              >
                                ✓
                              </span>
                            )}

                            {isWrongSelection && (
                              <span
                                className="quiz-result-icon"
                                aria-label="Incorrect answer"
                              >
                                ✕
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div
                        className={`quiz-feedback ${
                          isCorrect
                            ? "quiz-feedback-correct"
                            : "quiz-feedback-wrong"
                        }`}
                        role="status"
                      >
                        <span>{isCorrect ? "✓" : "!"}</span>

                        <div>
                          <strong>
                            {isCorrect ? "Correct!" : "Not quite."}
                          </strong>
                          <p>{question.explanation}</p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <aside className="quiz-progress-card">
              <p className="intro-section-label">QUIZ PROGRESS</p>

              <div className="quiz-score-circle">
                <strong>{answeredCount}</strong>
                <span>of {quizQuestions.length} answered</span>
              </div>

              <div className="quiz-progress-bar">
                <div
                  style={{
                    width: `${(answeredCount / quizQuestions.length) * 100}%`,
                  }}
                />
              </div>

              <p>
                Answer all four questions to see your final result.
              </p>

              <button
                className="quiz-submit-button"
                type="button"
                disabled={answeredCount !== quizQuestions.length}
                onClick={checkQuiz}
              >
                Check my score
              </button>
            </aside>
          </div>

          {showSummary && (
            <div
              className={`quiz-summary ${
                correctCount >= 3
                  ? "quiz-summary-success"
                  : "quiz-summary-review"
              }`}
              id="quiz-summary"
              role="status"
            >
              <div className="quiz-summary-icon">
                {correctCount === quizQuestions.length ? "🎉" : correctCount >= quizQuestions.length-1 ? "⭐" : "📘"}
              </div>

              <div>
                <p className="intro-section-label">YOUR RESULT</p>
                <h3>
                  You scored {correctCount} out of {quizQuestions.length}
                </h3>

                <p>
                  {correctCount === quizQuestions.length &&
                    "Excellent work! You understand the main ideas in this lesson."}

                  {correctCount === quizQuestions.length - 1 &&
                    "Great job! You have a strong understanding of the basics."}

                  {correctCount < quizQuestions.length -1 &&
                    "Good effort. Review the lesson and try the questions again."}
                </p>
              </div>

              <button type="button" onClick={resetQuiz}>
                Try again
              </button>
            </div>
          )}
        </section>

        <section className="lesson-complete-section">
          <div>
            <p className="intro-section-label">LESSON COMPLETE</p>
            <h2>You have taken your first quantum step.</h2>
            <p>
              You now know the difference between bits and qubits, what
              superposition means, and how a Hadamard gate changes a qubit.
            </p>
          </div>

          <a className="next-module-button" href="/modules/2">
            Continue to Module 2
            <span aria-hidden="true">→</span>
          </a>
        </section>
      </main>

      <footer className="intro-module-footer">
        <a className="intro-module-brand" href="/">
          <span className="intro-module-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <p>Making quantum computing understandable for everyone.</p>

        <span>© 2026 QuantumPath</span>
      </footer>
    </div>
  );
}

export default IntroModule;