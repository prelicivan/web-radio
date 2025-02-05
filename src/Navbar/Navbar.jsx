import React from "react";
import "./Navbar.css"
import Audio from "../Audio/Audio";

function Navbar({
  toggleSongHistory
}) {
  return (
    <div className="navbar-component">
        <Audio />
        <div className="nav-items">
          <div className="nav-item">
            <button onClick={toggleSongHistory}>
              Song History
            </button>
          </div>
          <div className="nav-item">
            Schedule
          </div>
          <div className="nav-item">
            Gallery
          </div>
          <div className="nav-item">
            Contact
          </div>
        </div>
    </div>
  );
}

export default Navbar;
