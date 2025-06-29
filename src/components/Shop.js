import React, { useState, useEffect } from 'react';
import './Shop.css';
import Checkout from './Checkout';
import OrderHistory from './OrderHistory';
import ProductDetails from './ProductDetails';
import Wishlist from './Wishlist';
import GiftCard from './GiftCard';
import InventoryManagement from './InventoryManagement';
import BackInStockNotification from './BackInStockNotification';

const Shop = ({ currentUser }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showGiftCard, setShowGiftCard] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showBackInStock, setShowBackInStock] = useState(false);
  const [backInStockProduct, setBackInStockProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [backInStockNotifications, setBackInStockNotifications] = useState([]);
  const [preOrders, setPreOrders] = useState([]);

  // Enhanced products data with real images and more variety
  const sampleProducts = [
    {
      id: 1,
      name: "Sony WH-1000XM4 Wireless Headphones",
      price: 349.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      description: "Industry-leading noise canceling wireless headphones with 30-hour battery life",
      category: "Electronics",
      rating: 4.8,
      reviewCount: 1247,
      stock: 15,
      minStockLevel: 5,
      reorderPoint: 10,
      supplier: "Sony Electronics",
      expectedRestock: "2024-02-01"
    },
    {
      id: 2,
      name: "Apple Watch Series 8",
      price: 429.99,
      image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop",
      description: "Advanced health monitoring and fitness tracking with cellular connectivity",
      category: "Electronics",
      rating: 4.7,
      reviewCount: 892,
      stock: 8,
      minStockLevel: 3,
      reorderPoint: 8,
      supplier: "Apple Inc.",
      expectedRestock: "2024-01-25"
    },
    {
      id: 3,
      name: "Premium Organic Cotton T-Shirt",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      description: "Ultra-soft organic cotton t-shirt with sustainable production",
      category: "Clothing",
      rating: 4.5,
      reviewCount: 567,
      stock: 45,
      minStockLevel: 10,
      reorderPoint: 20,
      supplier: "EcoFabrics Co.",
      expectedRestock: "2024-02-05"
    },
    {
      id: 4,
      name: "Hydro Flask Water Bottle",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
      description: "Vacuum insulated stainless steel bottle keeps drinks cold for 24 hours",
      category: "Home & Garden",
      rating: 4.6,
      reviewCount: 1234,
      stock: 32,
      minStockLevel: 15,
      reorderPoint: 25,
      supplier: "Hydro Flask",
      expectedRestock: "2024-02-02"
    },
    {
      id: 5,
      name: "Samsung Wireless Charger",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1609592806596-b43bada2f4a2?w=400&h=400&fit=crop",
      description: "Fast wireless charging pad compatible with all Qi-enabled devices",
      category: "Electronics",
      rating: 4.4,
      reviewCount: 445,
      stock: 20,
      minStockLevel: 8,
      reorderPoint: 15,
      supplier: "Samsung Electronics",
      expectedRestock: "2024-01-28"
    },
    {
      id: 6,
      name: "Lululemon Yoga Mat",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
      description: "Premium non-slip yoga mat with alignment lines for perfect poses",
      category: "Sports",
      rating: 4.9,
      reviewCount: 678,
      stock: 12,
      minStockLevel: 5,
      reorderPoint: 10,
      supplier: "Lululemon Athletica",
      expectedRestock: "2024-01-30"
    },
    {
      id: 7,
      name: "Nike Air Max 270",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      description: "Comfortable running shoes with Air Max technology for maximum cushioning",
      category: "Sports",
      rating: 4.6,
      reviewCount: 892,
      stock: 18,
      minStockLevel: 8,
      reorderPoint: 12,
      supplier: "Nike Inc.",
      expectedRestock: "2024-02-03"
    },
    {
      id: 8,
      name: "Levi's 501 Original Jeans",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
      description: "Classic straight-leg jeans with authentic vintage styling",
      category: "Clothing",
      rating: 4.3,
      reviewCount: 445,
      stock: 25,
      minStockLevel: 10,
      reorderPoint: 20,
      supplier: "Levi Strauss & Co.",
      expectedRestock: "2024-02-01"
    },
    {
      id: 9,
      name: "Dyson V15 Detect Vacuum",
      price: 699.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "Cord-free vacuum with laser technology and 60-minute runtime",
      category: "Home & Garden",
      rating: 4.8,
      reviewCount: 234,
      stock: 5,
      minStockLevel: 2,
      reorderPoint: 5,
      supplier: "Dyson Ltd.",
      expectedRestock: "2024-01-25"
    },
    {
      id: 10,
      name: "Canon EOS R6 Camera",
      price: 2499.99,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
      description: "Full-frame mirrorless camera with 4K video and advanced autofocus",
      category: "Electronics",
      rating: 4.9,
      reviewCount: 156,
      stock: 3,
      minStockLevel: 1,
      reorderPoint: 3,
      supplier: "Canon Inc.",
      expectedRestock: "2024-01-20"
    },
    {
      id: 11,
      name: "Adidas Ultraboost 22",
      price: 179.99,
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop",
      description: "Energy-returning running shoes with responsive Boost midsole",
      category: "Sports",
      rating: 4.7,
      reviewCount: 567,
      stock: 22,
      minStockLevel: 8,
      reorderPoint: 15,
      supplier: "Adidas AG",
      expectedRestock: "2024-02-04"
    },
    {
      id: 12,
      name: "Ray-Ban Aviator Classic",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
      description: "Timeless aviator sunglasses with UV400 protection and gold frame",
      category: "Clothing",
      rating: 4.5,
      reviewCount: 789,
      stock: 15,
      minStockLevel: 5,
      reorderPoint: 10,
      supplier: "Luxottica Group",
      expectedRestock: "2024-01-29"
    },
    {
      id: 13,
      name: "Philips Hue Smart Bulb Set",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
      description: "Smart LED bulbs with 16 million colors and voice control",
      category: "Home & Garden",
      rating: 4.4,
      reviewCount: 334,
      stock: 28,
      minStockLevel: 10,
      reorderPoint: 20,
      supplier: "Philips Lighting",
      expectedRestock: "2024-02-06"
    },
    {
      id: 14,
      name: "GoPro HERO10 Black",
      price: 449.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "5.3K video camera with HyperSmooth 4.0 stabilization",
      category: "Electronics",
      rating: 4.6,
      reviewCount: 445,
      stock: 10,
      minStockLevel: 4,
      reorderPoint: 8,
      supplier: "GoPro Inc.",
      expectedRestock: "2024-01-27"
    },
    {
      id: 15,
      name: "Under Armour Tech 2.0 T-Shirt",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      description: "Moisture-wicking performance shirt with anti-odor technology",
      category: "Sports",
      rating: 4.3,
      reviewCount: 678,
      stock: 35,
      minStockLevel: 12,
      reorderPoint: 25,
      supplier: "Under Armour Inc.",
      expectedRestock: "2024-02-07"
    },
    // New Products - Books & Literature
    {
      id: 16,
      name: "The Art of Programming - Complete Guide",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
      description: "Comprehensive guide to modern programming techniques and best practices",
      category: "Books",
      rating: 4.8,
      reviewCount: 234,
      stock: 42,
      minStockLevel: 15,
      reorderPoint: 30,
      supplier: "TechBooks Publishing",
      expectedRestock: "2024-02-10"
    },
    {
      id: 17,
      name: "Mindful Living: A Daily Practice",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
      description: "Transform your life with mindfulness and meditation practices",
      category: "Books",
      rating: 4.6,
      reviewCount: 189,
      stock: 28,
      minStockLevel: 10,
      reorderPoint: 20,
      supplier: "Wellness Press",
      expectedRestock: "2024-02-08"
    },
    // Beauty & Personal Care
    {
      id: 18,
      name: "La Mer Moisturizing Cream",
      price: 349.99,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      description: "Luxury moisturizing cream with marine ingredients for radiant skin",
      category: "Beauty & Personal Care",
      rating: 4.9,
      reviewCount: 567,
      stock: 8,
      minStockLevel: 3,
      reorderPoint: 8,
      supplier: "Estée Lauder",
      expectedRestock: "2024-01-28"
    },
    {
      id: 19,
      name: "Dyson Airwrap Multi-Styler",
      price: 599.99,
      image: "https://images.unsplash.com/photo-1522338146-11119349dcfc?w=400&h=400&fit=crop",
      description: "Revolutionary hair styling tool with multiple attachments",
      category: "Beauty & Personal Care",
      rating: 4.7,
      reviewCount: 892,
      stock: 12,
      minStockLevel: 5,
      reorderPoint: 10,
      supplier: "Dyson Ltd.",
      expectedRestock: "2024-02-01"
    },
    {
      id: 20,
      name: "Chanel N°5 Eau de Parfum",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
      description: "Iconic fragrance with timeless elegance and sophistication",
      category: "Beauty & Personal Care",
      rating: 4.8,
      reviewCount: 1234,
      stock: 25,
      minStockLevel: 8,
      reorderPoint: 15,
      supplier: "Chanel",
      expectedRestock: "2024-02-05"
    },
    // Toys & Games
    {
      id: 21,
      name: "LEGO Star Wars Millennium Falcon",
      price: 799.99,
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
      description: "Ultimate collector's edition with 7,500+ pieces and detailed interior",
      category: "Toys & Games",
      rating: 4.9,
      reviewCount: 445,
      stock: 5,
      minStockLevel: 2,
      reorderPoint: 5,
      supplier: "LEGO Group",
      expectedRestock: "2024-02-15"
    },
    {
      id: 22,
      name: "Nintendo Switch OLED",
      price: 349.99,
      image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
      description: "Gaming console with 7-inch OLED screen and enhanced audio",
      category: "Toys & Games",
      rating: 4.8,
      reviewCount: 678,
      stock: 15,
      minStockLevel: 5,
      reorderPoint: 10,
      supplier: "Nintendo",
      expectedRestock: "2024-02-03"
    },
    {
      id: 23,
      name: "Catan Board Game",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=400&fit=crop",
      description: "Award-winning strategy game of exploration and settlement",
      category: "Toys & Games",
      rating: 4.7,
      reviewCount: 892,
      stock: 32,
      minStockLevel: 12,
      reorderPoint: 25,
      supplier: "Catan Studio",
      expectedRestock: "2024-02-08"
    },
    // Automotive
    {
      id: 24,
      name: "Dash Cam Pro HD",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "4K dash camera with GPS tracking and collision detection",
      category: "Automotive",
      rating: 4.6,
      reviewCount: 445,
      stock: 18,
      minStockLevel: 8,
      reorderPoint: 15,
      supplier: "AutoTech Solutions",
      expectedRestock: "2024-02-01"
    },
    {
      id: 25,
      name: "Car Phone Mount",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "Universal phone holder with suction cup mount for all vehicles",
      category: "Automotive",
      rating: 4.4,
      reviewCount: 567,
      stock: 45,
      minStockLevel: 15,
      reorderPoint: 30,
      supplier: "CarAccessories Pro",
      expectedRestock: "2024-02-10"
    },
    // Kitchen & Dining
    {
      id: 26,
      name: "KitchenAid Stand Mixer",
      price: 399.99,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
      description: "Professional 5-quart stand mixer with 10-speed motor",
      category: "Kitchen & Dining",
      rating: 4.9,
      reviewCount: 1234,
      stock: 22,
      minStockLevel: 8,
      reorderPoint: 15,
      supplier: "KitchenAid",
      expectedRestock: "2024-02-05"
    },
    {
      id: 27,
      name: "Instant Pot Duo 7-in-1",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
      description: "Electric pressure cooker with 7 cooking functions",
      category: "Kitchen & Dining",
      rating: 4.7,
      reviewCount: 892,
      stock: 35,
      minStockLevel: 12,
      reorderPoint: 25,
      supplier: "Instant Pot",
      expectedRestock: "2024-02-08"
    },
    {
      id: 28,
      name: "Wüsthof Classic Chef's Knife",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
      description: "8-inch forged steel chef's knife with precision edge",
      category: "Kitchen & Dining",
      rating: 4.8,
      reviewCount: 678,
      stock: 18,
      minStockLevel: 8,
      reorderPoint: 15,
      supplier: "Wüsthof",
      expectedRestock: "2024-02-03"
    },
    // Health & Wellness
    {
      id: 29,
      name: "Fitbit Charge 5",
      price: 179.99,
      image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop",
      description: "Advanced fitness tracker with heart rate monitoring and GPS",
      category: "Health & Wellness",
      rating: 4.6,
      reviewCount: 445,
      stock: 28,
      minStockLevel: 10,
      reorderPoint: 20,
      supplier: "Fitbit",
      expectedRestock: "2024-02-01"
    },
    {
      id: 30,
      name: "Vitamix Professional Series 750",
      price: 549.99,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
      description: "Professional blender with 5 pre-programmed settings",
      category: "Health & Wellness",
      rating: 4.9,
      reviewCount: 567,
      stock: 12,
      minStockLevel: 5,
      reorderPoint: 10,
      supplier: "Vitamix",
      expectedRestock: "2024-02-05"
    },
    // Pet Supplies
    {
      id: 31,
      name: "Furbo Dog Camera",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "Smart pet camera with treat dispenser and barking alerts",
      category: "Pet Supplies",
      rating: 4.7,
      reviewCount: 334,
      stock: 15,
      minStockLevel: 6,
      reorderPoint: 12,
      supplier: "Furbo",
      expectedRestock: "2024-02-03"
    },
    {
      id: 32,
      name: "Premium Cat Tree",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "Multi-level cat tree with scratching posts and cozy perches",
      category: "Pet Supplies",
      rating: 4.5,
      reviewCount: 234,
      stock: 22,
      minStockLevel: 8,
      reorderPoint: 15,
      supplier: "PetParadise",
      expectedRestock: "2024-02-08"
    },
    // Office & Stationery
    {
      id: 33,
      name: "Apple iPad Pro 12.9",
      price: 1099.99,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
      description: "12.9-inch tablet with M2 chip and Liquid Retina XDR display",
      category: "Office & Stationery",
      rating: 4.9,
      reviewCount: 789,
      stock: 8,
      minStockLevel: 3,
      reorderPoint: 8,
      supplier: "Apple Inc.",
      expectedRestock: "2024-01-30"
    },
    {
      id: 34,
      name: "Moleskine Classic Notebook",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
      description: "Premium hardcover notebook with acid-free paper",
      category: "Office & Stationery",
      rating: 4.6,
      reviewCount: 567,
      stock: 45,
      minStockLevel: 15,
      reorderPoint: 30,
      supplier: "Moleskine",
      expectedRestock: "2024-02-10"
    },
    // Outdoor & Camping
    {
      id: 35,
      name: "Coleman 4-Person Tent",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "Weather-resistant tent with easy setup and ventilation",
      category: "Outdoor & Camping",
      rating: 4.5,
      reviewCount: 445,
      stock: 18,
      minStockLevel: 8,
      reorderPoint: 15,
      supplier: "Coleman",
      expectedRestock: "2024-02-05"
    },
    {
      id: 36,
      name: "Yeti Tundra 45 Cooler",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "Premium rotomolded cooler with 5-day ice retention",
      category: "Outdoor & Camping",
      rating: 4.8,
      reviewCount: 334,
      stock: 12,
      minStockLevel: 5,
      reorderPoint: 10,
      supplier: "Yeti",
      expectedRestock: "2024-02-01"
    },
    // Musical Instruments
    {
      id: 37,
      name: "Fender Stratocaster Electric Guitar",
      price: 699.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "Classic electric guitar with maple neck and alder body",
      category: "Musical Instruments",
      rating: 4.9,
      reviewCount: 234,
      stock: 8,
      minStockLevel: 3,
      reorderPoint: 8,
      supplier: "Fender",
      expectedRestock: "2024-02-15"
    },
    {
      id: 38,
      name: "Yamaha P-125 Digital Piano",
      price: 649.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "88-key weighted digital piano with authentic sound",
      category: "Musical Instruments",
      rating: 4.7,
      reviewCount: 189,
      stock: 15,
      minStockLevel: 6,
      reorderPoint: 12,
      supplier: "Yamaha",
      expectedRestock: "2024-02-08"
    },
    // Baby & Kids
    {
      id: 39,
      name: "Graco 4-in-1 Convertible Car Seat",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "Safety-certified car seat that grows with your child",
      category: "Baby & Kids",
      rating: 4.8,
      reviewCount: 567,
      stock: 25,
      minStockLevel: 10,
      reorderPoint: 20,
      supplier: "Graco",
      expectedRestock: "2024-02-05"
    },
    {
      id: 40,
      name: "Fisher-Price Deluxe Kick 'n Play Piano Gym",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      description: "Interactive play gym with music and lights for infants",
      category: "Baby & Kids",
      rating: 4.6,
      reviewCount: 445,
      stock: 32,
      minStockLevel: 12,
      reorderPoint: 25,
      supplier: "Fisher-Price",
      expectedRestock: "2024-02-10"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const addToCart = (product) => {
    // Check if product is in stock
    if (product.stock === 0) {
      setBackInStockProduct(product);
      setShowBackInStock(true);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        // Check if adding more would exceed available stock
        if (existingItem.quantity + 1 > product.stock) {
          alert(`Sorry, only ${product.stock} units available in stock.`);
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    // Update stock in real-time
    updateProductStock(product.id, product.stock - 1);
  };

  const removeFromCart = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
      // Restore stock when removing from cart
      updateProductStock(productId, cartItem.stock + cartItem.quantity);
    }
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (newQuantity > product.stock) {
      alert(`Sorry, only ${product.stock} units available in stock.`);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const updateProductStock = (productId, newStock) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, stock: Math.max(0, newStock) }
          : product
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const addToWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const productWithDate = {
      ...product,
      addedDate: new Date().toISOString()
    };
    
    if (!wishlist.find(item => item.id === product.id)) {
      wishlist.push(productWithDate);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert(`${product.name} added to wishlist!`);
    } else {
      alert('Product is already in your wishlist!');
    }
  };

  const handleBackInStockNotification = (notificationData) => {
    setBackInStockNotifications(prev => [...prev, notificationData]);
    console.log('Back in stock notification signed up:', notificationData);
  };

  const handlePreOrder = (product) => {
    const preOrderData = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      customerEmail: currentUser?.email || 'guest@example.com',
      customerName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest User',
      quantity: 1,
      orderDate: new Date().toISOString(),
      expectedRestock: product.expectedRestock,
      status: 'pending'
    };

    setPreOrders(prev => [...prev, preOrderData]);
    alert(`Pre-order placed for ${product.name}! You'll be notified when it's available.`);
  };

  const handleInventoryStockUpdate = (productId, newStock) => {
    updateProductStock(productId, newStock);
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'stock':
        return filtered.sort((a, b) => b.stock - a.stock);
      case 'name':
      default:
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const getFilteredProducts = () => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleBackToShop = () => {
    setShowCheckout(false);
    setShowOrderHistory(false);
    setShowInventory(false);
  };

  const handleOrderComplete = (orderData) => {
    // Clear cart after successful order
    setCart([]);
    setShowCheckout(false);
    
    // You could save order data to localStorage or send to server
    console.log('Order completed:', orderData);
  };

  const handleViewOrders = () => {
    setShowOrderHistory(true);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const getStockStatus = (stock, reorderPoint, minStockLevel) => {
    if (stock <= minStockLevel) return "critical-stock";
    if (stock <= reorderPoint) return "low-stock";
    return "in-stock";
  };

  const categories = ['all', ...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className="shop-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <Checkout
        cart={cart}
        total={getTotalPrice()}
        onBackToShop={handleBackToShop}
        onOrderComplete={handleOrderComplete}
      />
    );
  }

  if (showOrderHistory) {
    return (
      <OrderHistory
        currentUser={currentUser}
        onBackToShop={handleBackToShop}
      />
    );
  }

  if (showWishlist) {
    return (
      <Wishlist
        onClose={() => setShowWishlist(false)}
        onAddToCart={addToCart}
      />
    );
  }

  if (showGiftCard) {
    return (
      <GiftCard
        onClose={() => setShowGiftCard(false)}
        onAddToCart={addToCart}
      />
    );
  }

  if (showInventory) {
    return (
      <InventoryManagement
        currentUser={currentUser}
        onClose={() => setShowInventory(false)}
        onStockUpdate={handleInventoryStockUpdate}
      />
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetails
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onAddToWishlist={addToWishlist}
        onPreOrder={handlePreOrder}
      />
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Welcome to Our Premium Shop!</h1>
        {currentUser && (
          <p>Hello, {currentUser.firstName}! Discover our curated collection</p>
        )}
      </div>

      <div className="shop-content">
        <div className="products-section">
          <div className="products-header">
            <div className="products-title">
              <h2>Our Products</h2>
              <div className="advanced-features">
                <button 
                  className="feature-btn wishlist-btn"
                  onClick={() => setShowWishlist(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  Wishlist
                </button>
                <button 
                  className="feature-btn gift-card-btn"
                  onClick={() => setShowGiftCard(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Gift Cards
                </button>
                <button 
                  className="feature-btn inventory-btn"
                  onClick={() => setShowInventory(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  Inventory
                </button>
              </div>
            </div>
            
            <div className="search-and-filters">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              
              <div className="filter-controls">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="stock">Most in Stock</option>
                </select>
                
                <div className="price-range">
                  <span>Price: €{priceRange.min} - €{priceRange.max}</span>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="category-filter">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Products' : category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="products-grid">
            {getFilteredAndSortedProducts().length === 0 ? (
              <div className="no-products">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              getFilteredAndSortedProducts().map(product => {
                const stockStatus = getStockStatus(product.stock, product.reorderPoint, product.minStockLevel);
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-image-container">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <div className="product-overlay">
                        <button 
                          className="quick-view-btn"
                          onClick={() => handleProductClick(product)}
                        >
                          Quick View
                        </button>
                        <button 
                          className="wishlist-btn"
                          onClick={() => addToWishlist(product)}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </button>
                      </div>
                      {product.stock <= product.reorderPoint && product.stock > 0 && (
                        <div className={`stock-badge ${stockStatus}`}>
                          {stockStatus === 'critical-stock' ? 'Critical Stock' : `Only ${product.stock} left!`}
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="out-of-stock-badge">Out of Stock</div>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="product-category-badge">{product.category}</div>
                      <h3 onClick={() => handleProductClick(product)} className="product-title">
                        {product.name}
                      </h3>
                      <div className="product-rating">
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={star <= product.rating ? "#ffd700" : "#ddd"} stroke="currentColor" strokeWidth="1">
                              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                            </svg>
                          ))}
                        </div>
                        <span className="rating-text">({product.reviewCount})</span>
                      </div>
                      <p className="product-description">{product.description}</p>
                      <div className="product-price-container">
                        <span className="product-price">€{product.price.toFixed(2)}</span>
                        <div className="product-actions">
                          {product.stock > 0 ? (
                            <button 
                              className="add-to-cart-btn"
                              onClick={() => addToCart(product)}
                            >
                              <span>Add to Cart</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
                              </svg>
                            </button>
                          ) : (
                            <button 
                              className="pre-order-btn"
                              onClick={() => handlePreOrder(product)}
                            >
                              <span>Pre-Order</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="stock-info">
                        <span className={`stock-indicator ${stockStatus}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                        {product.stock === 0 && (
                          <button 
                            className="notify-stock-btn"
                            onClick={() => {
                              setBackInStockProduct(product);
                              setShowBackInStock(true);
                            }}
                          >
                            Notify when available
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="cart-section">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <span className="cart-count">{cart.length} items</span>
          </div>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
              </svg>
              <p>Your cart is empty</p>
              <span>Add some products to get started!</span>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">€{item.price.toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="cart-total">
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>€{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="total-line total">
                  <span>Total:</span>
                  <span>€{getTotalPrice().toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  <span>Proceed to Checkout</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Order History Button */}
          <div className="order-history-section">
            <button className="order-history-btn" onClick={handleViewOrders}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span>View My Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Back in Stock Notification Modal */}
      {showBackInStock && backInStockProduct && (
        <BackInStockNotification
          product={backInStockProduct}
          onClose={() => {
            setShowBackInStock(false);
            setBackInStockProduct(null);
          }}
          onNotifyMe={handleBackInStockNotification}
        />
      )}
    </div>
  );
};

export default Shop; 