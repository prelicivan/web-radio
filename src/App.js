import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Schedule from "./Schedule/Schedule";
import Gallery from "./Gallery/Gallery";
import Contact from "./Contact/Contact";
import { SongHistoryProvider } from "./context/SongHistoryContext";

function App() {
  return (
    <Router>
      <SongHistoryProvider>
        <Routes>
            <Route path="/" element={<Home />}>
              <Route path="schedule" element={<Schedule />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
            </Route>
        </Routes>
      </SongHistoryProvider>
    </Router>
  );
}

export default App;