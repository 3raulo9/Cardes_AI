import React from 'react';
import '../styles/homepage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="header">
        <h1>Welcome to Cardes AI</h1>
        <p>Your ultimate language learning companion</p>
      </header>

      <section className="intro">
        <h2>About Cardes AI</h2>
        <p>Cardes AI is a flashcard-based app designed to help you master new languages with ease. Our intelligent algorithms adapt to your learning pace, making language acquisition faster and more efficient.</p>
      </section>

      <section className="features">
        <h2>Features</h2>
        <ul>
          <li>Personalized Learning Paths</li>
          <li>Interactive Flashcards</li>
          <li>Progress Tracking</li>
          <li>Daily Challenges</li>
          <li>Community Support</li>
        </ul>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>"Cardes AI has transformed my language learning journey. The flashcards are engaging and the app is incredibly user-friendly!" - Maria S.</p>
        </div>
        <div className="testimonial">
          <p>"I've tried many language apps, but Cardes AI stands out with its adaptive learning system. Highly recommend it!" - John D.</p>
        </div>
      </section>

      <section className="pricing">
        <h2>Pricing</h2>
        <div className="price-option">
          <h3>Free Plan</h3>
          <p>Access to basic features</p>
          <p>$0/month</p>
        </div>
        <div className="price-option">
          <h3>Premium Plan</h3>
          <p>All features unlocked</p>
          <p>$9.99/month</p>
        </div>
      </section>

      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>How does Cardes AI work?</h3>
          <p>Cardes AI uses advanced algorithms to personalize your learning experience, ensuring that you focus on areas that need improvement while reinforcing your strengths.</p>
        </div>
        <div className="faq-item">
          <h3>Can I use Cardes AI offline?</h3>
          <p>Yes, with the Premium Plan, you can download flashcards and learn offline.</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Cardes AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
