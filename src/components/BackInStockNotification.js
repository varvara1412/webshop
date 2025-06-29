import React, { useState } from 'react';
import './BackInStockNotification.css';

const BackInStockNotification = ({ product, onClose, onNotifyMe }) => {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call parent function to handle notification signup
      if (onNotifyMe) {
        onNotifyMe({
          productId: product.id,
          productName: product.name,
          email,
          quantity,
          signupDate: new Date().toISOString()
        });
      }

      setIsSuccess(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      setError('Failed to sign up for notification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="back-in-stock-modal">
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content success" onClick={e => e.stopPropagation()}>
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3>Successfully Signed Up!</h3>
            <p>You'll be notified when <strong>{product.name}</strong> is back in stock.</p>
            <p className="notification-info">
              We'll send you an email at <strong>{email}</strong> as soon as this item becomes available.
            </p>
            <button className="close-success-btn" onClick={onClose}>
              Got it!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="back-in-stock-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Get Notified When Back in Stock</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="product-info">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
              <h4>{product.name}</h4>
              <p className="product-price">€{product.price.toFixed(2)}</p>
              <p className="stock-status">Currently out of stock</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="notification-form">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Desired Quantity</label>
              <div className="quantity-selector">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isSubmitting}
                  className="quantity-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="10"
                  disabled={isSubmitting}
                  className="quantity-input"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={isSubmitting}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="cancel-btn"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="notify-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Signing Up...
                  </>
                ) : (
                  'Notify Me When Available'
                )}
              </button>
            </div>
          </form>

          <div className="notification-benefits">
            <h5>Why sign up for notifications?</h5>
            <ul>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Be the first to know when this item is back in stock
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Get exclusive early access to purchase
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Never miss out on your favorite products again
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackInStockNotification; 