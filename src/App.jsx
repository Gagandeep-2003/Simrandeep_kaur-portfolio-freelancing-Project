import "./App.css";
import { Header, About, Work, Skills, Footer } from "./container";
import {
  Navbar,
  TabSwitcher,
  SpotlightSearch,
  TabTitleChanger,
  CustomCursor,
  ScrollProgress
} from "./components";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import Project from "./components/Projects/Project";
import LoadingAnimation from "./components/LoadingAnimation/LoadingAnimation";
import ShortcutPopup from "./components/ShortcutPopup/ShortcutPopup";
import { useState, useEffect } from "react";

const MainContent = () => {
  const lenis = useLenis(); // Access Lenis instance if needed

  // Define sections for TabSwitcher
  const sections = [
    {
      id: "home",
      title: "Home",
      description: "Welcome to Simrandeep Kaur's portfolio showcasing expertise in plant pathology and sustainable agriculture."
    },
    {
      id: "about",
      title: "About",
      description: "Learn about Simrandeep's background, expertise, and passion for plant health and sustainable agriculture."
    },
    {
      id: "projects",
      title: "Projects",
      description: "Explore Simrandeep's research projects, field studies, and practical applications in plant pathology."
    },
    {
      id: "skills",
      title: "Skills",
      description: "Discover Simrandeep's technical skills, research capabilities, and specialized knowledge in plant sciences."
    },
    {
      id: "contact",
      title: "Contact",
      description: "Get in touch with Simrandeep for consultations, collaborations, or professional inquiries."
    }
  ];

  // Get skills and projects data for SpotlightSearch
  const [skillsData, setSkillsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);

  useEffect(() => {
    // Import skills and projects data
    const fetchData = async () => {
      try {
        const skillsModule = await import('./data/skillsData');
        const projectsModule = await import('./data/projectsData');

        // Check if data is available and set state
        if (skillsModule.default) {
          setSkillsData(skillsModule.default);
        }

        if (projectsModule.default) {
          setProjectsData(projectsModule.default);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <Navbar />
      <TabTitleChanger
        originalTitle="Simrandeep Kaur | Plant Pathologist"
        awayTitle="Missing you! Come back soon 👋"
      />
      <SpotlightSearch
        sections={sections}
        skills={skillsData}
        works={projectsData}
      />
      <TabSwitcher sections={sections} />
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
  const [showShortcutPopup, setShowShortcutPopup] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Show shortcut popup after loading completes
    setShowShortcutPopup(true);
  };

  const handleClosePopup = () => {
    setShowShortcutPopup(false);
  };

  return (
    <>
      <CustomCursor />
      {isLoading ? (
        <LoadingAnimation onComplete={handleLoadingComplete} />
      ) : (
        <>
          <ScrollProgress />
          <ShortcutPopup isVisible={showShortcutPopup} onClose={handleClosePopup} />
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
        </>
      )}
    </>
  );
};

export default App;
