import React, { useState, useEffect, useRef } from "react";
import CONFIG from "../config";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import './Audio.css'
import { Howl } from "howler";

function Audio() {
    const [stationStatus, setStationStatus] = useState("Checking...");
    const [currentSong, setCurrentSong] = useState("Loading...");
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const soundRef = useRef(null);

    // const playerOptions = {
    //     autoplay: false,
    //     controls: ["play"],
    //     loadSprite: true, // Ensures icons load properly
    //     iconUrl: "https://cdn.plyr.io/3.6.8/plyr.svg", // Fallback for missing icons
    //     html5: true, // Forces HTML5 mode
    // };

    useEffect(() => {
      soundRef.current = new Howl({
        src: [CONFIG.API_RADIO_STREAM_URL],
        html5: true, // Force HTML5 mode (required for streaming)
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
          soundRef.current.unload(); // Cleanup on unmount
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

    return (
        <div className="audio-component">
            <div className="station-status" style={{color: stationStatus === "On Air" ? "green" : "red"}}>
                {stationStatus}
            </div>
            <div className="audio-player">
              <button onClick={togglePlay} className="play-button">
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>
            <div className="song-info-container">
                <div className="scrolling-text">{currentSong}</div>
            </div>
        </div>
    )
}

export default Audio;