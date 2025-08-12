import "./App.css";
import Scoreboard from "./components/Scoreboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import QuizEvents from "./components/QuizEvents";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import { useState } from "react";
import QuestionModal from "./components/QuestionModal";
import Navbar from "./components/NavBar";
import MyTeamPage from "./components/MyTeamPage";
import ManagePage from "./components/ManagePage";
import FlagModal from "./components/FlagModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);

  const openFlagModal = () => {
    setIsFlagModalOpen(true);
  };

  const closeFlagModal = () => {
    setIsFlagModalOpen(false);
  };

  const handleStorageLogout = () => {
    window.sessionStorage.setItem("auth_token", null);
    window.sessionStorage.setItem("role", null);
    window.sessionStorage.setItem("userId", null);
  };

  return (
    <BrowserRouter className="App">
      <Navbar handleStorageLogout={handleStorageLogout} />
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/home" replace={true} />}
        ></Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/myteam" element={<MyTeamPage />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/events" element={<QuizEvents />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
      <Footer openModal={openModal} openFlagModal={openFlagModal} />
      {isModalOpen && <QuestionModal closeModal={closeModal} />}
      {isFlagModalOpen && <FlagModal closeModal={closeFlagModal} />}
    </BrowserRouter>
  );
}

export default App;