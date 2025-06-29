import React from 'react';

const RegistrationSuccess = ({ onViewChange }) => (
  <div className="success-container">
    <h1>Registration Successful!</h1>
    <p>Thank you for registering. Your account has been created.</p>
    <button onClick={() => onViewChange('shop')}>
      Start Shopping
    </button>
    <button style={{marginLeft: '1em'}} onClick={() => onViewChange('manage')}>
      User Management
    </button>
  </div>
);

export default RegistrationSuccess; 