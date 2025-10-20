import Constants from 'expo-constants';

// This function determines the correct backend URL to use.
const getApiUrl = () => {
  // If we are in a development build (running from your computer), we can get the host URI.
  if (__DEV__) {
    // The hostUri is the address of the computer running the Expo server.
    // It will be something like '192.168.1.100:8081'.
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      // We can then extract just the IP address from the host URI.
      const ipAddress = hostUri.split(':')[0];
      // And construct the full backend URL.
      return `http://${ipAddress}:3000/api`;
    }
  }

  // Fallback for production builds or if the host URI is not available.
  // In a real production app, you would replace this with your deployed server's URL.
  return 'http://localhost:3000/api'; 
};

// Export the dynamically generated URL.
const API_URL = getApiUrl();

console.log('Connecting to API at:', API_URL); // This will show the detected URL in your terminal

export { API_URL };

