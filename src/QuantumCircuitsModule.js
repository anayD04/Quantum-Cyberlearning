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
    question:
      "What does a quantum circuit represent?",
    options: [
      "A visual plan showing how quantum operations are applied to qubits",
      "A list of passwords used by a quantum computer",
      "A chart showing only measurement results",
      "A classical program with no qubits",
    ],
    answer: 0,
    explanation:
      "A quantum circuit is a visual and mathematical representation of a quantum program, showing qubits, gates, and measurements in order.",
  },
  {
    id: 2,
    question:
      "What does a horizontal wire in a quantum circuit usually represent?",
    options: [
      "A classical output only",
      "A qubit being tracked through the computation",
      "A gate that has already finished",
      "A probability value",
    ],
    answer: 1,
    explanation:
      "Each horizontal wire represents a qubit whose state changes as gates are applied along the circuit.",
  },
  {
    id: 3,
    question:
      "How are operations usually read in a quantum circuit diagram?",
    options: [
      "From bottom to top",
      "From right to left",
      "From left to right",
      "In any order",
    ],
    answer: 2,
    explanation:
      "Quantum circuit diagrams are usually read from left to right, with each gate acting on the state produced by earlier gates.",
  },
  {
    id: 4,
    question:
      "Why can H followed by X produce a different quantum state from X followed by H?",
    options: [
      "Some quantum gates do not commute, so order can change the result",
      "The second gate is ignored",
      "X automatically measures the qubit",
      "H only works at the beginning of a circuit",
    ],
    answer: 0,
    explanation:
      "Quantum gates do not always commute. Changing their order can change the amplitudes or phase of the final state.",
  },
  {
    id: 5,
    question:
      "What does it mean when two quantum gates do not commute?",
    options: [
      "They cannot appear in the same circuit",
      "They always cancel each other",
      "Changing their order can change the final quantum state",
      "They can only act on classical bits",
    ],
    answer: 2,
    explanation:
      "Non-commuting gates can produce different results depending on the order in which they are applied.",
  },
  {
    id: 6,
    question:
      "What is the purpose of a two-qubit gate such as CNOT?",
    options: [
      "To delete one of the qubits",
      "To measure both qubits immediately",
      "To convert both qubits into classical bits",
      "To allow the state of one qubit to affect another qubit",
    ],
    answer: 3,
    explanation:
      "CNOT creates an interaction between two qubits by using one as the control and the other as the target.",
  },
  {
    id: 7,
    question:
      "What is the role of the control qubit in a CNOT gate?",
    options: [
      "It is always flipped",
      "It is always measured",
      "It determines whether the target qubit should be flipped",
      "It becomes a classical variable",
    ],
    answer: 2,
    explanation:
      "If the control qubit is |1⟩, the CNOT flips the target. If the control is |0⟩, the target is left unchanged.",
  },
  {
    id: 8,
    question:
      "Why is measurement usually placed near the end of a quantum circuit?",
    options: [
      "Measurement only works on the final gate",
      "Measurement makes gates run faster",
      "Measurement creates new qubits",
      "Measuring too early can destroy quantum state information needed by later gates",
    ],
    answer: 3,
    explanation:
      "Measurement changes the quantum state, so circuits usually delay measurement until the quantum operations are finished.",
  },
  {
    id: 9,
    question:
      "What does measurement produce from a quantum state?",
    options: [
      "A new quantum gate",
      "A classical result such as 0 or 1",
      "Every possible answer at the same time",
      "A second copy of the qubit",
    ],
    answer: 1,
    explanation:
      "Measurement converts quantum information into a classical result that can be recorded and analyzed.",
  },
  {
    id: 10,
    question:
      "Which statement best compares classical and quantum circuits?",
    options: [
      "Quantum circuits never use gates",
      "Classical circuits always give random outputs",
      "Quantum circuits only work with one qubit",
      "Classical circuits usually process definite bits, while quantum circuits can manipulate superposition and entanglement",
    ],
    answer: 3,
    explanation:
      "Classical circuits work with definite bit values, while quantum circuits can manipulate richer quantum states involving superposition, phase, and entanglement.",
  },
  {
    id: 11,
    question:
      "What does the famous Bell state circuit usually use to create entanglement from |00⟩?",
    options: [
      "Two measurement gates",
      "Two X gates",
      "A Hadamard gate followed by CNOT",
      "A classical AND gate",
    ],
    answer: 2,
    explanation:
      "Applying H to the first qubit creates superposition, and a following CNOT can entangle the two qubits into a Bell state.",
  },
  {
    id: 12,
    question:
      "Why are quantum circuits often called the language of quantum computing?",
    options: [
      "They replace all programming languages",
      "They express quantum algorithms as sequences of operations that quantum hardware can execute",
      "They only display final answers",
      "They remove the need for quantum algorithms",
    ],
    answer: 1,
    explanation:
      "Quantum circuits translate an algorithm's strategy into gates, interactions, and measurements that can be implemented on quantum hardware.",
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
  const { completeModule, updateBestScore } = useProgress();
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
  setSelectedAnswers((currentAnswers) => {
    if (currentAnswers[questionId] !== undefined) {
      return currentAnswers;
    }

    return {
      ...currentAnswers,
      [questionId]: optionIndex,
    };
  });

  setShowSummary(false);
};

  const checkScore = () => {
  setShowSummary(true);
  const earnedPoints = correctCount * 2;
  const bonusPoints = correctCount === quizQuestions.length ? 6 : 0;
  updateBestScore(4, earnedPoints + bonusPoints);
  completeModule(4);

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
      A quantum circuit is a visual and mathematical description of a quantum
      program. It shows which qubits are used, which gates act on them, and in
      what order those operations happen.
    </p>
  </div>

  <div className="qcm-lesson-introduction">
    <div className="qcm-introduction-icon">🧭</div>

    <div>
      <h3>A route for quantum information</h3>

      <p>
        Think of a quantum circuit like an assembly line. A qubit begins in a
        starting state, passes through a sequence of gates, and is eventually
        measured to produce a classical result.
      </p>

      <p>
        The important difference is that the "thing" moving through the circuit
        is a quantum state. Gates can therefore change superposition, phase,
        interference, and relationships between multiple qubits.
      </p>
    </div>

    <div className="qcm-key-idea">
      <span>Key idea</span>
      <strong>
        A quantum circuit is not just a collection of gates. The order and
        interaction of those gates are part of the computation.
      </strong>
    </div>
  </div>

  <div className="qcm-lesson-grid">
    <article className="qcm-lesson-card">
      <span className="qcm-card-number">01</span>

      <div>
        <h3>Wires represent qubits</h3>

        <p>
          Each horizontal line in a quantum circuit represents a qubit being
          tracked through the computation.
        </p>

        <p>
          The line does not mean the qubit is literally traveling through a
          physical wire. It is a visual way to show which operations affect
          that qubit.
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
        <h3>Read gates from left to right</h3>

        <p>
          In the usual circuit convention, time moves from left to right.
          Gates are applied in the order they appear.
        </p>

        <p>
          The first gate transforms the starting state. The next gate then acts
          on the state produced by the first one.
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
        <h3>Measurement produces classical output</h3>

        <p>
          A qubit can remain in a quantum state while gates are being applied.
          When we measure it, we receive a classical result such as 0 or 1.
        </p>

        <p>
          Measurement changes the quantum state, so programmers must decide
          carefully when measurement should occur.
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

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">04</span>

      <div>
        <h3>Inputs tell us where the computation begins</h3>

        <p>
          On the left side of a circuit, we usually see the starting state of
          each qubit.
        </p>

        <p>
          For example, a single qubit may start in <strong>|0⟩</strong>. A
          two-qubit system may begin in <strong>|00⟩</strong>.
        </p>

        <div className="qcm-mini-circuit">
          <span>|0⟩</span>
          <div className="qcm-mini-wire" />
          <span>start</span>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">05</span>

      <div>
        <h3>Outputs may be probabilities, not one fixed answer</h3>

        <p>
          A quantum circuit can produce different measurement outcomes on
          different runs.
        </p>

        <p>
          For example, after a Hadamard gate, repeated measurements may produce
          roughly half 0s and half 1s.
        </p>

        <div className="qcm-measurement-example">
          <span>H|0⟩</span>
          <strong>→</strong>
          <span>50% 0</span>
          <strong>/</strong>
          <span>50% 1</span>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">06</span>

      <div>
        <h3>Quantum circuits are programs we can visualize</h3>

        <p>
          A circuit diagram gives us a compact way to see the structure of a
          quantum program.
        </p>

        <p>
          We can identify the qubits, the sequence of operations, interactions
          between qubits, and where measurement happens.
        </p>

        <div className="qcm-key-idea">
          <span>Think of it as</span>
          <strong>
            Input → gates → interactions → measurement → classical result
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">07</span>

      <div>
        <h3>Gate order can change the state</h3>

        <p>
          Quantum gates do not always behave the same way when their order is
          reversed.
        </p>

        <p>
          Starting from |0⟩, applying H then X produces a different quantum
          state from applying X then H.
        </p>

        <div className="qcm-mini-circuit">
          <span>|0⟩</span>

          <div className="qcm-mini-wire qcm-wire-with-gates">
            <strong>H</strong>
            <strong>X</strong>
          </div>

          <span>state A</span>
        </div>

        <div className="qcm-mini-circuit">
          <span>|0⟩</span>

          <div className="qcm-mini-wire qcm-wire-with-gates">
            <strong>X</strong>
            <strong>H</strong>
          </div>

          <span>state B</span>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">08</span>

      <div>
        <h3>H then X vs X then H</h3>

        <p>
          If H is applied first:
        </p>

        <p>
          <strong>H|0⟩ = (|0⟩ + |1⟩) / √2</strong>
        </p>

        <p>
          Applying X afterward keeps this particular balanced superposition in
          the same form.
        </p>

        <p>
          But if X is applied first:
        </p>

        <p>
          <strong>X|0⟩ = |1⟩</strong>
        </p>

        <p>
          and then:
        </p>

        <p>
          <strong>H|1⟩ = (|0⟩ - |1⟩) / √2</strong>
        </p>

        <div className="qcm-key-idea">
          <span>Important</span>
          <strong>
            The probabilities may look the same immediately, but the phase is
            different and later gates can reveal that difference.
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">09</span>

      <div>
        <h3>Non-commutativity</h3>

        <p>
          When changing the order of two operations changes the result, we say
          the operations <strong>do not commute</strong>.
        </p>

        <p>
          This is common in quantum computing, which means circuit order must
          be designed carefully.
        </p>

        <div className="qcm-key-idea">
          <span>Simple analogy</span>
          <strong>
            Socks then shoes is not the same as shoes then socks.
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">10</span>

      <div>
        <h3>Multi-qubit circuits</h3>

        <p>
          Quantum circuits can contain many qubits, with each qubit represented
          by its own horizontal line.
        </p>

        <div className="qcm-mini-circuit">
          <span>q0 |0⟩</span>
          <div className="qcm-mini-wire" />
          <span />
        </div>

        <div className="qcm-mini-circuit">
          <span>q1 |0⟩</span>
          <div className="qcm-mini-wire" />
          <span />
        </div>

        <p>
          Some gates act on just one qubit, while other gates connect the
          behavior of multiple qubits.
        </p>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">11</span>

      <div>
        <h3>CNOT connects two qubits</h3>

        <p>
          The CNOT gate uses one qubit as a <strong>control</strong> and another
          as a <strong>target</strong>.
        </p>

        <p>
          If the control is |0⟩, the target stays unchanged. If the control is
          |1⟩, the target flips.
        </p>

        <div className="qcm-key-idea">
          <span>CNOT rule</span>
          <strong>
            Control = 1 → flip target. Control = 0 → leave target alone.
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">12</span>

      <div>
        <h3>Two-qubit gates enable new behavior</h3>

        <p>
          CNOT becomes especially important when the control qubit is in
          superposition.
        </p>

        <p>
          In that case, the two qubits can become connected through a shared
          quantum state called <strong>entanglement</strong>.
        </p>

        <div className="qcm-key-idea">
          <span>Preview</span>
          <strong>
            Entanglement is one of the most important multi-qubit effects in
            quantum computing.
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">13</span>

      <div>
        <h3>Why we usually measure near the end</h3>

        <p>
          Gates may create superposition, interference, or entanglement that
          later parts of the circuit still need.
        </p>

        <p>
          Measuring too early can destroy that quantum state before the
          computation is finished.
        </p>

        <div className="qcm-key-idea">
          <span>Programming idea</span>
          <strong>
            Prepare first, transform next, measure when you are ready to read
            the result.
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">14</span>

      <div>
        <h3>Repeated runs reveal probabilities</h3>

        <p>
          Quantum circuits are often executed many times. These repeated runs
          are commonly called <strong>shots</strong>.
        </p>

        <p>
          Instead of looking at only one measurement, programmers inspect how
          often each result appears.
        </p>

        <div className="qcm-measurement-example">
          <span>1000 shots</span>
          <strong>→</strong>
          <span>503 zeros</span>
          <strong>+</strong>
          <span>497 ones</span>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">15</span>

      <div>
        <h3>Quantum circuits can create interference</h3>

        <p>
          Consider this simple sequence:
        </p>

        <div className="qcm-mini-circuit">
          <span>|0⟩</span>

          <div className="qcm-mini-wire qcm-wire-with-gates">
            <strong>H</strong>
            <strong>H</strong>
          </div>

          <span>|0⟩</span>
        </div>

        <p>
          The first H creates superposition. The second H causes the amplitudes
          to interfere and returns the state to |0⟩.
        </p>

        <p>
          This shows that superposition is not simply random guessing. Later
          gates can combine quantum amplitudes in useful ways.
        </p>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">16</span>

      <div>
        <h3>Classical circuits use definite bits</h3>

        <p>
          Classical logic circuits work with bits that have definite values:
          0 or 1.
        </p>

        <p>
          Gates such as NOT, AND, OR, and XOR transform those definite values
          according to fixed rules.
        </p>

        <div className="qcm-key-idea">
          <span>Example</span>
          <strong>NOT 0 → 1</strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">17</span>

      <div>
        <h3>Quantum circuits manipulate richer state</h3>

        <p>
          Quantum circuits work with qubits that can involve superposition,
          phase, interference, and entanglement.
        </p>

        <p>
          Their standard gates are also reversible before measurement.
        </p>

        <div className="qcm-key-idea">
          <span>Key difference</span>
          <strong>
            Classical circuits process definite bit values. Quantum circuits
            transform quantum states.
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">18</span>

      <div>
        <h3>Classical and quantum behavior differ</h3>

        <p>
          A normal deterministic classical circuit gives the same output for
          the same input.
        </p>

        <p>
          A quantum circuit can instead produce a probability distribution when
          measured.
        </p>

        <div className="qcm-measurement-example">
          <span>Classical</span>
          <strong>→</strong>
          <span>definite output</span>
        </div>

        <div className="qcm-measurement-example">
          <span>Quantum</span>
          <strong>→</strong>
          <span>possible outcomes + probabilities</span>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">19</span>

      <div>
        <h3>The Bell state circuit</h3>

        <p>
          One of the most famous small quantum circuits starts with two qubits
          in |00⟩.
        </p>

        <p>
          First, apply H to the first qubit. Then use that qubit as the control
          of a CNOT.
        </p>

        <div className="qcm-key-idea">
          <span>Bell circuit</span>
          <strong>|00⟩ → H on q0 → CNOT → entangled pair</strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">20</span>

      <div>
        <h3>What the Bell circuit produces</h3>

        <p>
          The ideal final state is:
        </p>

        <p>
          <strong>(|00⟩ + |11⟩) / √2</strong>
        </p>

        <p>
          This is a <strong>Bell state</strong>, one of the simplest and most
          important examples of entanglement.
        </p>

        <div className="qcm-measurement-example">
          <span>Measure both</span>
          <strong>→</strong>
          <span>00 or 11</span>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">21</span>

      <div>
        <h3>Why the Bell circuit matters</h3>

        <p>
          This tiny circuit demonstrates several major quantum ideas at once:
          superposition, controlled interaction, entanglement, and measurement.
        </p>

        <p>
          Bell states are important in areas such as quantum communication and
          quantum teleportation.
        </p>

        <div className="qcm-key-idea">
          <span>Pattern</span>
          <strong>
            Superposition → CNOT → entanglement → correlated measurement
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">22</span>

      <div>
        <h3>Tracing quantum circuits requires new thinking</h3>

        <p>
          In classical programming, we can often track one exact variable value
          after each instruction.
        </p>

        <p>
          In a quantum circuit, we may instead need to track amplitudes, phase,
          probabilities, and relationships between qubits.
        </p>

        <div className="qcm-key-idea">
          <span>Tracing question</span>
          <strong>
            Not just "What is the qubit?" but "What quantum state has the
            circuit created?"
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">23</span>

      <div>
        <h3>Circuits are the language of quantum algorithms</h3>

        <p>
          A quantum algorithm describes a strategy for solving a problem.
        </p>

        <p>
          The quantum circuit translates that strategy into gates that a
          quantum computer can execute.
        </p>

        <div className="qcm-key-idea">
          <span>From idea to machine</span>
          <strong>
            Algorithm → circuit → gates → hardware → measurement results
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">24</span>

      <div>
        <h3>Famous algorithms become circuits</h3>

        <p>
          Algorithms such as Grover's search algorithm and Shor's factoring
          algorithm can ultimately be expressed as carefully designed quantum
          circuits.
        </p>

        <p>
          Larger circuits may contain Hadamard gates, X gates, CNOT gates,
          phase gates, controlled operations, and measurements.
        </p>

        <div className="qcm-key-idea">
          <span>Big idea</span>
          <strong>
            A quantum algorithm becomes executable when its strategy is
            translated into a sequence of circuit operations.
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">25</span>

      <div>
        <h3>Real hardware adds noise</h3>

        <p>
          Circuit diagrams describe ideal mathematical operations. Real
          quantum computers must implement those operations physically.
        </p>

        <p>
          Physical qubits and gates are affected by noise, which means real
          measurements may not perfectly match the ideal prediction.
        </p>

        <div className="qcm-measurement-example">
          <span>Ideal Bell circuit</span>
          <strong>→</strong>
          <span>00 and 11 only</span>
        </div>

        <div className="qcm-measurement-example">
          <span>Noisy hardware</span>
          <strong>→</strong>
          <span>small unwanted outcomes may appear</span>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">26</span>

      <div>
        <h3>Efficient circuit design matters</h3>

        <p>
          More gates mean more opportunities for errors on current quantum
          hardware.
        </p>

        <p>
          Quantum programmers therefore care about using efficient gate
          sequences whenever possible.
        </p>

        <div className="qcm-key-idea">
          <span>Route analogy</span>
          <strong>
            If two routes reach the same destination, the shorter and simpler
            route may be easier to execute reliably.
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">27</span>

      <div>
        <h3>The complete circuit picture</h3>

        <p>
          Quantum circuits bring together everything you have learned so far.
        </p>

        <p>
          Qubits carry the quantum state. Gates transform it. Multi-qubit gates
          allow qubits to interact. Interference changes amplitudes.
          Measurement produces classical information.
        </p>

        <div className="qcm-key-idea">
          <span>Core flow</span>
          <strong>
            Prepare → transform → interact → interfere → measure → interpret
          </strong>
        </div>
      </div>
    </article>

    <article className="qcm-lesson-card">
      <span className="qcm-card-number">28</span>

      <div>
        <h3>Key takeaway</h3>

        <p>
          A quantum circuit is both a visual diagram and a mathematical
          description of a quantum program.
        </p>

        <p>
          Wires identify qubits, gates transform quantum states in a specific
          order, multi-qubit gates allow interaction, and measurement converts
          the final quantum state into classical information.
        </p>

        <div className="qcm-key-idea">
          <span>Remember</span>
          <strong>
            Learning to read and trace quantum circuits is one of the most
            important skills for understanding quantum algorithms.
          </strong>
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
          <small>Transform the state</small>
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
        <p>Identify each qubit's starting state.</p>
      </div>

      <div>
        <span>2</span>
        <p>Read the gates from left to right.</p>
      </div>

      <div>
        <span>3</span>
        <p>Track how the quantum state changes after each gate.</p>
      </div>

      <div>
        <span>4</span>
        <p>Look for interactions between multiple qubits.</p>
      </div>

      <div>
        <span>5</span>
        <p>Interpret the final measurement probabilities and results.</p>
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
                            disabled={hasAnswered}
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
        <section className="qcm-further-reading" id="further-reading">
  <div className="qcm-section-heading">
    <p className="qcm-section-label">KEEP EXPLORING</p>
    <h2>Further Readings</h2>
    <p>
      Continue exploring how quantum circuits represent computations,
      how circuit diagrams are read, and how circuits are executed on
      quantum computers.
    </p>
  </div>

  <div className="qcm-reading-grid">
    <a
      className="qcm-reading-card"
      href="https://learn.microsoft.com/en-us/azure/quantum/concepts-circuits"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="qcm-reading-card-top">
        <span className="qcm-reading-source">Microsoft Learn</span>
        <span className="qcm-reading-level">Beginner</span>
      </div>

      <h3>Quantum Circuit Diagram Conventions</h3>

      <p>
        Learn how to read quantum circuit diagrams, including qubit
        wires, gate order, controlled operations, measurement, inputs,
        and outputs.
      </p>

      <span className="qcm-reading-link">Open resource ↗</span>
    </a>

    <a
      className="qcm-reading-card"
      href="https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits/introduction"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="qcm-reading-card-top">
        <span className="qcm-reading-source">IBM Quantum</span>
        <span className="qcm-reading-level">Beginner+</span>
      </div>

      <h3>Introduction to Quantum Circuits</h3>

      <p>
        Explore the quantum circuit model and learn how circuit
        diagrams represent operations performed on quantum states.
      </p>

      <span className="qcm-reading-link">Open resource ↗</span>
    </a>

    <a
      className="qcm-reading-card"
      href="https://quantum.cloud.ibm.com/learning/en/courses/quantum-computing-in-practice/running-quantum-circuits"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="qcm-reading-card-top">
        <span className="qcm-reading-source">IBM Quantum</span>
        <span className="qcm-reading-level">Go Deeper</span>
      </div>

      <h3>Running Quantum Circuits</h3>

      <p>
        See how quantum circuits move from diagrams to executable
        programs using qubits, gates, multi-qubit operations, and
        measurements.
      </p>

      <span className="qcm-reading-link">Open resource ↗</span>
    </a>
  </div>

  <p className="qcm-reading-disclaimer">
    These optional resources are provided by external organizations.
    QuantumPath is not affiliated with or endorsed by these providers.
  </p>
</section>
        {showSummary && (
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
        )}
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