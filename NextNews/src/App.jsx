import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import CustomizeAvatar from "./pages/CustomizeAvatar"; // Import new page
import AnchorPage from "./pages/AnchorPage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/Contactus";

export default function App() {
  return (
    <Router>
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-fuchsia-950 min-h-screen text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<HomePage />} />
          <Route path="/demo/anchor" element={<AnchorPage/>} />
          <Route path="/demo/anchor/customize" element={<CustomizeAvatar />} />
        </Routes>
        <AboutUs/>
        <ContactUs/>
        
      </div>
    </Router>
  );
}
