import React, { useState, useEffect } from 'react';
import './Wishlist.css';

const Wishlist = ({ onClose, onAddToCart }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const moveToCart = (product) => {
    onAddToCart(product);
    removeFromWishlist(product.id);
  };

  const getSortedAndFilteredItems = () => {
    let filtered = wishlistItems;

    // Filter by category
    if (filterBy !== 'all') {
      filtered = filtered.filter(item => item.category === filterBy);
    }

    // Sort items
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'date':
      default:
        return filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
    }
  };

  const handleShareWishlist = () => {
    if (!shareEmail.trim()) {
      alert('Please enter an email address');
      return;
    }
    
    // Simulate sharing wishlist
    alert(`Wishlist shared with ${shareEmail}!`);
    setShareEmail('');
    setShowShareModal(false);
  };

  const getCategories = () => {
    const categories = [...new Set(wishlistItems.map(item => item.category))];
    return categories;
  };

  const sortedItems = getSortedAndFilteredItems();
  const categories = getCategories();

  return (
    <div className="wishlist-overlay">
      <div className="wishlist-modal">
        <div className="wishlist-header">
          <h2>My Wishlist</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3>Your wishlist is empty</h3>
            <p>Start adding items you love to your wishlist!</p>
            <button className="continue-shopping-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="wishlist-controls">
              <div className="wishlist-stats">
                <span>{wishlistItems.length} items</span>
                <span className="total-value">
                  Total: €{wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </span>
              </div>
              
              <div className="wishlist-filters">
                <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="date">Date Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
                
                <button 
                  className="share-wishlist-btn"
                  onClick={() => setShowShareModal(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16,6 12,2 8,6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  Share
                </button>
              </div>
            </div>

            <div className="wishlist-items">
              {sortedItems.map(item => (
                <div key={item.id} className="wishlist-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                    <div className="item-overlay">
                      <button 
                        className="quick-add-btn"
                        onClick={() => moveToCart(item)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    <div className="item-price">
                      <span className="current-price">€{item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="original-price">€{item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <div className="item-meta">
                      <span className="added-date">
                        Added {new Date(item.addedDate).toLocaleDateString()}
                      </span>
                      {item.stock && (
                        <span className={`stock-status ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <button 
                      className="move-to-cart-btn"
                      onClick={() => moveToCart(item)}
                    >
                      Move to Cart
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="wishlist-footer">
              <div className="wishlist-summary">
                <div className="summary-item">
                  <span>Total Items:</span>
                  <span>{wishlistItems.length}</span>
                </div>
                <div className="summary-item">
                  <span>Total Value:</span>
                  <span>€{wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span>Categories:</span>
                  <span>{categories.length}</span>
                </div>
              </div>
              
              <div className="wishlist-actions">
                <button className="clear-wishlist-btn" onClick={() => {
                  if (window.confirm('Are you sure you want to clear your wishlist?')) {
                    setWishlistItems([]);
                    localStorage.removeItem('wishlist');
                  }
                }}>
                  Clear Wishlist
                </button>
                <button className="export-wishlist-btn">
                  Export List
                </button>
              </div>
            </div>
          </>
        )}

        {showShareModal && (
          <div className="share-modal-overlay">
            <div className="share-modal">
              <h3>Share Your Wishlist</h3>
              <p>Send your wishlist to friends and family</p>
              
              <div className="share-input">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
                <button onClick={handleShareWishlist}>Send</button>
              </div>
              
              <div className="share-options">
                <button className="share-option">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  Facebook
                </button>
                <button className="share-option">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                  Twitter
                </button>
                <button className="share-option">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16,6 12,2 8,6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  Copy Link
                </button>
              </div>
              
              <button className="close-share-modal" onClick={() => setShowShareModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 