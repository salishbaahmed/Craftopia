import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerViewRewards.css';
import { 
  FiAward, 
  FiTrendingUp,
  FiShoppingBag,
  FiCheckCircle
} from 'react-icons/fi';

const CustomerViewRewards = () => {
  const navigate = useNavigate();
  const [rewardsData, setRewardsData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Load rewards data from localStorage
  useEffect(() => {
    try {
      // Load rewards from localStorage or initialize with defaults
      const savedRewardsData = localStorage.getItem('customerRewards');
      
      if (savedRewardsData) {
        const rewardsData = JSON.parse(savedRewardsData);
        setRewardsData(rewardsData);
      } else {
        // Initialize with default rewards data
        const defaultRewardsData = {
          totalPoints: 5000,
          availablePoints: 5000,
          usedPoints: 0,
          pointsHistory: [
            {
              id: 1,
              type: 'earned',
              description: 'Initial Reward Points',
              points: 5000,
              date: new Date().toISOString(),
              status: 'completed'
            }
          ],
          availableRewards: [
            {
              id: 1,
              name: 'Rs 500 Off',
              pointsRequired: 5000,
              description: 'Get Rs 500 off your next purchase',
              type: 'discount',
              validUntil: '2024-12-31'
            },
            {
              id: 2,
              name: 'Free Shipping',
              pointsRequired: 2000,
              description: 'Free shipping on your next order',
              type: 'shipping',
              validUntil: '2024-12-31'
            },
            {
              id: 3,
              name: 'Rs 1000 Off',
              pointsRequired: 10000,
              description: 'Get Rs 1000 off your next purchase',
              type: 'discount',
              validUntil: '2024-12-31'
            },
            {
              id: 4,
              name: 'Rs 2000 Off',
              pointsRequired: 20000,
              description: 'Get Rs 2000 off your next purchase',
              type: 'discount',
              validUntil: '2024-12-31'
            }
          ]
        };

        localStorage.setItem('customerRewards', JSON.stringify(defaultRewardsData));
        setRewardsData(defaultRewardsData);
      }
    } catch (error) {
      console.error('Error loading rewards data:', error);
    }
  }, []);

  // Listen for reward updates from other pages
  useEffect(() => {
    const handleRewardsUpdate = () => {
      try {
        const savedRewardsData = localStorage.getItem('customerRewards');
        if (savedRewardsData) {
          setRewardsData(JSON.parse(savedRewardsData));
        }
      } catch (error) {
        console.error('Error updating rewards data:', error);
      }
    };

    window.addEventListener('rewardsUpdated', handleRewardsUpdate);
    return () => window.removeEventListener('rewardsUpdated', handleRewardsUpdate);
  }, []);

  const formatPoints = (points) => points.toLocaleString();

  const handleRedeemReward = (reward) => {
    if (rewardsData.availablePoints >= reward.pointsRequired) {
      if (window.confirm(`Redeem ${reward.name} for ${formatPoints(reward.pointsRequired)} points?`)) {
        // Simulate redemption
        alert(`Successfully redeemed ${reward.name}!`);
      }
    } else {
      alert(`You need ${reward.pointsRequired - rewardsData.availablePoints} more points to redeem this reward.`);
    }
  };

  const handleShopNow = () => {
    navigate('/customer');
  };

  if (!rewardsData) {
    return (
      <div className="rewards-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your rewards...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="rewards-page">
      <Navbar />
      
      <div className="rewards-container">
        {/* Header Section */}
        <div className="rewards-header">
          <div className="header-content">
            <h1>My Rewards</h1>
            <p>Earn points with every purchase and redeem them for amazing rewards</p>
          </div>
        </div>

        {/* Main Rewards Overview */}
        <div className="rewards-overview">
          <div className="points-card">
            <div className="points-header">
              <div className="points-icon">
                <FiAward />
              </div>
              <div className="points-info">
                <h3>Total Points</h3>
                <div className="points-amount">
                  {formatPoints(rewardsData.totalPoints)}
                </div>
                <p>Available to use: {formatPoints(rewardsData.availablePoints)} points</p>
              </div>
            </div>
            <div className="points-breakdown">
              <div className="breakdown-item">
                <span>Earned</span>
                <strong>{formatPoints(rewardsData.totalPoints)}</strong>
              </div>
              <div className="breakdown-item">
                <span>Used</span>
                <strong>{formatPoints(rewardsData.usedPoints)}</strong>
              </div>
              <div className="breakdown-item">
                <span>Available</span>
                <strong className="available">{formatPoints(rewardsData.availablePoints)}</strong>
              </div>
            </div>
          </div>

          <div className="quick-actions-card">
            <h3>How Rewards Work</h3>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={handleShopNow}>
                <FiShoppingBag />
                Shop & Earn Points
              </button>
              <div className="points-info-text">
                <p><strong>Earn 1% back</strong> in points on every purchase</p>
                <p><strong>Earn 10 Reward</strong> points on every review</p>
                <p><strong>1 point = Rs 1</strong> in reward value</p>
                <p>Points never expire</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs-navigation">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FiTrendingUp />
            Points History
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            <FiAward />
            Redeem Rewards
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Points History Tab */}
          {activeTab === 'overview' && (
            <div className="history-tab">
              <h3>Points Earned from Purchases</h3>
              <div className="history-list">
                {rewardsData.pointsHistory.map(transaction => (
                  <div key={transaction.id} className="history-item">
                    <div className="transaction-icon">
                      <div className={`icon-${transaction.type === 'earned' ? 'earned' : 'used'}`}>
                        <FiShoppingBag />
                      </div>
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-main">
                        <h4>{transaction.description}</h4>
                        <span className={`points ${transaction.type === 'earned' ? 'earned' : 'used'}`}>
                          {transaction.type === 'earned' ? '+' : ''}{formatPoints(transaction.points)}
                        </span>
                      </div>
                      <div className="transaction-meta">
                        <span className="date">{new Date(transaction.date).toLocaleDateString()}</span>
                        <span className="status completed">
                          <FiCheckCircle />
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Rewards Tab */}
          {activeTab === 'rewards' && (
            <div className="rewards-tab">
              <h3>Available Rewards</h3>
              <p className="tab-description">Redeem your points for discounts and benefits</p>
              
              <div className="rewards-grid">
                {rewardsData.availableRewards.map(reward => (
                  <div key={reward.id} className="reward-card">
                    <div className="reward-header">
                      <div className="reward-icon">
                        <FiAward />
                      </div>
                      <div className="reward-points">
                        {formatPoints(reward.pointsRequired)} pts
                      </div>
                    </div>
                    <div className="reward-content">
                      <h4>{reward.name}</h4>
                      <p>{reward.description}</p>
                    </div>
                    <div className="reward-actions">
                      <button 
                        className={`redeem-btn ${
                          rewardsData.availablePoints >= reward.pointsRequired ? 'available' : 'insufficient'
                        }`}
                        onClick={() => handleRedeemReward(reward)}
                        disabled={rewardsData.availablePoints < reward.pointsRequired}
                      >
                        {rewardsData.availablePoints >= reward.pointsRequired ? 'Redeem Now' : 'Need More Points'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerViewRewards;