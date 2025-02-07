import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"
import Audio from "../Audio/Audio";

function Navbar({
  toggleSongHistory,
  turnOffSongHistory
}) {
  return (
    <div className="navbar-component">
      <div className="navbar-left-container">
          <div className="radio-logo">
              <Link to="/" onClick={turnOffSongHistory}>
                <div className="radio">Radio</div>
                <div className="dzungla">Džungla</div>       
              </Link>
            </div>
          <Audio />
        </div>
        <div className="nav-items">
          <div className="nav-item">
            <button onClick={toggleSongHistory}>
              Song History
            </button>
          </div>
          <div className="nav-item">
            <Link to="/schedule">Schedule</Link>
          </div>
          <div className="nav-item">
            <Link to="/gallery">Gallery</Link>
          </div>
          <div className="nav-item">
            <Link to="/contact">Contact</Link>
          </div>
        </div>
    </div>
  );
}

export default Navbar;
