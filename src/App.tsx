// Importaciones de librerías
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

// Importar el contexto de autenticación
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoutes from "./ProtectedRoutes";

// Importar los componentes de la aplicación
import WelcomeScreen from "./pages/WelcomeScreen";
import SignupScreen from "./pages/SignupScreen";
import GameDashboard from "./pages/GameDashboard";
import CharacterSelection from "./pages/CharacterSelection";
import Tutorial from "./pages/tutorialScreen";
import Store from "./pages/Store";
import Leaderboard from "./pages/Leaderboard";


// Importar los componentes de los niveles
import Nivel1 from "./components/mundoUno/Nivel1";
import Nivel2 from "./components/mundoUno/Nivel2";
import Nivel3 from "./components/mundoUno/Nivel3";
import Nivel4 from "./components/mundoUno/Nivel4";
import Ninvel5 from "./components/mundoUno/Nivel5";
import Nivel6 from "./components/mundoUno/Nivel6";
import Nivel7 from "./components/mundoDos/Nivel7";
import Nivel8 from "./components/mundoDos/Nivel8";
import Nivel9 from "./components/mundoDos/Nivel9";
import Nivel10 from "./components/mundoDos/Nivel10";
import Nivel11 from "./components/mundoDos/Nivel11";
import Nivel12 from "./components/mundoDos/Nivel12";
import Nivel13 from "./components/mundoTres/Nivel13";
import Nivel14 from "./components/mundoTres/Nivel14";
import Nivel15 from "./components/mundoTres/Nivel15";
import Nivel16 from "./components/mundoTres/Nivel16";
import Nivel17 from "./components/mundoTres/Nivel17";
import Nivel18 from "./components/mundoTres/Nivel18";
import Nivel19 from "./components/mundoCuatro/Nivel19";
import Nivel20 from "./components/mundoCuatro/Nivel20";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename="/classCraft2.0">
        <Routes>
          {/* Ruta para la pantalla de inicio */}
          <Route path="/login" element={<WelcomeScreen />} />
          {/* Ruta para la pantalla de registro */}
          <Route path="/signup" element={<SignupScreen />} />

          <Route element={<ProtectedRoutes />}>
            {/* Ruta para el dashboard del juego */}
            <Route path="/dashboard" element={<GameDashboard />} />
            {/* Ruta para el dashboard del juego */}
            <Route
              path="/character-selection"
              element={<CharacterSelection />}
            />
            {/* Ruta para el dashboard del juego */}
            <Route path="/tutorial" element={<Tutorial/>} />
            {/* Ruta para el dashboard del juego */}
            <Route path="/store" element={<Store />} />
            {/* Ruta para el dashboard del juego */}
            <Route path="/leaderboard" element={<Leaderboard />} />
            {/*Nivel 1*/}
            <Route path="/nivel1" element={<Nivel1 />} />
            {/*Nivel 2*/}
            <Route path="/nivel2" element={<Nivel2 />} />
            {/*Nivel 3*/}
            <Route path="/nivel3" element={<Nivel3 />} />
            {/*Nivel 4*/}
            <Route path="/nivel4" element={<Nivel4 />} />
            {/*Nivel 5*/}
            <Route path="/nivel5" element={<Ninvel5 />} />
            {/*Nivel 6*/}
            <Route path="/nivel6" element={<Nivel6 />} />
            {/*Nivel 7*/}
            <Route path="/nivel7" element={<Nivel7 />} />
            {/*Nivel 8*/}
            <Route path="/nivel8" element={<Nivel8 />} />
            {/*Nivel 9*/}
            <Route path="/nivel9" element={<Nivel9 />} />
            {/*Nivel 10*/}
            <Route path="/nivel10" element={<Nivel10 />} />
            {/*Nivel 11*/}
            <Route path="/nivel11" element={<Nivel11 />} />
            {/*Nivel 12*/}
            <Route path="/nivel12" element={<Nivel12 />} />
            {/*Nivel 13*/}
            <Route path="/nivel13" element={<Nivel13 />} />
            {/*Nivel 14*/}
            <Route path="/nivel14" element={<Nivel14 />} />
            {/*Nivel 15*/}
            <Route path="/nivel15" element={<Nivel15 />} />
            {/*Nivel 16*/}
            <Route path="/nivel16" element={<Nivel16 />} />
            {/*Nivel 17*/}
            <Route path="/nivel17" element={<Nivel17 />} />
            {/*Nivel 18*/}
            <Route path="/nivel18" element={<Nivel18 />} />
            {/*Nivel 19*/}
            <Route path="/nivel19" element={<Nivel19 />} />
            {/*Nivel 20*/}
            <Route path="/nivel20" element={<Nivel20 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
