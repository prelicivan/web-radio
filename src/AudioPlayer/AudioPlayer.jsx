import React, { useState, useEffect, useRef } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import CONFIG from "../config";
import "./AudioPlayer.css"

function AudioPlayer() {
  const [stationStatus, setStationStatus] = useState("Checking...");
  const [currentSong, setCurrentSong] = useState("Loading...");
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [volume, setVolume] = useState(1);
  const playerRef = useRef(null);

  const playerOptions = {
    autoplay: false,
    controls: ["play"],
    loadSprite: true, // Ensures icons load properly
    iconUrl: "https://cdn.plyr.io/3.6.8/plyr.svg", // Fallback for missing icons
    html5: true, // Forces HTML5 mode
  };

  // Check station stream status
  useEffect(() => {
    const checkStationStatus = async () => {
      try {
        const response = await fetch(CONFIG.API_RADIO_STREAM_URL, { method: "HEAD" });
        setStationStatus(response.ok ? "On Air" : "Offline");
      } catch (error) {
        console.error("Error checking station status:", error);
        setStationStatus("Offline");
      }
    };

    checkStationStatus();
    const interval = setInterval(checkStationStatus, 10000); 
    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch(CONFIG.API_NOW_PLAYING_URL);
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

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000); // Update every minute

    return () => clearInterval(clockInterval); // Clean up clock interval
  }, []);

  // Update Plyr's volume directly using ref
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (playerRef.current?.plyr) {
      playerRef.current.plyr.volume = newVolume;
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <header className="header">
        <div className="left-section">
          <div className="audio-player">
            <Plyr
              ref={playerRef}
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
              crossOrigin="anonymous"
            />
          </div>

          <div className="song-info-container">
            <div className="scrolling-text">{currentSong}</div>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-control"
          />
        </div>

        <div className="right-section">         
         <div className="station-status" 
              style={{
                color: stationStatus === "On Air" ? "green" : "red",
              }} 
          >
            {stationStatus}
          </div>
          <div className="time">{time}</div>
        </div>
      </header>
    </div>
  );
}

export default AudioPlayer;
