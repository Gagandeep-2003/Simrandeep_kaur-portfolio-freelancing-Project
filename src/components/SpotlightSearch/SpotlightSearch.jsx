
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './SpotlightSearch.css';

// Sound effect URL - using a more reliable source
const searchSoundUrl = 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3';

const SpotlightSearch = ({ sections, skills, works }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const searchSound = useRef(null);

  // Initialize sound after component mounts to avoid NotSupportedError
  useEffect(() => {
    searchSound.current = new Audio(searchSoundUrl);
  }, []);

  // Categories for search results
  const categories = {
    SECTION: 'Section',
    SKILL: 'Skill',
    PROJECT: 'Project',
    AI: 'AI Assistant'
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Space to toggle search
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        toggleSearch();
      }

      // Escape to close search
      if (e.key === 'Escape' && isVisible) {
        e.preventDefault();
        closeSearch();
      }

      // Handle Enter key in AI mode
      if (isVisible && isAiMode && e.key === 'Enter' && !isLoadingAi && aiQuery.length >= 3) {
        e.preventDefault();
        handleAiSubmit();
        return;
      }

      // Arrow keys for navigation and Enter for selection in regular search mode
      if (isVisible && searchResults.length > 0 && !isAiMode) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % searchResults.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleResultSelect(searchResults[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, searchResults, selectedIndex, isAiMode, isLoadingAi, aiQuery]);

  // Focus input when search is opened
  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  // Scroll to selected item
  useEffect(() => {
    if (resultsRef.current && searchResults.length > 0) {
      const selectedElement = resultsRef.current.querySelector('.search-result-item.selected');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Check for AI mode when query changes
  useEffect(() => {
    if (searchQuery.startsWith('@')) {
      setIsAiMode(true);
      setAiQuery(searchQuery.substring(1).trim());
    } else {
      setIsAiMode(false);
      setAiResponse(null);
    }
  }, [searchQuery]);

  // Handle AI query submission
  const handleAiSubmit = () => {
    if (!aiQuery || aiQuery.length < 3) {
      return;
    }
    
    handleAiQuery(aiQuery);
  };

  // Handle AI query
  const handleAiQuery = async (query) => {
    if (!query || query.length < 3) return;
    
    setIsLoadingAi(true);
    
    try {
      // Using Vite's environment variable format
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key not found. Make sure VITE_GEMINI_API_KEY is set in your .env file.');
      }
      
      const response = await fetchGeminiResponse(query, apiKey);
      setAiResponse(response);
      
      // Create AI result
      const aiResult = {
        id: 'ai-response',
        title: `AI Response: "${query}"`,
        description: response,
        category: categories.AI,
        icon: '🤖'
      };
      
      setSearchResults([aiResult]);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAiResponse('Sorry, I encountered an error while processing your request. Please try again later.');
      
      const errorResult = {
        id: 'ai-error',
        title: 'Error',
        description: 'Sorry, I encountered an error while processing your request. Please try again later.',
        category: categories.AI,
        icon: '⚠️'
      };
      
      setSearchResults([errorResult]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Fetch response from Gemini API using the official SDK
  const fetchGeminiResponse = async (query, apiKey) => {
    try {
      console.log("Initializing Gemini API with key:", apiKey.substring(0, 5) + "...");
      
      // Initialize the Generative AI SDK with your API key
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Using the free gemini-2.0-flash model instead of gemini-pro
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const profileInfo = `
        About Simrandeep Kaur:
        - Plant Pathologist with expertise in disease diagnosis, pest management, and sustainable agriculture
        - Passionate about promoting plant health and environmentally friendly farming practices
        - Skilled in research, laboratory techniques, field assessment, and data analysis
        - Experienced in diagnosing plant diseases, implementing control measures, and developing sustainable solutions
        - Portfolio showcases research projects, field studies, and publications in plant pathology
        - Education includes specialized training in plant sciences with focus on pathology and disease management
        - Available for consultation, research collaboration, and professional opportunities
        - Contact through the portfolio website for project inquiries and professional connections
      `;
      
      const prompt = `
        You are an AI assistant embedded in Simrandeep Kaur's portfolio website.
        Answer questions about Simrandeep based on this information:
        ${profileInfo}
        
        If the question is not related to Simrandeep's profile, skills, projects, or professional information,
        politely explain that you can only provide information about Simrandeep's professional profile.
        
        Keep answers concise (under 150 words) and professional.
        
        User question: ${query}
      `;
      
      console.log("Sending prompt to Gemini API");
      
      // Configure generation parameters
      const generationConfig = {
        temperature: 0.2,
        maxOutputTokens: 800,
      };
      
      // Generate content
      const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig,
      });
      
      console.log("Received response from Gemini API");
      
      // Extract the response text
      return result.response.text();
    } catch (error) {
      console.error("Error in Gemini API call:", error);
      throw error;
    }
  };

  // Search functionality
  useEffect(() => {
    if (isAiMode || !searchQuery.trim()) {
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    // Search in sections
    if (sections) {
      sections.forEach(section => {
        if (
          section.title.toLowerCase().includes(query) ||
          section.description.toLowerCase().includes(query)
        ) {
          results.push({
            id: section.id,
            title: section.title,
            description: section.description,
            category: categories.SECTION,
            icon: '🔍'
          });
        }
      });
    }

    // Search in skills
    if (skills) {
      skills.forEach(skill => {
        if (skill.name.toLowerCase().includes(query)) {
          results.push({
            id: `skill-${skill.name}`,
            title: skill.name,
            description: `Skill: ${skill.name}`,
            category: categories.SKILL,
            icon: '💻'
          });
        }
      });
    }

    // Search in works/projects
    if (works) {
      works.forEach(work => {
        if (
          work.title.toLowerCase().includes(query) ||
          work.description.toLowerCase().includes(query) ||
          (work.tags && work.tags.some(tag => tag.toLowerCase().includes(query)))
        ) {
          results.push({
            id: `project-${work.title}`,
            title: work.title,
            description: work.description,
            category: categories.PROJECT,
            icon: '🚀',
            link: work.projectLink
          });
        }
      });
    }

    setSearchResults(results);
    setSelectedIndex(0);
  }, [searchQuery, sections, skills, works, isAiMode]);

  const toggleSearch = () => {
    setIsVisible(!isVisible);
    setSearchQuery('');
    setSearchResults([]);
    setIsAiMode(false);
    setAiResponse(null);
    setAiQuery('');
    
    // Play sound only if audio is initialized
    if (searchSound.current) {
      try {
        searchSound.current.play().catch(err => {
          console.log("Audio play error (non-critical):", err.message);
        });
      } catch (err) {
        console.log("Audio error (non-critical):", err.message);
      }
    }
  };

  const closeSearch = () => {
    setIsVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    setIsAiMode(false);
    setAiResponse(null);
    setAiQuery('');
  };

  const handleResultSelect = (result) => {
    if (result.category === categories.SECTION) {
      const section = document.getElementById(result.id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (result.category === categories.SKILL) {
      // Navigate to the skills section
      const skillsSection = document.getElementById('skills'); // Replace with the actual ID of the skills section
      if (skillsSection) {
        skillsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (result.category === categories.PROJECT && result.link) {
      window.open(result.link, '_blank');
    }
    
    // Don't close for AI results, just keep them visible
    if (result.category !== categories.AI) {
      closeSearch();
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isVisible && event.target.closest('.spotlight-search-container') === null) {
        closeSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="spotlight-shortcut-hint">
        <div className="spotlight-shortcut-button" onClick={toggleSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <div className="tooltip-text">Press Ctrl+Space for search</div>
        </div>
      </div>
    );
  }

  return (
    <div className="spotlight-overlay">
      <div className="spotlight-search-container">
        <div className="spotlight-search-header">
          <div className="search-icon">
            {isAiMode ? (
              <span className="ai-icon">🤖</span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            )}
          </div>
          <div className="search-input-container">
            <input
              ref={inputRef}
              type="text"
              className={`spotlight-search-input ${isAiMode ? 'ai-mode' : ''}`}
              placeholder={isAiMode ? "Ask your question and press Enter or click 'Ask AI'..." : "Search sections, skills, projects or type @ for AI..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isAiMode && (
              <button 
                className="ai-submit-button" 
                onClick={handleAiSubmit}
                disabled={isLoadingAi || aiQuery.length < 3}
              >
                Ask AI
              </button>
            )}
          </div>
          <div className={`keyboard-hint ${isAiMode ? 'ai-mode-hint' : ''}`}>
            {isAiMode ? (
              <span className="ai-hint">Press Enter to Ask AI</span>
            ) : (
              <div className="keyboard-shortcuts">
                <div className="shortcut-group">
                  <span className="keyboard-shortcut">Enter</span>
                  <span className="shortcut-label">select</span>
                </div>
                <div className="shortcut-group">
                  <span className="keyboard-shortcut">Esc</span>
                  <span className="shortcut-label">close</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {isLoadingAi && (
          <div className="ai-loading">
            <div className="ai-loading-spinner"></div>
            <div className="ai-loading-text">Thinking...</div>
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div className="spotlight-search-results" ref={resultsRef}>
            {searchResults.map((result, index) => (
              <div
                key={result.id}
                className={`search-result-item ${index === selectedIndex ? 'selected' : ''} ${result.category === categories.AI ? 'ai-result' : ''}`}
                onClick={() => handleResultSelect(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="result-icon">{result.icon}</div>
                <div className="result-content">
                  <div className="result-title">{result.title}</div>
                  {result.category === categories.AI ? (
                    <div className="ai-response-text">{result.description}</div>
                  ) : (
                    <div className="result-description">{result.description}</div>
                  )}
                </div>
                <div className={`result-category ${result.category === categories.AI ? 'ai-category' : ''}`}>
                  {result.category}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {searchQuery && searchResults.length === 0 && !isLoadingAi && (
          <div className="spotlight-no-results">
            {isAiMode ? (
              <>
                <div className="no-results-icon">🤖</div>
                <div className="no-results-text">Type your question and click "Ask AI" or press Enter</div>
                {aiQuery.length >= 3 && (
                  <button 
                    className="ai-submit-button-large" 
                    onClick={handleAiSubmit}
                  >
                    Ask AI
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="no-results-icon">🔍</div>
                <div className="no-results-text">No results found for "{searchQuery}"</div>
                <div className="ai-suggestion">Try asking AI with @your question</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotlightSearch; 
