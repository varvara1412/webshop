import React, { useState, useEffect } from 'react';
import './ProductDetails.css';

const ProductDetails = ({ product, onClose, onAddToCart, onAddToWishlist, onPreOrder }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '' });

  // Enhanced product data with additional details
  const enhancedProduct = {
    ...product,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Blue', 'Red', 'Green'],
    rating: 4.5,
    reviewCount: 127,
    description: product.description + ' This premium product features high-quality materials and exceptional craftsmanship. Perfect for everyday use or special occasions.',
    features: [
      'Premium quality materials',
      'Durable construction',
      'Easy to maintain',
      'Comfortable design',
      'Versatile usage'
    ],
    specifications: {
      'Material': 'Premium Cotton',
      'Weight': '250g',
      'Dimensions': '30 x 20 x 5 cm',
      'Care Instructions': 'Machine washable',
      'Warranty': '1 year'
    }
  };

  useEffect(() => {
    // Load reviews from localStorage
    const savedReviews = localStorage.getItem(`reviews_${product.id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, [product.id]);

  const handleAddToCart = () => {
    if (enhancedProduct.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    if (enhancedProduct.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    
    const productWithOptions = {
      ...enhancedProduct,
      selectedSize,
      selectedColor,
      quantity
    };
    
    onAddToCart(productWithOptions);
    onClose();
  };

  const handlePreOrder = () => {
    if (enhancedProduct.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    if (enhancedProduct.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    
    const productWithOptions = {
      ...enhancedProduct,
      selectedSize,
      selectedColor,
      quantity
    };
    
    onPreOrder(productWithOptions);
    onClose();
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(enhancedProduct);
  };

  const handleSubmitReview = () => {
    if (!userReview.comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    const newReview = {
      id: Date.now(),
      user: 'Anonymous User',
      rating: userReview.rating,
      comment: userReview.comment,
      date: new Date().toISOString(),
      helpful: 0
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updatedReviews));
    
    setUserReview({ rating: 5, comment: '' });
  };

  const getStockStatus = () => {
    if (enhancedProduct.stock === 0) return { status: 'out-of-stock', text: 'Out of Stock' };
    if (enhancedProduct.stock <= enhancedProduct.minStockLevel) return { status: 'critical-stock', text: `Critical Stock - Only ${enhancedProduct.stock} left!` };
    if (enhancedProduct.stock <= enhancedProduct.reorderPoint) return { status: 'low-stock', text: `Low Stock - Only ${enhancedProduct.stock} left!` };
    return { status: 'in-stock', text: 'In Stock' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="product-details-overlay">
      <div className="product-details-modal">
        <button className="close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="product-details-content">
          <div className="product-images">
            <img src={enhancedProduct.image} alt={enhancedProduct.name} className="main-image" />
            <div className="image-thumbnails">
              <img src={enhancedProduct.image} alt="Thumbnail 1" />
              <img src={enhancedProduct.image} alt="Thumbnail 2" />
              <img src={enhancedProduct.image} alt="Thumbnail 3" />
            </div>
          </div>

          <div className="product-info">
            <div className="product-header">
              <h1>{enhancedProduct.name}</h1>
              <div className="product-rating">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill={star <= enhancedProduct.rating ? "#ffd700" : "#ddd"} stroke="currentColor" strokeWidth="1">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                  ))}
                </div>
                <span className="rating-text">{enhancedProduct.rating} ({enhancedProduct.reviewCount} reviews)</span>
                <button className="review-btn" onClick={() => setShowReviews(!showReviews)}>
                  {showReviews ? 'Hide Reviews' : 'Show Reviews'}
                </button>
              </div>
            </div>

            <div className="product-price">
              <span className="current-price">€{enhancedProduct.price.toFixed(2)}</span>
              <span className="original-price">€{(enhancedProduct.price * 1.2).toFixed(2)}</span>
              <span className="discount">-20%</span>
            </div>

            <div className="stock-status">
              <span className={`stock-indicator ${stockStatus.status}`}>
                {stockStatus.text}
              </span>
              {enhancedProduct.stock === 0 && enhancedProduct.expectedRestock && (
                <div className="restock-info">
                  <span className="restock-date">Expected restock: {enhancedProduct.expectedRestock}</span>
                </div>
              )}
            </div>

            <div className="product-description">
              <p>{enhancedProduct.description}</p>
            </div>

            {enhancedProduct.colors.length > 0 && (
              <div className="product-options">
                <label>Color:</label>
                <div className="color-options">
                  {enhancedProduct.colors.map(color => (
                    <button
                      key={color}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {enhancedProduct.sizes.length > 0 && (
              <div className="product-options">
                <label>Size:</label>
                <div className="size-options">
                  {enhancedProduct.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="size-guide-btn" onClick={() => setShowSizeGuide(!showSizeGuide)}>
                  Size Guide
                </button>
              </div>
            )}

            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={enhancedProduct.stock > 0 && quantity >= enhancedProduct.stock}
                >
                  +
                </button>
              </div>
              {enhancedProduct.stock > 0 && (
                <span className="stock-available">{enhancedProduct.stock} available</span>
              )}
            </div>

            <div className="product-actions">
              {enhancedProduct.stock > 0 ? (
                <button 
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={enhancedProduct.stock === 0}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
                  </svg>
                  Add to Cart
                </button>
              ) : (
                <button 
                  className="pre-order-btn"
                  onClick={handlePreOrder}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Pre-Order Now
                </button>
              )}
              
              <button className="wishlist-btn" onClick={handleAddToWishlist}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Add to Wishlist
              </button>
            </div>

            {showSizeGuide && (
              <div className="size-guide">
                <h3>Size Guide</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Chest (cm)</th>
                      <th>Waist (cm)</th>
                      <th>Hips (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>XS</td><td>81-86</td><td>66-71</td><td>86-91</td></tr>
                    <tr><td>S</td><td>86-91</td><td>71-76</td><td>91-96</td></tr>
                    <tr><td>M</td><td>91-96</td><td>76-81</td><td>96-101</td></tr>
                    <tr><td>L</td><td>96-101</td><td>81-86</td><td>101-106</td></tr>
                    <tr><td>XL</td><td>101-106</td><td>86-91</td><td>106-111</td></tr>
                    <tr><td>XXL</td><td>106-111</td><td>91-96</td><td>111-116</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="product-features">
              <h3>Features</h3>
              <ul>
                {enhancedProduct.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="product-specifications">
              <h3>Specifications</h3>
              <div className="specs-grid">
                {Object.entries(enhancedProduct.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}:</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {showReviews && (
              <div className="reviews-section">
                <h3>Customer Reviews</h3>
                <div className="review-form">
                  <h4>Write a Review</h4>
                  <div className="rating-input">
                    <label>Rating:</label>
                    <div className="stars-input">
                      {[1, 2, 3, 4, 5].map(star => (
                        <svg 
                          key={star} 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill={star <= userReview.rating ? "#ffd700" : "#ddd"} 
                          stroke="currentColor" 
                          strokeWidth="1"
                          onClick={() => setUserReview({ ...userReview, rating: star })}
                          style={{ cursor: 'pointer' }}
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Write your review..."
                    value={userReview.comment}
                    onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                  />
                  <button onClick={handleSubmitReview}>Submit Review</button>
                </div>
                
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={star <= review.rating ? "#ffd700" : "#ddd"} stroke="currentColor" strokeWidth="1">
                              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                            </svg>
                          ))}
                        </div>
                        <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <div className="review-footer">
                        <span className="review-user">{review.user}</span>
                        <button className="helpful-btn">
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 