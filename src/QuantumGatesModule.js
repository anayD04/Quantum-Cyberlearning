import React, { useMemo, useState } from "react";
import "./QuantumGatesModule.css";
import { useProgress } from "./ProgressContext";

const gates = {
  x: {
    name: "X Gate",
    shortName: "X",
    icon: "✕",
    subtitle: "The quantum bit flip",
    description:
      "The X gate flips a qubit from |0⟩ to |1⟩, or from |1⟩ to |0⟩. It is similar to a classical NOT gate.",
    analogy:
      "Think of a light switch. If the light is off, the X gate turns it on. If it is on, the X gate turns it off.",
    inputLabel: "|0⟩",
    outputLabel: "|1⟩",
    inputZero: 100,
    inputOne: 0,
    outputZero: 0,
    outputOne: 100,
    note: "The result is definite because the X gate swaps |0⟩ and |1⟩.",
    code: "qc.x(0)",
    type: "single",
  },
  h: {
    name: "Hadamard Gate",
    shortName: "H",
    icon: "H",
    subtitle: "The superposition maker",
    description:
      "The Hadamard gate places a qubit into superposition. Starting from |0⟩, it creates an equal quantum combination of |0⟩ and |1⟩.",
    analogy:
      "Imagine spinning a coin. Before it lands, it is not simply heads or tails. The Hadamard gate creates a quantum state with both possibilities.",
    inputLabel: "|0⟩",
    outputLabel: "(|0⟩ + |1⟩) / √2",
    inputZero: 100,
    inputOne: 0,
    outputZero: 50,
    outputOne: 50,
    note: "When measured, the qubit has a 50% chance of producing 0 and a 50% chance of producing 1.",
    code: "qc.h(0)",
    type: "single",
  },
  cnot: {
    name: "CNOT Gate",
    shortName: "CX",
    icon: "●",
    subtitle: "A controlled quantum flip",
    description:
      "The CNOT gate uses two qubits. The first is the control qubit, and the second is the target qubit. The target flips only when the control is |1⟩.",
    analogy:
      "Imagine a locked light switch. The target light can flip only when the control key is turned on.",
    inputLabel: "|1⟩ |0⟩",
    outputLabel: "|1⟩ |1⟩",
    controlInput: "1",
    targetInput: "0",
    controlOutput: "1",
    targetOutput: "1",
    note: "Because the control qubit is |1⟩, the target changes from |0⟩ to |1⟩.",
    code: "qc.cx(0, 1)",
    type: "double",
  },
};

const quizQuestions = [
  {
    id: 1,
    question: "What does the X gate do to a qubit in state |0⟩?",
    options: [
      "Changes it to |1⟩",
      "Creates two qubits",
      "Measures the qubit",
      "Deletes the qubit",
    ],
    answer: 0,
    explanation:
      "The X gate flips |0⟩ to |1⟩ and flips |1⟩ back to |0⟩.",
  },
  {
    id: 2,
    question: "Which gate is commonly used to create superposition?",
    options: ["CNOT gate", "AND gate", "Hadamard gate", "NOT gate"],
    answer: 2,
    explanation:
      "The Hadamard gate can create an equal superposition of |0⟩ and |1⟩.",
  },
  {
    id: 3,
    question: "How many qubits does a CNOT gate act on?",
    options: ["One", "Two", "Three", "Four"],
    answer: 1,
    explanation:
      "A CNOT gate uses one control qubit and one target qubit.",
  },
  {
    id: 4,
    question:
      "What is an important difference between classical and quantum gates?",
    options: [
      "Quantum gates can operate on superposition states",
      "Classical gates only work at night",
      "Quantum gates never change information",
      "Classical gates use qubits",
    ],
    answer: 0,
    explanation:
      "Quantum gates can transform superpositions and other quantum states, while classical gates operate on definite bits.",
  },
];

function ProbabilityBars({ zero, one, label }) {
  return (
    <div className="qgm-probability-group">
      <p>{label}</p>

      <div className="qgm-probability-row">
        <span>|0⟩</span>

        <div className="qgm-probability-track">
          <div style={{ width: `${zero}%` }} />
        </div>

        <strong>{zero}%</strong>
      </div>

      <div className="qgm-probability-row">
        <span>|1⟩</span>

        <div className="qgm-probability-track">
          <div style={{ width: `${one}%` }} />
        </div>

        <strong>{one}%</strong>
      </div>
    </div>
  );
}

