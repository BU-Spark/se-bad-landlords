import styles from './Footer.module.css';
import React, { useState, useEffect } from 'react';

// Footer component
const Footer = () => {
  return (
    <>
      {/* Footer section */}
      <footer className="footer">
        <div className="footer__addr">
          {/* Logo */}
          <h1 className="footer__logo">Bad Landlords Boston</h1>
          <h2>Contact Us</h2>
          <address>
            {/* Email button */}
            <a className="footer__btn" href="mailto:example@gmail.com">Email Us</a>
          </address>
        </div>

        {/* Navigation */}
        <ul className="footer__nav">
          {/* Media section */}
          <li className="nav__item">
            <h2 className="nav__title">Media</h2>

            <ul className="nav__ul">
              <li>
                <a href="#">Online</a>
              </li>

              <li>
                <a href="#">Print</a>
              </li>

              <li>
                <a href="#">Alternative Ads</a>
              </li>
            </ul>
          </li>

          {/* Technology section */}
          <li className="nav__item nav__item--extra">
            <h2 className="nav__title">Technology</h2>

            <ul className="nav__ul nav__ul--extra">
              <li>
                <a href="#">Hardware Design</a>
              </li>

              <li>
                <a href="#">Software Design</a>
              </li>

              <li>
                <a href="#">Digital Signage</a>
              </li>

              <li>
                <a href="#">Automation</a>
              </li>

              <li>
                <a href="#">Artificial Intelligence</a>
              </li>

              <li>
                <a href="#">IoT</a>
              </li>
            </ul>
          </li>

          {/* Legal section */}
          <li className="nav__item">
            <h2 className="nav__title">Legal</h2>

            <ul className="nav__ul">
              <li>
                <a href="#">Privacy Policy</a>
              </li>

              <li>
                <a href="#">Terms of Use</a>
              </li>

              <li>
                <a href="#">Sitemap</a>
              </li>
            </ul>
          </li>
        </ul>
      </footer>
    </>
  );
};

export default Footer;
