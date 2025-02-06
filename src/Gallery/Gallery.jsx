import React from "react";
import './Gallery.css'
import { useOutletContext } from "react-router-dom";

function Gallery () {
    const { songHistory } = useOutletContext();

    return (
        <div className={`gallery-component ${songHistory ? "song-history-active" : ""}`}>
             <div className="album-viewer">
              <div className="album-info">
                <div className="album-name">Album Name</div>
                <div className="album-description">
                  Album description album description album description album description
                  album description album description album description album description
                  album description
                </div>
              </div>
              <div className="album-photos">
                {[...Array(9)].map((_, index) => (
                  <div key={index} className="photo"></div>
                ))}
              </div>
            </div>
            <div className="album-search">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="album">Album {index + 1}</div>
              ))}
            </div>
        </div>
      );
}

export default Gallery;