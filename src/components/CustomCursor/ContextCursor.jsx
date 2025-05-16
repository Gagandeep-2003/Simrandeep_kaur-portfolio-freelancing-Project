// Add event listeners to interactive elements
const addEventListeners = () => {
  const elements = document.querySelectorAll(`[${propNames.dataAttr}]`);
  elements.forEach((item) => {
    // Remove existing listeners to prevent duplicates
    item.removeEventListener("mouseenter", handleMouseOver);
    item.removeEventListener("mouseleave", handleMouseOut);
    
    // Add new listeners
    item.addEventListener("mouseenter", handleMouseOver);
    item.addEventListener("mouseleave", handleMouseOut);
  });
};

// Add event listeners when DOM changes (for dynamically added elements)
const observer = new MutationObserver((mutations) => {
  // Check if any mutations added nodes
  const hasAddedNodes = mutations.some(mutation => 
    mutation.addedNodes.length > 0 || 
    mutation.attributeChanged || 
    mutation.type === 'childList'
  );
  
  if (hasAddedNodes) {
    // Small delay to ensure DOM is fully updated
    setTimeout(addEventListeners, 50);
  }
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true,
  attributes: true,
  attributeFilter: ['class', 'style', 'data-ccursor']
});
