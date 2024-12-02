import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Pages
import Home from "./Pages/HomePage/Home";
import NotFound from "./Pages/ErrorPages/NotFound/NotFound";


function App() {
  return (
    <Router>
      <Routes>
        {/*TO DO napraviti višestruke rute na istu komponentu na bolji nacin*/}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home.html" element={<Home />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
