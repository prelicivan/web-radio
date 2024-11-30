import React, { useState, useEffect } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import "./playerStyles.css"
import CONFIG from "../config";

function AudioPlayer() {
  const [currentSong, setCurrentSong] = useState("Loading...");
  const [volume, setVolume] = useState(1);

  const playerOptions = {
    autoplay: false,
    controls: ["play"],
  };

  // Fetch the current song name from AzuraCast API
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch(
          CONFIG.API_NOW_PLAYING_URL
        );
        const data = await response.json();
        setCurrentSong(
          `${data[0]?.now_playing.song.title} - ${data[0]?.now_playing.song.artist}`
        );
      } catch (error) {
        console.error("Error fetching song:", error);
      }
    };

    fetchSong();
    const interval = setInterval(fetchSong, 10000); // Update every 10 seconds

    return () => clearInterval(interval); // Clean up interval
  }, []);

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "left",
          gap: "20px", // Space between elements
          backgroundColor: "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        {/* Plyr Player */}
        <div className="audio-player"> 
          <Plyr
            source={{
              type: "audio",
              sources: [
                {
                  src: CONFIG.API_RADIO_STREAM_URL,
                  type: "audio/mpeg",
                },
              ],
            }}
            options={playerOptions}
          />
        </div>

        {/* Volume Control */}
        <div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              setVolume(e.target.value);
              const plyrInstance = document.querySelector(".plyr").plyr;
              if (plyrInstance) {
                plyrInstance.volume = e.target.value;
              }
            }}
            style={{ width: "150px", verticalAlign: "-webkit-baseline-middle" }}
          />
        </div>

        {/* Song Name */}
        <div style={{ fontSize: 30, verticalAlign: "-webkit-baseline-middle"}}>{currentSong}</div>
      </header>
      <h1>Ovo je radio?</h1>
    </div>
  );
}

export default AudioPlayer;
