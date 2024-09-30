import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";



function Content() {
  const { currentUser } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setIsAdmin(currentUser.role === "admin");
      setIsVolunteer(currentUser.role === "volunteer");
      console.log(currentUser.role);
    }
  }, [currentUser]);

  const handleStartOnboarding = async () => {
    if (!currentUser || !currentUser.id) {
      setError("User ID not available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`http://localhost:3001/api/volunteer-tasks/onboarding/${currentUser.id}`);
    } catch (err) {
      console.error("Error starting onboarding:", err);
      setError("Failed to start onboarding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h1>Dashboard Placeholder</h1>
      </div>
      {isAdmin && (
        <Link to="/create-account">
          <button
            className="button-10"
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Create Account
          </button>
        </Link>
      )}
      {isVolunteer && (
        <button
          className="button-10"
          style={{ padding: "10px 20px", fontSize: "16px", marginLeft: "10px" }}
          onClick={handleStartOnboarding}
          disabled={isLoading}
        >
          {isLoading ? "Starting..." : "Start Onboarding"}
        </button>
      )}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </main>
  );
}

export default Content;