function QuantumGatesModule() {
  const { addPoints, completeModule, isModuleCompleted } = useProgress();
  const [selectedGate, setSelectedGate] = useState("x");
  const [animationKey, setAnimationKey] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const activeGate = gates[selectedGate];
  const answeredCount = Object.keys(selectedAnswers).length;

  const correctCount = useMemo(() => {
    return quizQuestions.reduce((total, question) => {
      return selectedAnswers[question.id] === question.answer
        ? total + 1
        : total;
    }, 0);
  }, [selectedAnswers]);

  const selectGate = (gateName) => {
    setSelectedGate(gateName);
    setAnimationKey((current) => current + 1);
  };

  const replayGate = () => {
    setAnimationKey((current) => current + 1);
  };

  const handleAnswer = (questionId, optionIndex) => {
    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionIndex,
    }));

    setShowSummary(false);
  };

  const checkScore = () => {
    setShowSummary(true);
    if (!isModuleCompleted(3)) {
      addPoints(3, 20);
      completeModule(3);
    }

    setTimeout(() => {
      document
        .getElementById("quantum-gates-quiz-summary")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowSummary(false);
  };

  return (
    <div className="qgm-page">
      <header className="qgm-navbar">
        <a className="qgm-brand" href="/" aria-label="QuantumPath home">
          <span className="qgm-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <nav className="qgm-nav-links" aria-label="Lesson navigation">
          <a href="/modules">Modules</a>
          <a href="#lesson">Lesson</a>
          <a href="#explorer">Gate Explorer</a>
          <a href="#comparison">Comparison</a>
          <a href="#quiz">Quiz</a>
        </nav>

        <div className="qgm-module-progress">
          <span>Module 3</span>
          <strong>Quantum Gates</strong>
        </div>
      </header>

      <main>
        <section className="qgm-hero">
          <div className="qgm-hero-glow qgm-glow-one" />
          <div className="qgm-hero-glow qgm-glow-two" />

          <div className="qgm-hero-content">
            <a className="qgm-back-link" href="/modules">
              <span aria-hidden="true">←</span>
              Back to modules
            </a>

            <div className="qgm-module-label">
              <span>MODULE 03</span>
              <span className="qgm-difficulty">Beginner+</span>
            </div>

            <h1>
              Explore Quantum
              <span> Gates</span>
            </h1>

            <p>
              Learn how quantum gates transform qubits, create superposition,
              and connect multiple qubits inside a quantum circuit.
            </p>

            <div className="qgm-module-details">
              <span>⏱ 15 minutes</span>
              <span>✨ 3 quantum gates</span>
              <span>🧪 Interactive explorer</span>
            </div>
          </div>

          <div className="qgm-hero-visual" aria-hidden="true">
            <div className="qgm-hero-wire qgm-wire-one">
              <span>|0⟩</span>
              <div className="qgm-hero-gate qgm-x-gate">X</div>
              <span>|1⟩</span>
            </div>

            <div className="qgm-hero-wire qgm-wire-two">
              <span>|0⟩</span>
              <div className="qgm-hero-gate qgm-h-gate">H</div>
              <span>±</span>
            </div>

            <div className="qgm-cnot-visual">
              <div className="qgm-cnot-line" />
              <div className="qgm-control-dot" />
              <div className="qgm-target-circle">＋</div>
            </div>

            <div className="qgm-floating-chip qgm-chip-one">qc.x(0)</div>
            <div className="qgm-floating-chip qgm-chip-two">qc.h(0)</div>
            <div className="qgm-floating-chip qgm-chip-three">
              qc.cx(0, 1)
            </div>
          </div>
        </section>

        <section className="qgm-lesson-section" id="lesson">
          <div className="qgm-section-heading">
            <p className="qgm-section-label">LESSON 1</p>
            <h2>What are quantum gates?</h2>
            <p>
              Quantum gates are operations that change the state of one or more
              qubits. They are the building blocks of quantum circuits.
            </p>
          </div>

          <div className="qgm-introduction-card">
            <div className="qgm-introduction-icon">⚙️</div>

            <div>
              <h3>Instructions for qubits</h3>

              <p>
                In a classical program, logic gates transform ordinary bits.
                For example, a NOT gate changes 0 into 1.
              </p>

              <p>
                Quantum gates also transform information, but they act on
                qubits. Since qubits can be in superposition, quantum gates can
                create and manipulate combinations of possible states.
              </p>
            </div>

            <div className="qgm-lesson-highlight">
              <span>Key idea</span>
              <strong>
                Quantum gates change probability amplitudes, not just ordinary
                0 and 1 values.
              </strong>
            </div>
          </div>

          <div className="qgm-gate-lesson-grid">
            <article className="qgm-gate-lesson-card qgm-x-card">
              <div className="qgm-gate-card-top">
                <span className="qgm-gate-symbol">X</span>
                <span className="qgm-gate-number">01</span>
              </div>

              <h3>X Gate</h3>
              <p className="qgm-gate-subtitle">The quantum bit flip</p>

              <p>
                The X gate changes <strong>|0⟩ into |1⟩</strong> and changes{" "}
                <strong>|1⟩ into |0⟩</strong>.
              </p>

              <div className="qgm-analogy-box">
                <span>💡</span>

                <div>
                  <strong>Light switch analogy</strong>
                  <p>
                    The X gate behaves like flipping a switch from off to on or
                    from on to off.
                  </p>
                </div>
              </div>

              <div className="qgm-mini-equation">
                <span>|0⟩</span>
                <strong>X</strong>
                <span>|1⟩</span>
              </div>
            </article>

            <article className="qgm-gate-lesson-card qgm-h-card">
              <div className="qgm-gate-card-top">
                <span className="qgm-gate-symbol">H</span>
                <span className="qgm-gate-number">02</span>
              </div>

              <h3>Hadamard Gate</h3>
              <p className="qgm-gate-subtitle">The superposition maker</p>

              <p>
                The Hadamard gate can transform a definite qubit into a
                superposition with equal probabilities of measuring 0 or 1.
              </p>

              <div className="qgm-analogy-box qgm-purple-analogy">
                <span>🪙</span>

                <div>
                  <strong>Spinning coin analogy</strong>
                  <p>
                    It is like changing a resting coin into a spinning coin
                    with two possible outcomes.
                  </p>
                </div>
              </div>

              <div className="qgm-mini-equation">
                <span>|0⟩</span>
                <strong>H</strong>
                <span>50% / 50%</span>
              </div>
            </article>

            <article className="qgm-gate-lesson-card qgm-cnot-card">
              <div className="qgm-gate-card-top">
                <span className="qgm-gate-symbol">CX</span>
                <span className="qgm-gate-number">03</span>
              </div>

              <h3>CNOT Gate</h3>
              <p className="qgm-gate-subtitle">The controlled bit flip</p>

              <p>
                CNOT acts on two qubits. It flips the target qubit only when
                the control qubit is in state |1⟩.
              </p>

              <div className="qgm-analogy-box qgm-blue-analogy">
                <span>🔐</span>

                <div>
                  <strong>Key and lock analogy</strong>
                  <p>
                    The target switch works only when the control key is
                    activated.
                  </p>
                </div>
              </div>

              <div className="qgm-mini-equation">
                <span>|10⟩</span>
                <strong>CX</strong>
                <span>|11⟩</span>
              </div>
            </article>
          </div>
        </section>

        <section className="qgm-explorer-section" id="explorer">
          <div className="qgm-section-heading">
            <p className="qgm-section-label">INTERACTIVE GATE EXPLORER</p>
            <h2>See how each gate changes a qubit</h2>
            <p>
              Select a gate below to inspect its operation, probability change,
              circuit symbol, and Qiskit code.
            </p>
          </div>

          <div className="qgm-explorer-shell">
            <div className="qgm-gate-selector" role="tablist">
              {Object.entries(gates).map(([gateKey, gate]) => (
                <button
                  className={`qgm-gate-selector-button ${
                    selectedGate === gateKey ? "active" : ""
                  }`}
                  type="button"
                  key={gateKey}
                  onClick={() => selectGate(gateKey)}
                  aria-selected={selectedGate === gateKey}
                  role="tab"
                >
                  <span>{gate.icon}</span>

                  <div>
                    <strong>{gate.name}</strong>
                    <small>{gate.subtitle}</small>
                  </div>
                </button>
              ))}
            </div>

            <div
              className={`qgm-explorer-display qgm-${selectedGate}-display`}
              key={`${selectedGate}-${animationKey}`}
            >
              <div className="qgm-explorer-information">
                <div className="qgm-explorer-title">
                  <span>{activeGate.shortName}</span>

                  <div>
                    <p>{activeGate.subtitle}</p>
                    <h3>{activeGate.name}</h3>
                  </div>
                </div>

                <p className="qgm-explorer-description">
                  {activeGate.description}
                </p>

                <div className="qgm-explorer-analogy">
                  <span aria-hidden="true">💭</span>

                  <div>
                    <strong>Simple analogy</strong>
                    <p>{activeGate.analogy}</p>
                  </div>
                </div>

                <div className="qgm-code-line">
                  <span>Qiskit</span>
                  <code>{activeGate.code}</code>
                </div>
              </div>

              <div className="qgm-gate-animation-panel">
                {activeGate.type === "single" ? (
                  <>
                    <div className="qgm-state-transition">
                      <div className="qgm-state-node">
                        <small>Input</small>
                        <strong>{activeGate.inputLabel}</strong>
                      </div>

                      <div className="qgm-animated-wire">
                        <div className="qgm-moving-particle" />
                        <div className="qgm-active-gate">
                          {activeGate.shortName}
                        </div>
                      </div>

                      <div className="qgm-state-node qgm-output-node">
                        <small>Output</small>
                        <strong>{activeGate.outputLabel}</strong>
                      </div>
                    </div>

                    <div className="qgm-probabilities">
                      <ProbabilityBars
                        zero={activeGate.inputZero}
                        one={activeGate.inputOne}
                        label="Before gate"
                      />

                      <div className="qgm-probability-divider">→</div>

                      <ProbabilityBars
                        zero={activeGate.outputZero}
                        one={activeGate.outputOne}
                        label="After gate"
                      />
                    </div>
                  </>
                ) : (
                  <div className="qgm-cnot-explorer">
                    <div className="qgm-cnot-labels">
                      <span>Control qubit</span>
                      <span>Target qubit</span>
                    </div>

                    <div className="qgm-cnot-circuit">
                      <div className="qgm-cnot-wire-row">
                        <strong>|{activeGate.controlInput}⟩</strong>
                        <div className="qgm-horizontal-wire">
                          <span className="qgm-circuit-control-dot" />
                        </div>
                        <strong>|{activeGate.controlOutput}⟩</strong>
                      </div>

                      <div className="qgm-cnot-wire-row">
                        <strong>|{activeGate.targetInput}⟩</strong>
                        <div className="qgm-horizontal-wire">
                          <span className="qgm-circuit-target">＋</span>
                        </div>
                        <strong>|{activeGate.targetOutput}⟩</strong>
                      </div>

                      <div className="qgm-cnot-vertical-connector" />
                    </div>

                    <div className="qgm-cnot-state-summary">
                      <div>
                        <span>Input state</span>
                        <strong>{activeGate.inputLabel}</strong>
                      </div>

                      <span>→</span>

                      <div>
                        <span>Output state</span>
                        <strong>{activeGate.outputLabel}</strong>
                      </div>
                    </div>
                  </div>
                )}

                <div className="qgm-explorer-note">
                  <span>i</span>
                  <p>{activeGate.note}</p>
                </div>

                <button
                  className="qgm-replay-button"
                  type="button"
                  onClick={replayGate}
                >
                  Replay gate
                  <span aria-hidden="true">↻</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="qgm-comparison-section" id="comparison">
          <div className="qgm-section-heading">
            <p className="qgm-section-label">CLASSICAL VS QUANTUM</p>
            <h2>Compare logic gates and quantum gates</h2>
            <p>
              Classical gates transform definite bits. Quantum gates transform
              qubits and can act on superposition states.
            </p>
          </div>

          <div className="qgm-comparison-grid">
            <article className="qgm-comparison-card qgm-classical-card">
              <div className="qgm-comparison-card-header">
                <span>💻</span>

                <div>
                  <p>CLASSICAL LOGIC</p>
                  <h3>NOT Gate</h3>
                </div>
              </div>

              <p>
                A NOT gate flips one classical bit. The result is always
                definite.
              </p>

              <div className="qgm-truth-table">
                <div className="qgm-table-heading">
                  <span>Input</span>
                  <span>Output</span>
                </div>

                <div>
                  <span>0</span>
                  <span>1</span>
                </div>

                <div>
                  <span>1</span>
                  <span>0</span>
                </div>
              </div>

              <div className="qgm-comparison-callout">
                <strong>Closest quantum comparison</strong>
                <p>The X gate also flips 0 and 1 basis states.</p>
              </div>
            </article>

            <article className="qgm-comparison-card qgm-quantum-card">
              <div className="qgm-comparison-card-header">
                <span>⚛️</span>

                <div>
                  <p>QUANTUM LOGIC</p>
                  <h3>X Gate</h3>
                </div>
              </div>

              <p>
                The X gate flips |0⟩ and |1⟩, but it can also act on
                superpositions of those states.
              </p>

              <div className="qgm-truth-table">
                <div className="qgm-table-heading">
                  <span>Input</span>
                  <span>Output</span>
                </div>

                <div>
                  <span>|0⟩</span>
                  <span>|1⟩</span>
                </div>

                <div>
                  <span>|1⟩</span>
                  <span>|0⟩</span>
                </div>
              </div>

              <div className="qgm-comparison-callout qgm-quantum-callout">
                <strong>Quantum difference</strong>
                <p>
                  The gate also changes the amplitudes of superposition states.
                </p>
              </div>
            </article>

            <article className="qgm-comparison-card qgm-classical-card">
              <div className="qgm-comparison-card-header">
                <span>💻</span>

                <div>
                  <p>CLASSICAL LOGIC</p>
                  <h3>AND Gate</h3>
                </div>
              </div>

              <p>
                An AND gate outputs 1 only when both classical inputs are 1.
              </p>

              <div className="qgm-truth-table qgm-four-row-table">
                <div className="qgm-table-heading">
                  <span>Inputs</span>
                  <span>Output</span>
                </div>

                <div>
                  <span>0, 0</span>
                  <span>0</span>
                </div>

                <div>
                  <span>0, 1</span>
                  <span>0</span>
                </div>

                <div>
                  <span>1, 0</span>
                  <span>0</span>
                </div>

                <div>
                  <span>1, 1</span>
                  <span>1</span>
                </div>
              </div>

              <div className="qgm-comparison-callout">
                <strong>Classical behavior</strong>
                <p>Information is processed using fixed logical rules.</p>
              </div>
            </article>

            <article className="qgm-comparison-card qgm-quantum-card">
              <div className="qgm-comparison-card-header">
                <span>⚛️</span>

                <div>
                  <p>QUANTUM LOGIC</p>
                  <h3>CNOT Gate</h3>
                </div>
              </div>

              <p>
                CNOT flips the target only when its control qubit is |1⟩.
              </p>

              <div className="qgm-truth-table qgm-four-row-table">
                <div className="qgm-table-heading">
                  <span>Input</span>
                  <span>Output</span>
                </div>

                <div>
                  <span>|00⟩</span>
                  <span>|00⟩</span>
                </div>

                <div>
                  <span>|01⟩</span>
                  <span>|01⟩</span>
                </div>

                <div>
                  <span>|10⟩</span>
                  <span>|11⟩</span>
                </div>

                <div>
                  <span>|11⟩</span>
                  <span>|10⟩</span>
                </div>
              </div>

              <div className="qgm-comparison-callout qgm-quantum-callout">
                <strong>Quantum difference</strong>
                <p>
                  Combined with superposition, CNOT can help create
                  entanglement.
                </p>
              </div>
            </article>
          </div>

          <div className="qgm-comparison-summary">
            <div>
              <span>Classical gates</span>
              <strong>Transform definite 0 and 1 values</strong>
            </div>

            <span className="qgm-summary-vs">VS</span>

            <div>
              <span>Quantum gates</span>
              <strong>Transform amplitudes and quantum states</strong>
            </div>
          </div>
        </section>

        <section className="qgm-quiz-section" id="quiz">
          <div className="qgm-section-heading">
            <p className="qgm-section-label">KNOWLEDGE CHECK</p>
            <h2>Test your gate knowledge</h2>
            <p>
              Select an answer to receive immediate feedback. Complete all four
              questions to see your score.
            </p>
          </div>

          <div className="qgm-quiz-layout">
            <div className="qgm-quiz-questions">
              {quizQuestions.map((question, questionIndex) => {
                const selectedAnswer = selectedAnswers[question.id];
                const hasAnswered = selectedAnswer !== undefined;
                const isCorrect = selectedAnswer === question.answer;

                return (
                  <article className="qgm-quiz-card" key={question.id}>
                    <div className="qgm-question-heading">
                      <span>{questionIndex + 1}</span>
                      <h3>{question.question}</h3>
                    </div>

                    <div className="qgm-quiz-options">
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
                            className={`qgm-quiz-option ${
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
                            <span className="qgm-option-letter">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>

                            <span className="qgm-option-text">{option}</span>

                            {isCorrectOption && (
                              <span className="qgm-result-icon">✓</span>
                            )}

                            {isWrongSelection && (
                              <span className="qgm-result-icon">✕</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div
                        className={`qgm-quiz-feedback ${
                          isCorrect
                            ? "qgm-feedback-correct"
                            : "qgm-feedback-wrong"
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

            <aside className="qgm-quiz-progress-card">
              <p className="qgm-section-label">QUIZ PROGRESS</p>

              <div className="qgm-score-circle">
                <strong>{answeredCount}</strong>
                <span>of 4 answered</span>
              </div>

              <div className="qgm-progress-track">
                <div
                  style={{
                    width: `${(answeredCount / quizQuestions.length) * 100}%`,
                  }}
                />
              </div>

              <p>
                Answer every question before calculating your final result.
              </p>

              <button
                className="qgm-check-score-button"
                type="button"
                disabled={answeredCount !== quizQuestions.length}
                onClick={checkScore}
              >
                Check my score
              </button>
            </aside>
          </div>

          {showSummary && (
            <div
              className={`qgm-quiz-summary ${
                correctCount >= 3
                  ? "qgm-summary-success"
                  : "qgm-summary-review"
              }`}
              id="quantum-gates-quiz-summary"
              role="status"
            >
              <div className="qgm-summary-icon">
                {correctCount === 4 ? "🎉" : correctCount >= 3 ? "⭐" : "📘"}
              </div>

              <div>
                <p className="qgm-section-label">YOUR RESULT</p>
                <h3>
                  You scored {correctCount} out of {quizQuestions.length}
                </h3>

                <p>
                  {correctCount === 4 &&
                    "Excellent work! You understand the X, Hadamard, and CNOT gates."}

                  {correctCount === 3 &&
                    "Great job! You have a strong understanding of quantum gates."}

                  {correctCount < 3 &&
                    "Good effort. Review the gate explorer and try the quiz again."}
                </p>
              </div>

              <button type="button" onClick={resetQuiz}>
                Try again
              </button>
            </div>
          )}
        </section>

        <section className="qgm-complete-section">
          <div>
            <p className="qgm-section-label">MODULE COMPLETE</p>
            <h2>You can now explain three essential quantum gates.</h2>
            <p>
              You learned how the X gate flips qubits, how the Hadamard gate
              creates superposition, and how CNOT uses a control and target
              qubit.
            </p>
          </div>

          <a className="qgm-next-module-button" href="/modules/4">
            Continue to Module 4
            <span aria-hidden="true">→</span>
          </a>
        </section>
      </main>

      <footer className="qgm-footer">
        <a className="qgm-brand" href="/">
          <span className="qgm-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <p>Making quantum computing understandable for everyone.</p>

        <span>© 2026 QuantumPath</span>
      </footer>
    </div>
  );
}

export default QuantumGatesModule;