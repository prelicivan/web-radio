import React, { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import CONFIG from "../config";
import "./AudioPlayer.css";

function AudioPlayer() {
  const [stationStatus, setStationStatus] = useState("Checking...");
  const [currentSong, setCurrentSong] = useState("Loading...");
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Initialize Howler instance
  useEffect(() => {
    audioRef.current = new Howl({
      src: [CONFIG.API_RADIO_STREAM_URL],
      format: ["mp3"],
      html5: true, // Enable HTML5 mode for better stream handling
      volume: volume,
      onloaderror: (id, error) => console.error("Load error:", error),
      onplayerror: (id, error) => {
        console.error("Play error:", error);
        audioRef.current.once("unlock", () => audioRef.current.play());
      },
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.unload();
      }
    };
  }, [volume]);

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
    const interval = setInterval(fetchSong, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume(newVolume);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <header className="header">
        <div className="left-section">
          <div className="audio-player">
            <button className="play-pause-button" onClick={togglePlay}>
              {isPlaying ? "Pause" : "Play"}
            </button>
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
          <div
            className="station-status"
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
