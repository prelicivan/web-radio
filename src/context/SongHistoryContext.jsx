import { createContext, useContext, useState } from "react";

const SongHistoryContext = createContext();

export const SongHistoryProvider = ({ children }) => {
    const [songHistory, setSongHistory] = useState(false);

    const toggleSongHistory = () => {
        setSongHistory((prev) => !prev);
    };

    const turnOffSongHistory = () => {
        setSongHistory(false);
    }

    return (
        <SongHistoryContext.Provider value={{ songHistory, toggleSongHistory, turnOffSongHistory }}>
            {children}
        </SongHistoryContext.Provider>
    );
};

export const useSongHistory = () => useContext(SongHistoryContext);
