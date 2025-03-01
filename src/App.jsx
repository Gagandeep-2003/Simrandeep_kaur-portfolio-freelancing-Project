import "./App.css";
import { Header, About, Work, Skills, Footer } from "./container";
import { Navbar } from "./components";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import Project from "./components/Projects/Project";
import LoadingAnimation from "./components/LoadingAnimation/LoadingAnimation";
import { useState, useEffect } from "react";

const MainContent = () => {
  const lenis = useLenis(); // Access Lenis instance if needed

  return (
    <div className="app">
      <Navbar />
      <Header />
      <About />
      <Project />
      <Skills />
      <Footer />
    </div>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingAnimation onComplete={handleLoadingComplete} />
      ) : (
        <ReactLenis
          root
          options={{
            lerp: 0.1,           // Smoothness factor
            duration: 1,         // Animation duration
            smoothWheel: true,   // Enable mouse wheel scrolling
            smoothTouch: true,   // Enable touchpad gestures
            wheelMultiplier: 1,  // Adjust scroll speed
            touchMultiplier: 2,  // Adjust touch speed
          }}
        >
          <MainContent />
        </ReactLenis>
      )}
    </>
  );
};

export default App;
