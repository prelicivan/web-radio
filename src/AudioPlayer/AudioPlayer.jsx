import React, { useState, useEffect, useRef } from "react";

function AudioPlayer() {
  const audioRef = useRef(null); // To control the audio element
  const [playing, setPlaying] = useState(false); // Track if it's playing
  const [volume, setVolume] = useState(1); // Volume state
  const [currentSong, setCurrentSong] = useState("Loading..."); // Current song title

  // Play/Pause toggle
  const togglePlay = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing); // Flip the playing state
  };

  // Fetch the current song name from AzuraCast API
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch("https://localhost/public/white_noise_radio/api/nowplaying");
        const data = await response.json();
        setCurrentSong(data[0].now_playing.song.title); // Adjust index for your station
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
      <h1>My Web Radio</h1>
      <h2>Now Playing: {currentSong}</h2>

      <audio
        ref={audioRef}
        src="https://localhost:8000/radio.mp3"
        onEnded={() => setPlaying(false)} // Stop playing state when the track ends
      />

      <div>
        <button onClick={togglePlay}>
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <div>
        <label>Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => {
            setVolume(e.target.value);
            audioRef.current.volume = e.target.value; // Update volume on change
          }}
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
