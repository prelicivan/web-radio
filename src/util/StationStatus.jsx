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
