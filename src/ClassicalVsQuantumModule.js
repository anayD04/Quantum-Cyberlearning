import React, { useMemo, useState } from "react";
import "./ClassicalVsQuantumModule.css";

const approachData = {
  classical: {
    label: "Classical Approach",
    icon: "💻",
    title: "Work with one definite state",
    description:
      "A classical program stores exact values and follows instructions step by step. At any moment, each bit is either 0 or 1.",
    analogy:
      "Imagine walking through a maze by choosing one path at each intersection. You may need to go back and try another route if the first path fails.",
    steps: [
      "Start with a definite value",
      "Apply a normal instruction",
      "Receive a definite result",
    ],
    input: "0",
    operation: "Flip the bit",
    output: "1",
  },
  quantum: {
    label: "Quantum Approach",
    icon: "⚛️",
    title: "Work with quantum possibilities",
    description:
      "A quantum program controls qubits using quantum gates. A qubit can be placed into superposition before it is measured.",
    analogy:
      "Imagine a special maze explorer that can represent several possible routes at once, then uses quantum rules to make useful answers more likely.",
    steps: [
      "Start with a qubit",
      "Apply a quantum gate",
      "Measure one final result",
    ],
    input: "|0⟩",
    operation: "Apply Hadamard",
    output: "0 or 1",
  },
};

const quizQuestions = [
  {
    id: 1,
    question: "What values can a classical bit hold at one time?",
    options: [
      "Only 0 or 1",
      "0 and 1 in superposition",
      "Any decimal number",
      "Only the value 1",
    ],
    answer: 0,
    explanation:
      "A classical bit always has one definite value: either 0 or 1.",
  },
  {
    id: 2,
    question: "What does a quantum program use to change qubits?",
    options: [
      "Quantum gates",
      "Web browsers",
      "Classical switches only",
      "Image files",
    ],
    answer: 0,
    explanation:
      "Quantum programs apply quantum gates to change the state of qubits.",
  },
  {
    id: 3,
    question: "What happens when a qubit is measured?",
    options: [
      "It gives a classical result such as 0 or 1",
      "It disappears forever",
      "It always gives 0",
      "It becomes a Python variable",
    ],
    answer: 0,
    explanation:
      "Measurement turns the qubit's quantum state into a classical result such as 0 or 1.",
  },
  {
    id: 4,
    question: "Which statement is most accurate?",
    options: [
      "Quantum computers replace all classical computers",
      "Quantum programs are useful for every task",
      "Classical and quantum programs solve problems in different ways",
      "Quantum programs do not use instructions",
    ],
    answer: 2,
    explanation:
      "Classical and quantum computers have different strengths and solve problems using different models.",
  },
];

