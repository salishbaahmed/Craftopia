import React, { useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerQuiz.css';

const CustomerQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      title: "What type of crafts interest you most?",
      subtitle: "Select your primary crafting preference",
      options: [
        {
          id: 'resin',
          title: 'Resin Crafts',
          subtitle: 'Clear, glossy finished products',
          image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=300&fit=crop'
        },
        {
          id: 'clay',
          title: 'Clay Crafts',
          subtitle: 'Molded and baked creations',
          image: 'https://images.unsplash.com/photo-1584735264932-96d55eaf4c7b?w=400&h=300&fit=crop'
        },
        {
          id: 'custom-resin',
          title: 'Custom Resin',
          subtitle: 'Personalized resin items',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        },
        {
          id: 'custom-clay',
          title: 'Custom Clay',
          subtitle: 'Personalized clay creations',
          image: 'https://images.unsplash.com/photo-1548484356-3c9c5a2615e1?w=400&h=300&fit=crop'
        }
      ]
    },
    {
      id: 2,
      title: "Which resin products appeal to you?",
      subtitle: "Choose your favorite resin items",
      options: [
        {
          id: 'resin-keychain',
          title: 'Resin Keychains',
          subtitle: 'Durable and colorful',
          image: 'https://images.unsplash.com/photo-1605731414532-2587f80c2aaa?w=400&h=300&fit=crop'
        },
        {
          id: 'resin-coasters',
          title: 'Resin Coasters',
          subtitle: 'Protect your surfaces',
          image: 'https://images.unsplash.com/photo-1573869903598-5355d7ebf4a9?w=400&h=300&fit=crop'
        },
        {
          id: 'resin-jewelry',
          title: 'Jewelry Boxes',
          subtitle: 'Elegant storage solutions',
          image: 'https://images.unsplash.com/photo-1599643478510-a349f355fc53?w=400&h=300&fit=crop'
        },
        {
          id: 'resin-bookmarks',
          title: 'Resin Bookmarks',
          subtitle: 'Beautiful reading companions',
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
        }
      ]
    },
    {
      id: 3,
      title: "What clay creations catch your eye?",
      subtitle: "Select preferred clay items",
      options: [
        {
          id: 'clay-keychains',
          title: 'Clay Keychains',
          subtitle: 'Unique and lightweight',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        },
        {
          id: 'clay-pencil-toppers',
          title: 'Pencil Toppers',
          subtitle: 'Fun desk accessories',
          image: 'https://images.unsplash.com/photo-1452868195396-89c1af3b1b2e?w=400&h=300&fit=crop'
        },
        {
          id: 'clay-desk-decor',
          title: 'Desk Decor',
          subtitle: 'Brighten your workspace',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop'
        },
        {
          id: 'clay-photo-holders',
          title: 'Photo Holders',
          subtitle: 'Display precious memories',
          image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        }
      ]
    },
    {
      id: 4,
      title: "Which personalized items interest you?",
      subtitle: "Choose custom options you'd love",
      options: [
        {
          id: 'custom-name-plates',
          title: 'Name Plates',
          subtitle: 'Personalized identification',
          image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
        },
        {
          id: 'custom-necklaces',
          title: 'Initial Necklaces',
          subtitle: 'Wearable personalization',
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop'
        },
        {
          id: 'custom-trinkets',
          title: 'Trinket Boxes',
          subtitle: 'Store your treasures',
          image: 'https://images.unsplash.com/photo-1599643478510-a349f355fc53?w=400&h=300&fit=crop'
        },
        {
          id: 'custom-coasters',
          title: 'Photo Coasters',
          subtitle: 'Memories on display',
          image: 'https://images.unsplash.com/photo-1573869903598-5355d7ebf4a9?w=400&h=300&fit=crop'
        }
      ]
    },
    {
      id: 5,
      title: "Finalize your crafting preferences",
      subtitle: "Select any additional interests",
      options: [
        {
          id: 'resin-magnets',
          title: 'Resin Magnets',
          subtitle: 'Decorate your fridge',
          image: 'https://images.unsplash.com/photo-1616634375264-2d2e17736a36?w=400&h=300&fit=crop'
        },
        {
          id: 'clay-badges',
          title: 'Clay Badges',
          subtitle: 'Wearable art pieces',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        },
        {
          id: 'resin-trays',
          title: 'Resin Trays',
          subtitle: 'Functional and beautiful',
          image: 'https://images.unsplash.com/photo-1573869903598-5355d7ebf4a9?w=400&h=300&fit=crop'
        },
        {
          id: 'clay-bookmarks',
          title: 'Clay Bookmarks',
          subtitle: 'Artistic page markers',
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
        }
      ]
    }
  ];

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
      window.location.href = '/customer';
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (quizCompleted) {
    return (
      <div className="customerquiz-container">
        <Navbar />
        <div className="customerquiz-completed">
          <div className="customerquiz-completed-content">
            <h2>Quiz Completed! 🎉</h2>
            <p>Thank you for sharing your crafting preferences!</p>
            <div className="customerquiz-summary">
              <h3>Your Selections:</h3>
              <ul>
                {Object.entries(selectedAnswers).map(([questionIndex, answer]) => (
                  <li key={questionIndex}>
                    Q{parseInt(questionIndex) + 1}: {answer}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              className="customerquiz-restart-btn"
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setQuizCompleted(false);
              }}
            >
              Take Quiz Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];
  const isNextDisabled = !selectedAnswers[currentQuestion];

  return (
    <div className="customerquiz-container">
      <Navbar />
      <div className="customerquiz-content">
        {/* Updated Progress Bar with Question Numbers */}
        <div className="customerquiz-progress-section">
          <div className="customerquiz-progress-container">
            <div 
              className="customerquiz-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="customerquiz-question-numbers">
            {quizQuestions.map((_, index) => (
              <div
                key={index}
                className={`customerquiz-question-number ${
                  index <= currentQuestion ? 'customerquiz-question-active' : ''
                } ${index === currentQuestion ? 'customerquiz-question-current' : ''}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="customerquiz-question-section">
          <h1 className="customerquiz-question-title">{currentQ.title}</h1>
          <p className="customerquiz-question-subtitle">{currentQ.subtitle}</p>
        </div>

        {/* Updated 2x2 Grid Layout */}
        <div className="customerquiz-options-grid">
          <div className="customerquiz-options-row">
            {currentQ.options.slice(0, 2).map((option) => (
              <div
                key={option.id}
                className={`customerquiz-option-card ${
                  selectedAnswers[currentQuestion] === option.id ? 'customerquiz-option-selected' : ''
                }`}
                onClick={() => handleAnswerSelect(option.id)}
              >
                <div className="customerquiz-option-image">
                  <img src={option.image} alt={option.title} />
                </div>
                <div className="customerquiz-option-content">
                  <h3 className="customerquiz-option-title">{option.title}</h3>
                  <p className="customerquiz-option-subtitle">{option.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="customerquiz-options-row">
            {currentQ.options.slice(2, 4).map((option) => (
              <div
                key={option.id}
                className={`customerquiz-option-card ${
                  selectedAnswers[currentQuestion] === option.id ? 'customerquiz-option-selected' : ''
                }`}
                onClick={() => handleAnswerSelect(option.id)}
              >
                <div className="customerquiz-option-image">
                  <img src={option.image} alt={option.title} />
                </div>
                <div className="customerquiz-option-content">
                  <h3 className="customerquiz-option-title">{option.title}</h3>
                  <p className="customerquiz-option-subtitle">{option.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="customerquiz-navigation">
          <button 
            className="customerquiz-btn customerquiz-btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          
          <button 
            className="customerquiz-btn customerquiz-btn-exit"
            onClick={handleExit}
          >
            Exit Quiz
          </button>

          <button 
            className="customerquiz-btn customerquiz-btn-primary"
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Complete Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerQuiz;