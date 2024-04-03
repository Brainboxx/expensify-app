import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="welcome-text">
        <h2>Welcome to my Expense Tracker App</h2>
        <p>Please <Link to="/login">login</Link> to continue</p>
      </div>
      <div className="developer-text">
        <p>Developed by Brainboxx</p>
      </div>
    </div>
  );
};

export default HomePage;