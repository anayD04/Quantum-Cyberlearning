import React, { useMemo, useState } from "react";
import "./EntanglementModule.css";
import { useProgress } from "./ProgressContext";

const quizQuestions = [
  {
    id: 1,
    question: "What is quantum entanglement?",
    options: [
      "A shared quantum state involving multiple qubits",
      "A broken quantum computer",
      "A faster type of classical wire",
      "A qubit that is always equal to 1",
    ],
    answer: 0,
    explanation:
      "Entangled qubits are described by one shared quantum state rather than completely independent states.",
  },
  {
    id: 2,
    question: "Which two gates can create a Bell pair from |00⟩?",
    options: [
      "Two measurement gates",
      "Hadamard followed by CNOT",
      "Only an X gate",
      "AND followed by NOT",
    ],
    answer: 1,
    explanation:
      "Applying H to the first qubit and then CNOT creates the Bell state (|00⟩ + |11⟩) / √2.",
  },
  {
    id: 3,
    question:
      "What results can appear when the Bell pair in this lesson is measured?",
    options: [
      "Only 01",
      "Only 10",
      "00 or 11",
      "00, 01, 10, and 11 equally",
    ],
    answer: 2,
    explanation:
      "The Bell pair produces correlated outcomes: both qubits are measured as 0 or both are measured as 1.",
  },
  {
    id: 4,
    question: "Which statement about entanglement is correct?",
    options: [
      "It allows instant messages to be sent faster than light",
      "It means both qubits always have known classical values",
      "It is identical to copying two classical bits",
      "It creates correlations that cannot be fully explained by predetermined classical values",
    ],
    answer: 3,
    explanation:
      "Entanglement produces genuinely quantum correlations, but it cannot be used by itself to send information faster than light.",
  },
  {
    id: 5,
    question: "What is a Bell state?",
    options: [
      "A maximally entangled state involving two qubits",
      "A classical bit stored twice",
      "A measurement device",
      "A qubit that is always |0⟩",
    ],
    answer: 0,
    explanation:
      "A Bell state is a maximally entangled two-qubit state with strong quantum correlations.",
  },
  {
    id: 6,
    question:
      "What does the Hadamard gate do before the CNOT gate creates entanglement?",
    options: [
      "It measures both qubits",
      "It places the control qubit into superposition",
      "It deletes the target qubit",
      "It turns both qubits into classical bits",
    ],
    answer: 1,
    explanation:
      "The Hadamard gate first places the control qubit into superposition, allowing the following CNOT gate to entangle the pair.",
  },
  {
    id: 7,
    question: "What is the role of the CNOT gate when creating a Bell pair?",
    options: [
      "It measures the first qubit",
      "It creates a third qubit",
      "It flips the target depending on the control qubit",
      "It removes superposition from every qubit",
    ],
    answer: 2,
    explanation:
      "The CNOT gate flips the target qubit when the control is |1⟩, linking the two qubits into a shared state.",
  },
  {
    id: 8,
    question:
      "If one qubit in the Bell state (|00⟩ + |11⟩) / √2 is measured as 1, what will the other qubit be measured as?",
    options: [
      "It must be 0",
      "It could be any decimal number",
      "It disappears",
      "It will also be 1",
    ],
    answer: 3,
    explanation:
      "In this Bell state, the measurement results are correlated, so measuring one qubit as 1 means the other is also measured as 1.",
  },
  {
    id: 9,
    question:
      "How is classical correlation different from quantum entanglement?",
    options: [
      "Classical correlation can be explained by values chosen in advance",
      "Classical correlation always uses qubits",
      "Entanglement is caused by ordinary wires",
      "There is no difference",
    ],
    answer: 0,
    explanation:
      "Classically correlated objects can carry predetermined values, while entangled systems can produce correlations that cannot be fully explained that way.",
  },
  {
    id: 10,
    question:
      "Why does measuring one entangled qubit not allow faster-than-light communication?",
    options: [
      "Entangled qubits cannot be measured",
      "The individual result is random and cannot be controlled",
      "The second qubit always disappears",
      "CNOT gates are too slow",
    ],
    answer: 1,
    explanation:
      "Although the results are correlated, a person cannot choose the outcome of an individual measurement, so no controllable message is sent.",
  },
  {
    id: 11,
    question: "Why is entanglement useful in quantum computing?",
    options: [
      "It makes every calculation instantly correct",
      "It replaces all classical computers",
      "It allows qubits to share correlations used by quantum algorithms",
      "It prevents qubits from changing",
    ],
    answer: 2,
    explanation:
      "Entanglement allows quantum algorithms to coordinate information across multiple qubits in ways classical systems cannot directly reproduce.",
  },
  {
    id: 12,
    question: "Which application can use quantum entanglement?",
    options: [
      "Ordinary text formatting only",
      "Classical light switches",
      "Saving a normal image file",
      "Quantum teleportation and quantum communication",
    ],
    answer: 3,
    explanation:
      "Entanglement is an important resource in quantum teleportation, quantum communication, and several quantum algorithms.",
  },
];

