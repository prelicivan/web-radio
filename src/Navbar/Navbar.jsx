import React, { useState, useEffect, useRef } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import CONFIG from "../config";
import "./Navbar.css"
import Audio from "../Audio/Audio";

function Navbar() {
  return (
    <div className="navbar-component">
        <Audio />
    </div>
  );
}

export default Navbar;
