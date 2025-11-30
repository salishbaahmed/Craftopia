import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHelpCircle, 
  FiSearch, 
  FiStar, 
  FiTruck, 
  FiRefreshCw, 
  FiPackage, 
  FiUser, 
  FiCreditCard, 
  FiLock,
  FiPlus,
  FiMinus,
  FiMail,
  FiMessageCircle
} from 'react-icons/fi';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerFAQ.css';

const CustomerFAQ = () => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Memoize popularQuestions to prevent unnecessary re-renders
  const popularQuestions = useMemo(() => [
    {
      id: 'popular-1',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping (1-2 business days) and overnight shipping are also available at checkout. International shipping times vary by destination but generally take 7-14 business days.'
    },
    {
      id: 'popular-2',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all items in original condition with tags attached. Items must be unworn, unused, and in their original packaging. Refunds will be processed to your original payment method within 5-7 business days after we receive your return.'
    },
    {
      id: 'popular-3',
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and visiting the "Order History" section. Click on your order to view real-time tracking updates and estimated delivery dates.'
    },
    {
      id: 'popular-4',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Craftopia gift cards. All payments are processed securely through encrypted channels to protect your financial information.'
    }
  ], []);

  // Memoize faqSections to prevent unnecessary re-renders
  const faqSections = useMemo(() => [
    {
      id: 'shipping',
      title: 'Shipping & Delivery',
      icon: <FiTruck />,
      questions: [
        {
          id: 'ship-1',
          question: 'How long does shipping take?',
          answer: 'Standard shipping: 3-5 business days. Express: 1-2 business days. Overnight: Next business day. International: 7-14 business days. Delivery times may vary during holidays and peak seasons.'
        },
        {
          id: 'ship-2',
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by location. Customs fees and import duties are the responsibility of the recipient and are not included in your order total.'
        },
        {
          id: 'ship-3',
          question: 'How can I track my order?',
          answer: 'Tracking information is sent via email once your order ships. You can also track orders through your account dashboard. If you\'re having trouble tracking your package, contact our support team with your order number.'
        },
        {
          id: 'ship-4',
          question: 'What if my package is lost or damaged?',
          answer: 'If your package is lost in transit or arrives damaged, please contact us within 7 days of delivery. We\'ll file a claim with the carrier and either reship your items or issue a full refund. Photos of damaged items help expedite the process.'
        },
        {
          id: 'ship-5',
          question: 'Can I change my shipping address after ordering?',
          answer: 'Address changes are possible only if your order hasn\'t been processed for shipping. Contact us immediately with your order number and correct address. Once shipped, we cannot redirect packages.'
        }
      ]
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      icon: <FiRefreshCw />,
      questions: [
        {
          id: 'return-1',
          question: 'What is your return policy?',
          answer: '30-day return window for most items. Products must be in original condition with tags and packaging. Final sale items, personalized products, and intimate apparel cannot be returned. Return shipping is free for defective items.'
        },
        {
          id: 'return-2',
          question: 'How long do refunds take to process?',
          answer: 'Refunds are processed within 3-5 business days after we receive your return. It may take 5-10 additional business days for the refund to appear on your original payment method, depending on your bank or credit card company.'
        },
        {
          id: 'return-3',
          question: 'Can I exchange an item?',
          answer: 'Yes, we offer exchanges for different sizes or colors of the same item, subject to availability. Start a return in your account and select "Exchange" as your reason. If the requested item is unavailable, we\'ll process a refund.'
        },
        {
          id: 'return-4',
          question: 'Who pays for return shipping?',
          answer: 'We provide free return shipping for defective or incorrect items. For returns due to change of mind, return shipping costs are deducted from your refund. Premium members receive free return shipping on all orders.'
        }
      ]
    },
    {
      id: 'orders',
      title: 'Orders & Products',
      icon: <FiPackage />,
      questions: [
        {
          id: 'order-1',
          question: 'How do I cancel or modify an order?',
          answer: 'Orders can be canceled or modified within 1 hour of placement through your account. After 1 hour, orders enter processing and cannot be changed. Contact us immediately if you need to make changes to a recent order.'
        },
        {
          id: 'order-2',
          question: 'What if I received a wrong/damaged item?',
          answer: 'Please contact us within 48 hours of delivery with photos of the incorrect or damaged item and your order number. We\'ll ship the correct item immediately or process a full refund and provide a return label if needed.'
        },
        {
          id: 'order-3',
          question: 'Do you offer bulk discounts?',
          answer: 'Yes, we offer quantity discounts for orders of 10+ items. Contact our business sales team at wholesale@craftopia.com for pricing. Volume discounts are automatically applied at checkout for qualifying quantities.'
        },
        {
          id: 'order-4',
          question: 'How do I check product availability?',
          answer: 'Product availability is shown on each product page. Items marked "In Stock" ship within 24 hours. "Low Stock" indicates limited quantity. "Backordered" items will ship once restocked, with estimated dates provided.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: <FiUser />,
      questions: [
        {
          id: 'account-1',
          question: 'How do I update my email or password?',
          answer: 'Log into your account, go to "Account Settings," and click "Edit" next to your email or password. Password changes require current password verification. Email changes require confirmation through both old and new email addresses.'
        },
        {
          id: 'account-2',
          question: 'How do I delete my account?',
          answer: 'Account deletion can be requested in "Account Settings" under "Privacy." This action is permanent and will delete your order history, saved addresses, and preferences. Pending orders must be completed before account deletion.'
        },
        {
          id: 'account-3',
          question: 'Can I have multiple addresses saved?',
          answer: 'Yes, you can save multiple shipping addresses in your address book. Set a default address for faster checkout. Addresses are securely stored and can be edited or deleted at any time through your account settings.'
        },
        {
          id: 'account-4',
          question: 'How do I manage my communication preferences?',
          answer: 'Control email notifications in "Account Settings" under "Communication Preferences." Choose to receive promotional emails, order updates, product recommendations, and newsletter subscriptions. You can unsubscribe at any time.'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Payment & Billing',
      icon: <FiCreditCard />,
      questions: [
        {
          id: 'payment-1',
          question: 'What payment methods do you accept?',
          answer: 'We accept Visa, MasterCard, American Express, Discover, PayPal, Apple Pay, Google Pay, and Craftopia gift cards. All payments are processed through PCI-compliant secure payment gateways to ensure your financial data protection.'
        },
        {
          id: 'payment-2',
          question: 'Is my payment information secure?',
          answer: 'Yes, we use industry-standard SSL encryption and never store your complete payment details on our servers. Payment processing is handled by certified PCI-compliant partners. Your financial security is our top priority.'
        },
        {
          id: 'payment-3',
          question: 'Why was my payment declined?',
          answer: 'Common reasons include insufficient funds, incorrect card details, expired card, or security holds by your bank. Contact your bank to resolve the issue or try an alternative payment method. We never store declined payment attempts.'
        },
        {
          id: 'payment-4',
          question: 'Can I pay with multiple payment methods?',
          answer: 'Currently, we support one payment method per order. However, you can use gift cards combined with other payment methods. Split payments across multiple credit cards or payment platforms are not available at this time.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <FiLock />,
      questions: [
        {
          id: 'security-1',
          question: 'How do you protect my data?',
          answer: 'We implement multiple security layers including SSL encryption, regular security audits, and compliance with data protection regulations. Your personal information is stored on secure servers with limited access to authorized personnel only.'
        },
        {
          id: 'security-2',
          question: 'Do you use cookies?',
          answer: 'Yes, we use essential cookies for site functionality and optional analytics cookies to improve your shopping experience. You can manage cookie preferences through your browser settings or our privacy policy page. We never sell your data to third parties.'
        },
        {
          id: 'security-3',
          question: 'How can I report a security concern?',
          answer: 'Report security concerns immediately to security@craftopia.com. Our security team investigates all reports promptly. For suspected account compromise, change your password immediately and contact customer support for account verification.'
        },
        {
          id: 'security-4',
          question: 'What is your privacy policy?',
          answer: 'Our comprehensive privacy policy details how we collect, use, and protect your information. We are transparent about data practices and comply with applicable privacy laws. Review our full privacy policy in the website footer or account settings.'
        }
      ]
    }
  ], []);

  // Combine all questions for search functionality
  const allQuestions = useMemo(() => {
    const questions = [...popularQuestions];
    faqSections.forEach(section => {
      questions.push(...section.questions);
    });
    return questions;
  }, [faqSections, popularQuestions]);

  // Filter questions based on search query
  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return null;
    }

    const query = searchQuery.toLowerCase().trim();
    return allQuestions.filter(item =>
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query)
    );
  }, [searchQuery, allQuestions]);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqSections;
    }

    const query = searchQuery.toLowerCase().trim();
    return faqSections.map(section => ({
      ...section,
      questions: section.questions.filter(item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
      )
    })).filter(section => section.questions.length > 0);
  }, [searchQuery, faqSections]);

  // Filter popular questions based on search query
  const filteredPopularQuestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return popularQuestions;
    }

    const query = searchQuery.toLowerCase().trim();
    return popularQuestions.filter(item =>
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query)
    );
  }, [searchQuery, popularQuestions]);

  const hasSearchResults = filteredQuestions && filteredQuestions.length > 0;
  const hasNoSearchResults = searchQuery.trim() && (!filteredQuestions || filteredQuestions.length === 0);

  return (
    <div className="customerfaq-container">
      <Navbar />
      <div className="customerfaq-content">
        {/* Header Section */}
        <div className="customerfaq-header">
          <div className="customerfaq-icon-circle">
            <FiHelpCircle className="customerfaq-icon" />
          </div>
          <h1 className="customerfaq-title">Frequently Asked Questions</h1>
          <p className="customerfaq-subtitle">
            Find answers to common questions about orders, shipping, returns, and more
          </p>
          
          {/* Search Bar */}
          <div className="customerfaq-search-container">
            <div className="customerfaq-search">
              <FiSearch className="customerfaq-search-icon" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="customerfaq-search-input"
              />
            </div>
          </div>
        </div>

        {/* No Results Message */}
        {hasNoSearchResults && (
          <div className="customerfaq-no-results">
            <FiSearch className="customerfaq-no-results-icon" />
            <h3>No results found</h3>
            <p>We couldn't find any answers matching "{searchQuery}"</p>
            <button 
              className="customerfaq-clear-search"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          </div>
        )}

        {/* Search Results */}
        {hasSearchResults && (
          <div className="customerfaq-search-results">
            <h2 className="customerfaq-search-results-title">
              Search Results for "{searchQuery}"
            </h2>
            <div className="customerfaq-accordion-container">
              {filteredQuestions.map((item) => (
                <div key={item.id} className="customerfaq-accordion-item">
                  <button
                    className={`customerfaq-accordion-header ${openAccordion === item.id ? 'customerfaq-active' : ''}`}
                    onClick={() => toggleAccordion(item.id)}
                  >
                    <span className="customerfaq-accordion-question">{item.question}</span>
                    <span className="customerfaq-accordion-icon">
                      {openAccordion === item.id ? <FiMinus /> : <FiPlus />}
                    </span>
                  </button>
                  <div className={`customerfaq-accordion-content ${openAccordion === item.id ? 'customerfaq-active' : ''}`}>
                    <div className="customerfaq-accordion-answer">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Most Popular Questions (only show when no search or no results) */}
        {!searchQuery.trim() && (
          <div className="customerfaq-section-card customerfaq-popular-questions">
            <div className="customerfaq-section-header">
              <FiStar className="customerfaq-section-icon" />
              <h2 className="customerfaq-section-title">Most Popular Questions</h2>
            </div>
            
            <div className="customerfaq-accordion-container">
              {filteredPopularQuestions.map((item) => (
                <div key={item.id} className="customerfaq-accordion-item">
                  <button
                    className={`customerfaq-accordion-header ${openAccordion === item.id ? 'customerfaq-active' : ''}`}
                    onClick={() => toggleAccordion(item.id)}
                  >
                    <span className="customerfaq-accordion-question">{item.question}</span>
                    <span className="customerfaq-accordion-icon">
                      {openAccordion === item.id ? <FiMinus /> : <FiPlus />}
                    </span>
                  </button>
                  <div className={`customerfaq-accordion-content ${openAccordion === item.id ? 'customerfaq-active' : ''}`}>
                    <div className="customerfaq-accordion-answer">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main FAQ Sections (only show when no search) */}
        {!searchQuery.trim() && filteredSections.map((section) => (
          <div key={section.id} className="customerfaq-section-card">
            <div className="customerfaq-section-header">
              <span className="customerfaq-section-icon">{section.icon}</span>
              <h2 className="customerfaq-section-title">{section.title}</h2>
            </div>
            
            <div className="customerfaq-accordion-container">
              {section.questions.map((item) => (
                <div key={item.id} className="customerfaq-accordion-item">
                  <button
                    className={`customerfaq-accordion-header ${openAccordion === item.id ? 'customerfaq-active' : ''}`}
                    onClick={() => toggleAccordion(item.id)}
                  >
                    <span className="customerfaq-accordion-question">{item.question}</span>
                    <span className="customerfaq-accordion-icon">
                      {openAccordion === item.id ? <FiMinus /> : <FiPlus />}
                    </span>
                  </button>
                  <div className={`customerfaq-accordion-content ${openAccordion === item.id ? 'customerfaq-active' : ''}`}>
                    <div className="customerfaq-accordion-answer">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact Section */}
        <div className="customerfaq-contact-section">
          <div className="customerfaq-contact-content">
            <FiMessageCircle className="customerfaq-contact-icon" />
            <h3 className="customerfaq-contact-title">Still need help?</h3>
            <p className="customerfaq-contact-subtitle">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <button className="customerfaq-contact-button" onClick={() => handleNavigation('/customer-contact-support')}>
              <FiMail className="customerfaq-button-icon" />
              Contact Support
            </button>
            <p className="customerfaq-contact-email">
              Or email us at support@craftopia.com
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerFAQ;