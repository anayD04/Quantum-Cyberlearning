import React, { useMemo, useState } from "react";
import "./EntanglementModule.css";
import { useProgress } from "./ProgressContext";

const quizQuestions = [
  {
    id: 1,
    question:
      "What is the best description of quantum entanglement?",
    options: [
      "Two qubits that always store the same classical value",
      "A shared quantum state involving multiple qubits whose outcomes can be strongly correlated",
      "A faster type of classical connection",
      "A measurement that copies one qubit into another",
    ],
    answer: 1,
    explanation:
      "Entangled qubits are described by a shared quantum state, and their measurement outcomes can show correlations that cannot be understood by treating the qubits independently.",
  },
  {
    id: 2,
    question:
      "Why did Einstein famously describe entanglement as 'spooky action at a distance'?",
    options: [
      "Because entangled particles can remain strongly correlated even when separated by large distances",
      "Because quantum computers only work in darkness",
      "Because entangled qubits always communicate messages instantly",
      "Because measurement makes particles physically disappear",
    ],
    answer: 0,
    explanation:
      "Einstein was concerned by the fact that entangled systems can show strong correlations even when the particles are widely separated.",
  },
  {
    id: 3,
    question:
      "Which sequence can create the Bell state (|00⟩ + |11⟩) / √2 starting from |00⟩?",
    options: [
      "Apply CNOT first, then measure both qubits",
      "Apply X to both qubits",
      "Apply H to the first qubit, then apply CNOT using it as the control",
      "Apply two classical NOT gates",
    ],
    answer: 2,
    explanation:
      "The Hadamard gate first places the control qubit into superposition, and the following CNOT turns that into an entangled Bell state.",
  },
  {
    id: 4,
    question:
      "What is special about Bell states?",
    options: [
      "They contain only one qubit",
      "They are classical states stored twice",
      "They can never be measured",
      "They are maximally entangled states of two qubits",
    ],
    answer: 3,
    explanation:
      "Bell states are the simplest maximally entangled two-qubit states and are central to quantum information and communication.",
  },
  {
    id: 5,
    question:
      "What measurement outcomes are possible for the Bell state (|01⟩ + |10⟩) / √2 in the computational basis?",
    options: [
      "00 or 11",
      "01 or 10",
      "Only 00",
      "All four outcomes equally",
    ],
    answer: 1,
    explanation:
      "This Bell state produces opposite measurement results: if one qubit is measured as 0, the other is 1, and vice versa.",
  },
  {
    id: 6,
    question:
      "What does measurement do to an entangled pair in the standard introductory description?",
    options: [
      "It creates a third qubit",
      "It always destroys both qubits",
      "It causes the shared quantum state to collapse to an outcome consistent with the measurement",
      "It reveals hidden classical values that were fixed from the beginning",
    ],
    answer: 2,
    explanation:
      "Measurement is described as collapsing the joint entangled state to a result consistent with the observed outcome.",
  },
  {
    id: 7,
    question:
      "Why is classical correlation different from quantum entanglement?",
    options: [
      "Classical correlation can often be explained by values that were already fixed, while entangled correlations cannot be reproduced by local hidden-variable models",
      "Classical correlation always requires qubits",
      "Entanglement only works when particles are touching",
      "There is no meaningful difference",
    ],
    answer: 0,
    explanation:
      "Classical correlations can come from predetermined shared information, while Bell-test experiments show that entangled correlations cannot be explained by local hidden-variable theories.",
  },
  {
    id: 8,
    question:
      "Why does entanglement not allow faster-than-light communication?",
    options: [
      "Because entangled particles cannot be separated",
      "Because the measurement outcome cannot be chosen or controlled to encode a message",
      "Because CNOT gates are too slow",
      "Because measurement always gives 0",
    ],
    answer: 1,
    explanation:
      "Each local measurement result is random, so a sender cannot choose an outcome to transmit information. Classical communication is still needed to compare results.",
  },
  {
    id: 9,
    question:
      "Which statement best describes quantum teleportation?",
    options: [
      "It transports matter instantly across space",
      "It copies an unknown quantum state perfectly",
      "It transfers a quantum state using entanglement, measurement, and classical communication",
      "It sends information faster than light",
    ],
    answer: 2,
    explanation:
      "Quantum teleportation transfers the information defining a quantum state using shared entanglement, measurement, and classical communication.",
  },
  {
    id: 10,
    question:
      "What role does entanglement play in superdense coding?",
    options: [
      "It allows a pre-shared entangled pair to help communicate two classical bits by sending one qubit",
      "It removes the need to send any physical system",
      "It guarantees unlimited communication speed",
      "It converts every classical bit into two qubits",
    ],
    answer: 0,
    explanation:
      "With a shared entangled pair, superdense coding allows two classical bits of information to be communicated by sending one qubit under the protocol.",
  },
  {
    id: 11,
    question:
      "Which is a real area where entanglement can be useful?",
    options: [
      "Making ordinary web pages load instantly",
      "Replacing all classical encryption with no communication",
      "Preventing every type of quantum error automatically",
      "Quantum key distribution, quantum networks, and quantum sensing",
    ],
    answer: 3,
    explanation:
      "Entanglement is an important resource in areas such as quantum communication, networked quantum systems, and precision sensing.",
  },
  {
    id: 12,
    question:
      "Which statement about entanglement and quantum computing speedup is most accurate?",
    options: [
      "Entanglement alone guarantees every quantum algorithm is faster",
      "Entanglement is useless for algorithms",
      "Entanglement can be an important resource, but speedup usually depends on how it is combined with interference, superposition, and algorithm design",
      "Quantum speedup comes only from measuring qubits more often",
    ],
    answer: 2,
    explanation:
      "Entanglement can contribute to quantum advantage, but it does not automatically create a speedup. Useful algorithms depend on carefully designed combinations of quantum effects.",
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
  const { completeModule, updateBestScore} = useProgress();
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
  updateBestScore(5, earnedPoints + bonusPoints);
  completeModule(5);

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
      Entanglement occurs when two or more qubits share a quantum state that
      cannot be fully described by treating each qubit independently.
    </p>
  </div>

  <div className="em-introduction-card">
    <div className="em-introduction-icon">🔗</div>

    <div>
      <h3>One shared quantum state</h3>

      <p>
        Normally, we imagine separate objects as having separate states.
        Entangled qubits are different: the most complete description belongs
        to the <strong>combined system</strong>, not to each qubit by itself.
      </p>

      <p>
        This shared state can produce correlations that are stronger than what
        can be explained by ordinary classical models based on local,
        predetermined values.
      </p>

      <p>
        Albert Einstein famously described this behavior as{" "}
        <strong>"spooky action at a distance"</strong> because the correlations
        remain even when the particles are widely separated.
      </p>
    </div>

    <div className="em-key-idea">
      <span>Key idea</span>
      <strong>
        Entanglement is a property of a shared quantum state. It does not mean
        that a controllable signal is sent instantly from one qubit to another.
      </strong>
    </div>
  </div>

  <div className="em-lesson-grid">
    <article className="em-lesson-card">
      <span className="em-card-number">01</span>

      <div>
        <h3>How entanglement is created</h3>

        <p>
          A common way to create entanglement starts with two qubits in:
        </p>

        <div className="em-formula-box">
          |00⟩
        </div>

        <p>
          First, apply a Hadamard gate to the first qubit. This creates
          superposition:
        </p>

        <div className="em-formula-box">
          (|00⟩ + |10⟩) / √2
        </div>

        <p>
          Next, apply a CNOT gate using the first qubit as the control and the
          second as the target.
        </p>

        <div className="em-formula-box">
          (|00⟩ + |11⟩) / √2
        </div>

        <p>
          The final state cannot be separated into independent states for the
          two qubits. The pair is now entangled.
        </p>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">02</span>

      <div>
        <h3>Why H followed by CNOT works</h3>

        <p>
          The Hadamard gate creates a superposition in the control qubit.
          CNOT then links the target qubit to that control.
        </p>

        <div className="em-result-pair">
          <div>
            <span>Control branch</span>
            <strong>0</strong>
          </div>

          <span>→</span>

          <div>
            <span>Target</span>
            <strong>unchanged</strong>
          </div>
        </div>

        <div className="em-result-pair">
          <div>
            <span>Control branch</span>
            <strong>1</strong>
          </div>

          <span>→</span>

          <div>
            <span>Target</span>
            <strong>flipped</strong>
          </div>
        </div>

        <p>
          Because both control possibilities are present in superposition,
          CNOT creates a combined two-qubit state rather than one independent
          state for each qubit.
        </p>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">03</span>

      <div>
        <h3>Bell states</h3>

        <p>
          <strong>Bell states</strong> are the simplest maximally entangled
          states of two qubits.
        </p>

        <p>
          There are four Bell states:
        </p>

        <div className="em-formula-box">
          Φ⁺ = (|00⟩ + |11⟩) / √2
        </div>

        <div className="em-formula-box">
          Φ⁻ = (|00⟩ - |11⟩) / √2
        </div>

        <div className="em-formula-box">
          Ψ⁺ = (|01⟩ + |10⟩) / √2
        </div>

        <div className="em-formula-box">
          Ψ⁻ = (|01⟩ - |10⟩) / √2
        </div>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">04</span>

      <div>
        <h3>What the Bell states represent</h3>

        <p>
          The Φ states produce matching results when measured in the standard
          computational basis:
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

        <p>
          The Ψ states produce opposite results:
        </p>

        <div className="em-result-pair">
          <div>
            <span>Possible result</span>
            <strong>01</strong>
          </div>

          <span>or</span>

          <div>
            <span>Possible result</span>
            <strong>10</strong>
          </div>
        </div>

        <p>
          The plus and minus signs encode differences in{" "}
          <strong>relative phase</strong>, which can affect later interference.
        </p>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">05</span>

      <div>
        <h3>Measuring an entangled pair</h3>

        <p>
          Consider the Bell state:
        </p>

        <div className="em-formula-box">
          (|00⟩ + |11⟩) / √2
        </div>

        <p>
          If the first qubit is measured as 0, the joint state becomes
          consistent with |00⟩. Measuring the second qubit in the same basis
          then gives 0.
        </p>

        <p>
          If the first qubit is measured as 1, the joint state becomes
          consistent with |11⟩, and the second gives 1.
        </p>

        <div className="em-key-idea">
          <span>Important</span>
          <strong>
            The individual result is random, but the relationship between the
            two results is highly structured.
          </strong>
        </div>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">06</span>

      <div>
        <h3>Collapse of the shared state</h3>

        <p>
          In the standard introductory description, measurement causes the
          quantum state to <strong>collapse</strong> to a result compatible
          with the measurement.
        </p>

        <p>
          For an entangled pair, it is better to think about collapse of the
          <strong>joint state</strong> rather than two separate qubits acting
          independently.
        </p>

        <div className="em-warning-box">
          <span>!</span>

          <p>
            Saying that one measurement "instantly sends a value" to the other
            qubit is misleading. The two qubits were already described by one
            shared quantum state.
          </p>
        </div>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">07</span>

      <div>
        <h3>Classical correlation</h3>

        <p>
          Imagine placing a red card in one envelope and a blue card in
          another, then sending the envelopes to different locations.
        </p>

        <p>
          If you open one envelope and find red, you immediately know the other
          contains blue.
        </p>

        <p>
          That is a classical correlation because the values were fixed from
          the beginning. You simply did not know which envelope contained
          which card.
        </p>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">08</span>

      <div>
        <h3>Quantum correlation is fundamentally different</h3>

        <p>
          Entangled qubits cannot generally be explained by saying that every
          possible measurement result was secretly predetermined in advance.
        </p>

        <p>
          Experiments based on <strong>Bell's inequalities</strong> show that
          quantum correlations can violate limits obeyed by theories based on
          <strong>local hidden variables</strong>.
        </p>

        <div className="em-key-idea">
          <span>Key distinction</span>
          <strong>
            Classical correlation can come from shared hidden information.
            Entanglement can produce correlations that local hidden-variable
            models cannot reproduce.
          </strong>
        </div>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">09</span>

      <div>
        <h3>Quantum teleportation</h3>

        <p>
          Quantum teleportation transfers the{" "}
          <strong>quantum state of a qubit</strong> from one location to
          another.
        </p>

        <p>
          It requires three ingredients:
        </p>

        <div className="em-result-pair">
          <div>
            <span>1</span>
            <strong>Entanglement</strong>
          </div>

          <span>+</span>

          <div>
            <span>2</span>
            <strong>Measurement</strong>
          </div>
        </div>

        <div className="em-result-pair">
          <div>
            <span>3</span>
            <strong>Classical communication</strong>
          </div>

          <span>→</span>

          <div>
            <span>Result</span>
            <strong>State reconstructed</strong>
          </div>
        </div>

        <p>
          No matter or person is teleported. The information defining the
          quantum state is transferred according to the protocol.
        </p>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">10</span>

      <div>
        <h3>Superdense coding</h3>

        <p>
          Entanglement can also be used in a protocol called{" "}
          <strong>superdense coding</strong>.
        </p>

        <p>
          If two parties already share an entangled pair, sending one qubit
          can be used to communicate two classical bits under the protocol.
        </p>

        <div className="em-key-idea">
          <span>Important</span>
          <strong>
            The entanglement must already be shared beforehand. It is a
            resource that the communication protocol consumes.
          </strong>
        </div>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">11</span>

      <div>
        <h3>Entanglement in quantum algorithms</h3>

        <p>
          Quantum algorithms can deliberately create entanglement so that
          multiple qubits participate in a shared quantum state.
        </p>

        <p>
          This can represent relationships between parts of a computation that
          have no simple independent classical description.
        </p>

        <p>
          However, entanglement by itself does not guarantee a speedup.
          Quantum advantage usually comes from combining:
        </p>

        <div className="em-result-pair">
          <div>
            <span>Quantum resource</span>
            <strong>Superposition</strong>
          </div>

          <span>+</span>

          <div>
            <span>Quantum resource</span>
            <strong>Interference</strong>
          </div>
        </div>

        <div className="em-result-pair">
          <div>
            <span>Quantum resource</span>
            <strong>Entanglement</strong>
          </div>

          <span>+</span>

          <div>
            <span>Design</span>
            <strong>Algorithm structure</strong>
          </div>
        </div>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">12</span>

      <div>
        <h3>Not faster-than-light communication</h3>

        <p>
          One of the most common misconceptions is that entanglement allows
          instant messaging across any distance.
        </p>

        <p>
          It does not.
        </p>

        <p>
          If Alice measures her qubit, she cannot choose whether the result is
          0 or 1. Bob's local result is also random from his perspective.
        </p>

        <div className="em-warning-box">
          <span>!</span>

          <p>
            Alice and Bob must compare their results using ordinary classical
            communication before they can observe the correlation.
          </p>
        </div>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">13</span>

      <div>
        <h3>Entanglement does not mean "same value"</h3>

        <p>
          Some entangled states produce matching measurement results, but
          others produce opposite results.
        </p>

        <div className="em-formula-box">
          (|00⟩ + |11⟩) / √2 → matching
        </div>

        <div className="em-formula-box">
          (|01⟩ + |10⟩) / √2 → opposite
        </div>

        <p>
          Entanglement describes a relationship in a joint quantum state, not
          simply equality between two bits.
        </p>
      </div>
    </article>

    <article className="em-lesson-card">
      <span className="em-card-number">14</span>

      <div>
        <h3>Entanglement does not copy quantum information</h3>

        <p>
          Quantum mechanics includes the <strong>no-cloning theorem</strong>,
          which says an arbitrary unknown quantum state cannot be copied
          perfectly.
        </p>

        <p>
          Even quantum teleportation does not create an independent duplicate
          of the original state.
        </p>

        <div className="em-key-idea">
          <span>Remember</span>
          <strong>
            Entanglement can transfer and correlate quantum information, but it
            does not allow perfect copying of arbitrary unknown states.
          </strong>
        </div>
      </div>
    </article>
  </div>

  <div className="em-analogy-section">
    <div className="em-analogy-heading">
      <p className="em-section-label">CLASSICAL VS QUANTUM CORRELATION</p>
      <h3>Why the envelope analogy eventually breaks down</h3>
    </div>

    <div className="em-analogy-layout">
      <div className="em-analogy-card">
        <span>Classical envelopes</span>

        <div className="em-card-pair">
          <div>Red</div>
          <div>Blue</div>
        </div>

        <p>
          Put one red card and one blue card into separate envelopes. Opening
          one tells you what is in the other because the values were fixed
          beforehand.
        </p>

        <p>
          The correlation comes from ordinary shared information that already
          existed.
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
          Entangled systems can produce correlations that cannot be reproduced
          by assigning each particle a set of predetermined local answers.
        </p>

        <p>
          Bell-test experiments are what distinguish this quantum behavior from
          the simple envelope explanation.
        </p>
      </div>
    </div>

    <div className="em-analogy-note">
      <span>Remember</span>

      <p>
        The envelope analogy is useful for understanding ordinary correlation,
        but it is specifically what entanglement goes beyond.
      </p>
    </div>
  </div>

  <div className="em-computing-uses">
    <div className="em-computing-heading">
      <p className="em-section-label">WHY ENTANGLEMENT MATTERS</p>
      <h3>Entanglement as a quantum resource</h3>
    </div>

    <div className="em-use-grid">
      <article>
        <span>📡</span>
        <h4>Quantum teleportation</h4>
        <p>
          Shared entanglement, measurement, and classical communication can
          transfer an unknown quantum state between locations.
        </p>
      </article>

      <article>
        <span>📨</span>
        <h4>Superdense coding</h4>
        <p>
          A pre-shared entangled pair can be used in a protocol where sending
          one qubit communicates two classical bits.
        </p>
      </article>

      <article>
        <span>🔐</span>
        <h4>Quantum key distribution</h4>
        <p>
          Some QKD protocols use entangled systems to establish keys and test
          whether the quantum channel has been disturbed.
        </p>
      </article>

      <article>
        <span>🌐</span>
        <h4>Quantum networks</h4>
        <p>
          Future quantum networks may distribute entanglement between distant
          processors using quantum memories and repeaters.
        </p>
      </article>

      <article>
        <span>🧭</span>
        <h4>Quantum sensing</h4>
        <p>
          Entangled systems can improve the precision of some measurements of
          time, fields, acceleration, and other physical quantities.
        </p>
      </article>

      <article>
        <span>🧮</span>
        <h4>Quantum algorithms</h4>
        <p>
          Entanglement can help encode relationships across multiple qubits as
          part of a larger algorithmic strategy.
        </p>
      </article>

      <article>
        <span>🔗</span>
        <h4>Distributed quantum computing</h4>
        <p>
          Entanglement may allow smaller quantum processors to cooperate as
          parts of a larger distributed quantum system.
        </p>
      </article>

      <article>
        <span>🧪</span>
        <h4>Quantum experiments</h4>
        <p>
          Bell-state experiments test some of the deepest predictions of
          quantum mechanics and the limits of classical explanations.
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
                            disabled={hasAnswered}
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
        <section className="em-further-reading" id="further-reading">
  <div className="em-section-heading">
    <p className="em-section-label">KEEP EXPLORING</p>
    <h2>Further Readings</h2>
    <p>
      Continue exploring quantum entanglement, Bell states, quantum
      correlations, and the powerful applications that entanglement
      makes possible.
    </p>
  </div>

  <div className="em-reading-grid">
    <a
      className="em-reading-card"
      href="https://learn.microsoft.com/en-us/azure/quantum/concepts-entanglement"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="em-reading-card-top">
        <span className="em-reading-source">Microsoft Learn</span>
        <span className="em-reading-level">Beginner</span>
      </div>

      <h3>Entanglement and Correlations</h3>

      <p>
        Learn what quantum entanglement means, how entangled qubits
        behave when measured, how Bell states are created, and how
        quantum correlations differ from classical correlations.
      </p>

      <span className="em-reading-link">Open resource ↗</span>
    </a>

    <a
      className="em-reading-card"
      href="https://learning.quantum.ibm.com/course/basics-of-quantum-information/multiple-systems"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="em-reading-card-top">
        <span className="em-reading-source">IBM Quantum</span>
        <span className="em-reading-level">Beginner+</span>
      </div>

      <h3>Multiple Systems and Bell States</h3>

      <p>
        Go deeper into systems containing multiple qubits and explore
        the four Bell states, some of the most important examples of
        quantum entanglement.
      </p>

      <span className="em-reading-link">Open resource ↗</span>
    </a>

    <a
      className="em-reading-card"
      href="https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/introduction"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="em-reading-card-top">
        <span className="em-reading-source">IBM Quantum</span>
        <span className="em-reading-level">Go Deeper</span>
      </div>

      <h3>Entanglement in Action</h3>

      <p>
        Discover how entanglement becomes a useful computational
        resource through quantum teleportation, superdense coding,
        and other quantum information protocols.
      </p>

      <span className="em-reading-link">Open resource ↗</span>
    </a>
  </div>

  <p className="em-reading-disclaimer">
    These optional resources are provided by external organizations.
    QuantumPath is not affiliated with or endorsed by these providers.
  </p>
</section>
        {showSummary && (
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
        )}
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