// Initialize the app environment safely
export const initializeApp = (): boolean => {
  try {
    // Basic browser compatibility checks
    const checks = [
      typeof window !== 'undefined',
      typeof localStorage !== 'undefined',
      typeof console !== 'undefined'
    ];

    const failed = checks.filter(check => !check);
    
    if (failed.length > 0) {
      console.warn('Some browser features are not available');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error during app initialization:', error);
    return false;
  }
};

// Export environment check function
export const checkEnvironment = () => {
  const info = {
    isBrowser: typeof window !== 'undefined',
    hasLocalStorage: typeof localStorage !== 'undefined',
    hasConsole: typeof console !== 'undefined',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    timestamp: new Date().toISOString(),
  };

  if (info.hasConsole && info.isBrowser) {
    console.log('🌍 Environment Check:', info);
  }

  return info;
};