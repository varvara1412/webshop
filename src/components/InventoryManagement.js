import React, { useState, useEffect } from 'react';
import './InventoryManagement.css';

const InventoryManagement = ({ currentUser, onClose, onStockUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockUpdate, setStockUpdate] = useState({ quantity: '', reason: '' });
  const [notifications, setNotifications] = useState([]);
  const [preOrders, setPreOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');

  // Sample inventory data with more detailed stock information
  const sampleInventory = [
    {
      id: 1,
      name: "Sony WH-1000XM4 Wireless Headphones",
      currentStock: 15,
      minStockLevel: 5,
      maxStockLevel: 50,
      reorderPoint: 10,
      supplier: "Sony Electronics",
      lastRestocked: "2024-01-15",
      expectedRestock: "2024-02-01",
      status: "in-stock"
    },
    {
      id: 2,
      name: "Apple Watch Series 8",
      currentStock: 8,
      minStockLevel: 3,
      maxStockLevel: 25,
      reorderPoint: 8,
      supplier: "Apple Inc.",
      lastRestocked: "2024-01-10",
      expectedRestock: "2024-01-25",
      status: "low-stock"
    },
    {
      id: 3,
      name: "Premium Organic Cotton T-Shirt",
      currentStock: 45,
      minStockLevel: 10,
      maxStockLevel: 100,
      reorderPoint: 20,
      supplier: "EcoFabrics Co.",
      lastRestocked: "2024-01-20",
      expectedRestock: "2024-02-05",
      status: "in-stock"
    },
    {
      id: 4,
      name: "Hydro Flask Water Bottle",
      currentStock: 32,
      minStockLevel: 15,
      maxStockLevel: 80,
      reorderPoint: 25,
      supplier: "Hydro Flask",
      lastRestocked: "2024-01-18",
      expectedRestock: "2024-02-02",
      status: "in-stock"
    },
    {
      id: 5,
      name: "Samsung Wireless Charger",
      currentStock: 20,
      minStockLevel: 8,
      maxStockLevel: 40,
      reorderPoint: 15,
      supplier: "Samsung Electronics",
      lastRestocked: "2024-01-12",
      expectedRestock: "2024-01-28",
      status: "in-stock"
    },
    {
      id: 6,
      name: "Lululemon Yoga Mat",
      currentStock: 12,
      minStockLevel: 5,
      maxStockLevel: 30,
      reorderPoint: 10,
      supplier: "Lululemon Athletica",
      lastRestocked: "2024-01-08",
      expectedRestock: "2024-01-30",
      status: "low-stock"
    },
    {
      id: 7,
      name: "Nike Air Max 270",
      currentStock: 18,
      minStockLevel: 8,
      maxStockLevel: 35,
      reorderPoint: 12,
      supplier: "Nike Inc.",
      lastRestocked: "2024-01-14",
      expectedRestock: "2024-02-03",
      status: "in-stock"
    },
    {
      id: 8,
      name: "Levi's 501 Original Jeans",
      currentStock: 25,
      minStockLevel: 10,
      maxStockLevel: 60,
      reorderPoint: 20,
      supplier: "Levi Strauss & Co.",
      lastRestocked: "2024-01-16",
      expectedRestock: "2024-02-01",
      status: "in-stock"
    },
    {
      id: 9,
      name: "Dyson V15 Detect Vacuum",
      currentStock: 5,
      minStockLevel: 2,
      maxStockLevel: 15,
      reorderPoint: 5,
      supplier: "Dyson Ltd.",
      lastRestocked: "2024-01-05",
      expectedRestock: "2024-01-25",
      status: "critical-stock"
    },
    {
      id: 10,
      name: "Canon EOS R6 Camera",
      currentStock: 3,
      minStockLevel: 1,
      maxStockLevel: 10,
      reorderPoint: 3,
      supplier: "Canon Inc.",
      lastRestocked: "2024-01-03",
      expectedRestock: "2024-01-20",
      status: "critical-stock"
    },
    {
      id: 11,
      name: "Adidas Ultraboost 22",
      currentStock: 22,
      minStockLevel: 8,
      maxStockLevel: 40,
      reorderPoint: 15,
      supplier: "Adidas AG",
      lastRestocked: "2024-01-17",
      expectedRestock: "2024-02-04",
      status: "in-stock"
    },
    {
      id: 12,
      name: "Ray-Ban Aviator Classic",
      currentStock: 15,
      minStockLevel: 5,
      maxStockLevel: 30,
      reorderPoint: 10,
      supplier: "Luxottica Group",
      lastRestocked: "2024-01-13",
      expectedRestock: "2024-01-29",
      status: "in-stock"
    },
    {
      id: 13,
      name: "Philips Hue Smart Bulb Set",
      currentStock: 28,
      minStockLevel: 10,
      maxStockLevel: 50,
      reorderPoint: 20,
      supplier: "Philips Lighting",
      lastRestocked: "2024-01-19",
      expectedRestock: "2024-02-06",
      status: "in-stock"
    },
    {
      id: 14,
      name: "GoPro HERO10 Black",
      currentStock: 10,
      minStockLevel: 4,
      maxStockLevel: 25,
      reorderPoint: 8,
      supplier: "GoPro Inc.",
      lastRestocked: "2024-01-11",
      expectedRestock: "2024-01-27",
      status: "low-stock"
    },
    {
      id: 15,
      name: "Under Armour Tech 2.0 T-Shirt",
      currentStock: 35,
      minStockLevel: 12,
      maxStockLevel: 70,
      reorderPoint: 25,
      supplier: "Under Armour Inc.",
      lastRestocked: "2024-01-21",
      expectedRestock: "2024-02-07",
      status: "in-stock"
    },
    // New Products - Books & Literature
    {
      id: 16,
      name: "The Art of Programming - Complete Guide",
      currentStock: 42,
      minStockLevel: 15,
      maxStockLevel: 80,
      reorderPoint: 30,
      supplier: "TechBooks Publishing",
      lastRestocked: "2024-01-22",
      expectedRestock: "2024-02-10",
      status: "in-stock"
    },
    {
      id: 17,
      name: "Mindful Living: A Daily Practice",
      currentStock: 28,
      minStockLevel: 10,
      maxStockLevel: 50,
      reorderPoint: 20,
      supplier: "Wellness Press",
      lastRestocked: "2024-01-20",
      expectedRestock: "2024-02-08",
      status: "in-stock"
    },
    // Beauty & Personal Care
    {
      id: 18,
      name: "La Mer Moisturizing Cream",
      currentStock: 8,
      minStockLevel: 3,
      maxStockLevel: 20,
      reorderPoint: 8,
      supplier: "Estée Lauder",
      lastRestocked: "2024-01-15",
      expectedRestock: "2024-01-28",
      status: "low-stock"
    },
    {
      id: 19,
      name: "Dyson Airwrap Multi-Styler",
      currentStock: 12,
      minStockLevel: 5,
      maxStockLevel: 25,
      reorderPoint: 10,
      supplier: "Dyson Ltd.",
      lastRestocked: "2024-01-18",
      expectedRestock: "2024-02-01",
      status: "low-stock"
    },
    {
      id: 20,
      name: "Chanel N°5 Eau de Parfum",
      currentStock: 25,
      minStockLevel: 8,
      maxStockLevel: 40,
      reorderPoint: 15,
      supplier: "Chanel",
      lastRestocked: "2024-01-16",
      expectedRestock: "2024-02-05",
      status: "in-stock"
    },
    // Toys & Games
    {
      id: 21,
      name: "LEGO Star Wars Millennium Falcon",
      currentStock: 5,
      minStockLevel: 2,
      maxStockLevel: 10,
      reorderPoint: 5,
      supplier: "LEGO Group",
      lastRestocked: "2024-01-10",
      expectedRestock: "2024-02-15",
      status: "critical-stock"
    },
    {
      id: 22,
      name: "Nintendo Switch OLED",
      currentStock: 15,
      minStockLevel: 5,
      maxStockLevel: 30,
      reorderPoint: 10,
      supplier: "Nintendo",
      lastRestocked: "2024-01-19",
      expectedRestock: "2024-02-03",
      status: "in-stock"
    },
    {
      id: 23,
      name: "Catan Board Game",
      currentStock: 32,
      minStockLevel: 12,
      maxStockLevel: 60,
      reorderPoint: 25,
      supplier: "Catan Studio",
      lastRestocked: "2024-01-17",
      expectedRestock: "2024-02-08",
      status: "in-stock"
    },
    // Automotive
    {
      id: 24,
      name: "Dash Cam Pro HD",
      currentStock: 18,
      minStockLevel: 8,
      maxStockLevel: 35,
      reorderPoint: 15,
      supplier: "AutoTech Solutions",
      lastRestocked: "2024-01-14",
      expectedRestock: "2024-02-01",
      status: "in-stock"
    },
    {
      id: 25,
      name: "Car Phone Mount",
      currentStock: 45,
      minStockLevel: 15,
      maxStockLevel: 80,
      reorderPoint: 30,
      supplier: "CarAccessories Pro",
      lastRestocked: "2024-01-21",
      expectedRestock: "2024-02-10",
      status: "in-stock"
    },
    // Kitchen & Dining
    {
      id: 26,
      name: "KitchenAid Stand Mixer",
      currentStock: 22,
      minStockLevel: 8,
      maxStockLevel: 40,
      reorderPoint: 15,
      supplier: "KitchenAid",
      lastRestocked: "2024-01-18",
      expectedRestock: "2024-02-05",
      status: "in-stock"
    },
    {
      id: 27,
      name: "Instant Pot Duo 7-in-1",
      currentStock: 35,
      minStockLevel: 12,
      maxStockLevel: 60,
      reorderPoint: 25,
      supplier: "Instant Pot",
      lastRestocked: "2024-01-20",
      expectedRestock: "2024-02-08",
      status: "in-stock"
    },
    {
      id: 28,
      name: "Wüsthof Classic Chef's Knife",
      currentStock: 18,
      minStockLevel: 8,
      maxStockLevel: 35,
      reorderPoint: 15,
      supplier: "Wüsthof",
      lastRestocked: "2024-01-16",
      expectedRestock: "2024-02-03",
      status: "in-stock"
    },
    // Health & Wellness
    {
      id: 29,
      name: "Fitbit Charge 5",
      currentStock: 28,
      minStockLevel: 10,
      maxStockLevel: 50,
      reorderPoint: 20,
      supplier: "Fitbit",
      lastRestocked: "2024-01-19",
      expectedRestock: "2024-02-01",
      status: "in-stock"
    },
    {
      id: 30,
      name: "Vitamix Professional Series 750",
      currentStock: 12,
      minStockLevel: 5,
      maxStockLevel: 25,
      reorderPoint: 10,
      supplier: "Vitamix",
      lastRestocked: "2024-01-15",
      expectedRestock: "2024-02-05",
      status: "low-stock"
    },
    // Pet Supplies
    {
      id: 31,
      name: "Furbo Dog Camera",
      currentStock: 15,
      minStockLevel: 6,
      maxStockLevel: 30,
      reorderPoint: 12,
      supplier: "Furbo",
      lastRestocked: "2024-01-17",
      expectedRestock: "2024-02-03",
      status: "in-stock"
    },
    {
      id: 32,
      name: "Premium Cat Tree",
      currentStock: 22,
      minStockLevel: 8,
      maxStockLevel: 40,
      reorderPoint: 15,
      supplier: "PetParadise",
      lastRestocked: "2024-01-20",
      expectedRestock: "2024-02-08",
      status: "in-stock"
    },
    // Office & Stationery
    {
      id: 33,
      name: "Apple iPad Pro 12.9",
      currentStock: 8,
      minStockLevel: 3,
      maxStockLevel: 20,
      reorderPoint: 8,
      supplier: "Apple Inc.",
      lastRestocked: "2024-01-12",
      expectedRestock: "2024-01-30",
      status: "low-stock"
    },
    {
      id: 34,
      name: "Moleskine Classic Notebook",
      currentStock: 45,
      minStockLevel: 15,
      maxStockLevel: 80,
      reorderPoint: 30,
      supplier: "Moleskine",
      lastRestocked: "2024-01-22",
      expectedRestock: "2024-02-10",
      status: "in-stock"
    },
    // Outdoor & Camping
    {
      id: 35,
      name: "Coleman 4-Person Tent",
      currentStock: 18,
      minStockLevel: 8,
      maxStockLevel: 35,
      reorderPoint: 15,
      supplier: "Coleman",
      lastRestocked: "2024-01-18",
      expectedRestock: "2024-02-05",
      status: "in-stock"
    },
    {
      id: 36,
      name: "Yeti Tundra 45 Cooler",
      currentStock: 12,
      minStockLevel: 5,
      maxStockLevel: 25,
      reorderPoint: 10,
      supplier: "Yeti",
      lastRestocked: "2024-01-14",
      expectedRestock: "2024-02-01",
      status: "low-stock"
    },
    // Musical Instruments
    {
      id: 37,
      name: "Fender Stratocaster Electric Guitar",
      currentStock: 8,
      minStockLevel: 3,
      maxStockLevel: 15,
      reorderPoint: 8,
      supplier: "Fender",
      lastRestocked: "2024-01-10",
      expectedRestock: "2024-02-15",
      status: "low-stock"
    },
    {
      id: 38,
      name: "Yamaha P-125 Digital Piano",
      currentStock: 15,
      minStockLevel: 6,
      maxStockLevel: 25,
      reorderPoint: 12,
      supplier: "Yamaha",
      lastRestocked: "2024-01-16",
      expectedRestock: "2024-02-08",
      status: "in-stock"
    },
    // Baby & Kids
    {
      id: 39,
      name: "Graco 4-in-1 Convertible Car Seat",
      currentStock: 25,
      minStockLevel: 10,
      maxStockLevel: 45,
      reorderPoint: 20,
      supplier: "Graco",
      lastRestocked: "2024-01-19",
      expectedRestock: "2024-02-05",
      status: "in-stock"
    },
    {
      id: 40,
      name: "Fisher-Price Deluxe Kick 'n Play Piano Gym",
      currentStock: 32,
      minStockLevel: 12,
      maxStockLevel: 60,
      reorderPoint: 25,
      supplier: "Fisher-Price",
      lastRestocked: "2024-01-21",
      expectedRestock: "2024-02-10",
      status: "in-stock"
    }
  ];

  // Sample notifications data
  const sampleNotifications = [
    {
      id: 1,
      productId: 2,
      productName: "Apple Watch Series 8",
      type: "low-stock",
      message: "Stock level is below reorder point (8 units remaining)",
      timestamp: "2024-01-22T10:30:00Z",
      read: false
    },
    {
      id: 2,
      productId: 6,
      productName: "Lululemon Yoga Mat",
      type: "low-stock",
      message: "Stock level is below reorder point (12 units remaining)",
      timestamp: "2024-01-22T09:15:00Z",
      read: false
    },
    {
      id: 3,
      productId: 9,
      productName: "Dyson V15 Detect Vacuum",
      type: "critical-stock",
      message: "Critical stock level! Only 5 units remaining",
      timestamp: "2024-01-22T08:45:00Z",
      read: true
    },
    {
      id: 4,
      productId: 10,
      productName: "Canon EOS R6 Camera",
      type: "critical-stock",
      message: "Critical stock level! Only 3 units remaining",
      timestamp: "2024-01-22T08:30:00Z",
      read: true
    },
    {
      id: 5,
      productId: 14,
      productName: "GoPro HERO10 Black",
      type: "low-stock",
      message: "Stock level is below reorder point (10 units remaining)",
      timestamp: "2024-01-22T07:20:00Z",
      read: false
    }
  ];

  // Sample pre-orders data
  const samplePreOrders = [
    {
      id: 1,
      productId: 2,
      productName: "Apple Watch Series 8",
      customerEmail: "john.doe@email.com",
      customerName: "John Doe",
      quantity: 1,
      orderDate: "2024-01-20T14:30:00Z",
      expectedRestock: "2024-01-25",
      status: "pending"
    },
    {
      id: 2,
      productId: 6,
      productName: "Lululemon Yoga Mat",
      customerEmail: "jane.smith@email.com",
      customerName: "Jane Smith",
      quantity: 2,
      orderDate: "2024-01-19T16:45:00Z",
      expectedRestock: "2024-01-30",
      status: "pending"
    },
    {
      id: 3,
      productId: 9,
      productName: "Dyson V15 Detect Vacuum",
      customerEmail: "mike.wilson@email.com",
      customerName: "Mike Wilson",
      quantity: 1,
      orderDate: "2024-01-18T11:20:00Z",
      expectedRestock: "2024-01-25",
      status: "pending"
    }
  ];

  useEffect(() => {
    // Simulate API call to load inventory data
    setTimeout(() => {
      setProducts(sampleInventory);
      setNotifications(sampleNotifications);
      setPreOrders(samplePreOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStockUpdate = (productId, newQuantity, reason) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? {
              ...product,
              currentStock: parseInt(newQuantity),
              status: getStockStatus(parseInt(newQuantity), product.reorderPoint, product.minStockLevel),
              lastRestocked: new Date().toISOString().split('T')[0]
            }
          : product
      )
    );

    // Add notification for stock update
    const product = products.find(p => p.id === productId);
    const newNotification = {
      id: Date.now(),
      productId,
      productName: product.name,
      type: "stock-update",
      message: `Stock updated to ${newQuantity} units. Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setStockUpdate({ quantity: '', reason: '' });
    setSelectedProduct(null);

    // Notify parent component
    if (onStockUpdate) {
      onStockUpdate(productId, parseInt(newQuantity));
    }
  };

  const getStockStatus = (currentStock, reorderPoint, minStockLevel) => {
    if (currentStock <= minStockLevel) return "critical-stock";
    if (currentStock <= reorderPoint) return "low-stock";
    return "in-stock";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "critical-stock": return "#dc3545";
      case "low-stock": return "#ffc107";
      case "in-stock": return "#28a745";
      default: return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "critical-stock": return "Critical";
      case "low-stock": return "Low";
      case "in-stock": return "In Stock";
      default: return "Unknown";
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const fulfillPreOrder = (preOrderId) => {
    setPreOrders(prev =>
      prev.map(order =>
        order.id === preOrderId
          ? { ...order, status: "fulfilled" }
          : order
      )
    );
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="inventory-management">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-management">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="inventory-tabs">
        <button 
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
          {unreadNotificationsCount > 0 && (
            <span className="notification-badge">{unreadNotificationsCount}</span>
          )}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'pre-orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('pre-orders')}
        >
          Pre-Orders
        </button>
      </div>

      {activeTab === 'inventory' && (
        <div className="inventory-content">
          <div className="inventory-stats">
            <div className="stat-card">
              <h3>Total Products</h3>
              <span className="stat-number">{products.length}</span>
            </div>
            <div className="stat-card critical">
              <h3>Critical Stock</h3>
              <span className="stat-number">
                {products.filter(p => p.status === 'critical-stock').length}
              </span>
            </div>
            <div className="stat-card low">
              <h3>Low Stock</h3>
              <span className="stat-number">
                {products.filter(p => p.status === 'low-stock').length}
              </span>
            </div>
            <div className="stat-card good">
              <h3>In Stock</h3>
              <span className="stat-number">
                {products.filter(p => p.status === 'in-stock').length}
              </span>
            </div>
          </div>

          <div className="inventory-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Min Level</th>
                  <th>Reorder Point</th>
                  <th>Status</th>
                  <th>Last Restocked</th>
                  <th>Expected Restock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className={product.status}>
                    <td>
                      <div className="product-info">
                        <strong>{product.name}</strong>
                        <small>Supplier: {product.supplier}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`stock-count ${product.status}`}>
                        {product.currentStock}
                      </span>
                    </td>
                    <td>{product.minStockLevel}</td>
                    <td>{product.reorderPoint}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(product.status) }}
                      >
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td>{product.lastRestocked}</td>
                    <td>{product.expectedRestock}</td>
                    <td>
                      <button 
                        className="update-stock-btn"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="notifications-content">
          <h3>Stock Notifications</h3>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications to display</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {notification.type === 'critical-stock' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    )}
                    {notification.type === 'low-stock' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    )}
                    {notification.type === 'stock-update' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    )}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.productName}</h4>
                    <p>{notification.message}</p>
                    <small>{new Date(notification.timestamp).toLocaleString()}</small>
                  </div>
                  {!notification.read && <div className="unread-indicator"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'pre-orders' && (
        <div className="pre-orders-content">
          <h3>Pre-Orders</h3>
          <div className="pre-orders-list">
            {preOrders.length === 0 ? (
              <div className="no-pre-orders">
                <p>No pre-orders to display</p>
              </div>
            ) : (
              preOrders.map(order => (
                <div key={order.id} className="pre-order-item">
                  <div className="pre-order-info">
                    <h4>{order.productName}</h4>
                    <p><strong>Customer:</strong> {order.customerName} ({order.customerEmail})</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p><strong>Expected Restock:</strong> {order.expectedRestock}</p>
                  </div>
                  <div className="pre-order-actions">
                    <span className={`status-badge ${order.status}`}>
                      {order.status === 'pending' ? 'Pending' : 'Fulfilled'}
                    </span>
                    {order.status === 'pending' && (
                      <button 
                        className="fulfill-btn"
                        onClick={() => fulfillPreOrder(order.id)}
                      >
                        Mark as Fulfilled
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="stock-update-modal">
            <div className="modal-header">
              <h3>Update Stock - {selectedProduct.name}</h3>
              <button className="close-btn" onClick={() => setSelectedProduct(null)}>×</button>
            </div>
            <div className="modal-content">
              <div className="current-stock">
                <p><strong>Current Stock:</strong> {selectedProduct.currentStock} units</p>
                <p><strong>Reorder Point:</strong> {selectedProduct.reorderPoint} units</p>
                <p><strong>Min Stock Level:</strong> {selectedProduct.minStockLevel} units</p>
              </div>
              <div className="stock-update-form">
                <div className="form-group">
                  <label>New Stock Quantity:</label>
                  <input
                    type="number"
                    min="0"
                    value={stockUpdate.quantity}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, quantity: e.target.value })}
                    placeholder="Enter new quantity"
                  />
                </div>
                <div className="form-group">
                  <label>Reason for Update:</label>
                  <select
                    value={stockUpdate.reason}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, reason: e.target.value })}
                  >
                    <option value="">Select a reason</option>
                    <option value="restock">Restock from supplier</option>
                    <option value="return">Customer return</option>
                    <option value="damage">Damaged goods</option>
                    <option value="adjustment">Inventory adjustment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="update-btn"
                    onClick={() => handleStockUpdate(selectedProduct.id, stockUpdate.quantity, stockUpdate.reason)}
                    disabled={!stockUpdate.quantity || !stockUpdate.reason}
                  >
                    Update Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement; 