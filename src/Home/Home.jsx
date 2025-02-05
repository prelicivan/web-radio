import React, { useState } from "react";
import './Home.css'
import Navbar from "../Navbar/Navbar";
import SongHistory from "../SongHistory/SongHistory";
import { motion } from "framer-motion";

function Home() {
    const [songHistory, setSongHistory] = useState(false);

    const toggleSongHistory = () => {
        if (songHistory) {
            setSongHistory(false);
        } else {
            setSongHistory(true);
        }
    }

    return (
        <div className="home">
            <Navbar toggleSongHistory={toggleSongHistory} />
            <SongHistory isVisible={songHistory} />
        </div>
    )
}

export default Home;