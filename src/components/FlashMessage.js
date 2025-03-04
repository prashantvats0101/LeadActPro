// FlashMessage.js
import React from 'react';
import FlashMessage, { showMessage } from 'react-native-flash-message';

// Helper function to show success message
export const showSuccess = (message) => {
  showMessage({
    message: message,
    type: 'success', // Can be 'success', 'danger', 'info', or 'default'
    icon: 'success',
    duration: 3000, // Duration in milliseconds
    backgroundColor: 'green', // You can customize the background color
    color: 'white', // Text color
  });
};

// Helper function to show error message
export const showError = (message) => {
  showMessage({
    message: message,
    type: 'danger', // Error messages use 'danger' type
    icon: 'danger',
    duration: 3000, // Duration in milliseconds
    backgroundColor: 'red', // Custom error color
    color: 'white', // Text color
  });
};

const FlashMessageComponent = () => {
  return <FlashMessage position="top" />; // Set position to 'top' or 'bottom'
};

export default FlashMessageComponent;
