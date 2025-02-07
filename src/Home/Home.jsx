import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import './Home.css'
import Navbar from "../Navbar/Navbar";
import SongHistory from "../SongHistory/SongHistory";
import Schedule from "../Schedule/Schedule";
import Gallery from "../Gallery/Gallery";
import Contact from "../Contact/Contact";
import { useSongHistory } from "../context/SongHistoryContext";

function Home() {
    const { songHistory, toggleSongHistory, turnOffSongHistory } = useSongHistory();

    return (
            <div className="home">
                <Navbar toggleSongHistory={toggleSongHistory} turnOffSongHistory={turnOffSongHistory} />
                <div className="main-content">
                    <SongHistory isVisible={songHistory} />
                    <Outlet context={{ songHistory }}/>
                </div>
            </div>
    )
}

export default Home;