function ClassicalVsQuantumModule() {
  const [activeApproach, setActiveApproach] = useState("classical");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const currentApproach = approachData[activeApproach];

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

  const handleCheckScore = () => {
    setShowSummary(true);

    setTimeout(() => {
      document
        .getElementById("module-two-quiz-summary")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowSummary(false);
  };

  return (
    <div className="cvq-module-page">
      <header className="cvq-navbar">
        <a className="cvq-brand" href="/" aria-label="QuantumPath home">
          <span className="cvq-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <nav className="cvq-nav-links" aria-label="Lesson navigation">
          <a href="/modules">Modules</a>
          <a href="#lesson">Lesson</a>
          <a href="#comparison">Code</a>
          <a href="#interactive">Interactive</a>
          <a href="#quiz">Quiz</a>
        </nav>

        <div className="cvq-module-progress">
          <span>Module 2</span>
          <strong>Programming</strong>
        </div>
      </header>

      <main>
        <section className="cvq-hero">
          <div className="cvq-hero-glow cvq-glow-one" />
          <div className="cvq-hero-glow cvq-glow-two" />

          <div className="cvq-hero-content">
            <a className="cvq-back-link" href="/modules">
              <span aria-hidden="true">←</span>
              Back to modules
            </a>

            <div className="cvq-module-label">
              <span>MODULE 02</span>
              <span className="cvq-difficulty">Beginner</span>
            </div>

            <h1>
              Classical vs Quantum
              <span> Programming</span>
            </h1>

            <p>
              Compare how normal programs and quantum programs represent
              information, apply instructions, and produce results.
            </p>

            <div className="cvq-module-details">
              <span>⏱ 12 minutes</span>
              <span>💻 Python comparison</span>
              <span>⚛️ Qiskit example</span>
            </div>
          </div>

          <div className="cvq-hero-visual" aria-hidden="true">
            <div className="cvq-code-window cvq-classical-window">
              <div className="cvq-window-header">
                <span />
                <span />
                <span />
              </div>

              <div className="cvq-window-body">
                <small>classical.py</small>
                <code>bit = 0</code>
                <code>bit = 1 - bit</code>
                <code>print(bit)</code>
              </div>
            </div>

            <div className="cvq-code-window cvq-quantum-window">
              <div className="cvq-window-header">
                <span />
                <span />
                <span />
              </div>

              <div className="cvq-window-body">
                <small>quantum.py</small>
                <code>qc = QuantumCircuit(1)</code>
                <code>qc.h(0)</code>
                <code>qc.measure_all()</code>
              </div>
            </div>

            <div className="cvq-connector-line" />
            <div className="cvq-comparison-badge">VS</div>
          </div>
        </section>

        <section className="cvq-lesson-section" id="lesson">
          <div className="cvq-section-heading">
            <p className="cvq-section-label">LESSON 1</p>
            <h2>Two ways to describe a computation</h2>
            <p>
              Classical and quantum programs both give computers instructions,
              but they represent information differently.
            </p>
          </div>

          <div className="cvq-lesson-grid">
            <article className="cvq-lesson-card">
              <span className="cvq-card-number">01</span>

              <div>
                <h3>Classical programming</h3>

                <p>
                  Classical programming is the type of programming used for
                  websites, mobile apps, games, and most software.
                </p>

                <p>
                  A classical program works with definite values. A bit is
                  either <strong>0</strong> or <strong>1</strong>, and a
                  variable contains one known value at a time.
                </p>

                <div className="cvq-analogy-box">
                  <span aria-hidden="true">🚦</span>

                  <div>
                    <strong>Traffic light analogy</strong>
                    <p>
                      A traffic light shows one definite signal at a time. It
                      might be red, yellow, or green, but it is not all three at
                      once.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="cvq-lesson-card">
              <span className="cvq-card-number">02</span>

              <div>
                <h3>Quantum programming</h3>

                <p>
                  Quantum programming gives instructions to qubits using
                  operations called <strong>quantum gates</strong>.
                </p>

                <p>
                  Before measurement, a qubit can be in a superposition. This
                  means the program can represent quantum possibilities for
                  both 0 and 1.
                </p>

                <div className="cvq-analogy-box cvq-analogy-purple">
                  <span aria-hidden="true">🪙</span>

                  <div>
                    <strong>Spinning coin analogy</strong>
                    <p>
                      A resting coin is heads or tails. A spinning coin helps us
                      imagine multiple possible outcomes before a final result
                      is observed.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="cvq-lesson-card cvq-wide-card">
              <span className="cvq-card-number">03</span>

              <div>
                <h3>Different tools for different problems</h3>

                <p>
                  A quantum computer is not a replacement for your laptop or
                  phone. Classical computers are still better for most everyday
                  tasks.
                </p>

                <p>
                  Quantum computers are being studied for specialized problems
                  involving chemistry, optimization, simulation, and
                  cryptography.
                </p>

                <div className="cvq-key-differences">
                  <div>
                    <span>💻</span>
                    <strong>Classical programs</strong>
                    <p>Use bits, variables, loops, and normal logic.</p>
                  </div>

                  <div>
                    <span>⚛️</span>
                    <strong>Quantum programs</strong>
                    <p>Use qubits, gates, circuits, and measurement.</p>
                  </div>

                  <div>
                    <span>🤝</span>
                    <strong>Often work together</strong>
                    <p>
                      Many quantum programs also rely on classical code to
                      prepare data and interpret results.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="cvq-code-section" id="comparison">
          <div className="cvq-section-heading">
            <p className="cvq-section-label">CODE COMPARISON</p>
            <h2>Python vs Qiskit</h2>
            <p>
              These examples both begin with 0, apply an operation, and display
              a result.
            </p>
          </div>

          <div className="cvq-code-comparison-grid">
            <article className="cvq-code-card cvq-python-card">
              <div className="cvq-code-card-header">
                <div>
                  <span className="cvq-code-icon">🐍</span>

                  <div>
                    <p>CLASSICAL PYTHON</p>
                    <h3>Flip a classical bit</h3>
                  </div>
                </div>

                <span className="cvq-language-badge">Python</span>
              </div>

              <pre className="cvq-code-block">
                <code>
                  <span className="cvq-code-comment">
                    # Start with a classical bit
                  </span>
                  {"\n"}
                  <span className="cvq-code-variable">bit</span> ={" "}
                  <span className="cvq-code-number">0</span>
                  {"\n\n"}
                  <span className="cvq-code-comment"># Flip 0 to 1</span>
                  {"\n"}
                  <span className="cvq-code-variable">bit</span> ={" "}
                  <span className="cvq-code-number">1</span> -{" "}
                  <span className="cvq-code-variable">bit</span>
                  {"\n\n"}
                  <span className="cvq-code-function">print</span>(
                  <span className="cvq-code-variable">bit</span>)
                </code>
              </pre>

              <div className="cvq-code-output">
                <span>Output</span>
                <strong>1</strong>
              </div>

              <p className="cvq-code-explanation">
                The value is always definite. After the flip, the result is 1.
              </p>
            </article>

            <article className="cvq-code-card cvq-qiskit-card">
              <div className="cvq-code-card-header">
                <div>
                  <span className="cvq-code-icon">⚛️</span>

                  <div>
                    <p>QUANTUM PROGRAM</p>
                    <h3>Create superposition</h3>
                  </div>
                </div>

                <span className="cvq-language-badge cvq-qiskit-badge">
                  Qiskit
                </span>
              </div>

              <pre className="cvq-code-block">
                <code>
                  <span className="cvq-code-keyword">from</span> qiskit{" "}
                  <span className="cvq-code-keyword">import</span>{" "}
                  QuantumCircuit
                  {"\n\n"}
                  <span className="cvq-code-comment">
                    # Create one qubit
                  </span>
                  {"\n"}
                  <span className="cvq-code-variable">qc</span> ={" "}
                  <span className="cvq-code-function">QuantumCircuit</span>(
                  <span className="cvq-code-number">1</span>)
                  {"\n\n"}
                  <span className="cvq-code-comment">
                    # Apply a Hadamard gate
                  </span>
                  {"\n"}
                  <span className="cvq-code-variable">qc</span>.
                  <span className="cvq-code-function">h</span>(
                  <span className="cvq-code-number">0</span>)
                  {"\n\n"}
                  <span className="cvq-code-variable">qc</span>.
                  <span className="cvq-code-function">measure_all</span>()
                </code>
              </pre>

              <div className="cvq-code-output">
                <span>Possible output</span>
                <strong>0 or 1</strong>
              </div>

              <p className="cvq-code-explanation">
                The Hadamard gate creates a superposition. Measurement can
                return either 0 or 1.
              </p>
            </article>
          </div>

          <div className="cvq-code-note">
            <span aria-hidden="true">!</span>

            <p>
              The examples do not perform exactly the same operation. The
              Python example flips a definite bit, while the Qiskit example
              creates a superposition to demonstrate quantum behavior.
            </p>
          </div>
        </section>

        <section className="cvq-interactive-section" id="interactive">
          <div className="cvq-section-heading">
            <p className="cvq-section-label">INTERACTIVE COMPARISON</p>
            <h2>Switch between approaches</h2>
            <p>
              Toggle between classical and quantum programming to compare the
              information flow.
            </p>
          </div>

          <div className="cvq-interactive-container">
            <div className="cvq-toggle-group" role="group">
              <button
                className={
                  activeApproach === "classical"
                    ? "cvq-toggle-button active"
                    : "cvq-toggle-button"
                }
                type="button"
                onClick={() => setActiveApproach("classical")}
                aria-pressed={activeApproach === "classical"}
              >
                <span aria-hidden="true">💻</span>
                Classical
              </button>

              <button
                className={
                  activeApproach === "quantum"
                    ? "cvq-toggle-button active"
                    : "cvq-toggle-button"
                }
                type="button"
                onClick={() => setActiveApproach("quantum")}
                aria-pressed={activeApproach === "quantum"}
              >
                <span aria-hidden="true">⚛️</span>
                Quantum
              </button>
            </div>

            <div
              className={`cvq-approach-display cvq-${activeApproach}-display`}
            >
              <div className="cvq-approach-content">
                <div className="cvq-approach-heading">
                  <span className="cvq-approach-icon">
                    {currentApproach.icon}
                  </span>

                  <div>
                    <p>{currentApproach.label}</p>
                    <h3>{currentApproach.title}</h3>
                  </div>
                </div>

                <p className="cvq-approach-description">
                  {currentApproach.description}
                </p>

                <div className="cvq-approach-analogy">
                  <strong>Analogy</strong>
                  <p>{currentApproach.analogy}</p>
                </div>
              </div>

              <div className="cvq-process-panel">
                <div className="cvq-process-flow">
                  <div className="cvq-process-step">
                    <span>Input</span>
                    <strong>{currentApproach.input}</strong>
                  </div>

                  <div className="cvq-process-arrow">→</div>

                  <div className="cvq-process-step cvq-operation-step">
                    <span>Operation</span>
                    <strong>{currentApproach.operation}</strong>
                  </div>

                  <div className="cvq-process-arrow">→</div>

                  <div className="cvq-process-step">
                    <span>Output</span>
                    <strong>{currentApproach.output}</strong>
                  </div>
                </div>

                <div className="cvq-step-list">
                  {currentApproach.steps.map((step, index) => (
                    <div key={step}>
                      <span>{index + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cvq-quiz-section" id="quiz">
          <div className="cvq-section-heading">
            <p className="cvq-section-label">KNOWLEDGE CHECK</p>
            <h2>Test your understanding</h2>
            <p>
              Select an answer to receive immediate feedback for each question.
            </p>
          </div>

          <div className="cvq-quiz-layout">
            <div className="cvq-quiz-questions">
              {quizQuestions.map((question, questionIndex) => {
                const selectedAnswer = selectedAnswers[question.id];
                const hasAnswered = selectedAnswer !== undefined;
                const isCorrect = selectedAnswer === question.answer;

                return (
                  <article className="cvq-quiz-card" key={question.id}>
                    <div className="cvq-question-heading">
                      <span>{questionIndex + 1}</span>
                      <h3>{question.question}</h3>
                    </div>

                    <div className="cvq-quiz-options">
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
                            className={`cvq-quiz-option ${
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
                            <span className="cvq-option-letter">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>

                            <span className="cvq-option-text">{option}</span>

                            {isCorrectOption && (
                              <span className="cvq-result-icon">✓</span>
                            )}

                            {isWrongSelection && (
                              <span className="cvq-result-icon">✕</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div
                        className={`cvq-quiz-feedback ${
                          isCorrect
                            ? "cvq-feedback-correct"
                            : "cvq-feedback-wrong"
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

            <aside className="cvq-quiz-progress-card">
              <p className="cvq-section-label">QUIZ PROGRESS</p>

              <div className="cvq-score-circle">
                <strong>{answeredCount}</strong>
                <span>of 4 answered</span>
              </div>

              <div className="cvq-progress-track">
                <div
                  style={{
                    width: `${(answeredCount / quizQuestions.length) * 100}%`,
                  }}
                />
              </div>

              <p>
                Complete all four questions to calculate your final score.
              </p>

              <button
                className="cvq-check-score-button"
                type="button"
                disabled={answeredCount !== quizQuestions.length}
                onClick={handleCheckScore}
              >
                Check my score
              </button>
            </aside>
          </div>

          {showSummary && (
            <div
              className={`cvq-quiz-summary ${
                correctCount >= 3
                  ? "cvq-summary-success"
                  : "cvq-summary-review"
              }`}
              id="module-two-quiz-summary"
              role="status"
            >
              <div className="cvq-summary-icon">
                {correctCount === 4 ? "🎉" : correctCount >= 3 ? "⭐" : "📘"}
              </div>

              <div>
                <p className="cvq-section-label">YOUR RESULT</p>
                <h3>
                  You scored {correctCount} out of {quizQuestions.length}
                </h3>

                <p>
                  {correctCount === 4 &&
                    "Excellent work! You understand the main differences between classical and quantum programming."}

                  {correctCount === 3 &&
                    "Great job! You have a strong understanding of the lesson."}

                  {correctCount < 3 &&
                    "Good effort. Review the comparisons and try the quiz again."}
                </p>
              </div>

              <button type="button" onClick={resetQuiz}>
                Try again
              </button>
            </div>
          )}
        </section>

        <section className="cvq-complete-section">
          <div>
            <p className="cvq-section-label">MODULE COMPLETE</p>
            <h2>You can now compare classical and quantum programs.</h2>
            <p>
              You learned how bits and qubits differ, how quantum gates act as
              instructions, and why quantum computers are designed for
              specialized problems.
            </p>
          </div>

          <a className="cvq-next-module-button" href="/modules/3">
            Continue to Module 3
            <span aria-hidden="true">→</span>
          </a>
        </section>
      </main>

      <footer className="cvq-footer">
        <a className="cvq-brand" href="/">
          <span className="cvq-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <p>Making quantum computing understandable for everyone.</p>

        <span>© 2026 QuantumPath</span>
      </footer>
    </div>
  );
}

export default ClassicalVsQuantumModule;