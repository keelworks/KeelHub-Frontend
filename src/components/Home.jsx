import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../assets/home.css';

const Home = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>KeelHub</h1>
      <p>
        Welcome to KeelHub! Streamlining volunteer management for the KeelWorks
        Foundation.
      </p>
      {localStorage.getItem("token") ? (
        <div>
          <button
            onClick={() => {
              handleLogout();
            }}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Logout
          </button>
          <Link to="/create-account">
            <button style={{ padding: "10px 20px", fontSize: "16px" }}>
              Create Account
            </button>
          </Link>
        </div>
      ) : (
        <Link to="/login">
          <button style={{ padding: "10px 20px", fontSize: "16px" }}>
            Login
          </button>
        </Link>
      )}
    </div>
  );
};

export default Home;
