import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import SignupScreen from "./components/SignupScreen";
import GameDashboard from "./components/GameDashboard";
import GameScreen from "./components/GameScreen";
import CharacterSelection from "./components/CharacterSelection";
import Tutorial from "./components/tutorialScreen";
import Store from "./components/Store";
import Leaderboard from "./components/Leaderboard";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para la pantalla de inicio */}
        <Route path="/" element={<WelcomeScreen />} />
        {/* Ruta para la pantalla de registro */}
        <Route path="/signup" element={<SignupScreen />} />
        {/* Ruta para el dashboard del juego */}
        <Route path="/dashboard" element={<GameDashboard />} />
        {/* Ruta para el dashboard del juego */}
        <Route path="/game-screen" element={<GameScreen/>} />
        {/* Ruta para el dashboard del juego */}
        <Route path="/character-selection" element={<CharacterSelection/>} />
        {/* Ruta para el dashboard del juego */}
        <Route path="/tutorial" element={<Tutorial/>} />
        {/* Ruta para el dashboard del juego */}
        <Route path="/store" element={<Store/>} />
        {/* Ruta para el dashboard del juego */}
        <Route path="/leaderboard" element={<Leaderboard/>} />
      </Routes>
    </Router>
  );
};

export default App;
