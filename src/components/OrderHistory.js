import React, { useState, useEffect } from 'react';
import './OrderHistory.css';

const OrderHistory = ({ currentUser, onBackToShop }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Load real orders from localStorage
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('userOrders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          // Filter orders for current user
          const userOrders = parsedOrders.filter(order => 
            order.userEmail === currentUser?.email
          );
          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      }
      setLoading(false);
    };

    loadOrders();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return '#f39c12';
      case 'shipped':
        return '#3498db';
      case 'delivered':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        );
      case 'shipped':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
          </svg>
        );
      case 'delivered':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
        );
      case 'cancelled':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredOrders = () => {
    if (filterStatus === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === filterStatus);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="order-history-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="order-history-container">
        <div className="order-history-header">
          <button className="back-btn" onClick={closeOrderDetails}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Orders
          </button>
          <h1>Order Details</h1>
        </div>

        <div className="order-details-content">
          <div className="order-details-main">
            <div className="order-info-card">
              <div className="order-header">
                <h2>Order {selectedOrder.id}</h2>
                <div className="order-status" style={{ color: getStatusColor(selectedOrder.status) }}>
                  {getStatusIcon(selectedOrder.status)}
                  <span>{selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</span>
                </div>
              </div>
              
              <div className="order-meta">
                <p><strong>Order Date:</strong> {formatDate(selectedOrder.date)}</p>
                <p><strong>Total:</strong> €{selectedOrder.total.toFixed(2)}</p>
                <p><strong>Items:</strong> {selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
              </div>
            </div>

            <div className="order-items-card">
              <h3>Order Items</h3>
              <div className="order-items-list">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="order-item-detail">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>€{item.price.toFixed(2)} each</p>
                    </div>
                    <div className="item-total">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shipping-info-card">
              <h3>Shipping Information</h3>
              <div className="shipping-details">
                <p><strong>{selectedOrder.shipping.firstName} {selectedOrder.shipping.lastName}</strong></p>
                <p>{selectedOrder.shipping.address}</p>
                <p>{selectedOrder.shipping.city}, {selectedOrder.shipping.postalCode}</p>
                <p>{selectedOrder.shipping.country}</p>
                <p>Email: {selectedOrder.shipping.email}</p>
                <p>Phone: {selectedOrder.shipping.phone}</p>
              </div>
            </div>
          </div>

          <div className="tracking-sidebar">
            <div className="tracking-card">
              <h3>Tracking Information</h3>
              <div className="tracking-number">
                <p><strong>Tracking Number:</strong></p>
                <p className="tracking-code">{selectedOrder.tracking.number}</p>
                <p><strong>Carrier:</strong> {selectedOrder.tracking.carrier}</p>
              </div>
              
              <div className="tracking-timeline">
                <h4>Tracking Updates</h4>
                <div className="timeline">
                  {selectedOrder.tracking.updates.map((update, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h5>{update.status}</h5>
                          <span className="timeline-date">{formatDate(update.date)}</span>
                        </div>
                        <p>{update.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <button className="back-btn" onClick={onBackToShop}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Shop
        </button>
        <h1>My Orders</h1>
      </div>

      <div className="order-history-content">
        <div className="order-filters">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Orders ({orders.length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'processing' ? 'active' : ''}`}
              onClick={() => setFilterStatus('processing')}
            >
              Processing ({orders.filter(o => o.status === 'processing').length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'shipped' ? 'active' : ''}`}
              onClick={() => setFilterStatus('shipped')}
            >
              Shipped ({orders.filter(o => o.status === 'shipped').length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'delivered' ? 'active' : ''}`}
              onClick={() => setFilterStatus('delivered')}
            >
              Delivered ({orders.filter(o => o.status === 'delivered').length})
            </button>
          </div>
        </div>

        <div className="orders-list">
          {getFilteredOrders().length === 0 ? (
            <div className="no-orders">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
              </svg>
              <h3>No orders found</h3>
              <p>
                {orders.length === 0 
                  ? "You haven't placed any orders yet. Start shopping to see your order history here!"
                  : "You don't have any orders with this status yet."
                }
              </p>
              {orders.length === 0 && (
                <button className="start-shopping-btn" onClick={onBackToShop}>
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            getFilteredOrders().map(order => (
              <div key={order.id} className="order-card" onClick={() => openOrderDetails(order)}>
                <div className="order-card-header">
                  <div className="order-info">
                    <h3>Order {order.id}</h3>
                    <p className="order-date">{formatDate(order.date)}</p>
                  </div>
                  <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                    {getStatusIcon(order.status)}
                    <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </div>
                </div>
                
                <div className="order-items-preview">
                  {order.items.slice(0, 2).map(item => (
                    <div key={item.id} className="order-item-preview">
                      <img src={item.image} alt={item.name} />
                      <div className="item-preview-info">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div className="more-items">
                      +{order.items.length - 2} more items
                    </div>
                  )}
                </div>
                
                <div className="order-card-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">€{order.total.toFixed(2)}</span>
                  </div>
                  <button className="view-details-btn">
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-7-7l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory; 