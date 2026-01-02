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
            <div className="logo-icon-small">e-</div>
            <h2 className={`${theme === "dark" ? "color-light" : "color-dark"}`}>pay</h2>
          </div>
          <strong className={`footer-desc ${theme === "dark" ? "color-light" : "color-dark"}`}>
            The smartest way to manage your finances, pay bills, and send money across borders with zero stress.
          </strong>
          <div className="social-links">
            <Link href="#" className={`${theme === "dark" ? "color-light" : "color-dark"}`}><Facebook size={18} /></Link>
            <Link href="#" className={`${theme === "dark" ? "color-light" : "color-dark"}`}><Twitter size={18} /></Link>
            <Link href="#" className={`${theme === "dark" ? "color-light" : "color-dark"}`}><Instagram size={18} /></Link>
            <Link href="#" className={`${theme === "dark" ? "color-light" : "color-dark"}`}><Linkedin size={18} /></Link>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-section">
            <h4 className={`${theme === "dark" ? "color-light" : "color-dark"}`}>Company</h4>
            <Link href="#" className={`${theme === "dark" ? "color-light" : "color-dark"}`}>About Us</Link>
            <Link href="#" className={`${theme === "dark" ? "color-light" : "color-dark"}`}>Contact</Link>
          </div>

          <div className="footer-section">
            <h4 className={`${theme === "dark" ? "color-light" : "color-dark"}`}>Legal</h4>
            <Link href="#" className={`${theme === "dark" ? "color-light" : "color-dark"}`}>Privacy Policy</Link>
            <Link href="#" className={`${theme === "dark" ? "color-light" : "color-dark"}`}>Terms of Service</Link>
          </div>

          <div className="footer-section newsletter">
            <h4 className={`${theme === "dark" ? "color-light" : "color-dark"}`}>Newsletter</h4>
            <p className={`${theme === "dark" ? "color-light" : "color-dark"}`}>Get the latest updates on new features.</p>
            <div className="newsletter-input-box">
              <input type="email" placeholder="Your email" />
              <button className="subscribe-btn"><Send size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className={`${theme === "dark" ? "color-light" : "color-dark"}`}>&copy; 2025 e-pay Financial Services. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;