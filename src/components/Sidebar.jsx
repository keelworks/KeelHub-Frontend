import React from "react";
import {
  BsFillHouseDoorFill,
  BsFillPersonPlusFill,
  BsFillPeopleFill,
} from "react-icons/bs";
import logo from "../assets/logo.png"
import "../assets/sidebar.css";

function Sidebar() {
  return (
    <aside id="sidebar">
      <div className="sidebar-title">
        <div className="sidebar-brand">
        <img src={logo} alt="KeelHub Logo" className="logo" />
        KeelHub
        </div>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <a href="">
            <BsFillHouseDoorFill className="icon" /> Home
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="">
            <BsFillPersonPlusFill className="icon" /> Onboarding
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="">
            <BsFillPeopleFill className="icon" /> Volunteers
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
