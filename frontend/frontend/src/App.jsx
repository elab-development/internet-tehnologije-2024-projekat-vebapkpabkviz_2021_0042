import "./App.css";
import Scoreboard from "./components/Scoreboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { RegisterPage } from "./components/RegisterPage";
// import { LoginPage } from "./components/LoginPage";
import { QuizEvents } from "./components/QuizEvents";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import { useState } from "react";
import QuestionModal from "./components/QuestionModal";
import Navbar from "./components/NavBar";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/events" element={<QuizEvents />} />
      </Routes>
      <Footer openModal={openModal} />
      {isModalOpen && <QuestionModal closeModal={closeModal} />}
    </BrowserRouter>
  );
}

export default App;