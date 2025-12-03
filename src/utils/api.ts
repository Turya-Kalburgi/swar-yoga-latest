// API utilities

// Resort API
export const resortAPI = {
  create: async (data: any) => {
    console.log('Creating resort booking:', data);
    // In a real app, this would call an API endpoint
    return Promise.resolve({ success: true, data });
  },
  
  getAll: async () => {
    // In a real app, this would call an API endpoint
    return Promise.resolve([]);
  }
};

// Handle API errors
export const handleAPIError = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data.message || 'Server error';
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unknown error occurred';
  }
};