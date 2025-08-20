import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import Button from "./Button";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  });

  const [errors, setErrors] = useState({});

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
      .post("http://localhost:8000/api/register", userData)
      .then((response) => {
        console.log(response.data);
        if (response.data.access_token) {
          window.sessionStorage.setItem(
            "auth_token",
            response.data.access_token
          );
          window.sessionStorage.setItem("role", "contestant");
          window.sessionStorage.setItem("userId", response.data.data.id);
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Registration failed:", error);

        if (error.response && error.response.data) {
          // If the response contains validation errors
          setErrors(error.response.data);
        } else {
          // If there is a generic error
          setErrors({ generic: "Registration failed. Please try again." });
        }
      });
  };

  return (
    <div className="min-h-[84vh] p-6 bg-slate-300">
      <div className="max-w-xl mx-auto p-4 bg-gray-100 rounded-md">
        <h2 className="text-4xl font-bold mb-3">Register</h2>

        {/* Display validation errors if present */}
        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 mb-3">
            {Object.keys(errors).map((field) => (
              <div key={field}>
                {errors[field].map((errorMessage) => (
                  <div key={errorMessage}>{errorMessage}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
          <InputField
            label="Full name"
            type="text"
            name="full_name"
            value={userData.full_name}
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
            <Button type="submit" text="Register" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
