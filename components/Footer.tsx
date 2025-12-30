'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import './Footer.css';

interface FooterProps {
  theme: 'light' | 'dark';
}

const Footer = ({ theme }: FooterProps) => {
  const themeClass = theme === "dark" ? "color-dark" : "color-light";

  return (
    <footer className={`main-footer ${theme}`}>
      <div className="footer-content">
        <div className="footer-section brand-info">
          <div className="footer-logo">
            <div className="logo-icon-small">S</div>
            <h2 className={themeClass}>e-pay</h2>
          </div>
          <p className="footer-desc">
            The smartest way to manage your finances, pay bills, and send money across borders with zero stress.
          </p>
          <div className="social-links">
            <Link href="#"><Facebook size={18} /></Link>
            <Link href="#"><Twitter size={18} /></Link>
            <Link href="#"><Instagram size={18} /></Link>
            <Link href="#"><Linkedin size={18} /></Link>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-section">
            <h4 className={themeClass}>Company</h4>
            <Link href="#">About Us</Link>
            <Link href="#">Contact</Link>
          </div>

          <div className="footer-section">
            <h4 className={themeClass}>Legal</h4>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>

          <div className="footer-section newsletter">
            <h4 className={themeClass}>Newsletter</h4>
            <p>Get the latest updates on new features.</p>
            <div className="newsletter-input-box">
              <input type="email" placeholder="Your email" />
              <button className="subscribe-btn"><Send size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 e-pay Financial Services. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;