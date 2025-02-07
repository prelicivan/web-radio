import React, { useState, useEffect, useRef } from "react";
import CONFIG from "../config";
import { Howl } from "howler";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa"; 
import './Audio.css'

function Audio() {
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); 

  const [currentTrack, setCurrentTrack] = useState("Loading...");
  const [currentArtist, setcurrentArtist] = useState("Loading...");
  const [currentShow, setCurrentShow] = useState("Loading...");

  // Initialize Howler
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

  const toggleMute = () => {
    if (soundRef.current) {
      const newVolume = isMuted ? 1 : 0;
      soundRef.current.volume(newVolume);
      setIsMuted(!isMuted);
    }
  };

  // Currently playing song 
  useEffect(() => {
      const fetchSong = async () => {
      try {
          const response = await fetch(CONFIG.API_NOW_PLAYING_URL);
          const data = await response.json();

          setCurrentTrack(data[0]?.now_playing.song.title);
          setcurrentArtist(data[0]?.now_playing.song.artist);
          setCurrentShow(data[0]?.now_playing.playlist);
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

      <div className="audio-player">
        <button onClick={togglePlay} className="play-button">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={toggleMute} className="mute-button">
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>

      <div className="song-info-container">
        {/* <div className="current-show">{currentShow}</div> */}
        <div className="current-track">{currentTrack}</div>
        <div className="current-artist">{currentArtist}</div>
      </div>
      
    </div>
  )
}

export default Audio;