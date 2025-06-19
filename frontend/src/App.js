import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import AsteroidDashboard from './components/AsteroidDashboard';
import HistoricalTracker from './components/HistoricalTracker';
import QuizGame from './components/QuizGame';
import HazardWidget from './components/HazardWidget';
import GalacticBackground from './components/GalacticBackground';

// Navigation component to handle active tab state
const Navigation = ({ activeTab, setActiveTab }) => {
  const location = useLocation();

  useEffect(() => {
    // Update active tab based on current route
    const path = location.pathname;
    if (path === '/') {
      setActiveTab('dashboard');
    } else if (path === '/historical') {
      setActiveTab('historical');
    } else if (path === '/quiz') {
      setActiveTab('quiz');
    }
  }, [location, setActiveTab]);

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link 
          to="/" 
          className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </Link>
        <Link 
          to="/historical" 
          className={`nav-link ${activeTab === 'historical' ? 'active' : ''}`}
          onClick={() => setActiveTab('historical')}
        >
          📈 Historical Data
        </Link>
        <Link 
          to="/quiz" 
          className={`nav-link ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          🎮 Quiz Game
        </Link>
      </div>
    </nav>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="App">
        <GalacticBackground />
        <div className="loading-screen">
          <div className="loading-content">
            <h1 className="app-title">🛰️ NASA NEO Tracker</h1>
            <div className="loading-spinner"></div>
            <p>Loading stellar data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <GalacticBackground />
        
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              🛰️ NASA NEO Tracker
            </h1>
            <p className="app-subtitle">Monitor Near-Earth Objects in Real-Time</p>
            <div className="header-stats">
              <span className="stat-item">🌍 Live Data</span>
              <span className="stat-item">📡 NASA API</span>
              <span className="stat-item">🚨 Real-time Alerts</span>
            </div>
          </div>
        </header>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<AsteroidDashboard />} />
            <Route path="/historical" element={<HistoricalTracker />} />
            <Route path="/quiz" element={<QuizGame />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-info">
              <p>Data provided by NASA's Near Earth Object Web Service (NeoWs)</p>
              <p>Built with React & Node.js by Adrian Jandongan</p>
            </div>
            <div className="footer-links">
              <a 
                href="https://api.nasa.gov" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                🌐 NASA API Docs
              </a>
              <a 
                href="https://cneos.jpl.nasa.gov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                🔭 JPL NEO Database
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
