import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import useBurgerMenu from "./useBurgerMenu"; // Import the custom hook

const Navbar = ({ handleStorageLogout }) => {
  const { isOpen, toggleMenu } = useBurgerMenu(false); // Use the custom hook
  let navigate = useNavigate();

  const handleLogout = () => {
    let config = {
      method: "post",
      url: "http://127.0.0.1:8000/api/logout",
      headers: {
        Authorization: "Bearer " + window.sessionStorage.getItem("auth_token"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        handleStorageLogout();
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-sky-700 p-6 min-h-[10vh]">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link to="/home">
          <span className="font-semibold text-xl tracking-tight">FE pub</span>
        </Link>
      </div>
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-white border-white hover:text-gray-200 hover:border-gray-200"
          onClick={toggleMenu}
        >
          {isOpen ? <IoMdClose /> : <RxHamburgerMenu />}
        </button>
      </div>
      <div
        className={`w-full ${
          isOpen ? "block" : "hidden"
        } lg:flex lg:items-center lg:w-auto`}
      >
        <div className="text-sm lg:flex-grow">
          {(window.sessionStorage.getItem("role") === "admin" ||
            window.sessionStorage.getItem("role") === "moderator" ||
            window.sessionStorage.getItem("role") === "contestant") &&
          window.sessionStorage.getItem("auth_token") !== null ? (
            <>
              <button
                onClick={handleLogout}
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4"
              >
                Register
              </Link>
            </>
          )}
          <Link
            to="/scoreboard"
            className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200 mr-4"
          >
            Scoreboard
          </Link>
          <Link
            to="/events"
            className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-200"
          >
            Events
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
