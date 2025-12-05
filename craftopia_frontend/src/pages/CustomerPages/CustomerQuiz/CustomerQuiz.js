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
      title: "What type of product are you looking for?",
      subtitle: "Select the main purpose",
      options: [
        { id: 'useful', title: 'Something useful', subtitle: 'Practical items', letter: 'A', image: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=300&fit=crop' },
        { id: 'decorative', title: 'Something decorative', subtitle: 'Aesthetic pieces', letter: 'B', image: 'https://images.unsplash.com/photo-1584735264932-96d55eaf4c7b?w=400&h=300&fit=crop' },
        { id: 'personalized', title: 'Something personalized', subtitle: 'Custom made', letter: 'C', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop' },
        { id: 'budget', title: 'Small & budget-friendly', subtitle: 'Affordable gifts', letter: 'D', image: 'https://images.unsplash.com/photo-1548484356-3c9c5a2615e1?w=400&h=300&fit=crop' }
      ]
    },
    {
      id: 2,
      title: "Who are you buying this for?",
      subtitle: "Select the recipient",
      options: [
        { id: 'yourself', title: 'Yourself', subtitle: 'Treat yourself', letter: 'A', image: 'https://images.unsplash.com/photo-1605731414532-2587f80c2aaa?w=400&h=300&fit=crop' },
        { id: 'friend', title: 'Friend / Best Friend', subtitle: 'For a buddy', letter: 'B', image: 'https://images.unsplash.com/photo-1573869903598-5355d7ebf4a9?w=400&h=300&fit=crop' },
        { id: 'family', title: 'Family Member', subtitle: 'For family', letter: 'C', image: 'https://images.unsplash.com/photo-1599643478510-a349f355fc53?w=400&h=300&fit=crop' },
        { id: 'general', title: 'A Gift for Anyone', subtitle: 'General gift', letter: 'D', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop' }
      ]
    },
    {
      id: 3,
      title: "What style do you prefer?",
      subtitle: "Select material preference",
      options: [
        { id: 'resin', title: 'Resin', subtitle: 'Glossy & clear', letter: 'A', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop' },
        { id: 'clay', title: 'Clay', subtitle: 'Matte & molded', letter: 'B', image: 'https://images.unsplash.com/photo-1452868195396-89c1af3b1b2e?w=400&h=300&fit=crop' },
        { id: 'mixed', title: 'Combination / Mixed', subtitle: 'Best of both', letter: 'C', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
        { id: 'surprise', title: 'Surprise me!', subtitle: 'No preference', letter: 'D', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop' }
      ]
    }
  ];

  const getRecommendation = () => {
    const q1 = quizQuestions[0].options.find(o => o.id === selectedAnswers[0])?.letter;
    const q2 = quizQuestions[1].options.find(o => o.id === selectedAnswers[1])?.letter;
    const q3 = quizQuestions[2].options.find(o => o.id === selectedAnswers[2])?.letter;

    if (!q1 || !q2 || !q3) return "Please complete the quiz to get a recommendation.";

    const key = `Q1${q1}-Q2${q2}-Q3${q3}`;

    const resultsMap = {
      // Q1A - Useful
      'Q1A-Q2A-Q3A': 'Resin Bookmarks, Resin Coasters, Resin Cups, Resin Name Plates',
      'Q1A-Q2A-Q3B': 'Clay Bookmarks, Clay Pencil Toppers, Clay Photo Holders',
      'Q1A-Q2A-Q3C': 'Resin Bookmarks, Clay Bookmarks, Resin Coasters, Clay Photo Holders',
      'Q1A-Q2A-Q3D': 'Resin Coasters, Clay Bookmarks, Resin Cups',
      'Q1A-Q2B-Q3A': 'Resin Bookmarks, Resin Keychains, Resin Coasters',
      'Q1A-Q2B-Q3B': 'Clay Keychains, Clay Bookmarks, Clay Pencil Toppers',
      'Q1A-Q2B-Q3C': 'Resin Bookmarks, Clay Bookmarks, Resin Keychains',
      'Q1A-Q2B-Q3D': 'Clay Keychains, Resin Bookmarks, Resin Coasters',
      'Q1A-Q2C-Q3A': 'Resin Coasters, Resin Cups, Resin Name Plates',
      'Q1A-Q2C-Q3B': 'Clay Photo Holders, Clay Bookmarks',
      'Q1A-Q2C-Q3C': 'Resin Coasters, Clay Photo Holders',
      'Q1A-Q2C-Q3D': 'Resin Coasters, Clay Bookmarks',
      'Q1A-Q2D-Q3A': 'Resin Bookmarks, Resin Coasters, Resin Keychains',
      'Q1A-Q2D-Q3B': 'Clay Keychains, Clay Bookmarks, Clay Pencil Toppers',
      'Q1A-Q2D-Q3C': 'Resin Bookmarks, Clay Bookmarks, Resin Coasters',
      'Q1A-Q2D-Q3D': 'Resin Coasters, Clay Keychains',

      // Q1B - Decorative
      'Q1B-Q2A-Q3A': 'Resin Trays, Resin Jewelry Boxes, Resin Magnets',
      'Q1B-Q2A-Q3B': 'Clay Desk Decor, Clay Badges, Clay Trinket Boxes',
      'Q1B-Q2A-Q3C': 'Resin Jewelry Boxes, Clay Desk Decor',
      'Q1B-Q2A-Q3D': 'Resin Magnets, Clay Desk Decor',
      'Q1B-Q2B-Q3A': 'Resin Jewelry Boxes, Resin Magnets',
      'Q1B-Q2B-Q3B': 'Clay Trinket Boxes, Clay Badges',
      'Q1B-Q2B-Q3C': 'Resin Jewelry Boxes, Clay Trinket Boxes',
      'Q1B-Q2B-Q3D': 'Resin Magnets, Clay Badges',
      'Q1B-Q2C-Q3A': 'Resin Trays, Resin Magnets, Resin Jewelry Boxes',
      'Q1B-Q2C-Q3B': 'Clay Desk Decor, Clay Photo Holders',
      'Q1B-Q2C-Q3C': 'Resin Trays, Clay Photo Holders',
      'Q1B-Q2C-Q3D': 'Resin Magnets, Clay Desk Decor',
      'Q1B-Q2D-Q3A': 'Resin Magnets, Resin Trays',
      'Q1B-Q2D-Q3B': 'Clay Badges, Clay Trinket Boxes',
      'Q1B-Q2D-Q3C': 'Resin Magnets, Clay Trinket Boxes',
      'Q1B-Q2D-Q3D': 'Resin Magnets, Clay Badges',

      // Q1C - Personalized
      'Q1C-Q2A-Q3A': 'Customized Resin Initial Necklaces, Customized Resin Trinket Boxes, Customize Resin Name Plates',
      'Q1C-Q2A-Q3B': 'Customized Clay Initial Necklaces, Customized Clay Trinket Boxes',
      'Q1C-Q2A-Q3C': 'Customized Resin Initial Necklaces, Customized Clay Initial Necklaces',
      'Q1C-Q2A-Q3D': 'Customized Resin Initial Necklaces, Customized Clay Trinket Boxes',
      'Q1C-Q2B-Q3A': 'Customized Resin Keychains, Customized Resin Initial Necklaces, Customized Resin Bookmarks',
      'Q1C-Q2B-Q3B': 'Customized Clay Keychains, Customized Clay Initial Necklaces, Customized Clay Bookmarks',
      'Q1C-Q2B-Q3C': 'Customized Resin Keychains, Customized Clay Keychains',
      'Q1C-Q2B-Q3D': 'Customized Resin Keychains, Customized Clay Initial Necklaces',
      'Q1C-Q2C-Q3A': 'Custom Resin Photo Coasters, Customize Resin Name Plates, Customized Resin Trinket Boxes',
      'Q1C-Q2C-Q3B': 'Customized Clay Trinket Boxes',
      'Q1C-Q2C-Q3C': 'Custom Resin Photo Coasters, Customized Clay Trinket Boxes',
      'Q1C-Q2C-Q3D': 'Customize Resin Name Plates, Customized Clay Trinket Boxes',
      'Q1C-Q2D-Q3A': 'Customized Resin Keychains, Customized Resin Bookmarks',
      'Q1C-Q2D-Q3B': 'Customized Clay Keychains, Customized Clay Bookmarks',
      'Q1C-Q2D-Q3C': 'Customized Resin Keychains, Customized Clay Keychains',
      'Q1C-Q2D-Q3D': 'Customized Resin Keychains, Customized Clay Keychains',

      // Q1D - Small & Budget-Friendly
      'Q1D-Q2A-Q3A': 'Resin Keychains, Resin Bookmarks, Resin Magnets',
      'Q1D-Q2A-Q3B': 'Clay Keychains, Clay Pencil Toppers, Clay Badges',
      'Q1D-Q2A-Q3C': 'Resin Keychains, Clay Keychains',
      'Q1D-Q2A-Q3D': 'Resin Magnets, Clay Pencil Toppers',
      'Q1D-Q2B-Q3A': 'Resin Keychains, Resin Bookmarks',
      'Q1D-Q2B-Q3B': 'Clay Keychains, Clay Badges',
      'Q1D-Q2B-Q3C': 'Resin Keychains, Clay Keychains',
      'Q1D-Q2B-Q3D': 'Clay Keychains, Resin Magnets',
      'Q1D-Q2C-Q3A': 'Resin Magnets, Resin Coasters',
      'Q1D-Q2C-Q3B': 'Clay Photo Holders, Clay Bookmarks',
      'Q1D-Q2C-Q3C': 'Resin Magnets, Clay Bookmarks',
      'Q1D-Q2C-Q3D': 'Resin Magnets, Clay Bookmarks',
      'Q1D-Q2D-Q3A': 'Resin Keychains, Resin Magnets',
      'Q1D-Q2D-Q3B': 'Clay Keychains, Clay Pencil Toppers',
      'Q1D-Q2D-Q3C': 'Resin Keychains, Clay Keychains',
      'Q1D-Q2D-Q3D': 'Resin Keychains, Clay Keychains'
    };

    return resultsMap[key] || "We have a wide variety of crafts for you to explore!";
  };

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
    const recommendation = getRecommendation();
    const recommendedItems = recommendation.split(',').map(item => item.trim());

    return (
      <div className="customerquiz-container">
        <Navbar />
        <div className="customerquiz-completed">
          <div className="customerquiz-completed-content">
            <h2>Your Perfect Match! ✨</h2>
            <p>Based on your unique style, we've curated these just for you:</p>

            <div className="customerquiz-recommendations-grid">
              {recommendedItems.map((item, index) => (
                <div key={index} className="recommendation-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="recommendation-icon">🎁</div>
                  <h3>{item}</h3>
                </div>
              ))}
            </div>

            <button
              className="customerquiz-restart-btn"
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setQuizCompleted(false);
              }}
            >
              Start New Quiz
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
        {/* Progress Bar */}
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
                className={`customerquiz-question-number ${index <= currentQuestion ? 'customerquiz-question-active' : ''
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

        {/* Options Grid */}
        <div className="customerquiz-options-grid">
          <div className="customerquiz-options-row">
            {currentQ.options.slice(0, 2).map((option) => (
              <div
                key={option.id}
                className={`customerquiz-option-card ${selectedAnswers[currentQuestion] === option.id ? 'customerquiz-option-selected' : ''
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
                className={`customerquiz-option-card ${selectedAnswers[currentQuestion] === option.id ? 'customerquiz-option-selected' : ''
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
            {currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next Question'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerQuiz;