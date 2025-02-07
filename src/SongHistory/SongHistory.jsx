import React, { useEffect, useState } from "react";
import './SongHistory.css'
import CONFIG from "../config";
import { AnimatePresence, motion } from "framer-motion";

const fetchSongHistory = async () => {
    try {
        const now = new Date();

        console.log("Now: " + now);

        const lastHour = new Date(now.getTime() - 120 * 60 * 1000); // Adjust time range as needed

        const start = lastHour.toISOString(); // Convert to ISO 8601 format
        const end = now.toISOString();

        console.log(start + " - " + end);

        const response = await fetch(`${CONFIG.API_RADIO_HISTORY_URL}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, {
            headers: {
                "Authorization": `Bearer ${CONFIG.API_KEY}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching song history: ", error);
        return [];
    }
};

function SongHistory({
    isVisible
}) {
    const [songHistory, setSongHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSongHistory = async () => {
            const history = await fetchSongHistory();
            setSongHistory(history.slice(1, 6));
            setIsLoading(false);
        };

        loadSongHistory();

        const interval = setInterval(loadSongHistory, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div className="song-history-component" 
                            initial={{ x: -300 }} 
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 16 }} >
                        {isLoading ? (
                            <p>Loading...</p>
                            ) : (
                                <ul className="song-list" >
                                    {songHistory.map((entry) => (
                                        <li key={entry.sh_id}>
                                            <div className="track-name"><strong>{entry.song.title}</strong> </div>
                                            <div className="artist-name">{entry.song.artist}</div>  
                                            <div className="label-name">Album: ...</div> 
                                            <div className="year-released">Year of release: ...</div>
                                            {/* Label and Year would be extracted from album and  - now_playing */}
                                        </li>
                                    ))}
                                </ul>
                            )
                        }
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SongHistory;