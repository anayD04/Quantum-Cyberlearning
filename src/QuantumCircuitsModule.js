import React, { useMemo, useState } from "react";
import "./QuantumCircuitsModule.css";
import { useProgress } from "./ProgressContext";

const availableGates = {
  X: {
    name: "X Gate",
    description: "Flips |0⟩ to |1⟩ and |1⟩ to |0⟩.",
  },
  H: {
    name: "Hadamard Gate",
    description:
      "Creates or removes an equal superposition of |0⟩ and |1⟩.",
  },
};

const quizQuestions = [
  {
    id: 1,
    question: "In a quantum circuit diagram, which direction does time move?",
    options: [
      "From left to right",
      "From right to left",
      "From bottom to top",
      "Time does not appear",
    ],
    answer: 0,
    explanation:
      "Quantum circuits are usually read from left to right, with gates applied in that order.",
  },
  {
    id: 2,
    question: "What does each horizontal wire usually represent?",
    options: [
      "A probability answer",
      "A qubit",
      "A computer monitor",
      "A classical program",
    ],
    answer: 1,
    explanation:
      "Each horizontal wire represents a qubit moving through the circuit.",
  },
  {
    id: 3,
    question: "What happens if an X gate is applied to |0⟩?",
    options: [
      "It stays |0⟩",
      "It becomes two qubits",
      "It becomes |1⟩",
      "It is automatically measured",
    ],
    answer: 2,
    explanation:
      "The X gate flips the computational basis states, so |0⟩ becomes |1⟩.",
  },
  {
    id: 4,
    question:
      "Which statement best describes a quantum circuit compared with a classical circuit?",
    options: [
      "Quantum circuits never use gates",
      "Classical circuits use qubits",
      "Quantum circuits always produce the same output",
      "Quantum circuits can manipulate superposition states",
    ],
    answer: 3,
    explanation:
      "Quantum circuits can transform superpositions and other quantum states, while classical circuits process definite bits.",
  },
  {
    id: 5,
    question: "What is a quantum circuit?",
    options: [
      "A sequence of quantum gates applied to one or more qubits",
      "A list of classical passwords",
      "A type of computer screen",
      "A measurement result with no gates",
    ],
    answer: 0,
    explanation:
      "A quantum circuit is an ordered sequence of quantum gates that changes the state of one or more qubits.",
  },
  {
    id: 6,
    question: "Why is the order of gates important in a quantum circuit?",
    options: [
      "Gate order only changes the color of the diagram",
      "Each gate acts on the state produced by the gates before it",
      "All gates always produce the same result",
      "Only measurement gates have an order",
    ],
    answer: 1,
    explanation:
      "Each gate receives the state left by the previous gate, so changing the order can change the final quantum state.",
  },
  {
    id: 7,
    question:
      "Which statement about applying H then X compared with X then H is correct?",
    options: [
      "They must always produce identical quantum states",
      "The second gate is ignored",
      "The two orders can produce different states because gate order matters",
      "Both sequences immediately measure the qubit",
    ],
    answer: 2,
    explanation:
      "Quantum gates do not always commute, so applying H then X can produce a different state from applying X then H.",
  },
  {
    id: 8,
    question: "What does a gate symbol placed on a wire mean?",
    options: [
      "The wire stops at that point",
      "The qubit is deleted",
      "The gate acts on every qubit in the circuit",
      "That gate is applied to the qubit represented by the wire",
    ],
    answer: 3,
    explanation:
      "A gate symbol on a wire shows that the corresponding operation is applied to that qubit at that point in the circuit.",
  },
  {
    id: 9,
    question: "What happens when a qubit in superposition is measured?",
    options: [
      "It produces a classical result such as 0 or 1",
      "It remains in every possible state forever",
      "It becomes a new quantum gate",
      "It always produces 1",
    ],
    answer: 0,
    explanation:
      "Measurement converts the quantum state into a classical result, such as 0 or 1.",
  },
  {
    id: 10,
    question: "Where is measurement usually shown in a simple circuit?",
    options: [
      "Before the starting state",
      "Near the end, after the gates have been applied",
      "Outside the circuit diagram",
      "Only on classical wires",
    ],
    answer: 1,
    explanation:
      "Measurement is usually placed near the end so the circuit can first transform the qubit and then record a classical result.",
  },
  {
    id: 11,
    question:
      "What is a common difference between classical and quantum circuit outputs?",
    options: [
      "Classical circuits never use wires",
      "Quantum circuits cannot contain gates",
      "Classical outputs are often deterministic, while quantum measurements can be probabilistic",
      "Quantum circuits always output every answer",
    ],
    answer: 2,
    explanation:
      "Classical logic circuits usually give a definite output for known inputs, while quantum measurements may produce different outcomes with specific probabilities.",
  },
  {
    id: 12,
    question:
      "If a Hadamard gate creates equal probabilities for 0 and 1, what might repeated measurements show?",
    options: [
      "Only 0 every time",
      "Only 1 every time",
      "No classical results",
      "A mixture of 0 and 1 results over many runs",
    ],
    answer: 3,
    explanation:
      "A balanced superposition gives a 50% probability for each result, so repeated runs should produce a mixture of 0s and 1s.",
  },
];

