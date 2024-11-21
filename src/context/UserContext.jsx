import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse stored user", e);
      return null;
    }
  });

  const login = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const updateUserProfilePic = (newProfilePicUrl, newProfilePicType) => {
    const updatedUser = {
      ...currentUser,
      profile_pic: newProfilePicUrl,
      profile_pic_type: newProfilePicType
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  const updateUserField = (field, value) => {
    const updatedUser = {
      ...currentUser,
      [field]: value
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        currentUser,
        login,
        logout,
        setCurrentUser,
        updateUserProfilePic,
        updateUserField
      }}
    >
      {children}
    </UserContext.Provider>
  );
};