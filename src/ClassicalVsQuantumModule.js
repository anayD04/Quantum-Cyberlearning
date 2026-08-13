import React, { useMemo, useState } from "react";
import "./ClassicalVsQuantumModule.css";
import { useProgress } from "./ProgressContext";

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
    question:
      "Which statement best describes how a classical program usually represents information?",
    options: [
      "Variables usually hold definite values at a given moment",
      "Every variable is always in superposition",
      "Variables can only store 0",
      "Classical programs do not use state",
    ],
    answer: 0,
    explanation:
      "Classical programs usually represent state using variables with definite values, such as numbers, text, or Boolean values.",
  },
  {
    id: 2,
    question: "What does it mean when a classical program is deterministic?",
    options: [
      "It always uses random numbers",
      "The same input and instructions usually produce the same output",
      "It can only run once",
      "Its variables cannot change",
    ],
    answer: 1,
    explanation:
      "A deterministic program produces the same result when given the same input and the same sequence of instructions.",
  },
  {
    id: 3,
    question:
      "What is one major difference between classical and quantum program state?",
    options: [
      "Quantum state can involve superposition instead of only definite values",
      "Classical state cannot be stored",
      "Quantum programs do not use information",
      "Classical variables are always random",
    ],
    answer: 0,
    explanation:
      "Quantum programs can manipulate qubits in superposition, while classical programs usually work with definite variable values.",
  },
  {
    id: 4,
    question:
      "Why can the same quantum circuit produce different measurement results on different runs?",
    options: [
      "The circuit changes its source code each time",
      "The computer forgets the previous instructions",
      "Qubits cannot be measured",
      "Quantum measurements can be probabilistic",
    ],
    answer: 3,
    explanation:
      "Quantum circuits can produce probabilistic outcomes, so repeated runs may produce different results according to the state's measurement probabilities.",
  },
  {
    id: 5,
    question:
      "Why does ordinary classical variable tracing not transfer directly to quantum programs?",
    options: [
      "Quantum programs never have steps",
      "Classical tracing only works with websites",
      "A qubit may not have one definite classical value before measurement",
      "Quantum gates cannot be written down",
    ],
    answer: 2,
    explanation:
      "Classical tracing assumes variables have definite values. A qubit can instead be in superposition, so the full quantum state must be considered.",
  },
  {
    id: 6,
    question:
      "Why is debugging a quantum program more difficult than simply printing every qubit's value?",
    options: [
      "Quantum computers do not support any output",
      "Measuring a qubit can change the quantum state being debugged",
      "Qubits always display the wrong answer",
      "Quantum programs cannot contain errors",
    ],
    answer: 1,
    explanation:
      "Measurement affects the quantum state, so programmers cannot freely inspect qubits without potentially disturbing the computation.",
  },
  {
    id: 7,
    question:
      "What does reversibility mean for standard quantum gates before measurement?",
    options: [
      "The effect of a gate can be undone by an inverse operation",
      "A quantum gate can never be applied twice",
      "Every quantum program must run backward",
      "Measurement can always be reversed",
    ],
    answer: 0,
    explanation:
      "Quantum gates are reversible operations, meaning an inverse gate can undo the transformation before measurement.",
  },
  {
    id: 8,
    question:
      "Which statement best compares control flow in classical and quantum programs?",
    options: [
      "Quantum programs never execute instructions",
      "Classical programs cannot use loops",
      "Quantum programs only use if-statements",
      "Classical programs often branch on exact values, while quantum circuits often apply planned gate sequences before measurement",
    ],
    answer: 3,
    explanation:
      "Classical control flow commonly uses exact variable values for branches and loops, while quantum circuits often evolve a state through a sequence of gates.",
  },
  {
    id: 9,
    question: "Why is Shor's algorithm important in quantum computing?",
    options: [
      "It is used to design web pages",
      "It proves quantum computers are faster at every task",
      "It replaces Python with a new language",
      "It shows a quantum approach to integer factoring that could affect some cryptographic systems",
    ],
    answer: 3,
    explanation:
      "Shor's algorithm provides an efficient quantum method for factoring large integers on a sufficiently capable quantum computer, which is important for cryptography.",
  },
  {
    id: 10,
    question:
      "What kind of advantage does Grover's algorithm demonstrate?",
    options: [
      "It makes every search instantaneous",
      "It can reduce the number of queries needed for certain unstructured search problems",
      "It removes the need for qubits",
      "It guarantees the first guess is correct",
    ],
    answer: 1,
    explanation:
      "Grover's algorithm provides a quadratic-style improvement for certain unstructured search problems, reducing the number of required queries.",
  },
  {
    id: 11,
    question: "What is Qiskit used for?",
    options: [
      "Editing images for quantum computers",
      "Replacing all classical programming",
      "Measuring classical bits only",
      "Building and running quantum circuits using Python-based tools",
    ],
    answer: 3,
    explanation:
      "Qiskit is a software development kit that allows programmers to create, run, and analyze quantum circuits using Python.",
  },
  {
    id: 12,
    question:
      "Why are many real quantum programs described as hybrid programs?",
    options: [
      "They combine classical code for setup and analysis with quantum circuits for quantum operations",
      "They run two classical programs at once",
      "They never use measurement",
      "They avoid Python completely",
    ],
    answer: 0,
    explanation:
      "Many quantum applications use classical Python to prepare experiments and analyze results, while the quantum circuit performs operations on qubits.",
  },
];