const initialState = {
  label: "|0⟩",
  zeroProbability: 100,
  oneProbability: 0,
  phase: "positive",
};

function applyGateToState(state, gate) {
  if (gate === "X") {
    if (state.label === "|0⟩") {
      return {
        label: "|1⟩",
        zeroProbability: 0,
        oneProbability: 100,
        phase: "positive",
      };
    }

    if (state.label === "|1⟩") {
      return {
        label: "|0⟩",
        zeroProbability: 100,
        oneProbability: 0,
        phase: "positive",
      };
    }

    if (state.label === "(|0⟩ + |1⟩) / √2") {
      return {
        ...state,
        label: "(|0⟩ + |1⟩) / √2",
      };
    }

    return {
      ...state,
      label: "(|0⟩ - |1⟩) / √2",
    };
  }

  if (gate === "H") {
    if (state.label === "|0⟩") {
      return {
        label: "(|0⟩ + |1⟩) / √2",
        zeroProbability: 50,
        oneProbability: 50,
        phase: "positive",
      };
    }

    if (state.label === "|1⟩") {
      return {
        label: "(|0⟩ - |1⟩) / √2",
        zeroProbability: 50,
        oneProbability: 50,
        phase: "negative",
      };
    }

    if (state.label === "(|0⟩ + |1⟩) / √2") {
      return {
        label: "|0⟩",
        zeroProbability: 100,
        oneProbability: 0,
        phase: "positive",
      };
    }

    return {
      label: "|1⟩",
      zeroProbability: 0,
      oneProbability: 100,
      phase: "positive",
    };
  }

  return state;
}

function calculateCircuitSteps(gates) {
  const steps = [
    {
      gate: "Start",
      state: initialState,
      explanation: "The qubit begins in the |0⟩ state.",
    },
  ];

  let currentState = initialState;

  gates.forEach((gate, index) => {
    currentState = applyGateToState(currentState, gate);

    steps.push({
      gate,
      state: currentState,
      explanation:
        gate === "X"
          ? `Step ${index + 1}: The X gate flips the qubit's basis states.`
          : `Step ${index + 1}: The Hadamard gate changes the balance and phase of the qubit.`,
    });
  });

  return steps;
}

function ProbabilityBar({ label, value }) {
  return (
    <div className="qcm-probability-row">
      <span>{label}</span>

      <div className="qcm-probability-track">
        <div style={{ width: `${value}%` }} />
      </div>

      <strong>{value}%</strong>
    </div>
  );
}

