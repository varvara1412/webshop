import React, { useState, useEffect, useRef } from 'react';
import './CustomerSupportChat.css';

const CustomerSupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState('online'); // online, away, offline
  const [agentInfo, setAgentInfo] = useState({
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'Customer Support Specialist'
  });
  const messagesEndRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: 'agent',
        content: `Hi there! 👋 I'm ${agentInfo.name}, your customer support specialist. How can I help you today?`,
        timestamp: new Date(),
        agent: agentInfo
      }
    ]);
  }, [agentInfo.name]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Automated responses based on keywords
  const getAutoResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('order') || lowerMessage.includes('tracking')) {
      return "I'd be happy to help you with your order! Could you please provide your order number? You can find it in your order confirmation email or in your account dashboard.";
    }
    
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return "For returns and refunds, you can initiate the process through your account dashboard. We offer a 30-day return policy for most items. Would you like me to guide you through the return process?";
    }
    
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return "We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Shipping costs vary based on your location and order value. Would you like me to check shipping options for your area?";
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('billing')) {
      return "We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely. Is there a specific payment issue you're experiencing?";
    }
    
    if (lowerMessage.includes('stock') || lowerMessage.includes('available')) {
      return "I can help you check product availability! Could you please let me know which product you're interested in? I can also set up a back-in-stock notification for you.";
    }
    
    if (lowerMessage.includes('account') || lowerMessage.includes('login')) {
      return "For account-related issues, you can reset your password using the 'Forgot Password' link on the login page. If you're still having trouble, I can help you troubleshoot further.";
    }
    
    return "Thank you for your message! I'm here to help. Could you please provide more details about your inquiry so I can assist you better?";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const autoResponse = getAutoResponse(inputMessage);
      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: autoResponse,
        timestamp: new Date(),
        agent: agentInfo
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = () => {
    switch (chatStatus) {
      case 'online': return '#10b981';
      case 'away': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (chatStatus) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="customer-support-chat">
      {/* Chat Widget Button */}
      <button 
        className={`chat-widget-button ${isOpen ? 'hidden' : ''}`}
        onClick={toggleChat}
        aria-label="Open customer support chat"
      >
        <div className="chat-widget-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div className="chat-widget-badge">1</div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="agent-avatar">
                <img src={agentInfo.avatar} alt={agentInfo.name} />
                <div 
                  className="status-indicator" 
                  style={{ backgroundColor: getStatusColor() }}
                ></div>
              </div>
              <div className="agent-details">
                <h3>{agentInfo.name}</h3>
                <p>{agentInfo.role}</p>
                <span className="status-text" style={{ color: getStatusColor() }}>
                  {getStatusText()}
                </span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button 
                className="minimize-btn"
                onClick={toggleChat}
                aria-label="Minimize chat"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.type === 'user' ? 'user-message' : 'agent-message'}`}
              >
                {message.type === 'agent' && (
                  <div className="message-avatar">
                    <img src={message.agent.avatar} alt={message.agent.name} />
                  </div>
                )}
                <div className="message-content">
                  <div className="message-bubble">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message agent-message">
                <div className="message-avatar">
                  <img src={agentInfo.avatar} alt={agentInfo.name} />
                </div>
                <div className="message-content">
                  <div className="message-bubble typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button 
              className="quick-action-btn"
              onClick={() => setInputMessage("I need help with my order")}
            >
              Order Help
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => setInputMessage("I want to return an item")}
            >
              Returns
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => setInputMessage("What are your shipping options?")}
            >
              Shipping
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => setInputMessage("I have a payment issue")}
            >
              Payment
            </button>
          </div>

          {/* Chat Input */}
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <textarea
                className="chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows="1"
                disabled={isTyping}
              />
              <button 
                className="send-button"
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                aria-label="Send message"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>
            <div className="chat-footer">
              <span className="chat-footer-text">
                Press Enter to send, Shift+Enter for new line
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSupportChat; 