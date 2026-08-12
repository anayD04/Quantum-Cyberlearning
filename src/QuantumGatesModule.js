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
    question:
      "What is one important difference between standard quantum gates and many classical logic operations?",
    options: [
      "Quantum gates can only work with the value 1",
      "Standard quantum gates are reversible before measurement",
      "Classical gates always use qubits",
      "Quantum gates cannot be combined",
    ],
    answer: 1,
    explanation:
      "Standard quantum gates are reversible before measurement, meaning their transformations can be undone using an inverse operation.",
  },
  {
    id: 2,
    question: "What does the X gate do to the basic qubit states?",
    options: [
      "It measures both states",
      "It creates a second qubit",
      "It flips |0⟩ to |1⟩ and |1⟩ to |0⟩",
      "It always creates superposition",
    ],
    answer: 2,
    explanation:
      "The X gate is the quantum bit-flip gate. It changes |0⟩ to |1⟩ and |1⟩ to |0⟩.",
  },
  {
    id: 3,
    question:
      "What does the matrix representation of a quantum gate describe?",
    options: [
      "How the gate transforms a quantum state",
      "The physical size of the quantum computer",
      "How many times a qubit has been measured",
      "The programming language used to build the circuit",
    ],
    answer: 0,
    explanation:
      "A gate's matrix is a mathematical description of how that gate transforms a quantum state. For example, the X matrix swaps the |0⟩ and |1⟩ components.",
  },
  {
    id: 4,
    question:
      "What state is produced when a Hadamard gate is applied to |0⟩?",
    options: [
      "|1⟩ only",
      "|0⟩ only",
      "(|0⟩ - |1⟩) / √2",
      "(|0⟩ + |1⟩) / √2",
    ],
    answer: 3,
    explanation:
      "Applying H to |0⟩ creates the balanced superposition (|0⟩ + |1⟩) / √2, giving equal probabilities of measuring 0 or 1.",
  },
  {
    id: 5,
    question:
      "How does H|1⟩ differ from H|0⟩?",
    options: [
      "H|1⟩ contains a minus sign between the |0⟩ and |1⟩ components",
      "H|1⟩ always produces |0⟩",
      "H|1⟩ cannot be measured",
      "There is no difference between the two quantum states",
    ],
    answer: 0,
    explanation:
      "H|0⟩ = (|0⟩ + |1⟩)/√2, while H|1⟩ = (|0⟩ - |1⟩)/√2. The minus sign represents a phase difference that can affect later interference.",
  },
  {
    id: 6,
    question:
      "What happens to the target qubit of a CNOT gate when its control qubit is |1⟩?",
    options: [
      "The target is measured",
      "The target is deleted",
      "The target always becomes |1⟩",
      "The target is flipped",
    ],
    answer: 3,
    explanation:
      "When the CNOT control is |1⟩, the target is flipped. A target of |0⟩ becomes |1⟩, while |1⟩ becomes |0⟩.",
  },
  {
    id: 7,
    question:
      "Which gate sequence can create an entangled Bell state starting from |00⟩?",
    options: [
      "Measure both qubits immediately",
      "Apply X to both qubits",
      "Apply H to the first qubit, then use it as the control of CNOT",
      "Apply two classical NOT gates",
    ],
    answer: 2,
    explanation:
      "Applying H to the first qubit creates superposition. A following CNOT can then produce the entangled Bell state (|00⟩ + |11⟩) / √2.",
  },
  {
    id: 8,
    question: "Why can the order of gates matter in a quantum circuit?",
    options: [
      "Different gate orders can produce different quantum states",
      "Quantum gates stop working after the first gate",
      "Every gate automatically measures the qubit",
      "Gate order only changes how the circuit looks",
    ],
    answer: 0,
    explanation:
      "Each gate acts on the state produced by earlier gates. Changing the order can therefore change amplitudes or phase and produce a different final quantum state.",
  },
  {
    id: 9,
    question:
      "Why is a classical AND gate not reversible?",
    options: [
      "AND gates always output 1",
      "Different input combinations can produce the same output, so information is lost",
      "AND gates require three qubits",
      "The AND gate creates superposition",
    ],
    answer: 1,
    explanation:
      "For example, 00, 01, and 10 all produce an AND output of 0. From that output alone, we cannot recover the original inputs.",
  },
  {
    id: 10,
    question:
      "How does the Toffoli gate provide AND-like behavior while remaining reversible?",
    options: [
      "It measures its inputs before producing an answer",
      "It preserves the control qubits and conditionally flips a target qubit",
      "It converts all three qubits into classical bits",
      "It permanently deletes the original inputs",
    ],
    answer: 1,
    explanation:
      "The Toffoli gate has two controls and a target. It flips the target when both controls are 1 while preserving the control information, making the operation reversible.",
  },
  {
    id: 11,
    question:
      "Why is quantum interference important when building quantum algorithms?",
    options: [
      "It makes every measurement result equal to 1",
      "It prevents quantum gates from interacting",
      "It turns quantum circuits into classical circuits",
      "It can reinforce useful amplitudes and cancel unwanted ones",
    ],
    answer: 3,
    explanation:
      "Quantum algorithms can arrange gates so amplitudes interfere, increasing the probability of useful outcomes while reducing other possibilities.",
  },
  {
    id: 12,
    question:
      "Why are quantum gates considered the building blocks of quantum algorithms?",
    options: [
      "Every quantum algorithm uses only the X gate",
      "Quantum gates remove the need for qubits",
      "A single gate automatically solves any quantum problem",
      "Quantum algorithms are constructed from carefully arranged sequences of gate operations",
    ],
    answer: 3,
    explanation:
      "Quantum algorithms are implemented as circuits containing carefully ordered quantum gates that manipulate qubits, superposition, phase, interference, and entanglement.",
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
  const { completeModule, updateBestScore } = useProgress();
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
  updateBestScore(3, earnedPoints + bonusPoints);
  completeModule(3);

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
      Quantum gates are operations that transform the state of one or more
      qubits. They are the basic building blocks of quantum circuits and
      quantum algorithms.
    </p>
  </div>

  <div className="qgm-introduction-card">
    <div className="qgm-introduction-icon">⚙️</div>

    <div>
      <h3>Instructions for quantum states</h3>

      <p>
        In classical computing, logic gates such as NOT, AND, and OR transform
        ordinary bits. Quantum gates also transform information, but they act
        on qubits and quantum states.
      </p>

      <p>
        Because qubits can be in superposition or become entangled, quantum
        gates must be able to transform more than just definite 0 and 1 values.
        They can change amplitudes, phase relationships, and correlations
        between qubits.
      </p>

      <p>
        Standard quantum gates are also <strong>reversible</strong> before
        measurement. This means their transformations can be undone by an
        inverse gate.
      </p>
    </div>

    <div className="qgm-lesson-highlight">
      <span>Key idea</span>
      <strong>
        Quantum gates do not simply change bits. They transform entire quantum
        states in a reversible way.
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
        The X gate is one of the simplest quantum gates. It flips the two basic
        qubit states:
      </p>

      <div className="qgm-mini-equation">
        <span>|0⟩</span>
        <strong>X</strong>
        <span>|1⟩</span>
      </div>

      <div className="qgm-mini-equation">
        <span>|1⟩</span>
        <strong>X</strong>
        <span>|0⟩</span>
      </div>

      <p>
        This makes the X gate similar to the classical NOT gate when the input
        is definitely |0⟩ or |1⟩.
      </p>

      <div className="qgm-analogy-box">
        <span>💡</span>

        <div>
          <strong>Light switch analogy</strong>
          <p>
            Think of |0⟩ as OFF and |1⟩ as ON. The X gate flips the switch in
            either direction.
          </p>
        </div>
      </div>

      <p>
        Quantum gates can be represented using matrices. The X gate is written
        as:
      </p>

      <div className="qgm-mini-equation">
        <span>X =</span>
        <strong>[0 1; 1 0]</strong>
      </div>

      <p>
        You do not need to multiply matrices yet. For now, think of this matrix
        as a rule that swaps the |0⟩ and |1⟩ parts of a quantum state.
      </p>
    </article>

    <article className="qgm-gate-lesson-card qgm-h-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">H</span>
        <span className="qgm-gate-number">02</span>
      </div>

      <h3>Hadamard Gate</h3>
      <p className="qgm-gate-subtitle">The superposition gate</p>

      <p>
        The Hadamard gate is one of the most important gates in quantum
        computing because it can create superposition.
      </p>

      <p>
        If a qubit starts in |0⟩:
      </p>

      <div className="qgm-mini-equation">
        <span>|0⟩</span>
        <strong>H</strong>
        <span>(|0⟩ + |1⟩) / √2</span>
      </div>

      <p>
        This state gives equal probabilities of measuring 0 or 1.
      </p>

      <p>
        If the qubit starts in |1⟩:
      </p>

      <div className="qgm-mini-equation">
        <span>|1⟩</span>
        <strong>H</strong>
        <span>(|0⟩ - |1⟩) / √2</span>
      </div>

      <p>
        Both states have 50/50 measurement probabilities, but the plus and
        minus signs represent a difference in <strong>quantum phase</strong>.
        That difference can affect later interference.
      </p>

      <div className="qgm-analogy-box qgm-purple-analogy">
        <span>🌊</span>

        <div>
          <strong>Wave analogy</strong>
          <p>
            Quantum amplitudes can reinforce or cancel like waves. The
            Hadamard gate helps create states that later gates can interfere in
            useful ways.
          </p>
        </div>
      </div>

      <p>
        Applying H twice returns the qubit to its original state, which is
        another example of reversibility.
      </p>
    </article>

    <article className="qgm-gate-lesson-card qgm-cnot-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">CX</span>
        <span className="qgm-gate-number">03</span>
      </div>

      <h3>CNOT Gate</h3>
      <p className="qgm-gate-subtitle">The controlled bit flip</p>

      <p>
        The CNOT gate acts on <strong>two qubits</strong>. One is the{" "}
        <strong>control</strong> qubit and the other is the{" "}
        <strong>target</strong> qubit.
      </p>

      <p>
        The rule is simple:
      </p>

      <div className="qgm-analogy-box qgm-blue-analogy">
        <span>🎛️</span>

        <div>
          <strong>Control and target</strong>
          <p>
            If the control qubit is |0⟩, leave the target unchanged. If the
            control qubit is |1⟩, flip the target.
          </p>
        </div>
      </div>

      <div className="qgm-mini-equation">
        <span>|00⟩</span>
        <strong>CX</strong>
        <span>|00⟩</span>
      </div>

      <div className="qgm-mini-equation">
        <span>|01⟩</span>
        <strong>CX</strong>
        <span>|01⟩</span>
      </div>

      <div className="qgm-mini-equation">
        <span>|10⟩</span>
        <strong>CX</strong>
        <span>|11⟩</span>
      </div>

      <div className="qgm-mini-equation">
        <span>|11⟩</span>
        <strong>CX</strong>
        <span>|10⟩</span>
      </div>

      <p>
        CNOT becomes especially important when the control qubit is in
        superposition. In that case, it can help create entanglement.
      </p>
    </article>

    <article className="qgm-gate-lesson-card qgm-wide-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">H+CX</span>
        <span className="qgm-gate-number">04</span>
      </div>

      <h3>Creating entanglement with H and CNOT</h3>
      <p className="qgm-gate-subtitle">A powerful two-gate pattern</p>

      <p>
        One of the most important introductory quantum circuit patterns uses a
        Hadamard gate followed by a CNOT gate.
      </p>

      <p>
        Start with two qubits in:
      </p>

      <div className="qgm-mini-equation">
        <span>|00⟩</span>
        <strong>Start</strong>
        <span>Two separate qubits</span>
      </div>

      <p>
        Apply H to the first qubit:
      </p>

      <div className="qgm-mini-equation">
        <span>|00⟩</span>
        <strong>H</strong>
        <span>(|00⟩ + |10⟩) / √2</span>
      </div>

      <p>
        Then use the first qubit as the control of a CNOT:
      </p>

      <div className="qgm-mini-equation">
        <span>(|00⟩ + |10⟩) / √2</span>
        <strong>CX</strong>
        <span>(|00⟩ + |11⟩) / √2</span>
      </div>

      <div className="qgm-analogy-box qgm-purple-analogy">
        <span>🔗</span>

        <div>
          <strong>Bell state</strong>
          <p>
            The result is an entangled state called a Bell state. Measuring
            both qubits gives correlated outcomes such as 00 or 11.
          </p>
        </div>
      </div>
    </article>

    <article className="qgm-gate-lesson-card qgm-wide-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">→</span>
        <span className="qgm-gate-number">05</span>
      </div>

      <h3>Quantum gates combine into circuits</h3>
      <p className="qgm-gate-subtitle">Sequences of transformations</p>

      <p>
        A useful quantum program normally contains many gates arranged in a
        sequence. Together, those gates form a <strong>quantum circuit</strong>.
      </p>

      <div className="qgm-mini-equation">
        <span>|0⟩</span>
        <strong>H → X → H</strong>
        <span>Measure</span>
      </div>

      <p>
        Each gate acts on the state produced by the gates before it. This means
        the circuit is a chain of transformations rather than a collection of
        unrelated instructions.
      </p>

      <div className="qgm-analogy-box">
        <span>🧩</span>

        <div>
          <strong>Building a sequence</strong>
          <p>
            A single gate is like one instruction. A circuit combines many
            instructions into a complete quantum computation.
          </p>
        </div>
      </div>
    </article>

    <article className="qgm-gate-lesson-card qgm-wide-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">↔</span>
        <span className="qgm-gate-number">06</span>
      </div>

      <h3>Why gate order matters</h3>
      <p className="qgm-gate-subtitle">H then X is not always the same as X then H</p>

      <p>
        In quantum circuits, changing the order of gates can change the final
        quantum state.
      </p>

      <p>
        Starting with |0⟩, consider H followed by X:
      </p>

      <div className="qgm-mini-equation">
        <span>|0⟩</span>
        <strong>H → X</strong>
        <span>(|0⟩ + |1⟩) / √2</span>
      </div>

      <p>
        Now reverse the order:
      </p>

      <div className="qgm-mini-equation">
        <span>|0⟩</span>
        <strong>X → H</strong>
        <span>(|0⟩ - |1⟩) / √2</span>
      </div>

      <p>
        The measurement probabilities may look the same at this point, but the
        phase is different. Later gates can reveal that difference.
      </p>

      <div className="qgm-lesson-highlight">
        <span>Important</span>
        <strong>
          Quantum gates do not always commute. The order in which you apply
          them can matter.
        </strong>
      </div>
    </article>

    <article className="qgm-gate-lesson-card qgm-x-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">NOT</span>
        <span className="qgm-gate-number">07</span>
      </div>

      <h3>Classical NOT vs quantum X</h3>
      <p className="qgm-gate-subtitle">Similar behavior, different model</p>

      <p>
        A classical NOT gate flips:
      </p>

      <div className="qgm-mini-equation">
        <span>0</span>
        <strong>NOT</strong>
        <span>1</span>
      </div>

      <div className="qgm-mini-equation">
        <span>1</span>
        <strong>NOT</strong>
        <span>0</span>
      </div>

      <p>
        The X gate behaves the same way for the basic quantum states:
      </p>

      <div className="qgm-mini-equation">
        <span>|0⟩</span>
        <strong>X</strong>
        <span>|1⟩</span>
      </div>

      <p>
        But X can also act on superpositions. It swaps the |0⟩ and |1⟩
        components of the entire quantum state.
      </p>

      <div className="qgm-analogy-box">
        <span>⚖️</span>

        <div>
          <strong>The key difference</strong>
          <p>
            Classical NOT only handles definite bits. Quantum X must also
            preserve amplitudes and phase relationships.
          </p>
        </div>
      </div>
    </article>

    <article className="qgm-gate-lesson-card qgm-cnot-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">AND</span>
        <span className="qgm-gate-number">08</span>
      </div>

      <h3>Classical AND is not reversible</h3>
      <p className="qgm-gate-subtitle">Information can be lost</p>

      <p>
        A classical AND gate outputs 1 only when both inputs are 1.
      </p>

      <div className="qgm-mini-equation">
        <span>00, 01, 10</span>
        <strong>AND</strong>
        <span>0</span>
      </div>

      <div className="qgm-mini-equation">
        <span>11</span>
        <strong>AND</strong>
        <span>1</span>
      </div>

      <p>
        If we only know that the output was 0, we cannot tell whether the
        original input was 00, 01, or 10. Information has been lost.
      </p>

      <div className="qgm-lesson-highlight">
        <span>Key difference</span>
        <strong>
          Standard quantum gates must preserve enough information for the
          operation to be reversible.
        </strong>
      </div>
    </article>

    <article className="qgm-gate-lesson-card qgm-wide-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">CCX</span>
        <span className="qgm-gate-number">09</span>
      </div>

      <h3>The Toffoli gate: reversible AND-like logic</h3>
      <p className="qgm-gate-subtitle">Two controls and one target</p>

      <p>
        The <strong>Toffoli gate</strong> is a three-qubit gate with two
        control qubits and one target qubit.
      </p>

      <p>
        The target flips only when both controls are |1⟩.
      </p>

      <div className="qgm-analogy-box qgm-blue-analogy">
        <span>🔐</span>

        <div>
          <strong>Two-key lock analogy</strong>
          <p>
            Imagine a lock that changes the target switch only when two
            separate keys are both activated.
          </p>
        </div>
      </div>

      <p>
        Unlike a classical AND gate, the Toffoli gate keeps the original
        control information. Because the information is preserved, the
        operation is reversible.
      </p>
    </article>

    <article className="qgm-gate-lesson-card qgm-wide-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">🌊</span>
        <span className="qgm-gate-number">10</span>
      </div>

      <h3>Quantum gates control interference</h3>
      <p className="qgm-gate-subtitle">Shaping useful probabilities</p>

      <p>
        Quantum algorithms do not simply create superposition and hope for the
        correct answer.
      </p>

      <p>
        Gates are arranged so that quantum amplitudes can interfere. Some
        possibilities reinforce each other while others cancel.
      </p>

      <div className="qgm-analogy-box qgm-purple-analogy">
        <span>🌊</span>

        <div>
          <strong>Think about overlapping waves</strong>
          <p>
            Waves that line up become stronger. Waves that oppose each other
            can cancel. Quantum gates can create similar interference effects
            between amplitudes.
          </p>
        </div>
      </div>

      <p>
        A quantum algorithm may therefore use gates to increase the probability
        of useful answers and reduce the probability of unwanted ones before
        measurement.
      </p>
    </article>

    <article className="qgm-gate-lesson-card qgm-wide-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">ALG</span>
        <span className="qgm-gate-number">11</span>
      </div>

      <h3>Gates are the building blocks of quantum algorithms</h3>
      <p className="qgm-gate-subtitle">From simple operations to useful computation</p>

      <p>
        Just as classical programs combine instructions into larger
        applications, quantum algorithms combine gates into carefully designed
        circuits.
      </p>

      <div className="qgm-key-differences">
        <div>
          <span>🔐</span>
          <strong>Shor's algorithm</strong>
          <p>
            Uses structured quantum operations to solve problems related to
            integer factoring.
          </p>
        </div>

        <div>
          <span>🔎</span>
          <strong>Grover's algorithm</strong>
          <p>
            Uses superposition and interference to improve certain search
            problems.
          </p>
        </div>

        <div>
          <span>🧪</span>
          <strong>Quantum simulation</strong>
          <p>
            Uses gate sequences to model molecules and other quantum systems.
          </p>
        </div>

        <div>
          <span>🛡️</span>
          <strong>Error correction</strong>
          <p>
            Uses large networks of gates to detect and correct certain quantum
            errors.
          </p>
        </div>
      </div>
    </article>

    <article className="qgm-gate-lesson-card qgm-wide-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">HW</span>
        <span className="qgm-gate-number">12</span>
      </div>

      <h3>From circuit diagrams to real hardware</h3>
      <p className="qgm-gate-subtitle">Software instructions become physical actions</p>

      <p>
        In a circuit diagram, a quantum gate looks like a simple box. On real
        quantum hardware, that gate must be implemented as a physical control
        operation.
      </p>

      <p>
        Different technologies use different kinds of qubits, including
        superconducting circuits, trapped ions, neutral atoms, and photons.
      </p>

      <div className="qgm-key-differences">
        <div>
          <span>1</span>
          <strong>Algorithm</strong>
          <p>Describe the quantum computation we want to perform.</p>
        </div>

        <div>
          <span>2</span>
          <strong>Circuit</strong>
          <p>Express the algorithm as a sequence of quantum gates.</p>
        </div>

        <div>
          <span>3</span>
          <strong>Hardware</strong>
          <p>
            Translate the gates into physical control signals such as
            microwave or laser pulses.
          </p>
        </div>
      </div>
    </article>

    <article className="qgm-gate-lesson-card qgm-wide-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">✓</span>
        <span className="qgm-gate-number">13</span>
      </div>

      <h3>Why gate accuracy matters</h3>
      <p className="qgm-gate-subtitle">Real quantum gates are not perfect</p>

      <p>
        The gates we study in theory perform exact mathematical
        transformations. Physical quantum computers must approximate those
        operations in the real world.
      </p>

      <p>
        Qubits are sensitive to noise and unwanted interactions, so each gate
        can introduce a small error.
      </p>

      <p>
        If a circuit contains many gates, those errors can accumulate. That is
        why researchers work on:
      </p>

      <div className="qgm-key-differences">
        <div>
          <span>🎯</span>
          <strong>Gate fidelity</strong>
          <p>Making each gate as accurate as possible.</p>
        </div>

        <div>
          <span>🔇</span>
          <strong>Noise reduction</strong>
          <p>Protecting qubits from unwanted environmental effects.</p>
        </div>

        <div>
          <span>✂️</span>
          <strong>Shorter circuits</strong>
          <p>Using fewer operations when possible.</p>
        </div>

        <div>
          <span>🛡️</span>
          <strong>Error correction</strong>
          <p>Detecting and correcting errors in larger quantum systems.</p>
        </div>
      </div>
    </article>

    <article className="qgm-gate-lesson-card qgm-wide-card">
      <div className="qgm-gate-card-top">
        <span className="qgm-gate-symbol">⭐</span>
        <span className="qgm-gate-number">14</span>
      </div>

      <h3>Three gates to remember</h3>
      <p className="qgm-gate-subtitle">Your core quantum gate toolkit</p>

      <div className="qgm-key-differences">
        <div>
          <span>X</span>
          <strong>X Gate</strong>
          <p>
            Flips |0⟩ and |1⟩. Think: <strong>flip</strong>.
          </p>
        </div>

        <div>
          <span>H</span>
          <strong>Hadamard Gate</strong>
          <p>
            Creates superposition and enables interference. Think:{" "}
            <strong>superposition</strong>.
          </p>
        </div>

        <div>
          <span>CX</span>
          <strong>CNOT Gate</strong>
          <p>
            Flips a target depending on a control qubit. Think:{" "}
            <strong>controlled flip</strong>.
          </p>
        </div>
      </div>

      <div className="qgm-lesson-highlight">
        <span>Key takeaway</span>
        <strong>
          Quantum algorithms are built from carefully ordered sequences of
          reversible gates that manipulate amplitudes, phase, superposition,
          and correlations between qubits.
        </strong>
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
                            disabled={hasAnswered}
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
                <span>of {quizQuestions.length} answered</span>
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
                {correctCount === quizQuestions.length ? "🎉" : correctCount >= quizQuestions.length - 1 ? "⭐" : "📘"}
              </div>

              <div>
                <p className="qgm-section-label">YOUR RESULT</p>
                <h3>
                  You scored {correctCount} out of {quizQuestions.length}
                </h3>

                <p>
                  {correctCount === quizQuestions.length &&
                    "Excellent work! You understand the X, Hadamard, and CNOT gates."}

                  {correctCount === quizQuestions.length - 1 &&
                    "Great job! You have a strong understanding of quantum gates."}

                  {correctCount < quizQuestions.length - 1 &&
                    "Good effort. Review the gate explorer and try the quiz again."}
                </p>
              </div>

              <button type="button" onClick={resetQuiz}>
                Try again
              </button>
            </div>
          )}
        </section>
        {showSummary && (
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
        )}
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