// Production Configuration Template
// Copy this to your build pipeline or deployment scripts

const productionConfig = {
  // App Information
  app: {
    name: "Energy Tracker",
    version: "1.0.0",
    description: "Track your cognitive clarity and physical energy throughout the day",
    author: "Your Company Name",
    keywords: ["energy", "wellness", "tracking", "health", "productivity"]
  },

  // Build Configuration
  build: {
    // Remove development features
    enableDevTools: false,
    enableMockData: false,
    enableTestingControls: false,
    
    // Optimization settings
    minify: true,
    sourcemap: false,
    treeshake: true,
    
    // Bundle splitting
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', '@radix-ui/react-slider'],
          charts: ['recharts']
        }
      }
    }
  },

  // PWA Configuration
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 24 * 60 * 60 // 24 hours
            }
          }
        }
      ]
    },
    manifest: {
      name: 'Energy Tracker',
      short_name: 'EnergyTracker',
      description: 'Track your cognitive clarity and physical energy',
      theme_color: '#c45e99',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },

  // Environment Variables Template
  env: {
    production: {
      VITE_APP_ENV: 'production',
      VITE_SUPABASE_URL: 'https://your-project.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'your-production-anon-key',
      VITE_OPENAI_API_KEY: 'your-openai-api-key',
      VITE_ENABLE_ANALYTICS: 'true',
      VITE_SENTRY_DSN: 'your-sentry-dsn'
    },
    staging: {
      VITE_APP_ENV: 'staging',
      VITE_SUPABASE_URL: 'https://your-staging-project.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'your-staging-anon-key',
      VITE_OPENAI_API_KEY: 'your-openai-api-key',
      VITE_ENABLE_ANALYTICS: 'false'
    }
  },

  // Security Headers (for web deployment)
  headers: {
    '/*': [
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin'
      },
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.openai.com;"
      }
    ]
  },

  // Database Migration Scripts
  migrations: {
    supabase: {
      // Run these SQL commands in Supabase SQL editor
      tables: `
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          profile JSONB DEFAULT '{}'::jsonb,
          preferences JSONB DEFAULT '{}'::jsonb
        );

        -- Check-ins table
        CREATE TABLE IF NOT EXISTS check_ins (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          type TEXT NOT NULL CHECK (type IN ('morning', 'midday', 'afternoon', 'evening')),
          cognitive_clarity INTEGER NOT NULL CHECK (cognitive_clarity BETWEEN 1 AND 12),
          physical_energy INTEGER NOT NULL CHECK (physical_energy BETWEEN 1 AND 12),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Tracking entries table
        CREATE TABLE IF NOT EXISTS tracking_entries (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          mood TEXT NOT NULL,
          stress_level TEXT NOT NULL CHECK (stress_level IN ('low', 'medium', 'high')),
          cognitive_clarity INTEGER NOT NULL CHECK (cognitive_clarity BETWEEN 0 AND 100),
          physical_energy INTEGER NOT NULL CHECK (physical_energy BETWEEN 0 AND 100),
          lifestyle_factors JSONB NOT NULL DEFAULT '{}'::jsonb,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Happy moments table
        CREATE TABLE IF NOT EXISTS happy_moments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          description TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Pomodoro sessions table
        CREATE TABLE IF NOT EXISTS pomodoro_sessions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          duration INTEGER NOT NULL DEFAULT 25,
          completed BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_check_ins_user_timestamp ON check_ins(user_id, timestamp DESC);
        CREATE INDEX IF NOT EXISTS idx_tracking_user_timestamp ON tracking_entries(user_id, timestamp DESC);
        CREATE INDEX IF NOT EXISTS idx_happy_moments_user_timestamp ON happy_moments(user_id, timestamp DESC);
        CREATE INDEX IF NOT EXISTS idx_pomodoro_user_timestamp ON pomodoro_sessions(user_id, timestamp DESC);

        -- Enable Row Level Security
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
        ALTER TABLE tracking_entries ENABLE ROW LEVEL SECURITY;
        ALTER TABLE happy_moments ENABLE ROW LEVEL SECURITY;
        ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
        CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

        CREATE POLICY "Users can manage own check-ins" ON check_ins FOR ALL USING (auth.uid() = user_id);
        CREATE POLICY "Users can manage own tracking entries" ON tracking_entries FOR ALL USING (auth.uid() = user_id);
        CREATE POLICY "Users can manage own happy moments" ON happy_moments FOR ALL USING (auth.uid() = user_id);
        CREATE POLICY "Users can manage own pomodoro sessions" ON pomodoro_sessions FOR ALL USING (auth.uid() = user_id);
      `,
      
      // Storage buckets for user files
      storage: `
        -- Create storage bucket for user uploads
        INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', false);

        -- Create policy for user uploads
        CREATE POLICY "Users can upload own files" ON storage.objects FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
        CREATE POLICY "Users can view own files" ON storage.objects FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
        CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
      `
    }
  },

  // Deployment Scripts
  deployment: {
    // Vercel deployment config (vercel.json)
    vercel: {
      version: 2,
      builds: [
        {
          src: "package.json",
          use: "@vercel/static-build",
          config: {
            buildCommand: "npm run build",
            outputDirectory: "dist"
          }
        }
      ],
      routes: [
        {
          src: "/(.*)",
          dest: "/index.html"
        }
      ]
    },

    // Netlify deployment config (netlify.toml)
    netlify: `
      [build]
        publish = "dist"
        command = "npm run build"

      [[redirects]]
        from = "/*"
        to = "/index.html"
        status = 200

      [build.environment]
        NODE_VERSION = "18"
    `
  },

  // Analytics Configuration
  analytics: {
    events: [
      'app_start',
      'check_in_completed',
      'tracking_entry_created',
      'health_data_synced',
      'ai_insight_viewed'
    ],
    userProperties: [
      'subscription_status',
      'health_integrations_enabled',
      'tracking_streak'
    ]
  }
};

// Export for build scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = productionConfig;
}

// Usage instructions:
console.log(`
🚀 Production Deployment Checklist:

1. Environment Setup:
   - Copy .env.example to .env.production
   - Add your Supabase production URL and keys
   - Add OpenAI API key for AI insights

2. Database Setup:
   - Run the SQL migrations in your Supabase dashboard
   - Enable Row Level Security policies
   - Test authentication flows

3. Build Configuration:
   - Update package.json scripts for production
   - Configure PWA settings if needed
   - Set up analytics tracking

4. Deployment:
   - Choose platform (Vercel, Netlify, or native app stores)
   - Configure custom domain and SSL
   - Set up monitoring and error tracking

5. Testing:
   - Test all user flows in production environment
   - Verify health data integrations work
   - Test offline functionality (if PWA)

6. Go Live:
   - Monitor initial user activity
   - Set up customer support channels
   - Plan feature updates based on feedback

Need help with any of these steps? Check the DEPLOYMENT_GUIDE.md for detailed instructions.
`);