function ClassicalVsQuantumModule() {
  const { completeModule, updateBestScore } = useProgress();
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
  updateBestScore(2, earnedPoints + bonusPoints);
  completeModule(2);

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
    <h2>Classical vs Quantum Programming</h2>
    <p>
      Classical and quantum programs both give computers instructions, but
      they represent information, execute operations, and produce results in
      fundamentally different ways.
    </p>
  </div>

  <div className="cvq-lesson-grid">
    {/* CARD 01 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">01</span>

      <div>
        <h3>How classical programming works</h3>

        <p>
          <strong>Classical programming</strong> is the type of programming
          used to create websites, mobile apps, games, operating systems, and
          most software we use today.
        </p>

        <p>
          Classical programs usually work with <strong>exact values</strong>.
          A variable has one definite value at a particular moment. For
          example, if a variable called <code>score</code> contains 10, then
          its current value is 10 — not several different values at once.
        </p>

        <p>
          Instructions are normally executed in a predictable sequence. The
          computer moves from one instruction to the next unless something
          like an <code>if</code> statement, function, or loop changes the
          flow.
        </p>

        <div className="cvq-analogy-box">
          <span aria-hidden="true">📝</span>

          <div>
            <strong>Think of following a recipe</strong>
            <p>
              A classical program is similar to following recipe
              instructions: complete one step, update what you have, and then
              continue to the next step.
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 02 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">02</span>

      <div>
        <h3>Deterministic behavior</h3>

        <p>
          Many classical programs are <strong>deterministic</strong>. This
          means that if you provide the same input and execute the same
          instructions, you expect the same output.
        </p>

        <p>
          For example, imagine a program that multiplies a number by two. If
          the input is 4, the output will be 8 every time the same operation
          is performed.
        </p>

        <div className="cvq-analogy-box cvq-analogy-purple">
          <span aria-hidden="true">🧮</span>

          <div>
            <strong>Same instructions, same result</strong>
            <p>
              Input 4 → multiply by 2 → output 8. This predictable behavior
              makes many classical programs straightforward to trace and
              debug.
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 03 */}
    <article className="cvq-lesson-card cvq-wide-card">
      <span className="cvq-card-number">03</span>

      <div>
        <h3>Classical programs have definite state</h3>

        <p>
          A program's <strong>state</strong> describes the information it
          currently contains. In classical programming, we often represent
          this information using variables.
        </p>

        <p>
          Imagine that a program contains:
        </p>

        <div className="cvq-analogy-box">
          <span aria-hidden="true">💻</span>

          <div>
            <strong>Example program state</strong>
            <p>
              <code>x = 3</code>
              <br />
              <code>y = 7</code>
            </p>
          </div>
        </div>

        <p>
          We know exactly what each variable contains. If the program then
          performs <code>x = x + 1</code>, we can trace the program and say
          that <code>x</code> now contains 4.
        </p>

        <p>
          This gives us one of the most useful questions in classical program
          comprehension:
        </p>

        <div className="cvq-analogy-box cvq-analogy-purple">
          <span aria-hidden="true">🔎</span>

          <div>
            <strong>What is the value of each variable after this line?</strong>
            <p>
              Because classical variables have definite values, programmers
              can often understand a program by following those values step
              by step.
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 04 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">04</span>

      <div>
        <h3>Quantum programming changes the rules</h3>

        <p>
          <strong>Quantum programming</strong> works with qubits and quantum
          states instead of relying only on ordinary classical variables.
        </p>

        <p>
          A qubit can be in the state <strong>|0⟩</strong>, the state{" "}
          <strong>|1⟩</strong>, or a <strong>superposition</strong> involving
          both states.
        </p>

        <p>
          Quantum programs transform these states using operations called{" "}
          <strong>quantum gates</strong>.
        </p>

        <div className="cvq-analogy-box">
          <span aria-hidden="true">⚛️</span>

          <div>
            <strong>A different programming question</strong>
            <p>
              Instead of only asking "What value does this variable have?",
              a quantum programmer must ask "What quantum state have I
              prepared, and how will the next gate transform it?"
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 05 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">05</span>

      <div>
        <h3>Reading |0⟩ and |1⟩</h3>

        <p>
          Quantum computing uses a notation called{" "}
          <strong>Dirac notation</strong> to describe quantum states.
        </p>

        <p>
          The two basic states of a qubit are:
        </p>

        <div className="cvq-key-differences">
          <div>
            <span>0</span>
            <strong>|0⟩</strong>
            <p>Pronounced "ket zero."</p>
          </div>

          <div>
            <span>1</span>
            <strong>|1⟩</strong>
            <p>Pronounced "ket one."</p>
          </div>
        </div>

        <p>
          A <strong>ket</strong> represents a quantum state. Mathematically,
          these basic states can also be represented as vectors:
        </p>

        <div className="cvq-analogy-box cvq-analogy-purple">
          <span aria-hidden="true">📐</span>

          <div>
            <strong>Kets as vectors</strong>
            <p>
              |0⟩ = [1, 0]ᵀ
              <br />
              |1⟩ = [0, 1]ᵀ
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 06 */}
    <article className="cvq-lesson-card cvq-wide-card">
      <span className="cvq-card-number">06</span>

      <div>
        <h3>What about bras?</h3>

        <p>
          You may also see quantum states written using symbols such as{" "}
          <strong>⟨0|</strong> and <strong>⟨1|</strong>. These are called{" "}
          <strong>bras</strong>.
        </p>

        <div className="cvq-key-differences">
          <div>
            <span>⚛️</span>
            <strong>Ket</strong>
            <p>|0⟩ represents a quantum state as a column vector.</p>
          </div>

          <div>
            <span>📐</span>
            <strong>Bra</strong>
            <p>⟨0| is the corresponding row-vector form.</p>
          </div>

          <div>
            <span>🧠</span>
            <strong>For now</strong>
            <p>
              You only need to recognize the notation. We do not need
              bra-ket calculations yet.
            </p>
          </div>
        </div>

        <p>
          Bras and kets become useful when performing mathematical
          calculations with quantum states. For now, remember the most
          important idea:
        </p>

        <div className="cvq-analogy-box">
          <span aria-hidden="true">⭐</span>

          <div>
            <strong>Kets describe quantum states.</strong>
            <p>
              When you see |0⟩ or |1⟩ in QuantumPath, read them as "ket zero"
              and "ket one."
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 07 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">07</span>

      <div>
        <h3>Quantum outcomes can be probabilistic</h3>

        <p>
          Quantum programs can produce{" "}
          <strong>probabilistic measurement outcomes</strong>.
        </p>

        <p>
          Suppose a qubit begins in |0⟩ and a Hadamard gate places it into a
          balanced superposition. When measured, it has equal probabilities
          of producing 0 or 1.
        </p>

        <div className="cvq-analogy-box cvq-analogy-purple">
          <span aria-hidden="true">📊</span>

          <div>
            <strong>One circuit, many runs</strong>
            <p>
              If we run the circuit many times, we might see approximately
              50% of measurements produce 0 and 50% produce 1.
            </p>
          </div>
        </div>

        <p>
          Repeated executions of a quantum circuit are commonly called{" "}
          <strong>shots</strong>. Quantum programmers often examine the
          distribution of results across many shots.
        </p>
      </div>
    </article>

    {/* CARD 08 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">08</span>

      <div>
        <h3>Control flow works differently</h3>

        <p>
          Classical programs commonly use control structures such as{" "}
          <code>if</code> statements and loops to choose which instructions
          execute next.
        </p>

        <p>
          A quantum circuit is often designed as a sequence of gates that
          transform a quantum state before the qubits are measured.
        </p>

        <div className="cvq-key-differences">
          <div>
            <span>💻</span>
            <strong>Classical</strong>
            <p>
              Read values → make decisions → follow branches → update
              variables.
            </p>
          </div>

          <div>
            <span>⚛️</span>
            <strong>Quantum</strong>
            <p>
              Prepare qubits → apply gates → transform state → measure.
            </p>
          </div>
        </div>

        <p>
          Modern quantum programs can combine quantum operations with
          classical decisions, but the quantum circuit itself requires a
          different way of thinking about control.
        </p>
      </div>
    </article>

    {/* CARD 09 */}
    <article className="cvq-lesson-card cvq-wide-card">
      <span className="cvq-card-number">09</span>

      <div>
        <h3>Quantum gates are reversible</h3>

        <p>
          Another important difference is{" "}
          <strong>reversibility</strong>. Ordinary classical operations can
          erase information, but the standard quantum gates used before
          measurement are reversible.
        </p>

        <p>
          For example, the quantum X gate flips |0⟩ to |1⟩:
        </p>

        <div className="cvq-key-differences">
          <div>
            <span>1</span>
            <strong>|0⟩ → X → |1⟩</strong>
            <p>The first X gate flips the qubit.</p>
          </div>

          <div>
            <span>2</span>
            <strong>|1⟩ → X → |0⟩</strong>
            <p>Applying X again reverses the operation.</p>
          </div>
        </div>

        <div className="cvq-analogy-box cvq-analogy-purple">
          <span aria-hidden="true">↩️</span>

          <div>
            <strong>Think of an undo button</strong>
            <p>
              Quantum gates have inverse operations. If you know which gate
              transformed the state, its inverse can undo that
              transformation.
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 10 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">10</span>

      <div>
        <h3>Why quantum debugging is difficult</h3>

        <p>
          When debugging a classical program, programmers can print or
          inspect variables to see exactly what they contain.
        </p>

        <p>
          Quantum programs make this harder because{" "}
          <strong>measurement changes the quantum state</strong>.
        </p>

        <div className="cvq-analogy-box">
          <span aria-hidden="true">🐞</span>

          <div>
            <strong>You cannot freely peek inside</strong>
            <p>
              If a qubit is in superposition, measuring it just to check its
              value changes the state you were trying to inspect.
            </p>
          </div>
        </div>

        <p>
          Quantum programmers therefore need debugging and visualization
          techniques that respect how quantum information behaves.
        </p>
      </div>
    </article>

    {/* CARD 11 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">11</span>

      <div>
        <h3>Why classical tracing does not directly transfer</h3>

        <p>
          Classical program tracing works well because variables have exact
          values. We can create a table showing the value of each variable
          after every instruction.
        </p>

        <p>
          A quantum state can instead involve superposition, probability
          amplitudes, and eventually entanglement between multiple qubits.
        </p>

        <div className="cvq-analogy-box cvq-analogy-purple">
          <span aria-hidden="true">🔍</span>

          <div>
            <strong>The tracing problem</strong>
            <p>
              Asking "Is this qubit currently 0 or 1?" may be the wrong
              question before measurement. We need to understand the entire
              quantum state and how gates transform it.
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 12 */}
    <article className="cvq-lesson-card cvq-wide-card">
      <span className="cvq-card-number">12</span>

      <div>
        <h3>Visualization becomes especially important</h3>

        <p>
          Because quantum states are difficult to inspect directly,
          programmers use visual tools to understand how quantum programs
          behave.
        </p>

        <div className="cvq-key-differences">
          <div>
            <span>🔌</span>
            <strong>Circuit diagrams</strong>
            <p>Show which gates act on each qubit and in what order.</p>
          </div>

          <div>
            <span>📊</span>
            <strong>Probability histograms</strong>
            <p>Show how often different measurement outcomes occur.</p>
          </div>

          <div>
            <span>🌐</span>
            <strong>Bloch spheres</strong>
            <p>Help visualize the state of a single qubit.</p>
          </div>
        </div>

        <p>
          Other tools can display statevectors or trace a circuit one gate at
          a time. These visualizations help programmers reason about behavior
          that cannot be understood by simply watching ordinary variables.
        </p>
      </div>
    </article>

    {/* CARD 13 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">13</span>

      <div>
        <h3>Shor's algorithm</h3>

        <p>
          <strong>Shor's algorithm</strong>, introduced by Peter Shor in
          1994, is one of the most famous examples of quantum computing's
          potential.
        </p>

        <p>
          It provides an efficient quantum method for factoring large
          integers on a sufficiently capable fault-tolerant quantum
          computer.
        </p>

        <div className="cvq-analogy-box">
          <span aria-hidden="true">🔐</span>

          <div>
            <strong>Why does that matter?</strong>
            <p>
              The security of some important cryptographic systems is related
              to the difficulty of mathematical problems such as integer
              factorization. Shor's algorithm showed that quantum computation
              could change how we think about these problems.
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 14 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">14</span>

      <div>
        <h3>Grover's search algorithm</h3>

        <p>
          <strong>Grover's algorithm</strong> demonstrates another kind of
          quantum advantage.
        </p>

        <p>
          Imagine searching an unsorted collection containing many possible
          items. A classical search may need to examine many possibilities
          individually.
        </p>

        <p>
          Grover's algorithm can reduce the number of queries needed for
          certain unstructured search problems.
        </p>

        <div className="cvq-analogy-box cvq-analogy-purple">
          <span aria-hidden="true">🔎</span>

          <div>
            <strong>A useful speedup</strong>
            <p>
              Very roughly, a classical search may require work proportional
              to N possibilities, while Grover's algorithm requires work
              proportional to about √N queries.
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 15 */}
    <article className="cvq-lesson-card cvq-wide-card">
      <span className="cvq-card-number">15</span>

      <div>
        <h3>Quantum is not better for every program</h3>

        <p>
          Shor's and Grover's algorithms do not mean that quantum computers
          make every program faster.
        </p>

        <p>
          Classical computers remain extremely effective for everyday tasks
          such as running websites, managing files, playing videos, writing
          documents, and executing most software.
        </p>

        <div className="cvq-key-differences">
          <div>
            <span>💻</span>
            <strong>Classical strength</strong>
            <p>
              Reliable, efficient general-purpose computation for everyday
              applications.
            </p>
          </div>

          <div>
            <span>⚛️</span>
            <strong>Quantum strength</strong>
            <p>
              Specialized algorithms that can exploit quantum properties for
              particular problems.
            </p>
          </div>

          <div>
            <span>🤝</span>
            <strong>Hybrid computing</strong>
            <p>
              Quantum and classical computers can work together rather than
              one completely replacing the other.
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 16 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">16</span>

      <div>
        <h3>What is Qiskit?</h3>

        <p>
          <strong>Qiskit</strong> is a software development kit for working
          with quantum circuits and quantum computers.
        </p>

        <p>
          It allows programmers to construct quantum circuits using{" "}
          <strong>Python</strong>, making it easier to connect familiar
          classical programming with quantum operations.
        </p>

        <div className="cvq-analogy-box">
          <span aria-hidden="true">🐍</span>

          <div>
            <strong>A bridge from Python to quantum computing</strong>
            <p>
              With Qiskit, Python code can create qubits, construct circuits,
              apply quantum gates, run experiments, and process measurement
              results.
            </p>
          </div>
        </div>
      </div>
    </article>

    {/* CARD 17 */}
    <article className="cvq-lesson-card">
      <span className="cvq-card-number">17</span>

      <div>
        <h3>Quantum programs are often hybrid</h3>

        <p>
          A real quantum application often contains both{" "}
          <strong>classical code</strong> and a{" "}
          <strong>quantum circuit</strong>.
        </p>

        <div className="cvq-key-differences">
          <div>
            <span>1</span>
            <strong>Python</strong>
            <p>Create and configure the quantum circuit.</p>
          </div>

          <div>
            <span>2</span>
            <strong>Quantum circuit</strong>
            <p>Apply gates and manipulate qubits.</p>
          </div>

          <div>
            <span>3</span>
            <strong>Measurement</strong>
            <p>Convert quantum information into classical results.</p>
          </div>

          <div>
            <span>4</span>
            <strong>Python again</strong>
            <p>Analyze, display, and interpret those results.</p>
          </div>
        </div>

        <p>
          This is one reason Qiskit is useful for learning: students can use
          familiar Python concepts while gradually learning the quantum
          programming model.
        </p>
      </div>
    </article>

    {/* CARD 18 */}
    <article className="cvq-lesson-card cvq-wide-card">
      <span className="cvq-card-number">18</span>

      <div>
        <h3>The biggest shift is how we understand a program</h3>

        <p>
          The most important difference between classical and quantum
          programming is not the programming language or syntax. It is{" "}
          <strong>how we reason about the state of a computation</strong>.
        </p>

        <div className="cvq-key-differences">
          <div>
            <span>💻</span>
            <strong>Classical thinking</strong>
            <p>"What exact value does this variable contain?"</p>
          </div>

          <div>
            <span>⚛️</span>
            <strong>Quantum thinking</strong>
            <p>"What quantum state have I prepared?"</p>
          </div>

          <div>
            <span>📊</span>
            <strong>Measurement thinking</strong>
            <p>"What outcomes and probabilities should I expect?"</p>
          </div>
        </div>

        <div className="cvq-analogy-box cvq-analogy-purple">
          <span aria-hidden="true">⭐</span>

          <div>
            <strong>Key takeaway</strong>
            <p>
              Quantum programming is not simply classical programming with
              different commands. Qubits, superposition, measurement,
              reversibility, and probabilistic outcomes create a different
              model of computation — and therefore require new ways to trace,
              visualize, debug, and understand programs.
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
                            disabled={hasAnswered}
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
                <span>of {quizQuestions.length} answered</span>
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
                onClick={checkScore}
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
                {correctCount === quizQuestions.length ? "🎉" : correctCount >= quizQuestions.length - 1 ? "⭐" : "📘"}
              </div>

              <div>
                <p className="cvq-section-label">YOUR RESULT</p>
                <h3>
                  You scored {correctCount} out of {quizQuestions.length}
                </h3>

                <p>
                  {correctCount === quizQuestions.length &&
                    "Excellent work! You understand the main differences between classical and quantum programming."}

                  {correctCount === quizQuestions.length - 1 &&
                    "Great job! You have a strong understanding of the lesson."}

                  {correctCount < quizQuestions.length - 1 &&
                    "Good effort. Review the comparisons and try the quiz again."}
                </p>
              </div>

              <button type="button" onClick={resetQuiz}>
                Try again
              </button>
            </div>
          )}
        </section>
        <section className="cvq-further-reading" id="further-reading">
  <div className="cvq-section-heading">
    <p className="cvq-section-label">KEEP EXPLORING</p>
    <h2>Further Readings</h2>
    <p>
      Continue exploring how classical and quantum programming differ
      with these trusted external resources.
    </p>
  </div>

  <div className="cvq-reading-grid">
    <a
      className="cvq-reading-card"
      href="https://quantum.cloud.ibm.com/learning/en/modules/quantum-mechanics/get-started-with-qiskit"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="cvq-reading-card-top">
        <span className="cvq-reading-source">IBM Quantum</span>
        <span className="cvq-reading-level">Beginner</span>
      </div>

      <h3>Get Started with Qiskit</h3>

      <p>
        Learn how Qiskit represents qubits, gates, measurements, and
        quantum circuits while getting an introduction to the quantum
        programming workflow.
      </p>

      <span className="cvq-reading-link">Open resource ↗</span>
    </a>

    <a
      className="cvq-reading-card"
      href="https://learn.microsoft.com/en-us/azure/quantum/hybrid-computing-concepts"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="cvq-reading-card-top">
        <span className="cvq-reading-source">Microsoft Learn</span>
        <span className="cvq-reading-level">Beginner+</span>
      </div>

      <h3>Hybrid Quantum Computing Concepts</h3>

      <p>
        Explore how classical and quantum computers can work together,
        with each type of processor handling the tasks it is best
        suited for.
      </p>

      <span className="cvq-reading-link">Open resource ↗</span>
    </a>

    <a
      className="cvq-reading-card"
      href="https://learn.microsoft.com/en-us/azure/quantum/qsharp-overview"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="cvq-reading-card-top">
        <span className="cvq-reading-source">Microsoft Learn</span>
        <span className="cvq-reading-level">Go Deeper</span>
      </div>

      <h3>Introduction to Quantum Programming with Q#</h3>

      <p>
        See how a language designed for quantum programming represents
        quantum operations and integrates classical and quantum
        computation.
      </p>

      <span className="cvq-reading-link">Open resource ↗</span>
    </a>
  </div>

  <p className="cvq-reading-disclaimer">
    These optional resources are provided by external organizations.
    QuantumPath is not affiliated with or endorsed by these providers.
  </p>
</section>
        {showSummary && (
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

            <a 
              className="next-module-button" 
              href="/modules/3"
            >
              Continue to Module 3
              <span aria-hidden="true">→</span>
            </a>
          </section>
        )}
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