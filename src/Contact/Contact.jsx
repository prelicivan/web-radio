import React from "react";
import './Contact.css'
import { useOutletContext } from "react-router-dom";

function Contact () {
    const { songHistory } = useOutletContext();

    return (
        <div className={`contact-component ${songHistory ? "song-history-active" : ""}`}>
            <div className="left-side-container">
                <div className="big-logo">
                        <h3>RADIO</h3>
                        <h1>DŽUNGLA</h1>
                </div>
                <div className="contact-info">
                    <div className="email">
                        Email: dzungla@radio.rs
                    </div>
                    <div className="address">
                        Address: Beograd, Srbija
                    </div>
                    <div className="social-media">
                        <a>Instagram</a>
                        <a>Youtube</a>
                        <a>Soundcloud</a>
                    </div>
                </div>
            </div>
            <div className="about-us">
                <div className="title">About Us</div>
                <div className="text">
                    <p>
                        Text text text text text text text text text text text text text text text text text text text text 
                    </p>
                    <p>
                        Text text text text text text text text text text text text text text text text text text text text 
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Contact;