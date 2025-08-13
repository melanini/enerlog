// Supabase configuration from environment variables with safe fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    // Direct access to import.meta.env with null checks
    const env = import.meta?.env;
    if (env && typeof env === 'object') {
      return env[key] || fallback;
    }
    return fallback;
  } catch (error) {
    // Silently handle errors and return fallback
    return fallback;
  }
};

// Helper function to safely get the current mode
const getMode = (): string => {
  try {
    const mode = import.meta?.env?.MODE;
    if (mode) return mode;
    return 'development';
  } catch (error) {
    return 'development';
  }
};

export const supabaseConfig = {
  url: getEnvVar('VITE_SUPABASE_URL', ''),
  anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', ''),
};

// For backward compatibility
export const projectId = supabaseConfig.url ? 
  supabaseConfig.url.match(/https:\/\/(.+)\.supabase\.co/)?.[1] || '' : '';

export const publicAnonKey = supabaseConfig.anonKey;

// Validate configuration
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseConfig.url && supabaseConfig.anonKey);
};

// Development helpers with safe mode detection
const currentMode = getMode();
export const isDevelopment = currentMode === 'development';
export const isProduction = currentMode === 'production';

// App configuration with safe fallbacks
export const appConfig = {
  name: getEnvVar('VITE_APP_NAME', 'Energy Tracker'),
  version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  enableDevTools: getEnvVar('VITE_ENABLE_DEV_TOOLS', 'true') === 'true' && isDevelopment,
  enableMockData: getEnvVar('VITE_ENABLE_MOCK_DATA', 'true') === 'true',
  openaiApiKey: getEnvVar('VITE_OPENAI_API_KEY', ''),
};

// Feature flags
export const features = {
  aiInsights: !!appConfig.openaiApiKey,
  analytics: !!getEnvVar('VITE_ANALYTICS_ID'),
  errorTracking: !!getEnvVar('VITE_SENTRY_DSN'),
  healthIntegrations: isProduction,
};

// Enhanced logging for better developer experience
if (isDevelopment) {
  try {
    const configStatus = isSupabaseConfigured() ? 'Backend Connected' : 'Demo Mode Active';
    
    console.log(`🚀 ${appConfig.name} v${appConfig.version}`);
    console.log(`📊 Mode: ${currentMode}`);
    console.log(`🔗 Backend: ${configStatus}`);
    
    if (!isSupabaseConfigured()) {
      console.log(`
🎯 Demo Mode Features:
   ✅ Full app functionality available
   ✅ Data stored locally in browser
   ✅ All features work offline
   ✅ Perfect for testing and development
   
💡 To connect backend: Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env
      `);
    } else {
      console.log('✅ Supabase backend connected');
    }
    
    console.log(`🛠️ Developer Tools: ${appConfig.enableDevTools ? 'Enabled' : 'Disabled'}`);
  } catch (error) {
    // Silently handle console errors
  }
}