const visualizerSteps = [
  {
    id: 0,
    name: "Start",
    gate: "Initial state",
    state: "|00⟩",
    formula: "|00⟩",
    description:
      "Both qubits begin in the definite state |0⟩. They are separate and not entangled.",
    q0: {
      label: "|0⟩",
      zeroProbability: 100,
      oneProbability: 0,
    },
    q1: {
      label: "|0⟩",
      zeroProbability: 100,
      oneProbability: 0,
    },
    entangled: false,
  },
  {
    id: 1,
    name: "Hadamard",
    gate: "Apply H to q₀",
    state: "|+0⟩",
    formula: "(|00⟩ + |10⟩) / √2",
    description:
      "The Hadamard gate places q₀ into superposition. The two qubits are still not entangled.",
    q0: {
      label: "|+⟩",
      zeroProbability: 50,
      oneProbability: 50,
    },
    q1: {
      label: "|0⟩",
      zeroProbability: 100,
      oneProbability: 0,
    },
    entangled: false,
  },
  {
    id: 2,
    name: "CNOT",
    gate: "Apply CNOT",
    state: "Bell pair",
    formula: "(|00⟩ + |11⟩) / √2",
    description:
      "CNOT connects the two qubits. Their combined state can no longer be separated into two independent qubit states.",
    q0: {
      label: "Shared state",
      zeroProbability: 50,
      oneProbability: 50,
    },
    q1: {
      label: "Shared state",
      zeroProbability: 50,
      oneProbability: 50,
    },
    entangled: true,
  },
  {
    id: 3,
    name: "Measure",
    gate: "Measure both qubits",
    state: "00 or 11",
    formula: "P(00) = 50%, P(11) = 50%",
    description:
      "Measurement produces matching outcomes. If q₀ is 0, q₁ is also 0. If q₀ is 1, q₁ is also 1.",
    q0: {
      label: "0 or 1",
      zeroProbability: 50,
      oneProbability: 50,
    },
    q1: {
      label: "Matching result",
      zeroProbability: 50,
      oneProbability: 50,
    },
    entangled: true,
  },
];

function ProbabilityBar({ label, value }) {
  return (
    <div className="em-probability-row">
      <span>{label}</span>

      <div className="em-probability-track">
        <div style={{ width: `${value}%` }} />
      </div>

      <strong>{value}%</strong>
    </div>
  );
}

