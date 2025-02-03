import React, { useState, useEffect, useRef } from "react";
import CONFIG from "../config";
import { Howl } from "howler";
import { FaPlay, FaPause, FaCircle } from "react-icons/fa";
import './Audio.css'

function Audio() {
  const [stationStatus, setStationStatus] = useState("Checking...");
  const [currentSong, setCurrentSong] = useState("Loading...");
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [CONFIG.API_RADIO_STREAM_URL],
      html5: true, 
      format: ["mp3"],
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onerror: (error) => {
        console.error("Audio error:", error);
        setStationStatus("Offline");
      },
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload(); 
      }
    };
  }, []);
  
  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  useEffect(() => {
    const checkStationStatus = async () => {
        try {
            const response = await fetch(CONFIG.API_RADIO_STREAM_URL, { method: "GET" });
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

  return (
    <div className="audio-component">
      <div className="radio-logo">
        <div className="radio" style={{fontSize: 15, fontWeight: 50}}>Radio</div>
        <div className="dzungla" style={{fontSize: 20, fontWeight: 1000}}>Dzungla</div>       
      </div>
      <div className="audio-player">
        <button onClick={togglePlay} className="play-button">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className="song-info-container">
          <div className="scrolling-text">{currentSong}</div>
      </div>
      <div className="station-status" style={{color: stationStatus === "On Air" ? "green" : "red"}}>
          <FaCircle />
      </div>
    </div>
  )
}

export default Audio;