import React, { useState, useEffect, useRef } from "react";
import CONFIG from "../config";
import { Howl } from "howler";
import { FaPlay, FaPause, FaCircle } from "react-icons/fa";
import './Audio.css'
import { Link } from "react-router-dom";

function Audio() {
  const [stationStatus, setStationStatus] = useState("Checking...");
  const [currentSong, setCurrentSong] = useState("Loading...");
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState("Loading...");
  const [currentArtist, setcurrentArtist] = useState("Loading...");

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

          setCurrentTrack(data[0]?.now_playing.song.title);
          setcurrentArtist(data[0]?.now_playing.song.artist);

          // console.log("Song track: " + currentTrack);
          // console.log("Song artist: " + currentArtist);
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
        <Link to="/">
          <div className="radio">Radio</div>
          <div className="dzungla">Džungla</div>       
        </Link>
      </div>
      <div className="audio-player">
        <button onClick={togglePlay} className="play-button">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className="song-info-container">
        <div className="current-track">{currentTrack}</div>
        <div className="current-artist">{currentArtist}</div>
      </div>
    </div>
  )
}

export default Audio;