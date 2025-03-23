import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './ShortcutPopup.css';

const ShortcutPopup = ({ isVisible, onClose }) => {
  const popupRef = useRef(null);
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(100);
  const initialDuration = 4; // seconds before auto-close (reduced from 8 to 4)
  const timerRef = useRef(null);
  
  // Reset refs array for shortcut items
  itemsRef.current = [];
  
  // Add to refs array for animation targeting
  const addToRefs = (el) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  useEffect(() => {
    if (isVisible && containerRef.current) {
      // Create a timeline for popup entrance
      const tl = gsap.timeline();
      
      // Animate the container
      tl.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 }, // Change x to y for bottom entrance
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
      
      // Animate each shortcut item
      tl.fromTo(
        itemsRef.current,
        { opacity: 0, x: 20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.3, 
          stagger: 0.1, 
          ease: "power2.out" 
        },
        "-=0.2"
      );

      // Start progress bar animation
      setProgress(100);
      let startTime = Date.now();
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Set up timer to update progress bar
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, 100 - (elapsed / initialDuration) * 100);
        setProgress(remaining);
        
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          onClose();
        }
      }, 50);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="shortcut-popup-container corner-popup" ref={containerRef}>
      <div className="shortcut-popup-header">
        <h3>Keyboard Shortcuts</h3>
        <button className="shortcut-popup-close" onClick={onClose}>×</button>
      </div>
      <div className="shortcut-popup-content">
        <div className="shortcut-item" ref={addToRefs}>
          <div className="shortcut-item-inner">
            <div className="shortcut-icon">⌨️</div>
            <div className="shortcut-info">
              <div className="shortcut-keys">
                <span className="keyboard-shortcut">Ctrl</span> + <span className="keyboard-shortcut">Q</span>
              </div>
              <div className="shortcut-description">Open Tab Switcher to navigate between sections</div>
            </div>
          </div>
        </div>
        
        <div className="shortcut-item" ref={addToRefs}>
          <div className="shortcut-item-inner">
            <div className="shortcut-icon">🔍</div>
            <div className="shortcut-info">
              <div className="shortcut-keys">
                <span className="keyboard-shortcut">Ctrl</span> + <span className="keyboard-shortcut">Space</span>
              </div>
              <div className="shortcut-description">Open Spotlight Search for quick navigation</div>
            </div>
          </div>
        </div>
        
        <div className="shortcut-item" ref={addToRefs}>
          <div className="shortcut-item-inner">
            <div className="shortcut-icon">🤖</div>
            <div className="shortcut-info">
              <div className="shortcut-keys">
                <span className="keyboard-shortcut">@</span> + query
              </div>
              <div className="shortcut-description">Ask AI assistant within spotlight search</div>
            </div>
          </div>
        </div>
      </div>
      <div className="shortcut-popup-footer">
        <div className="progress-container">
          <div 
            className="progress-bar" 
            ref={progressRef}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ShortcutPopup; 
