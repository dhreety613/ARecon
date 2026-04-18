import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import Missions from "./pages/Missions";
import LiveMission from "./pages/LiveMission";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/live" element={<LiveMission />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;