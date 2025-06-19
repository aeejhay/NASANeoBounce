import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuizGame.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const QuizGame = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    fetchAsteroids();
  }, []);

  const fetchAsteroids = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/neos`);
      setAsteroids(response.data.asteroids);
    } catch (error) {
      console.error('Failed to fetch asteroids for quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = () => {
    if (asteroids.length === 0) return [];

    const questions = [];

    // Question 1: Which asteroid is closest?
    if (asteroids.length > 0) {
      const closest = asteroids.reduce((closest, current) => 
        current.distance.kilometers < closest.distance.kilometers ? current : closest
      );
      const options = asteroids.slice(0, 4).map(a => a.name);
      if (!options.includes(closest.name)) {
        options[3] = closest.name;
      }
      
      questions.push({
        question: "Which asteroid is closest to Earth?",
        options: options.sort(() => Math.random() - 0.5),
        correct: closest.name,
        explanation: `${closest.name} is the closest at ${Math.round(closest.distance.kilometers).toLocaleString()} km away.`
      });
    }

    // Question 2: Which asteroid is fastest?
    if (asteroids.length > 0) {
      const fastest = asteroids.reduce((fastest, current) => 
        current.velocity > fastest.velocity ? current : fastest
      );
      const options = asteroids.slice(0, 4).map(a => a.name);
      if (!options.includes(fastest.name)) {
        options[3] = fastest.name;
      }
      
      questions.push({
        question: "Which asteroid is traveling the fastest?",
        options: options.sort(() => Math.random() - 0.5),
        correct: fastest.name,
        explanation: `${fastest.name} is traveling at ${Math.round(fastest.velocity).toLocaleString()} km/h.`
      });
    }

    // Question 3: How many hazardous asteroids?
    const hazardousCount = asteroids.filter(a => a.isHazardous).length;
    const options = [
      hazardousCount,
      Math.max(0, hazardousCount - 1),
      hazardousCount + 1,
      Math.max(0, hazardousCount - 2)
    ].sort(() => Math.random() - 0.5);
    
    questions.push({
      question: "How many potentially hazardous asteroids are there today?",
      options: options,
      correct: hazardousCount,
      explanation: `There are ${hazardousCount} potentially hazardous asteroids detected today.`
    });

    // Question 4: Largest asteroid
    if (asteroids.length > 0) {
      const largest = asteroids.reduce((largest, current) => {
        const currentAvg = (current.diameter.min + current.diameter.max) / 2;
        const largestAvg = (largest.diameter.min + largest.diameter.max) / 2;
        return currentAvg > largestAvg ? current : largest;
      });
      const options = asteroids.slice(0, 4).map(a => a.name);
      if (!options.includes(largest.name)) {
        options[3] = largest.name;
      }
      
      questions.push({
        question: "Which asteroid has the largest diameter?",
        options: options.sort(() => Math.random() - 0.5),
        correct: largest.name,
        explanation: `${largest.name} has the largest diameter at ${((largest.diameter.min + largest.diameter.max) / 2).toFixed(2)} km.`
      });
    }

    // Question 5: Average distance
    if (asteroids.length > 0) {
      const avgDistance = Math.round(
        asteroids.reduce((sum, a) => sum + a.distance.kilometers, 0) / asteroids.length
      );
      const options = [
        avgDistance,
        Math.round(avgDistance * 0.8),
        Math.round(avgDistance * 1.2),
        Math.round(avgDistance * 0.9)
      ].sort(() => Math.random() - 0.5);
      
      questions.push({
        question: "What is the average distance of all asteroids from Earth (in km)?",
        options: options,
        correct: avgDistance,
        explanation: `The average distance is ${avgDistance.toLocaleString()} km.`
      });
    }

    return questions;
  };

  const questions = generateQuestions();

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].correct;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "🎉 Excellent! You're an asteroid expert!";
    if (percentage >= 60) return "👍 Good job! You know your asteroids!";
    if (percentage >= 40) return "📚 Not bad! Keep learning about NEOs!";
    return "🌍 Keep exploring! The universe is vast!";
  };

  if (loading) {
    return (
      <div className="quiz-game">
        <h2 className="card-title">🎮 Asteroid Quiz</h2>
        <div className="loading">Loading asteroid data for quiz...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-game">
        <h2 className="card-title">🎮 Asteroid Quiz</h2>
        <div className="no-questions">
          <p>No asteroid data available for quiz questions.</p>
          <button className="btn" onClick={fetchAsteroids}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="quiz-game">
        <div className="quiz-result">
          <h2 className="card-title">🎯 Quiz Complete!</h2>
          <div className="result-score">
            <div className="score-circle">
              <span className="score-number">{score}</span>
              <span className="score-total">/{questions.length}</span>
            </div>
            <p className="score-percentage">
              {Math.round((score / questions.length) * 100)}%
            </p>
          </div>
          <p className="score-message">{getScoreMessage()}</p>
          <div className="result-actions">
            <button className="btn" onClick={handleRestart}>
              🔄 Play Again
            </button>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
              🏠 Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-game">
      <div className="quiz-header">
        <h2 className="card-title">🎮 Asteroid Quiz</h2>
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="quiz-stats">
        <div className="stat-card">
          <div className="stat-number">{score}</div>
          <div className="stat-label">Correct</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{currentQuestion - score}</div>
          <div className="stat-label">Incorrect</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{questions.length - currentQuestion - 1}</div>
          <div className="stat-label">Remaining</div>
        </div>
      </div>

      <div className="card">
        <div className="question-container">
          <h3 className="question-text">{currentQ.question}</h3>
          
          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'correct'
                      : 'incorrect'
                    : selectedAnswer !== null && option === currentQ.correct
                    ? 'correct'
                    : ''
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          {selectedAnswer !== null && (
            <div className={`explanation ${isCorrect ? 'correct' : 'incorrect'}`}>
              <p><strong>{isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</strong></p>
              <p>{currentQ.explanation}</p>
            </div>
          )}
        </div>
      </div>

      {selectedAnswer !== null && (
        <div className="quiz-actions">
          <button className="btn" onClick={handleNextQuestion}>
            {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
          </button>
        </div>
      )}

      <div className="quiz-info">
        <p>
          <strong>How to play:</strong> Answer questions about today's asteroids. 
          Test your knowledge about distances, velocities, and hazards!
        </p>
      </div>
    </div>
  );
};

export default QuizGame; 