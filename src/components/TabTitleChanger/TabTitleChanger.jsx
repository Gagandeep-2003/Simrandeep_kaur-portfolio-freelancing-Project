import { useEffect } from 'react';

/**
 * Component that changes the tab title when user switches focus
 * away from the tab and restores it when they return
 */
const TabTitleChanger = ({ 
  originalTitle = 'Simrandeep Kaur | Plant Pathologist',
  awayTitle = 'Missing you! Come back soon 👋', 
  awayFavicon = null,
  originalFavicon = null
}) => {
  useEffect(() => {
    let originalFaviconElement = null;
    let newFaviconElement = null;
    
    // Save the original favicon if specified
    if (awayFavicon && originalFavicon) {
      originalFaviconElement = document.querySelector("link[rel='shortcut icon']");
      
      // Create a new favicon element to swap in
      newFaviconElement = document.createElement('link');
      newFaviconElement.rel = 'shortcut icon';
      newFaviconElement.type = 'image/x-icon';
      newFaviconElement.href = awayFavicon;
    }
    
    // Event handler for when the document visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from the tab
        document.title = awayTitle;
        
        // Change favicon if provided
        if (awayFavicon && newFaviconElement && originalFaviconElement) {
          document.head.removeChild(originalFaviconElement);
          document.head.appendChild(newFaviconElement);
        }
      } else {
        // User returned to the tab
        document.title = originalTitle;
        
        // Restore original favicon
        if (originalFavicon && originalFaviconElement && newFaviconElement) {
          document.head.removeChild(document.querySelector("link[rel='shortcut icon']"));
          document.head.appendChild(originalFaviconElement);
        }
      }
    };
    
    // Create smooth title animation for away state
    const animateTitleAway = () => {
      const messages = [
        'Oops, where are you going?',
        'Hey, come back!', 
        'Missing you already...',
        awayTitle
      ];
      let index = 0;
      
      const interval = setInterval(() => {
        if (document.hidden) {
          document.title = messages[index];
          index = (index + 1) % messages.length;
        } else {
          clearInterval(interval);
          document.title = originalTitle;
        }
      }, 2000);
      
      return interval;
    };
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.title = originalTitle;
    };
  }, [originalTitle, awayTitle, awayFavicon, originalFavicon]);
  
  // This component doesn't render anything
  return null;
};

export default TabTitleChanger; 