function EntanglementModule() {
  const { addPoints, completeModule, isModuleCompleted } = useProgress();
  const [activeStep, setActiveStep] = useState(0);
  const [measurement, setMeasurement] = useState(null);
  const [measurementHistory, setMeasurementHistory] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const currentStep = visualizerSteps[activeStep];
  const answeredCount = Object.keys(selectedAnswers).length;

  const correctCount = useMemo(() => {
    return quizQuestions.reduce((score, question) => {
      return selectedAnswers[question.id] === question.answer
        ? score + 1
        : score;
    }, 0);
  }, [selectedAnswers]);

  const goToStep = (stepIndex) => {
    setActiveStep(stepIndex);

    if (stepIndex < 3) {
      setMeasurement(null);
    }
  };

  const moveForward = () => {
    setActiveStep((current) => Math.min(current + 1, 3));
    setMeasurement(null);
  };

  const moveBackward = () => {
    setActiveStep((current) => Math.max(current - 1, 0));
    setMeasurement(null);
  };

  const resetVisualizer = () => {
    setActiveStep(0);
    setMeasurement(null);
    setMeasurementHistory([]);
  };

  const measureBellPair = () => {
    const result = Math.random() < 0.5 ? "00" : "11";

    setActiveStep(3);
    setMeasurement(result);
    setMeasurementHistory((history) => [result, ...history].slice(0, 8));
  };

  const handleAnswer = (questionId, optionIndex) => {
    setSelectedAnswers((answers) => ({
      ...answers,
      [questionId]: optionIndex,
    }));

    setShowSummary(false);
  };

  const checkScore = () => {
    setShowSummary(true);

    if (!isModuleCompleted(5)) {
    addPoints(5, 20);
    completeModule(5);
  }

    setTimeout(() => {
      document
        .getElementById("entanglement-quiz-summary")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowSummary(false);
  };

  return (
    <div className="em-page">
      <header className="em-navbar">
        <a className="em-brand" href="/" aria-label="QuantumPath home">
          <span className="em-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <nav className="em-nav-links" aria-label="Lesson navigation">
          <a href="/modules">Modules</a>
          <a href="#lesson">Lesson</a>
          <a href="#visualizer">Visualizer</a>
          <a href="#comparison">Comparison</a>
          <a href="#quiz">Quiz</a>
        </nav>

        <div className="em-module-progress">
          <span>Module 5</span>
          <strong>Entanglement</strong>
        </div>
      </header>

      <main>
        <section className="em-hero">
          <div className="em-hero-glow em-glow-one" />
          <div className="em-hero-glow em-glow-two" />

          <div className="em-hero-content">
            <a className="em-back-link" href="/modules">
              <span aria-hidden="true">←</span>
              Back to modules
            </a>

            <div className="em-module-label">
              <span>MODULE 05</span>
              <span className="em-difficulty">Intermediate</span>
            </div>

            <h1>
              Discover Quantum
              <span> Entanglement</span>
            </h1>

            <p>
              Explore how two qubits can share one quantum state, produce
              remarkable correlations, and become a powerful resource for
              quantum computing.
            </p>

            <div className="em-module-details">
              <span>⏱ 15 minutes</span>
              <span>🔗 Interactive Bell pair</span>
              <span>📊 Correlated measurements</span>
            </div>
          </div>

          <div className="em-hero-visual" aria-hidden="true">
            <div className="em-hero-qubit em-hero-qubit-one">
              <span>q₀</span>
              <strong>|0⟩</strong>
            </div>

            <div className="em-entanglement-bridge">
              <span />
              <span />
              <span />
            </div>

            <div className="em-hero-qubit em-hero-qubit-two">
              <span>q₁</span>
              <strong>|0⟩</strong>
            </div>

            <div className="em-hero-circuit">
              <div className="em-hero-wire-row">
                <span>q₀</span>

                <div>
                  <strong>H</strong>
                  <i className="em-control-dot" />
                </div>
              </div>

              <div className="em-hero-wire-row">
                <span>q₁</span>

                <div>
                  <i className="em-target-symbol">＋</i>
                </div>
              </div>

              <i className="em-control-line" />
            </div>

            <div className="em-floating-state">
              <small>Bell state</small>
              <strong>(|00⟩ + |11⟩) / √2</strong>
            </div>
          </div>
        </section>

        <section className="em-lesson-section" id="lesson">
          <div className="em-section-heading">
            <p className="em-section-label">LESSON 1</p>
            <h2>What is entanglement?</h2>
            <p>
              Entanglement occurs when multiple qubits share a combined quantum
              state that cannot be fully described by treating each qubit
              independently.
            </p>
          </div>

          <div className="em-introduction-card">
            <div className="em-introduction-icon">🔗</div>

            <div>
              <h3>One shared quantum description</h3>

              <p>
                When two qubits are entangled, we describe them as one combined
                system. Measuring one qubit reveals information about the result
                of measuring the other.
              </p>

              <p>
                This does not mean that each qubit secretly carried a known
                classical answer from the beginning. Experiments show that
                quantum correlations are stronger than classical hidden-value
                explanations can reproduce.
              </p>
            </div>

            <div className="em-key-idea">
              <span>Key idea</span>
              <strong>
                Entanglement is about a shared quantum state, not a physical
                rope, signal, or instant message between particles.
              </strong>
            </div>
          </div>

          <div className="em-lesson-grid">
            <article className="em-lesson-card">
              <span className="em-card-number">01</span>

              <div>
                <h3>A combined state</h3>

                <p>
                  Consider the Bell state:
                </p>

                <div className="em-formula-box">
                  (|00⟩ + |11⟩) / √2
                </div>

                <p>
                  This state represents two qubits together. The possible
                  measurement results are 00 and 11.
                </p>
              </div>
            </article>

            <article className="em-lesson-card">
              <span className="em-card-number">02</span>

              <div>
                <h3>Matching measurements</h3>

                <p>
                  If the first qubit is measured as 0, the second is also found
                  as 0. If the first is measured as 1, the second is also 1.
                </p>

                <div className="em-result-pair">
                  <div>
                    <span>Possible result</span>
                    <strong>00</strong>
                  </div>

                  <span>or</span>

                  <div>
                    <span>Possible result</span>
                    <strong>11</strong>
                  </div>
                </div>
              </div>
            </article>

            <article className="em-lesson-card">
              <span className="em-card-number">03</span>

              <div>
                <h3>Not faster-than-light messaging</h3>

                <p>
                  Each individual measurement still appears random. A person
                  measuring one qubit cannot choose whether the result will be 0
                  or 1.
                </p>

                <div className="em-warning-box">
                  <span>!</span>

                  <p>
                    Entanglement creates correlations, but it cannot be used
                    alone to send a controllable message faster than light.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="em-analogy-section">
            <div className="em-analogy-heading">
              <p className="em-section-label">A SIMPLE ANALOGY</p>
              <h3>Two mystery cards</h3>
            </div>

            <div className="em-analogy-layout">
              <div className="em-analogy-card">
                <span>Classical cards</span>

                <div className="em-card-pair">
                  <div>Red</div>
                  <div>Blue</div>
                </div>

                <p>
                  Imagine placing one red card and one blue card into two
                  envelopes. Opening one envelope tells you which card was in
                  the other because both colors were fixed beforehand.
                </p>
              </div>

              <div className="em-analogy-divider">VS</div>

              <div className="em-analogy-card em-quantum-analogy">
                <span>Entangled qubits</span>

                <div className="em-card-pair">
                  <div>?</div>
                  <div>?</div>
                </div>

                <p>
                  Entangled qubits are not simply ordinary cards with
                  predetermined values. Quantum experiments reveal correlations
                  that cannot be reproduced by that classical envelope story.
                </p>
              </div>
            </div>

            <div className="em-analogy-note">
              <span>Remember</span>

              <p>
                Analogies help us begin, but no everyday object behaves exactly
                like an entangled quantum system.
              </p>
            </div>
          </div>

          <div className="em-computing-uses">
            <div className="em-computing-heading">
              <p className="em-section-label">WHY IT MATTERS</p>
              <h3>Entanglement in quantum computing</h3>
            </div>

            <div className="em-use-grid">
              <article>
                <span>🧮</span>
                <h4>Quantum algorithms</h4>
                <p>
                  Entanglement helps quantum algorithms coordinate information
                  across multiple qubits.
                </p>
              </article>

              <article>
                <span>📡</span>
                <h4>Quantum teleportation</h4>
                <p>
                  Entanglement can help transfer a quantum state when combined
                  with classical communication.
                </p>
              </article>

              <article>
                <span>🔐</span>
                <h4>Quantum communication</h4>
                <p>
                  Entangled systems can support security tests that reveal
                  certain kinds of interference or eavesdropping.
                </p>
              </article>

              <article>
                <span>🧪</span>
                <h4>Quantum simulation</h4>
                <p>
                  Entangled qubits can represent relationships found in
                  molecules and quantum materials.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="em-visualizer-section" id="visualizer">
          <div className="em-section-heading">
            <p className="em-section-label">INTERACTIVE VISUALIZER</p>
            <h2>Create and measure a Bell pair</h2>
            <p>
              Follow the circuit step by step. First create superposition with
              a Hadamard gate, then connect the qubits using CNOT.
            </p>
          </div>

          <div className="em-visualizer-shell">
            <div className="em-step-selector">
              {visualizerSteps.map((step, index) => (
                <button
                  className={activeStep === index ? "active" : ""}
                  type="button"
                  key={step.id}
                  onClick={() => goToStep(index)}
                >
                  <span>{index}</span>

                  <div>
                    <strong>{step.name}</strong>
                    <small>{step.gate}</small>
                  </div>
                </button>
              ))}
            </div>

            <div className="em-visualizer-content">
              <div className="em-circuit-panel">
                <div className="em-panel-heading">
                  <div>
                    <p className="em-section-label">BELL PAIR CIRCUIT</p>
                    <h3>{currentStep.gate}</h3>
                  </div>

                  <span>
                    Step {activeStep} of {visualizerSteps.length - 1}
                  </span>
                </div>

                <div className="em-circuit-diagram">
                  <div className="em-circuit-row">
                    <div className="em-qubit-label">
                      <span>q₀</span>
                      <strong>|0⟩</strong>
                    </div>

                    <div className="em-circuit-wire">
                      <button
                        className={`em-circuit-gate ${
                          activeStep >= 1 ? "active" : ""
                        }`}
                        type="button"
                        onClick={() => goToStep(1)}
                      >
                        H
                      </button>

                      <button
                        className={`em-circuit-control ${
                          activeStep >= 2 ? "active" : ""
                        }`}
                        type="button"
                        onClick={() => goToStep(2)}
                        aria-label="CNOT control"
                      />

                      <button
                        className={`em-measure-gate ${
                          activeStep >= 3 ? "active" : ""
                        }`}
                        type="button"
                        onClick={() => goToStep(3)}
                      >
                        M
                      </button>
                    </div>
                  </div>

                  <div className="em-circuit-row">
                    <div className="em-qubit-label">
                      <span>q₁</span>
                      <strong>|0⟩</strong>
                    </div>

                    <div className="em-circuit-wire">
                      <span className="em-gate-placeholder" />

                      <button
                        className={`em-circuit-target ${
                          activeStep >= 2 ? "active" : ""
                        }`}
                        type="button"
                        onClick={() => goToStep(2)}
                        aria-label="CNOT target"
                      >
                        ＋
                      </button>

                      <button
                        className={`em-measure-gate ${
                          activeStep >= 3 ? "active" : ""
                        }`}
                        type="button"
                        onClick={() => goToStep(3)}
                      >
                        M
                      </button>
                    </div>
                  </div>

                  <div
                    className={`em-cnot-connector ${
                      activeStep >= 2 ? "active" : ""
                    }`}
                  />
                </div>

                <div className="em-circuit-controls">
                  <button
                    type="button"
                    onClick={moveBackward}
                    disabled={activeStep === 0}
                  >
                    ← Previous
                  </button>

                  <button type="button" onClick={resetVisualizer}>
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={moveForward}
                    disabled={activeStep === 3}
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div className="em-state-panel">
                <div className="em-state-heading">
                  <span
                    className={
                      currentStep.entangled
                        ? "em-status-badge entangled"
                        : "em-status-badge"
                    }
                  >
                    {currentStep.entangled ? "Entangled" : "Not entangled"}
                  </span>

                  <h3>{currentStep.state}</h3>
                  <code>{currentStep.formula}</code>
                  <p>{currentStep.description}</p>
                </div>

                <div
                  className={`em-qubit-visualization ${
                    currentStep.entangled ? "is-entangled" : ""
                  }`}
                >
                  <div className="em-visual-qubit">
                    <span>q₀</span>
                    <strong>{currentStep.q0.label}</strong>
                    <i />
                  </div>

                  <div className="em-quantum-link">
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="em-visual-qubit">
                    <span>q₁</span>
                    <strong>{currentStep.q1.label}</strong>
                    <i />
                  </div>
                </div>

                <div className="em-probability-grid">
                  <div>
                    <p>Qubit q₀</p>

                    <ProbabilityBar
                      label="|0⟩"
                      value={currentStep.q0.zeroProbability}
                    />

                    <ProbabilityBar
                      label="|1⟩"
                      value={currentStep.q0.oneProbability}
                    />
                  </div>

                  <div>
                    <p>Qubit q₁</p>

                    <ProbabilityBar
                      label="|0⟩"
                      value={currentStep.q1.zeroProbability}
                    />

                    <ProbabilityBar
                      label="|1⟩"
                      value={currentStep.q1.oneProbability}
                    />
                  </div>
                </div>

                {currentStep.entangled && (
                  <div className="em-entanglement-message">
                    <span>🔗</span>

                    <p>
                      These probabilities describe the individual measurements,
                      but the important information is in the shared
                      correlation: the two results match.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="em-measurement-lab">
              <div className="em-measurement-heading">
                <div>
                  <p className="em-section-label">MEASUREMENT LAB</p>
                  <h3>Measure the entangled qubits</h3>
                  <p>
                    Each run is random, but the two measured bits always match
                    in this Bell state.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={measureBellPair}
                  disabled={activeStep < 2}
                >
                  Measure both qubits
                </button>
              </div>

              <div className="em-measurement-display">
                <div className="em-measured-pair">
                  <div
                    className={
                      measurement
                        ? "em-measured-qubit revealed"
                        : "em-measured-qubit"
                    }
                  >
                    <span>q₀</span>
                    <strong>{measurement ? measurement[0] : "?"}</strong>
                  </div>

                  <div className="em-correlation-line">
                    <span>correlated</span>
                  </div>

                  <div
                    className={
                      measurement
                        ? "em-measured-qubit revealed"
                        : "em-measured-qubit"
                    }
                  >
                    <span>q₁</span>
                    <strong>{measurement ? measurement[1] : "?"}</strong>
                  </div>
                </div>

                <div className="em-measurement-result">
                  {activeStep < 2 && (
                    <>
                      <strong>Create entanglement first</strong>
                      <p>
                        Apply the Hadamard and CNOT gates before measuring the
                        pair.
                      </p>
                    </>
                  )}

                  {activeStep >= 2 && !measurement && (
                    <>
                      <strong>Ready to measure</strong>
                      <p>
                        The result will be either 00 or 11, each with a 50%
                        probability.
                      </p>
                    </>
                  )}

                  {measurement && (
                    <>
                      <strong>Result: {measurement}</strong>
                      <p>
                        Both qubits produced the same value, demonstrating the
                        Bell pair's correlation.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="em-history-section">
                <span>Recent measurements</span>

                <div className="em-history-list">
                  {measurementHistory.length === 0 && (
                    <small>No measurements yet</small>
                  )}

                  {measurementHistory.map((result, index) => (
                    <div key={`${result}-${index}`}>
                      <span>{index + 1}</span>
                      <strong>{result}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="em-comparison-section" id="comparison">
          <div className="em-section-heading">
            <p className="em-section-label">CLASSICAL VS QUANTUM</p>
            <h2>Correlation is not always entanglement</h2>
            <p>
              Classical systems can be correlated too, but their relationships
              can be explained using ordinary predetermined values.
            </p>
          </div>

          <div className="em-comparison-grid">
            <article className="em-comparison-card em-classical-card">
              <div className="em-comparison-heading">
                <span>💻</span>

                <div>
                  <p>CLASSICAL CORRELATION</p>
                  <h3>Matching classical bits</h3>
                </div>
              </div>

              <div className="em-classical-visual">
                <div>
                  <small>Bit A</small>
                  <strong>0</strong>
                </div>

                <span>matches</span>

                <div>
                  <small>Bit B</small>
                  <strong>0</strong>
                </div>
              </div>

              <p>
                Two classical bits may be prepared with matching values. For
                example, a program could randomly choose 00 or 11.
              </p>

              <ul>
                <li>Each bit has a definite value.</li>
                <li>The values may be chosen before observation.</li>
                <li>The correlation can be copied and stored.</li>
                <li>Ordinary probability can explain the results.</li>
              </ul>

              <div className="em-comparison-example">
                <span>Example</span>
                <code>choice = random.choice(["00", "11"])</code>
              </div>
            </article>

            <article className="em-comparison-card em-quantum-card">
              <div className="em-comparison-heading">
                <span>⚛️</span>

                <div>
                  <p>QUANTUM ENTANGLEMENT</p>
                  <h3>A shared Bell state</h3>
                </div>
              </div>

              <div className="em-quantum-correlation-visual">
                <div>
                  <small>Qubit q₀</small>
                  <strong>?</strong>
                </div>

                <span className="em-small-link">
                  <i />
                  <i />
                  <i />
                </span>

                <div>
                  <small>Qubit q₁</small>
                  <strong>?</strong>
                </div>
              </div>

              <p>
                The Bell pair is described by one combined quantum state. Its
                correlations depend on how the qubits are measured.
              </p>

              <ul>
                <li>The pair shares one quantum state.</li>
                <li>Individual outcomes remain random.</li>
                <li>Unknown quantum states cannot be perfectly copied.</li>
                <li>Classical hidden values cannot explain all results.</li>
              </ul>

              <div className="em-comparison-example em-quantum-example">
                <span>Bell state</span>
                <code>(|00⟩ + |11⟩) / √2</code>
              </div>
            </article>
          </div>

          <div className="em-comparison-table">
            <div className="em-table-header">
              <span>Feature</span>
              <span>Classical correlation</span>
              <span>Entanglement</span>
            </div>

            <div>
              <strong>Information</strong>
              <span>Separate bits with definite values</span>
              <span>One shared quantum state</span>
            </div>

            <div>
              <strong>Individual result</strong>
              <span>Can be predetermined</span>
              <span>Can remain fundamentally random</span>
            </div>

            <div>
              <strong>Correlation</strong>
              <span>Explained by ordinary shared information</span>
              <span>Can exceed classical explanations</span>
            </div>

            <div>
              <strong>Copying</strong>
              <span>Bits can be copied</span>
              <span>Unknown quantum states cannot be cloned perfectly</span>
            </div>

            <div>
              <strong>Communication</strong>
              <span>Uses ordinary signals</span>
              <span>Does not enable faster-than-light messaging</span>
            </div>
          </div>
        </section>

        <section className="em-quiz-section" id="quiz">
          <div className="em-section-heading">
            <p className="em-section-label">KNOWLEDGE CHECK</p>
            <h2>Test your entanglement knowledge</h2>
            <p>
              Select an answer to receive immediate feedback. Complete all four
              questions to calculate your score.
            </p>
          </div>

          <div className="em-quiz-layout">
            <div className="em-quiz-questions">
              {quizQuestions.map((question, questionIndex) => {
                const selectedAnswer = selectedAnswers[question.id];
                const hasAnswered = selectedAnswer !== undefined;
                const isCorrect = selectedAnswer === question.answer;

                return (
                  <article className="em-quiz-card" key={question.id}>
                    <div className="em-question-heading">
                      <span>{questionIndex + 1}</span>
                      <h3>{question.question}</h3>
                    </div>

                    <div className="em-quiz-options">
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
                            className={`em-quiz-option ${
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
                            <span className="em-option-letter">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>

                            <span className="em-option-text">{option}</span>

                            {isCorrectOption && (
                              <span className="em-result-icon">✓</span>
                            )}

                            {isWrongSelection && (
                              <span className="em-result-icon">✕</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div
                        className={`em-quiz-feedback ${
                          isCorrect
                            ? "em-feedback-correct"
                            : "em-feedback-wrong"
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

            <aside className="em-quiz-progress-card">
              <p className="em-section-label">QUIZ PROGRESS</p>

              <div className="em-score-circle">
                <strong>{answeredCount}</strong>
                <span>of {quizQuestions.length}</span>
              </div>

              <div className="em-progress-track">
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
                className="em-check-score-button"
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
              className={`em-quiz-summary ${
                correctCount >= 3
                  ? "em-summary-success"
                  : "em-summary-review"
              }`}
              id="entanglement-quiz-summary"
              role="status"
            >
              <div className="em-summary-icon">
                {correctCount === quizQuestions.length ? "🎉" : correctCount >= quizQuestions.length - 1 ? "⭐" : "📘"}
              </div>

              <div>
                <p className="em-section-label">YOUR RESULT</p>

                <h3>
                  You scored {correctCount} out of {quizQuestions.length}
                </h3>

                <p>
                  {correctCount === quizQuestions.length &&
                    "Excellent work! You understand Bell pairs, correlated measurements, and the difference between classical and quantum correlation."}

                  {correctCount === quizQuestions.length - 1 &&
                    "Great job! You have a strong understanding of quantum entanglement."}

                  {correctCount < quizQuestions.length - 1 &&
                    "Good effort. Review the visualizer and comparison section, then try the quiz again."}
                </p>
              </div>

              <button type="button" onClick={resetQuiz}>
                Try again
              </button>
            </div>
          )}
        </section>

        <section className="em-complete-section">
          <div>
            <p className="em-section-label">MODULE COMPLETE</p>
            <h2>You can now explain the foundations of entanglement.</h2>
            <p>
              You learned how Hadamard and CNOT create a Bell pair, why
              entangled measurements are correlated, and how quantum
              correlation differs from classical shared information.
            </p>
          </div>

          <a className="em-next-module-button" href="/modules">
            Return to modules
            <span aria-hidden="true">→</span>
          </a>
        </section>
      </main>

      <footer className="em-footer">
        <a className="em-brand" href="/">
          <span className="em-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <p>Making quantum computing understandable for everyone.</p>

        <span>© 2026 QuantumPath</span>
      </footer>
    </div>
  );
}

export default EntanglementModule;