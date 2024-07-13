import React, { useEffect } from 'react';
import anime from 'animejs';
import '../styles/loading.css'; // Make sure to create and style this CSS file

const Loading = () => {
  useEffect(() => {
    anime({
      targets: '.loader',
      duration: 1000,
      loop: true,
      endDelay: 1000,
      direction: 'alternate',
      easing: 'easeInOutSine',
      backgroundColor: '#666',
      borderRadius: ['400%'],

    });
  }, []);

  return (
    <div className="loading-overlay">
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
