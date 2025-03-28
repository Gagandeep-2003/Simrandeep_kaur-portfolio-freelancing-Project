
import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  // Main refs for cursor elements
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const cursorLeafRef = useRef(null);
  
  // State for cursor behavior
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPositions, setTrailPositions] = useState([]);
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [magneticElement, setMagneticElement] = useState(null);
  const [isGrowing, setIsGrowing] = useState(false);
  const [growthPositions, setGrowthPositions] = useState([]);

  // Refs for tracking interactive elements
  const interactiveElementsRef = useRef([]);
  const clickCountRef = useRef(0);
  const magneticStrength = 0.3; // Adjust magnetic pull strength

  useEffect(() => {
    // For smooth cursor movement with trailing effect
    const updatePosition = (e) => {
      let x = e.clientX;
      let y = e.clientY;
      
      // Apply magnetic effect when near interactive elements
      if (magneticElement) {
        const rect = magneticElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance to element center
        const distanceX = centerX - x;
        const distanceY = centerY - y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Apply stronger magnetic pull when closer
        const pullStrength = magneticStrength * (1 - Math.min(distance / 150, 1));
        
        // Apply magnetic pull based on distance
        x += distanceX * pullStrength;
        y += distanceY * pullStrength;
      }
      
      const newPosition = { x, y };
      setPosition(newPosition);
      
      // Animate cursor dot and ring with transform for smoother movement
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
      
      if (cursorRingRef.current) {
        // Add slight lag to ring for natural feel
        setTimeout(() => {
          if (cursorRingRef.current) {
            cursorRingRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
          }
        }, 50);
      }
      
      if (cursorLeafRef.current) {
        // Add different lag to leaf
        setTimeout(() => {
          if (cursorLeafRef.current) {
            cursorLeafRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) ${
              linkHovered ? 'scale(0.7) rotate(-15deg)' : clicked ? 'scale(1) rotate(45deg)' : 'scale(0)'
            }`;
          }
        }, 80);
      }
      
      // Add position to trail array and keep only the last 8 positions for performance
      setTrailPositions(prevPositions => {
        const updatedPositions = [...prevPositions, newPosition];
        return updatedPositions.slice(-8);
      });
    };

    const handleMouseDown = (e) => {
      setClicked(true);
      
      // Create plant growth effect on click
      clickCountRef.current += 1;
      
      // Only create new growth if we're not already growing
      if (!isGrowing) {
        setIsGrowing(true);
        
        // Create a unique ID using current timestamp and a random number
        const id = Date.now() + Math.floor(Math.random() * 1000);
        
        // Generate random plant type (0-3) for variety
        const plantType = Math.floor(Math.random() * 4);
        
        setGrowthPositions(prev => [...prev, { 
          x: e.clientX, 
          y: e.clientY, 
          id, 
          plantType,
          // Random rotations for more natural look
          stemRotation: (Math.random() * 6) - 3,
          scale: 0.8 + (Math.random() * 0.4)
        }]);
        
        // Limit to maximum 6 growths to prevent clutter
        if (growthPositions.length > 5) {
          setGrowthPositions(prev => prev.slice(-5));
        }
        
        // Reset growing state after animation completes
        setTimeout(() => setIsGrowing(false), 2000);
      }
    };
    
    const handleMouseUp = () => {
      setClicked(false);
    };
    
    const handleMouseEnter = () => setHidden(false);
    const handleMouseLeave = () => setHidden(true);

    // Find all interactive elements on the page
    const initializeInteractiveElements = () => {
      const elements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
      interactiveElementsRef.current = Array.from(elements);
      
      // Add hover listeners to all interactive elements
      interactiveElementsRef.current.forEach(el => {
        el.addEventListener('mouseenter', () => handleLinkHoverStart(el));
        el.addEventListener('mouseleave', handleLinkHoverEnd);
      });
    };
    
    // Handle magnetic effect and hover state
    const handleLinkHoverStart = (el) => {
      setLinkHovered(true);
      setMagneticElement(el);
      
      // Add active state to element for additional feedback
      el.classList.add('cursor-magnetic-active');
    };
    
    const handleLinkHoverEnd = () => {
      setLinkHovered(false);
      setMagneticElement(null);
      
      // Remove active state from all elements
      interactiveElementsRef.current.forEach(el => {
        el.classList.remove('cursor-magnetic-active');
      });
    };
    
    // Initialize elements
    initializeInteractiveElements();
    
    // Add global event listeners
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Refresh interactive elements periodically to catch dynamically added elements
    const refreshInterval = setInterval(initializeInteractiveElements, 2000);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);

      interactiveElementsRef.current.forEach(el => {
        el.removeEventListener('mouseenter', handleLinkHoverStart);
        el.removeEventListener('mouseleave', handleLinkHoverEnd);
        el.classList.remove('cursor-magnetic-active');
      });
      
      clearInterval(refreshInterval);
    };
  }, [magneticElement, linkHovered, clicked, isGrowing, growthPositions.length]);

  // Hide the default cursor when our custom one is active
  useEffect(() => {
    document.body.style.cursor = 'none';
    document.documentElement.classList.add('custom-cursor-enabled');
    
    return () => {
      document.body.style.cursor = 'auto';
      document.documentElement.classList.remove('custom-cursor-enabled');
    };
  }, []);

  const cursorClasses = `custom-cursor ${hidden ? 'hidden' : ''} ${clicked ? 'clicked' : ''} ${linkHovered ? 'link-hovered' : ''}`;
  const followerClasses = `custom-cursor-follower ${hidden ? 'hidden' : ''} ${clicked ? 'clicked' : ''} ${linkHovered ? 'link-hovered' : ''}`;
  const leafClasses = `cursor-leaf ${hidden ? 'hidden' : ''} ${clicked ? 'clicked' : ''} ${linkHovered ? 'link-hovered' : ''}`;

  // Render leaf trails with decreasing opacity
  const renderTrails = () => {
    return trailPositions.map((pos, index) => {
      const opacity = 0.15 - (index * 0.018); // Decrease opacity for older positions
      const scale = 0.7 - (index * 0.08);   // Decrease size for older positions
      
      return (
        <div
          key={index}
          className="cursor-trail"
          style={{
            left: 0,
            top: 0,
            opacity: opacity > 0 ? opacity : 0,
            transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${scale > 0.2 ? scale : 0.2})`,
          }}
        />
      );
    });
  };

  // Plant types with different characteristics
  const plantTypes = [
    // Regular plant (green with yellow flower)
    { 
      stemColor: 'stem-green',
      leafColor: 'leaf-green',
      flowerColor: 'flower-yellow',
      leafCount: 4,
    },
    // Pink/purple flowering plant
    { 
      stemColor: 'stem-purple',
      leafColor: 'leaf-dark-green',
      flowerColor: 'flower-pink',
      leafCount: 3,
    },
    // Blue/teal exotic plant
    { 
      stemColor: 'stem-teal', 
      leafColor: 'leaf-teal',
      flowerColor: 'flower-blue',
      leafCount: 5,
    },
    // Fall/orange plant
    { 
      stemColor: 'stem-brown',
      leafColor: 'leaf-orange',
      flowerColor: 'flower-orange',
      leafCount: 3,
    }
  ];

  // Render plant growths at click positions
  const renderGrowths = () => {
    return growthPositions.map((pos) => {
      const plant = plantTypes[pos.plantType];
      
      return (
        <div
          key={pos.id}
          className="plant-growth active"
          style={{
            left: 0,
            top: 0,
            transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${pos.scale}) rotate(${pos.stemRotation}deg)`,
          }}
        >
          <div className={`stem ${plant.stemColor}`}></div>
          
          {/* Basic leaves */}
          <div className={`leaf leaf-left ${plant.leafColor}`}></div>
          <div className={`leaf leaf-right ${plant.leafColor}`}></div>
          
          {/* Extra leaves based on plant type */}
          {plant.leafCount > 3 && (
            <div className={`leaf leaf-left-bottom ${plant.leafColor}`}></div>
          )}
          {plant.leafCount > 3 && (
            <div className={`leaf leaf-right-bottom ${plant.leafColor}`}></div>
          )}
          {plant.leafCount > 4 && (
            <div className={`leaf leaf-back ${plant.leafColor}`}></div>
          )}
          
          <div className={`leaf leaf-top ${plant.leafColor}`}></div>
          
          {/* Stem details */}
          <div className="stem-details">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`stem-segment segment-${i+1}`}></div>
            ))}
          </div>
          
          {/* Flower with petals */}
          <div className={`flower ${plant.flowerColor}`}>
            <div className="flower-center"></div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`petal petal-${i+1}`}></div>
            ))}
          </div>
          
          {/* Dewdrops on leaves */}
          <div className="dewdrops">
            <div className="dewdrop dewdrop-1"></div>
            <div className="dewdrop dewdrop-2"></div>
            <div className="dewdrop dewdrop-3"></div>
          </div>
          
          {/* Particles animation */}
          <div className="particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`particle particle-${i+1} ${plant.flowerColor}-particle`}></div>
            ))}
          </div>
          
          {/* Light effect */}
          <div className="light-effect"></div>
        </div>
      );
    });
  };

  return (
    <>
      {/* SVG Defs for gradient */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8BC34A" />
            <stop offset="100%" stopColor="#4CAF50" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
      
      {/* Trail effect */}
      {renderTrails()}
      
      {/* Plant growth effect at click positions */}
      {renderGrowths()}
      
      {/* Main cursor dot */}
      <div
        ref={cursorDotRef}
        className={cursorClasses}
        style={{
          left: 0,
          top: 0,
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
        }}
      />
      
      {/* Secondary cursor follower (ring) */}
      <div
        ref={cursorRingRef}
        className={followerClasses}
        style={{
          left: 0,
          top: 0,
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
        }}
      />
      
      {/* Leaf cursor element */}
      <div
        ref={cursorLeafRef}
        className={leafClasses}
        style={{
          left: 0,
          top: 0,
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%) scale(0)`,
        }}
      >
        <svg viewBox="0 0 24 24" className="leaf-svg">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34C5.55,21.73 6.8,22 8,22C19,22 22,15 22,8C22,4 16,2 16,2C16,2 9,3 5,8C5,8 10,6 17,8Z" />
        </svg>
      </div>
    </>
  );
};

export default CustomCursor; 
