import React, { useEffect, useState } from "react";
import './Schedule.css'
import CONFIG from "../config";
import { useOutletContext } from "react-router-dom";
import { lineWobble } from 'ldrs'

const getNextSevenDays = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const nextSevenDays = [];

    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        const formattedDate = nextDay.toLocaleDateString('en-GB').replace(/\//g, ".");
        nextSevenDays.push({
            day: daysOfWeek[nextDay.getDay()],
            date: formattedDate,
            timestamp: nextDay.toISOString().split("T")[0], // Format as YYYY-MM-DD for API
        });
    } 

    return nextSevenDays;
}

function Schedule() {
    const [days, setDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [allShows, setAllShows] = useState([]); // Store all data
    const [isLoading, setIsLoading] = useState(true);

    const { songHistory } = useOutletContext();

    lineWobble.register()

    // Select initial day
    useEffect(() => {
        const daysArray = getNextSevenDays();
        setDays(daysArray);
        setSelectedDay(daysArray[0]); // Default to today
    }, []);

    // Fetch and store full schedule when component mounts
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch(CONFIG.API_STATION_SCHEDULE_URL);
                const data = await response.json();
                setAllShows(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching schedule: ", error);
                setAllShows([]);
                setIsLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    // Update schedule when selected day changes
    useEffect(() => {
        if (selectedDay && allShows.length > 0) {
            const filteredSchedule = allShows.filter(show => show.start.substring(0, 10) === selectedDay.timestamp);
            setSchedule(filteredSchedule);
        }
    }, [selectedDay, allShows]);

    const handleDayClick = (day) => {
        setSelectedDay(day);
    }

    return (
        <div className={`schedule-component ${songHistory ? "song-history-active" : ""}`}>
            <div className={`day-selector ${songHistory ? "song-history-active" : ""}`}>
                {days.map((day, index) => (
                    <button key={index} 
                            className={`day-button ${selectedDay && selectedDay.day === day.day ? 'selected' : ''}`} 
                            onClick={() => handleDayClick(day)}>
                        {day.day} {day.date}
                    </button>
                ))}
            </div>
            <div className="schedule-list">
                {isLoading ? (
                    <p className="schedule-no-load">Loading schedule...</p>
                ) : schedule.length > 0 ? (
                    schedule.map((show, index) => (
                        <div key={index} className="schedule-item">
                            <div className="schedule-item-time">
                                {new Date(show.start).getHours()} - {new Date(show.end).getHours()}
                            </div>
                            <div className="schedule-item-name">
                                {show.title}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="schedule-no-load">No scheduled shows for this day</p>
                )}
            </div>
        </div>
    );
}

export default Schedule;
