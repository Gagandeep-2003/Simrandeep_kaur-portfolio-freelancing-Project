
import React, { useEffect } from 'react';
import ContextCursor from './ContextCursor.jsx';

const CustomCursor = () => {
  // Using the context-cursor-master implementation with smooth scroll animation

  useEffect(() => {
    // Find all interactive elements that should have cursor effects
    const addCursorEffects = () => {
      // Add data-ccursor attribute to buttons, links, and other interactive elements
      const buttons = document.querySelectorAll('button, .app__footer-card, .app__work-item, .app__skills-item, .app__about-profile, .search-result-item, .shortcut-item, .spotlight-shortcut-button, .ai-submit-button, .spotlight-search-container button, .shortcut-popup-container button');
      buttons.forEach(button => {
        if (!button.hasAttribute('data-ccursor')) {
          button.setAttribute('data-ccursor', 'lift');
        }
      });

      const links = document.querySelectorAll('a, .app__navbar-links li, .spotlight-search-input, .keyboard-shortcut, .spotlight-search-container, .shortcut-popup-container, .spotlight-search-overlay, .shortcut-popup-overlay');
      links.forEach(link => {
        if (!link.hasAttribute('data-ccursor')) {
          link.setAttribute('data-ccursor', '');
        }
      });

      // Add specific handling for the spotlight search and shortcut popup containers
      const overlays = document.querySelectorAll('.spotlight-search-overlay, .shortcut-popup-overlay');
      overlays.forEach(overlay => {
        if (!overlay.hasAttribute('data-ccursor')) {
          overlay.setAttribute('data-ccursor', 'noParallax');
        }
      });
    };

    // Run initially and after content loads
    addCursorEffects();
    window.addEventListener('load', addCursorEffects);

    return () => {
      window.removeEventListener('load', addCursorEffects);
    };
  }, []);

  return (
    <ContextCursor
      radius={16}
      transitionSpeed={0.8}
      parallaxIndex={15}
      hoverPadding={6}
    />
  );
};

export default CustomCursor;
