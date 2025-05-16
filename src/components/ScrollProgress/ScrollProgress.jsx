import React, { useState, useEffect, useCallback } from 'react';
import './ScrollProgress.css';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSection, setCurrentSection] = useState('');

  // Calculate scroll progress and determine current section
  const calculateScrollProgress = useCallback(() => {
    // Get the total scrollable height (total document height minus viewport height)
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Get current scroll position
    const scrollPosition = window.scrollY;

    // Calculate percentage scrolled
    const percentage = Math.round((scrollPosition / totalHeight) * 100);

    // Update state
    setScrollProgress(percentage);

    // Show the progress bar only after scrolling a bit
    setIsVisible(scrollPosition > 100);

    // Determine current section
    const sections = document.querySelectorAll('section[id], div[id="home"], div[id="about"], div[id="projects"], div[id="skills"], div[id="contact"]');

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();

      // If the section is in view
      if (rect.top <= 100) {
        setCurrentSection(section.id);
        break;
      }
    }
  }, []);

  // Handle scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle click on the progress bar
  const handleProgressBarClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = (clickPosition / rect.width) * 100;

    // Calculate the scroll position based on the percentage
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = (percentage / 100) * totalHeight;

    // Scroll to the position
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  };

  // Calculate scroll progress
  useEffect(() => {
    // Add scroll event listener
    window.addEventListener('scroll', calculateScrollProgress);

    // Initial calculation
    calculateScrollProgress();

    // Cleanup
    return () => window.removeEventListener('scroll', calculateScrollProgress);
  }, [calculateScrollProgress]);

  return (
    <div
      className={`scroll-progress-container ${isVisible ? 'visible' : ''} ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => {
        setShowTooltip(true);
        setIsExpanded(true);
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
        setIsExpanded(false);
      }}
      onClick={handleProgressBarClick}
    >
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {showTooltip && (
        <div className="scroll-progress-tooltip">
          {scrollProgress}% scrolled
          {currentSection && (
            <span className="current-section">
              Current section: <strong>{currentSection}</strong>
            </span>
          )}
        </div>
      )}

      <div
        className={`scroll-progress-marker ${isExpanded ? 'expanded' : ''}`}
        style={{ left: `${scrollProgress}%` }}
        onClick={(e) => {
          e.stopPropagation();
          handleScrollToTop();
        }}
      >
        <div className="scroll-progress-percentage">{scrollProgress}%</div>
        <div className="scroll-to-top-icon">↑</div>
      </div>
    </div>
  );
};

export default ScrollProgress;
