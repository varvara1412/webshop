import React, { useState, useEffect } from 'react';
import './GiftCard.css';

const GiftCard = ({ onClose, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [myGiftCards, setMyGiftCards] = useState([]);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [selectedGiftCard, setSelectedGiftCard] = useState(null);

  const predefinedAmounts = [25, 50, 100, 150, 200, 250];

  useEffect(() => {
    // Load user's gift cards from localStorage
    const savedGiftCards = localStorage.getItem('myGiftCards');
    if (savedGiftCards) {
      setMyGiftCards(JSON.parse(savedGiftCards));
    }
  }, []);

  const handleBuyGiftCard = () => {
    if (!recipientEmail || !recipientName || !senderName) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (amount < 10 || amount > 1000) {
      alert('Gift card amount must be between €10 and €1000');
      return;
    }

    const giftCard = {
      id: Date.now(),
      code: generateGiftCardCode(),
      amount: amount,
      recipientEmail,
      recipientName,
      senderName,
      message,
      purchaseDate: new Date().toISOString(),
      status: 'active',
      balance: amount,
      transactions: []
    };

    // Add to user's gift cards
    const updatedGiftCards = [...myGiftCards, giftCard];
    setMyGiftCards(updatedGiftCards);
    localStorage.setItem('myGiftCards', JSON.stringify(updatedGiftCards));

    // Simulate purchase
    alert(`Gift card purchased successfully! Code: ${giftCard.code}`);
    
    // Reset form
    setSelectedAmount(50);
    setCustomAmount('');
    setRecipientEmail('');
    setRecipientName('');
    setSenderName('');
    setMessage('');
  };

  const handleRedeemGiftCard = () => {
    if (!giftCardCode.trim()) {
      alert('Please enter a gift card code');
      return;
    }

    // Simulate gift card redemption
    const giftCard = {
      id: Date.now(),
      code: giftCardCode,
      amount: 100, // Simulated amount
      balance: 100,
      redeemDate: new Date().toISOString(),
      status: 'active',
      transactions: []
    };

    const updatedGiftCards = [...myGiftCards, giftCard];
    setMyGiftCards(updatedGiftCards);
    localStorage.setItem('myGiftCards', JSON.stringify(updatedGiftCards));

    alert(`Gift card redeemed successfully! Balance: €${giftCard.balance.toFixed(2)}`);
    setGiftCardCode('');
  };

  const handleUseGiftCard = (giftCard) => {
    if (!redeemAmount || parseFloat(redeemAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(redeemAmount);
    if (amount > giftCard.balance) {
      alert('Amount exceeds gift card balance');
      return;
    }

    // Update gift card balance
    const updatedGiftCards = myGiftCards.map(card => {
      if (card.id === giftCard.id) {
        return {
          ...card,
          balance: card.balance - amount,
          transactions: [...card.transactions, {
            type: 'redeem',
            amount: amount,
            date: new Date().toISOString(),
            description: 'Used for purchase'
          }]
        };
      }
      return card;
    });

    setMyGiftCards(updatedGiftCards);
    localStorage.setItem('myGiftCards', JSON.stringify(updatedGiftCards));
    setRedeemAmount('');
    setSelectedGiftCard(null);

    alert(`Used €${amount.toFixed(2)} from gift card. Remaining balance: €${(giftCard.balance - amount).toFixed(2)}`);
  };

  const generateGiftCardCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getActiveGiftCards = () => {
    return myGiftCards.filter(card => card.status === 'active' && card.balance > 0);
  };

  const getExpiredGiftCards = () => {
    return myGiftCards.filter(card => card.status === 'expired' || card.balance <= 0);
  };

  return (
    <div className="gift-card-overlay">
      <div className="gift-card-modal">
        <div className="gift-card-header">
          <h2>Gift Cards</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="gift-card-tabs">
          <button 
            className={`tab-btn ${activeTab === 'buy' ? 'active' : ''}`}
            onClick={() => setActiveTab('buy')}
          >
            Buy Gift Card
          </button>
          <button 
            className={`tab-btn ${activeTab === 'redeem' ? 'active' : ''}`}
            onClick={() => setActiveTab('redeem')}
          >
            Redeem Code
          </button>
          <button 
            className={`tab-btn ${activeTab === 'my-cards' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-cards')}
          >
            My Gift Cards
          </button>
        </div>

        <div className="gift-card-content">
          {activeTab === 'buy' && (
            <div className="buy-gift-card">
              <div className="gift-card-preview">
                <div className="card-design">
                  <div className="card-header">
                    <h3>Gift Card</h3>
                    <span className="card-amount">€{customAmount || selectedAmount}</span>
                  </div>
                  <div className="card-body">
                    <p className="card-message">
                      {message || 'Wishing you joy and happiness!'}
                    </p>
                    <div className="card-footer">
                      <span>From: {senderName || 'Your Name'}</span>
                      <span>To: {recipientName || 'Recipient'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gift-card-form">
                <h3>Gift Card Details</h3>
                
                <div className="amount-selection">
                  <label>Select Amount:</label>
                  <div className="amount-options">
                    {predefinedAmounts.map(amount => (
                      <button
                        key={amount}
                        className={`amount-option ${selectedAmount === amount ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                      >
                        €{amount}
                      </button>
                    ))}
                  </div>
                  <div className="custom-amount">
                    <label>Or enter custom amount:</label>
                    <input
                      type="number"
                      placeholder="Enter amount (€10-€1000)"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      min="10"
                      max="1000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Recipient Email *</label>
                  <input
                    type="email"
                    placeholder="Enter recipient's email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Recipient Name *</label>
                  <input
                    type="text"
                    placeholder="Enter recipient's name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Personal Message</label>
                  <textarea
                    placeholder="Write a personal message (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="3"
                  />
                </div>

                <button className="buy-gift-card-btn" onClick={handleBuyGiftCard}>
                  Buy Gift Card - €{(customAmount || selectedAmount).toFixed(2)}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'redeem' && (
            <div className="redeem-gift-card">
              <div className="redeem-info">
                <h3>Redeem Gift Card</h3>
                <p>Enter your gift card code to add it to your account</p>
              </div>

              <div className="redeem-form">
                <div className="form-group">
                  <label>Gift Card Code</label>
                  <input
                    type="text"
                    placeholder="Enter gift card code (e.g., ABCD-1234-EFGH-5678)"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                  />
                </div>

                <button className="redeem-btn" onClick={handleRedeemGiftCard}>
                  Redeem Gift Card
                </button>
              </div>

              <div className="redeem-help">
                <h4>How to redeem:</h4>
                <ul>
                  <li>Enter the 16-digit gift card code</li>
                  <li>Click "Redeem Gift Card"</li>
                  <li>The balance will be added to your account</li>
                  <li>Use the balance for future purchases</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'my-cards' && (
            <div className="my-gift-cards">
              <div className="cards-summary">
                <div className="summary-item">
                  <span>Active Cards:</span>
                  <span>{getActiveGiftCards().length}</span>
                </div>
                <div className="summary-item">
                  <span>Total Balance:</span>
                  <span>€{getActiveGiftCards().reduce((sum, card) => sum + card.balance, 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="gift-cards-list">
                <h3>Active Gift Cards</h3>
                {getActiveGiftCards().length === 0 ? (
                  <div className="no-cards">
                    <p>No active gift cards found</p>
                  </div>
                ) : (
                  getActiveGiftCards().map(card => (
                    <div key={card.id} className="gift-card-item">
                      <div className="card-info">
                        <div className="card-code">{card.code}</div>
                        <div className="card-balance">€{card.balance.toFixed(2)}</div>
                        <div className="card-date">
                          Added: {new Date(card.purchaseDate || card.redeemDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="card-actions">
                        <button 
                          className="use-card-btn"
                          onClick={() => setSelectedGiftCard(card)}
                        >
                          Use Card
                        </button>
                        <button className="view-history-btn">
                          History
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {getExpiredGiftCards().length > 0 && (
                  <>
                    <h3>Expired/Used Gift Cards</h3>
                    {getExpiredGiftCards().map(card => (
                      <div key={card.id} className="gift-card-item expired">
                        <div className="card-info">
                          <div className="card-code">{card.code}</div>
                          <div className="card-balance">€{card.balance.toFixed(2)}</div>
                          <div className="card-status">Used/Expired</div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedGiftCard && (
          <div className="use-gift-card-modal">
            <div className="use-card-content">
              <h3>Use Gift Card</h3>
              <p>Gift Card: {selectedGiftCard.code}</p>
              <p>Available Balance: €{selectedGiftCard.balance.toFixed(2)}</p>
              
              <div className="form-group">
                <label>Amount to Use:</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(e.target.value)}
                  max={selectedGiftCard.balance}
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div className="use-card-actions">
                <button 
                  className="confirm-use-btn"
                  onClick={() => handleUseGiftCard(selectedGiftCard)}
                >
                  Use €{redeemAmount || '0.00'}
                </button>
                <button 
                  className="cancel-use-btn"
                  onClick={() => {
                    setSelectedGiftCard(null);
                    setRedeemAmount('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCard; 