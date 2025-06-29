import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import UserManagement from './components/UserManagement';
import RegistrationSuccess from './components/RegistrationSuccess';
import Shop from './components/Shop';
import CustomerSupportChat from './components/CustomerSupportChat';

function App() {
  const [activeView, setActiveView] = useState('register');
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      setCurrentUser(JSON.parse(user));
      setActiveView('shop'); // Redirect to shop if user is already logged in
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveView('shop'); // Redirect to shop after login
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setActiveView('register');
  };

  return (
    <div className="App">
      <Navigation 
        activeView={activeView} 
        onViewChange={setActiveView}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      {activeView === 'register' && (
        <RegistrationForm onViewChange={setActiveView} />
      )}
      {activeView === 'login' && (
        <LoginForm 
          onViewChange={setActiveView} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {activeView === 'manage' && (
        <UserManagement />
      )}
      {activeView === 'success' && (
        <RegistrationSuccess onViewChange={setActiveView} />
      )}
      {activeView === 'shop' && (
        <Shop currentUser={currentUser} />
      )}
      <CustomerSupportChat />
    </div>
  );
}

export default App;
