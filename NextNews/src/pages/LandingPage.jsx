import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <Features />
      <AboutUs/>
      <ContactUs/>
    </>
  );
};

export default LandingPage;