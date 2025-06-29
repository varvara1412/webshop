import React, { useState, useEffect } from 'react';
import './Checkout.css';

const Checkout = ({ cart, total, onBackToShop, onOrderComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Germany',
    
    // Payment Information
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    
    // Order Notes
    orderNotes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [processingStep, setProcessingStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stepAnimation, setStepAnimation] = useState('enter');

  // Animation effects
  useEffect(() => {
    setStepAnimation('enter');
    const timer = setTimeout(() => setStepAnimation(''), 300);
    return () => clearTimeout(timer);
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      // Validate shipping information
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    }

    if (currentStep === 2) {
      // Validate payment information
      if (paymentMethod === 'credit') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!formData.cardHolder.trim()) newErrors.cardHolder = 'Card holder name is required';
        if (!formData.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
        if (!formData.expiryYear) newErrors.expiryYear = 'Expiry year is required';
        if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
        
        // Basic card validation
        if (formData.cardNumber && formData.cardNumber.replace(/\s/g, '').length !== 16) {
          newErrors.cardNumber = 'Card number must be 16 digits';
        }
        if (formData.cvv && formData.cvv.length !== 3) {
          newErrors.cvv = 'CVV must be 3 digits';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStepAnimation('exit');
      setTimeout(() => {
        setStep(step + 1);
      }, 200);
    }
  };

  const handleBack = () => {
    setStepAnimation('exit');
    setTimeout(() => {
      setStep(step - 1);
    }, 200);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const processPayment = async () => {
    setIsProcessing(true);
    setProcessingStep(1);
    
    // Simulate payment processing steps
    const processingSteps = [
      { step: 1, message: 'Validating payment information...', delay: 800 },
      { step: 2, message: 'Processing payment...', delay: 1200 },
      { step: 3, message: 'Confirming transaction...', delay: 1000 },
      { step: 4, message: 'Creating your order...', delay: 600 }
    ];

    for (const processingStep of processingSteps) {
      setProcessingStep(processingStep.step);
      await new Promise(resolve => setTimeout(resolve, processingStep.delay));
    }
    
    // Create order data
    const orderData = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'processing',
      total: total,
      items: cart,
      shipping: formData,
      paymentMethod: paymentMethod === 'credit' ? 'Credit Card' : 'PayPal',
      userEmail: formData.email,
      tracking: {
        number: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}DE`,
        carrier: 'DHL Express',
        updates: [
          {
            date: new Date().toISOString(),
            status: 'Order Confirmed',
            description: 'Your order has been confirmed and is being processed'
          }
        ]
      }
    };

    // Save order to localStorage
    try {
      const existingOrders = localStorage.getItem('userOrders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(orderData);
      localStorage.setItem('userOrders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order:', error);
    }
    
    setIsProcessing(false);
    setShowSuccess(true);
    
    // Show success animation before moving to confirmation
    setTimeout(() => {
      setStep(4);
      setShowSuccess(false);
      setProcessingStep(0);
      
      // Call the order complete callback
      if (onOrderComplete) {
        onOrderComplete(orderData);
      }
    }, 1500);
  };

  const renderProcessingAnimation = () => {
    const processingMessages = [
      'Validating payment information...',
      'Processing payment...',
      'Confirming transaction...',
      'Creating your order...'
    ];

    return (
      <div className="processing-overlay">
        <div className="processing-container">
          <div className="processing-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          
          <div className="processing-steps">
            {processingMessages.map((message, index) => (
              <div 
                key={index}
                className={`processing-step ${processingStep > index ? 'completed' : processingStep === index + 1 ? 'active' : ''}`}
              >
                <div className="step-indicator">
                  {processingStep > index + 1 ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="step-message">{message}</span>
              </div>
            ))}
          </div>
          
          <div className="processing-progress">
            <div 
              className="progress-bar"
              style={{ width: `${(processingStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccessAnimation = () => (
    <div className="success-overlay">
      <div className="success-container">
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <path d="M22 4L12 14.01l-3-3"/>
          </svg>
        </div>
        <h2>Payment Successful!</h2>
        <p>Your order has been processed successfully.</p>
        <div className="success-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="particle" style={{ '--delay': `${i * 0.1}s` }}></div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderShippingForm = () => (
    <div className={`checkout-form ${stepAnimation}`}>
      <h3>Shipping Information</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={errors.firstName ? 'error' : ''}
            placeholder="Enter your first name"
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={errors.lastName ? 'error' : ''}
            placeholder="Enter your last name"
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
            placeholder="Enter your phone number"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address">Street Address *</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className={errors.address ? 'error' : ''}
          placeholder="Enter your street address"
        />
        {errors.address && <span className="error-message">{errors.address}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={errors.city ? 'error' : ''}
            placeholder="Enter your city"
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code *</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className={errors.postalCode ? 'error' : ''}
            placeholder="Enter postal code"
          />
          {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="country">Country</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
        >
          <option value="Germany">Germany</option>
          <option value="France">France</option>
          <option value="Italy">Italy</option>
          <option value="Spain">Spain</option>
          <option value="Netherlands">Netherlands</option>
          <option value="Belgium">Belgium</option>
          <option value="Austria">Austria</option>
          <option value="Switzerland">Switzerland</option>
        </select>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className={`checkout-form ${stepAnimation}`}>
      <h3>Payment Information</h3>
      
      <div className="payment-method-selector">
        <button
          className={`payment-method ${paymentMethod === 'credit' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('credit')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Credit Card
        </button>
        
        <button
          className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('paypal')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.5 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            <path d="M7 15h10v-2H7v2z"/>
            <path d="M7 11h10V9H7v2z"/>
            <path d="M7 7h10V5H7v2z"/>
            <path d="M3 3h18v18H3V3z"/>
          </svg>
          PayPal
        </button>
      </div>

      {paymentMethod === 'credit' ? (
        <div className="credit-card-form">
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number *</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              className={errors.cardNumber ? 'error' : ''}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
            {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cardHolder">Card Holder Name *</label>
            <input
              type="text"
              id="cardHolder"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleInputChange}
              className={errors.cardHolder ? 'error' : ''}
              placeholder="JOHN DOE"
            />
            {errors.cardHolder && <span className="error-message">{errors.cardHolder}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryMonth">Expiry Month *</label>
              <select
                id="expiryMonth"
                name="expiryMonth"
                value={formData.expiryMonth}
                onChange={handleInputChange}
                className={errors.expiryMonth ? 'error' : ''}
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
              {errors.expiryMonth && <span className="error-message">{errors.expiryMonth}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="expiryYear">Expiry Year *</label>
              <select
                id="expiryYear"
                name="expiryYear"
                value={formData.expiryYear}
                onChange={handleInputChange}
                className={errors.expiryYear ? 'error' : ''}
              >
                <option value="">Year</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
              {errors.expiryYear && <span className="error-message">{errors.expiryYear}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV *</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                className={errors.cvv ? 'error' : ''}
                placeholder="123"
                maxLength="3"
              />
              {errors.cvv && <span className="error-message">{errors.cvv}</span>}
            </div>
          </div>
        </div>
      ) : (
        <div className="paypal-info">
          <div className="paypal-logo">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.5 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              <path d="M7 15h10v-2H7v2z"/>
              <path d="M7 11h10V9H7v2z"/>
              <path d="M7 7h10V5H7v2z"/>
              <path d="M3 3h18v18H3V3z"/>
            </svg>
          </div>
          <p>You will be redirected to PayPal to complete your payment securely.</p>
        </div>
      )}
    </div>
  );

  const renderOrderReview = () => (
    <div className={`checkout-form ${stepAnimation}`}>
      <h3>Order Review</h3>
      
      <div className="order-summary">
        <div className="order-items">
          <h4>Order Items</h4>
          {cart.map((item, index) => (
            <div key={index} className="order-item">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <h5>{item.name}</h5>
                <p className="item-category">{item.category}</p>
                <p className="item-price">€{item.price.toFixed(2)} x {item.quantity}</p>
              </div>
              <div className="item-total">
                €{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="order-totals">
          <div className="total-line">
            <span>Subtotal:</span>
            <span>€{total.toFixed(2)}</span>
          </div>
          <div className="total-line">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="total-line total">
            <span>Total:</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="shipping-summary">
          <h4>Shipping Address</h4>
          <p>{formData.firstName} {formData.lastName}</p>
          <p>{formData.address}</p>
          <p>{formData.city}, {formData.postalCode}</p>
          <p>{formData.country}</p>
          <p>{formData.email}</p>
          <p>{formData.phone}</p>
        </div>

        <div className="payment-summary">
          <h4>Payment Method</h4>
          <p>{paymentMethod === 'credit' ? 'Credit Card' : 'PayPal'}</p>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="orderNotes">Order Notes (Optional)</label>
        <textarea
          id="orderNotes"
          name="orderNotes"
          value={formData.orderNotes}
          onChange={handleInputChange}
          placeholder="Any special instructions for your order..."
          rows="3"
        />
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className={`checkout-form ${stepAnimation}`}>
      <div className="confirmation-content">
        <div className="confirmation-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <path d="M22 4L12 14.01l-3-3"/>
          </svg>
        </div>
        
        <h2>Thank You for Your Order!</h2>
        <p className="order-id">Order ID: ORD-{Date.now()}</p>
        
        <div className="confirmation-details">
          <div className="detail-item">
            <span className="label">Order Total:</span>
            <span className="value">€{total.toFixed(2)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Payment Method:</span>
            <span className="value">{paymentMethod === 'credit' ? 'Credit Card' : 'PayPal'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Shipping Address:</span>
            <span className="value">{formData.address}, {formData.city}</span>
          </div>
        </div>

        <div className="next-steps">
          <h4>What's Next?</h4>
          <ul>
            <li>You'll receive an email confirmation shortly</li>
            <li>We'll notify you when your order ships</li>
            <li>Track your order with the provided tracking number</li>
          </ul>
        </div>

        <button className="back-to-shop-btn" onClick={onBackToShop}>
          Continue Shopping
        </button>
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4].map((stepNumber) => (
        <div key={stepNumber} className={`step ${step >= stepNumber ? 'active' : ''} ${step === stepNumber ? 'current' : ''}`}>
          <div className="step-number">{stepNumber}</div>
          <div className="step-label">
            {stepNumber === 1 && 'Shipping'}
            {stepNumber === 2 && 'Payment'}
            {stepNumber === 3 && 'Review'}
            {stepNumber === 4 && 'Confirmation'}
          </div>
          {stepNumber < 4 && <div className="step-connector"></div>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="checkout-container">
      {isProcessing && renderProcessingAnimation()}
      {showSuccess && renderSuccessAnimation()}
      
      <div className="checkout-header">
        <button className="back-btn" onClick={onBackToShop}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Shop
        </button>
        <h1>Checkout</h1>
      </div>

      {renderStepIndicator()}

      <div className="checkout-content">
        <div className="checkout-main">
          {step === 1 && renderShippingForm()}
          {step === 2 && renderPaymentForm()}
          {step === 3 && renderOrderReview()}
          {step === 4 && renderConfirmation()}
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary-sidebar">
            <h3>Order Summary</h3>
            <div className="cart-items-summary">
              {cart.map((item, index) => (
                <div key={index} className="cart-item-summary">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span className="item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="order-totals-sidebar">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-line total">
                <span>Total:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {step < 4 && (
        <div className="checkout-actions">
          {step > 1 && (
            <button className="back-button" onClick={handleBack}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button className="next-button" onClick={handleNext}>
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-7-7l7 7-7 7"/>
              </svg>
            </button>
          ) : (
            <button 
              className="process-payment-button" 
              onClick={processPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="button-spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Process Payment
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout; 