import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import { useAuth } from "./contexts/AuthContext";
import EventPage from "./pages/EventPage";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import SignUpPage from "./pages/SignUpPage";
import VenuePage from "./pages/VenuePage";
import DashboardPage from "./pages/DashboardPage";
import { useEventContext } from "./contexts/EventContext";
import Loading from "./components/Loading";

function App() {
  const [eventFormActive, setEventFormActive] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const { loading } = useEventContext();

  return (
    <>
      {loading && <Loading />}
      <Nav eventFormActive={eventFormActive} mapLoaded={mapLoaded} />
      <Routes>
        <Route path="/" element={<MapPage eventFormActive={eventFormActive} setEventFormActive={setEventFormActive} setMapLoaded={setMapLoaded} />} />
        {currentUser && <Route path="/Dashboard" element={<DashboardPage />} />}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/venue-event/:id" element={<EventPage />} />
        <Route path="/venue/:id" element={<VenuePage />} />
      </Routes>
    </>
  );
}
export default App;