function QuantumCircuitsModule() {
  const { addPoints, completeModule, isModuleCompleted } = useProgress();
  const [circuitGates, setCircuitGates] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const circuitSteps = useMemo(
    () => calculateCircuitSteps(circuitGates),
    [circuitGates]
  );

  const currentStep = circuitSteps[activeStep] || circuitSteps[0];
  const answeredCount = Object.keys(selectedAnswers).length;

  const correctCount = useMemo(() => {
    return quizQuestions.reduce((score, question) => {
      return selectedAnswers[question.id] === question.answer
        ? score + 1
        : score;
    }, 0);
  }, [selectedAnswers]);

  const addGate = (gate) => {
    if (circuitGates.length >= 6) {
      return;
    }

    setCircuitGates((currentGates) => [...currentGates, gate]);
    setActiveStep(circuitGates.length + 1);
  };

  const removeGate = (index) => {
    const updatedGates = circuitGates.filter(
      (_, gateIndex) => gateIndex !== index
    );

    setCircuitGates(updatedGates);
    setActiveStep((currentStepIndex) =>
      Math.min(currentStepIndex, updatedGates.length)
    );
  };

  const clearCircuit = () => {
    setCircuitGates([]);
    setActiveStep(0);
  };

  const moveToPreviousStep = () => {
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const moveToNextStep = () => {
    setActiveStep((current) =>
      Math.min(current + 1, circuitSteps.length - 1)
    );
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
    if (!isModuleCompleted(4)) {
        addPoints(4, 20);
        completeModule(4);
    }

    setTimeout(() => {
      document
        .getElementById("quantum-circuits-quiz-summary")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowSummary(false);
  };

  return (
    <div className="qcm-page">
      <header className="qcm-navbar">
        <a className="qcm-brand" href="/" aria-label="QuantumPath home">
          <span className="qcm-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <nav className="qcm-nav-links" aria-label="Lesson navigation">
          <a href="/modules">Modules</a>
          <a href="#lesson">Lesson</a>
          <a href="#builder">Circuit Builder</a>
          <a href="#comparison">Comparison</a>
          <a href="#quiz">Quiz</a>
        </nav>

        <div className="qcm-module-progress">
          <span>Module 4</span>
          <strong>Quantum Circuits</strong>
        </div>
      </header>

      <main>
        <section className="qcm-hero">
          <div className="qcm-hero-glow qcm-glow-one" />
          <div className="qcm-hero-glow qcm-glow-two" />

          <div className="qcm-hero-content">
            <a className="qcm-back-link" href="/modules">
              <span aria-hidden="true">←</span>
              Back to modules
            </a>

            <div className="qcm-module-label">
              <span>MODULE 04</span>
              <span className="qcm-difficulty">Intermediate</span>
            </div>

            <h1>
              Build Quantum
              <span> Circuits</span>
            </h1>

            <p>
              Discover how qubits move through sequences of quantum gates and
              learn to read, build, and explain simple quantum circuits.
            </p>

            <div className="qcm-module-details">
              <span>⏱ 15 minutes</span>
              <span>⚛️ Interactive circuit builder</span>
              <span>📊 Step-by-step state tracing</span>
            </div>
          </div>

          <div className="qcm-hero-visual" aria-hidden="true">
            <div className="qcm-hero-circuit-card">
              <div className="qcm-circuit-title">
                <span>quantum_circuit</span>
                <small>3 gates</small>
              </div>

              <div className="qcm-hero-circuit-row">
                <span className="qcm-wire-label">q₀</span>
                <div className="qcm-hero-wire">
                  <span className="qcm-hero-gate">H</span>
                  <span className="qcm-hero-gate">X</span>
                  <span className="qcm-hero-gate">H</span>
                  <span className="qcm-measure-symbol">M</span>
                </div>
              </div>
            </div>

            <div className="qcm-floating-state qcm-state-one">
              <small>Start</small>
              <strong>|0⟩</strong>
            </div>

            <div className="qcm-floating-state qcm-state-two">
              <small>After H</small>
              <strong>50 / 50</strong>
            </div>

            <div className="qcm-floating-code">qc.h(0)</div>
            <div className="qcm-floating-code qcm-code-two">qc.x(0)</div>
          </div>
        </section>

        <section className="qcm-lesson-section" id="lesson">
          <div className="qcm-section-heading">
            <p className="qcm-section-label">LESSON 1</p>
            <h2>What is a quantum circuit?</h2>
            <p>
              A quantum circuit is a visual and mathematical plan showing how
              quantum gates are applied to qubits in a particular order.
            </p>
          </div>

          <div className="qcm-lesson-introduction">
            <div className="qcm-introduction-icon">🧭</div>

            <div>
              <h3>A route for quantum information</h3>
              <p>
                Think of a quantum circuit like a route on a map. The qubit is a
                traveler, each gate is a stop that changes the traveler, and
                measurement tells us where the traveler finishes.
              </p>
            </div>

            <div className="qcm-key-idea">
              <span>Key idea</span>
              <strong>
                The order of quantum gates matters because each gate acts on
                the state produced by the gates before it.
              </strong>
            </div>
          </div>

          <div className="qcm-lesson-grid">
            <article className="qcm-lesson-card">
              <span className="qcm-card-number">01</span>

              <div>
                <h3>Qubits travel along wires</h3>
                <p>
                  Each horizontal line in a circuit diagram represents a qubit.
                  The qubit begins on the left and moves through operations
                  toward the right.
                </p>

                <div className="qcm-mini-circuit">
                  <span>|0⟩</span>
                  <div className="qcm-mini-wire" />
                  <span>time →</span>
                </div>
              </div>
            </article>

            <article className="qcm-lesson-card">
              <span className="qcm-card-number">02</span>

              <div>
                <h3>Gates are applied in sequence</h3>
                <p>
                  Gates are read from left to right. The first gate changes the
                  starting state, and the next gate acts on that new state.
                </p>

                <div className="qcm-mini-circuit">
                  <span>|0⟩</span>
                  <div className="qcm-mini-wire qcm-wire-with-gates">
                    <strong>H</strong>
                    <strong>X</strong>
                  </div>
                  <span>output</span>
                </div>
              </div>
            </article>

            <article className="qcm-lesson-card">
              <span className="qcm-card-number">03</span>

              <div>
                <h3>Measurement produces a classical result</h3>
                <p>
                  A qubit may be in superposition while moving through the
                  circuit. Measurement converts its quantum state into a
                  classical result such as 0 or 1.
                </p>

                <div className="qcm-measurement-example">
                  <span>Quantum state</span>
                  <strong>→</strong>
                  <span className="qcm-measurement-box">M</span>
                  <strong>→</strong>
                  <span>0 or 1</span>
                </div>
              </div>
            </article>
          </div>

          <div className="qcm-reading-guide">
            <div className="qcm-reading-guide-header">
              <div>
                <p className="qcm-section-label">HOW TO READ A CIRCUIT</p>
                <h3>Follow the qubit from left to right</h3>
              </div>

              <span>Example circuit</span>
            </div>

            <div className="qcm-reading-circuit">
              <div className="qcm-reading-label">
                <small>Starting state</small>
                <strong>|0⟩</strong>
              </div>

              <div className="qcm-reading-wire">
                <div className="qcm-reading-gate">
                  <strong>H</strong>
                  <small>Create superposition</small>
                </div>

                <div className="qcm-reading-arrow">→</div>

                <div className="qcm-reading-gate">
                  <strong>X</strong>
                  <small>Flip basis states</small>
                </div>

                <div className="qcm-reading-arrow">→</div>

                <div className="qcm-reading-gate qcm-measure-gate">
                  <strong>M</strong>
                  <small>Measure</small>
                </div>
              </div>

              <div className="qcm-reading-label">
                <small>Classical result</small>
                <strong>0 or 1</strong>
              </div>
            </div>

            <div className="qcm-reading-steps">
              <div>
                <span>1</span>
                <p>Identify the starting state.</p>
              </div>

              <div>
                <span>2</span>
                <p>Read each gate from left to right.</p>
              </div>

              <div>
                <span>3</span>
                <p>Track how every gate changes the state.</p>
              </div>

              <div>
                <span>4</span>
                <p>Interpret the final measurement.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="qcm-builder-section" id="builder">
          <div className="qcm-section-heading">
            <p className="qcm-section-label">INTERACTIVE CIRCUIT BUILDER</p>
            <h2>Create a one-qubit circuit</h2>
            <p>
              Add X and Hadamard gates, then move through the circuit one step
              at a time to see how the qubit changes.
            </p>
          </div>

          <div className="qcm-builder-shell">
            <aside className="qcm-gate-toolbox">
              <div>
                <p className="qcm-section-label">GATE TOOLBOX</p>
                <h3>Add a gate</h3>
                <p>
                  Your circuit can contain up to six gates. Gates are applied
                  in the order you add them.
                </p>
              </div>

              <button
                className="qcm-toolbox-gate"
                type="button"
                onClick={() => addGate("X")}
                disabled={circuitGates.length >= 6}
              >
                <span>X</span>

                <div>
                  <strong>{availableGates.X.name}</strong>
                  <small>{availableGates.X.description}</small>
                </div>

                <span className="qcm-add-symbol">＋</span>
              </button>

              <button
                className="qcm-toolbox-gate"
                type="button"
                onClick={() => addGate("H")}
                disabled={circuitGates.length >= 6}
              >
                <span>H</span>

                <div>
                  <strong>{availableGates.H.name}</strong>
                  <small>{availableGates.H.description}</small>
                </div>

                <span className="qcm-add-symbol">＋</span>
              </button>

              <button
                className="qcm-clear-button"
                type="button"
                onClick={clearCircuit}
                disabled={circuitGates.length === 0}
              >
                Clear circuit
              </button>
            </aside>

            <div className="qcm-builder-workspace">
              <div className="qcm-circuit-canvas">
                <div className="qcm-canvas-header">
                  <div>
                    <span>q₀</span>
                    <strong>One-qubit circuit</strong>
                  </div>

                  <span>{circuitGates.length}/6 gates</span>
                </div>

                <div className="qcm-circuit-track">
                  <div className="qcm-circuit-start">
                    <small>Start</small>
                    <strong>|0⟩</strong>
                  </div>

                  <div className="qcm-builder-wire">
                    {circuitGates.length === 0 && (
                      <div className="qcm-empty-circuit-message">
                        Add an X or H gate to begin
                      </div>
                    )}

                    {circuitGates.map((gate, index) => (
                      <button
                        className={`qcm-builder-gate ${
                          activeStep === index + 1 ? "active" : ""
                        }`}
                        type="button"
                        key={`${gate}-${index}`}
                        onClick={() => setActiveStep(index + 1)}
                        aria-label={`View circuit after gate ${index + 1}: ${gate}`}
                      >
                        <strong>{gate}</strong>
                        <small>Step {index + 1}</small>

                        <span
                          className="qcm-remove-gate"
                          role="button"
                          tabIndex={0}
                          aria-label={`Remove ${gate} gate`}
                          onClick={(event) => {
                            event.stopPropagation();
                            removeGate(index);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              event.stopPropagation();
                              removeGate(index);
                            }
                          }}
                        >
                          ×
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="qcm-circuit-end">
                    <small>Measure</small>
                    <strong>M</strong>
                  </div>
                </div>
              </div>

              <div className="qcm-state-tracer">
                <div className="qcm-tracer-heading">
                  <div>
                    <p className="qcm-section-label">STATE TRACER</p>
                    <h3>
                      Step {activeStep} of {circuitSteps.length - 1}
                    </h3>
                  </div>

                  <div className="qcm-step-controls">
                    <button
                      type="button"
                      onClick={moveToPreviousStep}
                      disabled={activeStep === 0}
                    >
                      ← Previous
                    </button>

                    <button
                      type="button"
                      onClick={moveToNextStep}
                      disabled={activeStep === circuitSteps.length - 1}
                    >
                      Next →
                    </button>
                  </div>
                </div>

                <div className="qcm-state-display">
                  <div className="qcm-current-state">
                    <small>
                      {currentStep.gate === "Start"
                        ? "Initial state"
                        : `After ${currentStep.gate} gate`}
                    </small>

                    <strong>{currentStep.state.label}</strong>

                    <p>{currentStep.explanation}</p>
                  </div>

                  <div className="qcm-state-visual">
                    <div
                      className={`qcm-qubit-orb ${
                        currentStep.state.zeroProbability === 50
                          ? "superposition"
                          : currentStep.state.oneProbability === 100
                            ? "one-state"
                            : "zero-state"
                      }`}
                    >
                      <span>|0⟩</span>
                      <span>|1⟩</span>
                      <div />
                    </div>
                  </div>

                  <div className="qcm-probability-panel">
                    <p>Measurement probabilities</p>

                    <ProbabilityBar
                      label="|0⟩"
                      value={currentStep.state.zeroProbability}
                    />

                    <ProbabilityBar
                      label="|1⟩"
                      value={currentStep.state.oneProbability}
                    />

                    {currentStep.state.zeroProbability === 50 && (
                      <small>
                        The probabilities are equal, but the plus or minus sign
                        still affects future gates.
                      </small>
                    )}
                  </div>
                </div>

                <div className="qcm-step-timeline">
                  {circuitSteps.map((step, index) => (
                    <button
                      className={activeStep === index ? "active" : ""}
                      type="button"
                      key={`${step.gate}-${index}`}
                      onClick={() => setActiveStep(index)}
                    >
                      <span>{index}</span>
                      <strong>{step.gate}</strong>
                      <small>{step.state.label}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="qcm-comparison-section" id="comparison">
          <div className="qcm-section-heading">
            <p className="qcm-section-label">CLASSICAL VS QUANTUM</p>
            <h2>Two kinds of circuits</h2>
            <p>
              Both types of circuits arrange gates in a sequence, but they
              process information in different ways.
            </p>
          </div>

          <div className="qcm-comparison-grid">
            <article className="qcm-comparison-card qcm-classical-card">
              <div className="qcm-comparison-heading">
                <span>💻</span>

                <div>
                  <p>CLASSICAL CIRCUIT</p>
                  <h3>Definite bits and logic</h3>
                </div>
              </div>

              <div className="qcm-comparison-diagram">
                <div className="qcm-classical-inputs">
                  <span>0</span>
                  <span>1</span>
                </div>

                <div className="qcm-classical-gate">
                  <strong>AND</strong>
                </div>

                <span className="qcm-diagram-arrow">→</span>

                <div className="qcm-classical-output">0</div>
              </div>

              <ul>
                <li>Uses bits with definite values.</li>
                <li>Uses gates such as NOT, AND, and OR.</li>
                <li>Signals usually move in one direction.</li>
                <li>Outputs are deterministic for known inputs.</li>
              </ul>

              <div className="qcm-comparison-note">
                <strong>Example</strong>
                <p>
                  An AND gate outputs 1 only when both of its input bits are 1.
                </p>
              </div>
            </article>

            <article className="qcm-comparison-card qcm-quantum-card">
              <div className="qcm-comparison-heading">
                <span>⚛️</span>

                <div>
                  <p>QUANTUM CIRCUIT</p>
                  <h3>Qubits and amplitudes</h3>
                </div>
              </div>

              <div className="qcm-comparison-diagram">
                <span className="qcm-quantum-input">|0⟩</span>

                <div className="qcm-quantum-wire">
                  <span>H</span>
                  <span>X</span>
                </div>

                <span className="qcm-diagram-arrow">→</span>

                <div className="qcm-quantum-output">M</div>
              </div>

              <ul>
                <li>Uses qubits that can be in superposition.</li>
                <li>Uses gates such as X, H, and CNOT.</li>
                <li>Gate order changes the final quantum state.</li>
                <li>Measurement outcomes can be probabilistic.</li>
              </ul>

              <div className="qcm-comparison-note qcm-quantum-note">
                <strong>Example</strong>
                <p>
                  A Hadamard gate can create equal probabilities for measuring
                  0 and 1.
                </p>
              </div>
            </article>
          </div>

          <div className="qcm-difference-table">
            <div className="qcm-difference-header">
              <span>Feature</span>
              <span>Classical circuit</span>
              <span>Quantum circuit</span>
            </div>

            <div>
              <strong>Information unit</strong>
              <span>Bit</span>
              <span>Qubit</span>
            </div>

            <div>
              <strong>Possible state</strong>
              <span>0 or 1</span>
              <span>Superposition of |0⟩ and |1⟩</span>
            </div>

            <div>
              <strong>Gate examples</strong>
              <span>NOT, AND, OR</span>
              <span>X, H, CNOT</span>
            </div>

            <div>
              <strong>Final result</strong>
              <span>Usually definite</span>
              <span>Produced through measurement</span>
            </div>
          </div>
        </section>

        <section className="qcm-quiz-section" id="quiz">
          <div className="qcm-section-heading">
            <p className="qcm-section-label">KNOWLEDGE CHECK</p>
            <h2>Test your circuit knowledge</h2>
            <p>
              Select an answer to receive immediate feedback. Complete all four
              questions to calculate your score.
            </p>
          </div>

          <div className="qcm-quiz-layout">
            <div className="qcm-quiz-questions">
              {quizQuestions.map((question, questionIndex) => {
                const selectedAnswer = selectedAnswers[question.id];
                const hasAnswered = selectedAnswer !== undefined;
                const isCorrect = selectedAnswer === question.answer;

                return (
                  <article className="qcm-quiz-card" key={question.id}>
                    <div className="qcm-question-heading">
                      <span>{questionIndex + 1}</span>
                      <h3>{question.question}</h3>
                    </div>

                    <div className="qcm-quiz-options">
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
                            className={`qcm-quiz-option ${
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
                            <span className="qcm-option-letter">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>

                            <span className="qcm-option-text">{option}</span>

                            {isCorrectOption && (
                              <span className="qcm-result-icon">✓</span>
                            )}

                            {isWrongSelection && (
                              <span className="qcm-result-icon">✕</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div
                        className={`qcm-quiz-feedback ${
                          isCorrect
                            ? "qcm-feedback-correct"
                            : "qcm-feedback-wrong"
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

            <aside className="qcm-quiz-progress-card">
              <p className="qcm-section-label">QUIZ PROGRESS</p>

              <div className="qcm-score-circle">
                <strong>{answeredCount}</strong>
                <span>of {quizQuestions.length}</span>
              </div>

              <div className="qcm-progress-track">
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
                className="qcm-check-score-button"
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
              className={`qcm-quiz-summary ${
                correctCount >= 3
                  ? "qcm-summary-success"
                  : "qcm-summary-review"
              }`}
              id="quantum-circuits-quiz-summary"
              role="status"
            >
              <div className="qcm-summary-icon">
                {correctCount === quizQuestions.length ? "🎉" : correctCount >= quizQuestions.length - 1 ? "⭐" : "📘"}
              </div>

              <div>
                <p className="qcm-section-label">YOUR RESULT</p>

                <h3>
                  You scored {correctCount} out of {quizQuestions.length}
                </h3>

                <p>
                  {correctCount === quizQuestions.length &&
                    "Excellent work! You can read and explain a basic quantum circuit."}

                  {correctCount === quizQuestions.length - 1 &&
                    "Great job! You have a strong understanding of quantum circuits."}

                  {correctCount < quizQuestions - 1 &&
                    "Good effort. Review the circuit builder and try the quiz again."}
                </p>
              </div>

              <button type="button" onClick={resetQuiz}>
                Try again
              </button>
            </div>
          )}
        </section>

        <section className="qcm-complete-section">
          <div>
            <p className="qcm-section-label">MODULE COMPLETE</p>
            <h2>You can now build and read a basic quantum circuit.</h2>
            <p>
              You learned how qubits move through gates, why gate order matters,
              how measurement works, and how quantum circuits differ from
              classical logic circuits.
            </p>
          </div>

          <a className="qcm-next-module-button" href="/modules/5">
            Continue to Module 5
            <span aria-hidden="true">→</span>
          </a>
        </section>
      </main>

      <footer className="qcm-footer">
        <a className="qcm-brand" href="/">
          <span className="qcm-brand-icon">Q</span>
          <span>QuantumPath</span>
        </a>

        <p>Making quantum computing understandable for everyone.</p>

        <span>© 2026 QuantumPath</span>
      </footer>
    </div>
  );
}

export default QuantumCircuitsModule;