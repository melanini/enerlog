# Energy Tracker App - Production Deployment Guide

## Overview
Your energy tracking app is well-architected with React/TypeScript, Supabase backend, and comprehensive features. Here's the step-by-step guide to make it production-ready.

## Phase 1: Mobile App Foundation

### Option A: Progressive Web App (PWA) - Fastest Path
**Timeline: 1-2 weeks**

1. **PWA Configuration**
   ```bash
   # Add to package.json
   npm install @vite-pwa/nuxt workbox-window
   ```

2. **Create PWA Manifest**
   ```json
   // public/manifest.json
   {
     "name": "Energy Tracker",
     "short_name": "EnergyTracker",
     "description": "Track your cognitive clarity and physical energy",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#c45e99",
     "theme_color": "#c45e99",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png", 
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

3. **Service Worker for Offline Support**
   - Cache essential app files
   - Enable offline data viewing
   - Background sync for data uploads

### Option B: React Native (Complete Mobile Experience)
**Timeline: 4-6 weeks**

1. **Setup React Native Environment**
   ```bash
   npx react-native init EnergyTrackerApp --template react-native-template-typescript
   ```

2. **Port Components**
   - Convert web components to React Native
   - Update navigation (React Navigation)
   - Adapt layouts for mobile screens

3. **Native Features Integration**
   - Push notifications (react-native-push-notification)
   - Health data access (react-native-health)
   - Background app refresh

## Phase 2: Backend & Data Infrastructure

### Supabase Production Setup
**Timeline: 1 week**

1. **Database Schema Creation**
   ```sql
   -- Create production tables
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     profile JSONB
   );

   CREATE TABLE check_ins (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID NOT NULL REFERENCES users(id),
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     type TEXT NOT NULL CHECK (type IN ('morning', 'midday', 'afternoon', 'evening')),
     cognitive_clarity INTEGER NOT NULL CHECK (cognitive_clarity BETWEEN 1 AND 12),
     physical_energy INTEGER NOT NULL CHECK (physical_energy BETWEEN 1 AND 12)
   );

   CREATE TABLE tracking_entries (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID NOT NULL REFERENCES users(id),
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     mood TEXT NOT NULL,
     stress_level TEXT NOT NULL CHECK (stress_level IN ('low', 'medium', 'high')),
     cognitive_clarity INTEGER NOT NULL,
     physical_energy INTEGER NOT NULL,
     lifestyle_factors JSONB NOT NULL,
     notes TEXT
   );

   CREATE TABLE happy_moments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID NOT NULL REFERENCES users(id),
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     description TEXT NOT NULL
   );

   -- Add indexes for performance
   CREATE INDEX idx_check_ins_user_timestamp ON check_ins(user_id, timestamp DESC);
   CREATE INDEX idx_tracking_user_timestamp ON tracking_entries(user_id, timestamp DESC);
   ```

2. **Row Level Security (RLS)**
   ```sql
   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
   ALTER TABLE tracking_entries ENABLE ROW LEVEL SECURITY;
   ALTER TABLE happy_moments ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can insert own check-ins" ON check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can view own check-ins" ON check_ins FOR SELECT USING (auth.uid() = user_id);
   ```

3. **Environment Variables**
   ```bash
   # .env.production
   VITE_SUPABASE_URL=your-production-url
   VITE_SUPABASE_ANON_KEY=your-production-anon-key
   VITE_OPENAI_API_KEY=your-openai-key
   ```

### Data Migration from localStorage
**Timeline: 2-3 days**

1. **Create Migration Component**
   ```typescript
   // components/DataMigration.tsx
   export function DataMigration() {
     const migrateLocalData = async () => {
       const localData = localStorage.getItem('energyApp_tracking');
       if (localData) {
         const entries = JSON.parse(localData);
         // Batch upload to Supabase
         await supabase.from('tracking_entries').insert(entries);
         localStorage.removeItem('energyApp_tracking');
       }
     };
   }
   ```

## Phase 3: Health Integrations

### Apple HealthKit Integration (iOS)
**Timeline: 2-3 weeks**

1. **React Native Health Setup**
   ```bash
   npm install react-native-health
   cd ios && pod install
   ```

2. **Health Permissions**
   ```typescript
   // services/healthKit.ts
   import { AppleHealthKit, HealthKitPermissions } from 'react-native-health';

   const permissions: HealthKitPermissions = {
     permissions: {
       read: [
         AppleHealthKit.Constants.Permissions.SleepAnalysis,
         AppleHealthKit.Constants.Permissions.Steps,
         AppleHealthKit.Constants.Permissions.HeartRate,
         AppleHealthKit.Constants.Permissions.ActiveEnergyBurned
       ]
     }
   };

   export const initHealthKit = () => {
     AppleHealthKit.initHealthKit(permissions, (error: string) => {
       if (error) {
         console.log('HealthKit init error:', error);
       }
     });
   };
   ```

3. **Data Sync Functions**
   ```typescript
   export const syncSleepData = async () => {
     const options = {
       startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
       endDate: new Date().toISOString()
     };

     AppleHealthKit.getSleepSamples(options, (err, samples) => {
       if (samples) {
         // Process and upload to Supabase
         processSleepData(samples);
       }
     });
   };
   ```

### Google Fit Integration (Android)
**Timeline: 2-3 weeks**

1. **Google Fit Setup**
   ```bash
   npm install react-native-google-fit
   ```

2. **Permissions & Authentication**
   ```typescript
   // services/googleFit.ts
   import GoogleFit from 'react-native-google-fit';

   export const initGoogleFit = () => {
     const options = {
       scopes: [
         Scopes.FITNESS_ACTIVITY_READ,
         Scopes.FITNESS_BODY_READ,
         Scopes.FITNESS_LOCATION_READ
       ]
     };

     GoogleFit.authorize(options);
   };
   ```

## Phase 4: Production Features

### Push Notifications
**Timeline: 1 week**

1. **Setup Push Service**
   ```typescript
   // services/notifications.ts
   export const scheduleCheckInReminder = () => {
     // Schedule 4 daily reminders
     const times = ['08:00', '13:00', '16:00', '20:00'];
     
     times.forEach((time, index) => {
       scheduleNotification({
         id: index,
         title: 'Energy Check-in',
         body: 'How are your energy levels right now?',
         schedule: { time }
       });
     });
   };
   ```

### AI Insights Enhancement
**Timeline: 1-2 weeks**

1. **Production AI Service**
   ```typescript
   // services/aiInsights.ts
   export const generateInsights = async (data: TrackingEntry[]) => {
     const response = await fetch('/api/ai-insights', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ data })
     });
     
     return response.json();
   };
   ```

### Data Export & Backup
**Timeline: 3-4 days**

1. **Export Functionality**
   ```typescript
   // utils/dataExport.ts
   export const exportUserData = async () => {
     const data = await supabase
       .from('tracking_entries')
       .select('*')
       .eq('user_id', userId);
       
     const csv = convertToCSV(data);
     downloadFile(csv, 'energy-tracker-data.csv');
   };
   ```

## Phase 5: Testing & Deployment

### Pre-Production Checklist
**Timeline: 1-2 weeks**

1. **Remove Development Features**
   ```typescript
   // Remove TestingControls component
   // Update environment checks
   const showDevTools = process.env.NODE_ENV === 'development' && process.env.VITE_SHOW_DEV_TOOLS === 'true';
   ```

2. **Performance Optimization**
   - Implement lazy loading for screens
   - Optimize bundle size
   - Add loading states
   - Cache frequently accessed data

3. **Security Hardening**
   - Validate all user inputs
   - Implement rate limiting
   - Secure API endpoints
   - Add HTTPS enforcement

4. **Testing Suite**
   ```bash
   # Add testing dependencies
   npm install -D @testing-library/react @testing-library/jest-dom vitest
   ```

### Deployment Options

#### Web App (Vercel/Netlify)
```bash
# Build and deploy
npm run build
vercel --prod
```

#### iOS App Store
1. Create App Store Connect account
2. Generate certificates and provisioning profiles
3. Build archive in Xcode
4. Upload to App Store Connect
5. Submit for review

#### Google Play Store
1. Create Google Play Console account
2. Generate signed APK/AAB
3. Upload to Play Console
4. Submit for review

## Phase 6: Post-Launch Monitoring

### Analytics & Monitoring
1. **User Analytics**
   - App usage patterns
   - Feature adoption rates
   - User retention metrics

2. **Performance Monitoring**
   - App crash rates
   - API response times
   - Battery usage optimization

3. **User Feedback**
   - In-app feedback system
   - App store reviews monitoring
   - Feature request tracking

## Cost Estimation

### Development Timeline & Budget
- **PWA Version**: 4-6 weeks, $15K-$25K
- **React Native Version**: 8-12 weeks, $30K-$50K
- **Backend Infrastructure**: $50-$200/month (Supabase Pro)
- **AI Features**: $100-$500/month (OpenAI API)
- **App Store Fees**: $99/year (iOS) + $25 (Android)

### Recommended Phase 1 Priority
1. **PWA deployment** (fastest path to market)
2. **Supabase production setup**
3. **Basic health integrations**
4. **Push notifications**
5. **AI insights enhancement**

This approach gets you to market quickly while maintaining the option to develop native apps later based on user feedback and traction.