import React from 'react';
import './Navigation.css';

const Navigation = ({ activeView, onViewChange, currentUser, onLogout }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>Online Shop</h2>
        </div>
        <div className="nav-links">
          {!currentUser ? (
            <>
              <button 
                className={`nav-link ${activeView === 'register' ? 'active' : ''}`}
                onClick={() => onViewChange('register')}
              >
                Register
              </button>
              <button 
                className={`nav-link ${activeView === 'login' ? 'active' : ''}`}
                onClick={() => onViewChange('login')}
              >
                Login
              </button>
            </>
          ) : (
            <>
              <button 
                className={`nav-link ${activeView === 'shop' ? 'active' : ''}`}
                onClick={() => onViewChange('shop')}
              >
                Shop
              </button>
              <button 
                className={`nav-link ${activeView === 'manage' ? 'active' : ''}`}
                onClick={() => onViewChange('manage')}
              >
                Account
              </button>
              <button 
                className="nav-link logout-btn"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 