
import React, { useEffect } from 'react';
import ContextCursor from './ContextCursor.jsx';

const CustomCursor = () => {
  // Using the context-cursor-master implementation with smooth scroll animation

  useEffect(() => {
    // Find all interactive elements that should have cursor effects
    const addCursorEffects = () => {
      // Add data-ccursor attribute to buttons, links, and other interactive elements
      const buttons = document.querySelectorAll('button, .app__footer-card, .app__work-item, .app__skills-item, .app__about-profile, .search-result-item, .shortcut-item, .spotlight-shortcut-button, .ai-submit-button');
      buttons.forEach(button => {
        if (!button.hasAttribute('data-ccursor')) {
          button.setAttribute('data-ccursor', 'lift');
        }
      });

      const links = document.querySelectorAll('a, .app__navbar-links li, .spotlight-search-input, .keyboard-shortcut');
      links.forEach(link => {
        if (!link.hasAttribute('data-ccursor')) {
          link.setAttribute('data-ccursor', '');
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
