import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import ModulesPage from "./ModulesPage";
import IntroModule from "./IntroModule";
import ClassicalVsQuantumModule from "./ClassicalVsQuantumModule";
import QuantumGatesModule from "./QuantumGatesModule";
import QuantumCircuitsModule from "./QuantumCircuitsModule";
import EntanglementModule from "./EntanglementModule";
import ProgressPage from "./ProgressPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/modules/1" element={<IntroModule />} />
        <Route path="/modules/2" element={<ClassicalVsQuantumModule />} />
        <Route path="/modules/3" element={<QuantumGatesModule />} />
        <Route path="/modules/4" element={<QuantumCircuitsModule />} />
        <Route path="/modules/5" element={<EntanglementModule />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;