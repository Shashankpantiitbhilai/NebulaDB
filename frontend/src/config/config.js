// config.js
// Centralized configuration management for NebulaDB frontend

const config = {
  // Environment detection
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
  isProduction: import.meta.env.VITE_NODE_ENV === 'production',
  
  // Backend URLs
  backend: {
    dev: import.meta.env.VITE_BACKEND_URL_DEV ,
    prod: import.meta.env.VITE_BACKEND_URL_PROD ,
    current: null, // Will be set dynamically
  },
  
  // MongoDB Atlas (for display purposes only - not used for API calls)
  atlas: {
    publicKey: import.meta.env.VITE_ATLAS_PUBLIC_KEY,
    privateKey: import.meta.env.VITE_ATLAS_PRIVATE_KEY,
    orgId: import.meta.env.VITE_ATLAS_ORG_ID,
  },
  
  // App settings
  app: {
    name: 'NebulaDB',
    version: '1.0.0',
    description: 'Simplifying database connections with automated setup',
  }
};

// Set current backend URL based on environment
config.backend.current = config.isDevelopment 
  ? config.backend.dev 
  : config.backend.prod;

// Log configuration in development
if (config.isDevelopment) {
  console.log('🔧 NebulaDB Configuration:', {
    environment: import.meta.env.VITE_NODE_ENV || 'development',
    backendUrl: config.backend.current,
    atlasOrgId: config.atlas.orgId,
  });
}

export default config;
