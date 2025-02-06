import React from "react";
import './Gallery.css'
import { useOutletContext } from "react-router-dom";

function Gallery () {
    const { songHistory } = useOutletContext();

    return (
        <div className={`gallery-component ${songHistory ? "song-history-active" : ""}`}>
            
        </div>
    )
}

export default Gallery;