import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import Button from "./Button";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const LoginPage = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.get("http://localhost:8000/sanctum/csrf-cookie");
    await axios
      .post("http://localhost:8000/api/login", userData)
      .then((response) => {
        console.log(response.data);

        window.sessionStorage.setItem("auth_token", response.data.access_token);
        window.sessionStorage.setItem("role", response.data.role);
        window.sessionStorage.setItem("userId", response.data.id);

        // Redirect to home page on successful login
        navigate("/home");
      })
      .catch((error) => {
        console.error("Login failed:", error);

        // Update the error state with the error message
        setError("Invalid username or password. Please try again.");
      });
  };

  return (
    <div className="min-h-[84vh] p-6 bg-slate-300">
      <div className="max-w-xl mx-auto p-4 bg-gray-100 rounded-md">
        <h2 className="text-4xl font-bold mb-3">Login</h2>

        {/* Display error message if error is present */}
        {error && <div className="text-red-500 mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
          />
          <div>
            <Button type="submit" text="Login" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
