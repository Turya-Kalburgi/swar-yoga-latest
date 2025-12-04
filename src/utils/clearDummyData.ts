/**
 * Utility to clear all dummy/sample data from localStorage
 * Removes test data that may have been added during development
 */

export const clearDummyData = () => {
  // List of localStorage keys that contain dummy/sample data
  const dummyDataKeys = [
    'contact_messages',      // Contact form submissions with test data
    'cart_items',            // Cart data with sample users
    'sample_workshops',      // Sample workshop data
    'test_data',             // Any test data
    'dummy_users'            // Dummy user entries
  ];

  dummyDataKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        
        // Clear the key entirely
        localStorage.removeItem(key);
        console.log(`✅ Cleared ${key}`);
      } catch (e) {
        console.warn(`Could not parse ${key}:`, e);
        localStorage.removeItem(key);
      }
    }
  });

  // Also clear any keys that contain test data indicators
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (
      key.includes('test') ||
      key.includes('dummy') ||
      key.includes('sample') ||
      key.includes('demo')
    ) {
      localStorage.removeItem(key);
      console.log(`✅ Cleared ${key}`);
    }
  });

  console.log('✅ All dummy data cleared from localStorage');
};

// Export a function to clean specific data
export const clearContactMessages = () => {
  localStorage.removeItem('contact_messages');
  console.log('✅ Contact messages cleared');
};

export const clearCartItems = () => {
  localStorage.removeItem('cart_items');
  console.log('✅ Cart items cleared');
};

// Call this on app initialization if needed
export const cleanupAllDummyData = () => {
  clearDummyData();
};
