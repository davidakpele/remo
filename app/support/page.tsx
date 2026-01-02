'use client';

import { useState } from 'react';
import {
  Headphones, Mail, MessageCircle, Phone, Clock, CheckCircle,
  Send, Search, ChevronDown, ChevronUp, FileText, AlertCircle,
  HelpCircle, Zap, Shield, CreditCard, Smartphone
} from 'lucide-react';
import "./Support.css";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    priority: 'medium'
  });
  const [submitted, setSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: <MessageCircle size={28} />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: 'Available 24/7',
      action: 'Start Chat',
      color: '#10b981'
    },
    {
      icon: <Mail size={28} />,
      title: 'Email Support',
      description: 'Send us an email',
      availability: 'Response within 24 hours',
      action: 'Send Email',
      color: '#3b82f6'
    },
    {
      icon: <Phone size={28} />,
      title: 'Phone Support',
      description: 'Call our support line',
      availability: 'Mon-Fri, 9AM-6PM',
      action: 'Call Now',
      color: '#8b5cf6'
    },
    {
      icon: <FileText size={28} />,
      title: 'Help Center',
      description: 'Browse our documentation',
      availability: 'Self-service resources',
      action: 'Visit Help Center',
      color: '#f59e0b'
    }
  ];

  const faqs = [
    {
      category: 'Account',
      icon: <Smartphone />,
      questions: [
        {
          q: 'How do I reset my password?',
          a: 'Go to Settings > Security > Change Password. Enter your current password and choose a new one. You\'ll receive a confirmation email once updated.'
        },
        {
          q: 'Can I have multiple accounts?',
          a: 'Yes, you can create multiple accounts with different email addresses. However, each account must be verified separately.'
        },
        {
          q: 'How do I verify my account?',
          a: 'Complete your KYC verification by uploading a valid ID and selfie. The process takes 24-48 hours. You\'ll receive an email once approved.'
        }
      ]
    },
    {
      category: 'Payments',
      icon: <CreditCard />,
      questions: [
        {
          q: 'Why was my payment declined?',
          a: 'Payments can be declined due to insufficient funds, incorrect card details, or security restrictions. Check your payment method and try again.'
        },
        {
          q: 'How long do transfers take?',
          a: 'Internal transfers are instant. Bank transfers take 1-3 business days. International transfers may take up to 5 business days.'
        },
        {
          q: 'What are the transaction limits?',
          a: 'Daily limits vary by account level: Basic ($1,000), Verified ($10,000), Premium ($50,000). Contact support to increase limits.'
        }
      ]
    },
    {
      category: 'Security',
      icon: <Shield />,
      questions: [
        {
          q: 'How do I enable two-factor authentication?',
          a: 'Go to Settings > Security > Two-Factor Authentication. Scan the QR code with your authenticator app and enter the verification code.'
        },
        {
          q: 'What should I do if my account is compromised?',
          a: 'Immediately contact support via live chat or call our emergency hotline. We\'ll freeze your account and help secure it.'
        },
        {
          q: 'Are my transactions encrypted?',
          a: 'Yes, all transactions use bank-level 256-bit SSL encryption. Your data is stored in secure, encrypted databases.'
        }
      ]
    }
  ];

  const quickLinks = [
    { icon: <Zap />, label: 'Getting Started Guide', href: '#' },
    { icon: <CreditCard />, label: 'Payment Methods', href: '#' },
    { icon: <Shield />, label: 'Security Guidelines', href: '#' },
    { icon: <FileText />, label: 'Terms of Service', href: '#' },
    { icon: <HelpCircle />, label: 'Privacy Policy', href: '#' },
    { icon: <AlertCircle />, label: 'Report an Issue', href: '#' }
  ];

  const toggleFaq = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedFaq(expandedFaq === key ? null : key);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
        priority: 'medium'
      });
    }, 3000);
  };

  return (
    <div className="support-page">
      {/* Hero Section */}
      <div className="support-hero">
        <div className="hero-content">
          <div className="hero-icon-wrapper">
            <Headphones size={48} />
          </div>
          <h1 className="hero-title">How can we help you?</h1>
          <p className="hero-subtitle">
            Get instant answers or connect with our support team
          </p>
          
          {/* Search Bar */}
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, guides..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="support-content">
        {/* Contact Methods */}
        <section className="support-section">
          <h2 className="section-title">Contact Our Support Team</h2>
          <div className="contact-grid">
            {contactMethods.map((method, idx) => (
              <div 
                key={idx} 
                className="contact-card"
                style={{ '--accent-color': method.color }}
              >
                <div className="contact-icon" style={{ backgroundColor: method.color }}>
                  {method.icon}
                </div>
                <h3 className="contact-title">{method.title}</h3>
                <p className="contact-description">{method.description}</p>
                <div className="contact-availability">
                  <Clock size={14} />
                  <span>{method.availability}</span>
                </div>
                <button className="contact-action">{method.action}</button>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="support-section">
          <h2 className="section-title">Quick Links</h2>
          <div className="quick-links-grid">
            {quickLinks.map((link, idx) => (
              <a key={idx} href={link.href} className="quick-link-card">
                <div className="quick-link-icon">{link.icon}</div>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="support-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((category, catIdx) => (
              <div key={catIdx} className="faq-category">
                <div className="faq-category-header">
                  <div className="faq-category-icon">{category.icon}</div>
                  <h3 className="faq-category-title">{category.category}</h3>
                </div>
                <div className="faq-questions">
                  {category.questions.map((item, qIdx) => {
                    const isExpanded = expandedFaq === `${catIdx}-${qIdx}`;
                    return (
                      <div key={qIdx} className="faq-item">
                        <button
                          className="faq-question"
                          onClick={() => toggleFaq(catIdx, qIdx)}
                        >
                          <span>{item.q}</span>
                          {isExpanded ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="faq-answer">
                            <p>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support Ticket Form */}
        <section className="support-section">
          <h2 className="section-title">Submit a Support Ticket</h2>
          <div className="ticket-form-wrapper">
            {submitted ? (
              <div className="success-message">
                <CheckCircle size={48} />
                <h3>Ticket Submitted Successfully!</h3>
                <p>We've received your support request. Our team will respond within 24 hours.</p>
                <p className="ticket-number">Ticket #EP-{Math.floor(Math.random() * 100000)}</p>
              </div>
            ) : (
              <form className="ticket-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="account">Account Issues</option>
                      <option value="payment">Payment Problems</option>
                      <option value="security">Security Concerns</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing Questions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide detailed information about your issue..."
                    rows="6"
                    required
                  />
                </div>

                <button type="submit" className="submit-button">
                  <Send size={20} />
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Support Hours */}
        <section className="support-section">
          <div className="support-hours">
            <div className="hours-content">
              <Clock size={32} />
              <div>
                <h3>Support Hours</h3>
                <p>Our team is available to help you:</p>
                <ul>
                  <li><strong>Live Chat:</strong> 24/7</li>
                  <li><strong>Phone Support:</strong> Monday - Friday, 9:00 AM - 6:00 PM (WAT)</li>
                  <li><strong>Email Support:</strong> Response within 24 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;