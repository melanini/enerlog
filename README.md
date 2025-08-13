# Energy Tracker

A comprehensive energy tracking application focused on cognitive clarity and physical energy monitoring through daily check-ins.

## ✨ Features

- 🏠 **Home Dashboard** - Interactive sliders for 4 daily check-ins with energy level tracking
- 📊 **Analytics** - Comprehensive charts and insights showing energy patterns
- 📝 **Detailed Tracking** - Mood, stress levels, and lifestyle factors
- 🧠 **AI Insights** - Personalized recommendations based on your data
- 🎯 **Habit Formation** - Badge system and streak tracking
- 📱 **Mobile-First PWA** - Installable as mobile app with offline support
- 🔐 **Authentication** - Secure user accounts with demo mode

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd energy-tracker
npm install
```

### 2. Run Immediately (Demo Mode)

```bash
npm run dev
```

**The app works immediately without any configuration!** 🎉

When you see "⚠️ Supabase not configured - using demo mode" in the console, this is **expected behavior**. The app is designed to work perfectly in demo mode with full functionality.

### 3. Optional: Add Backend (Later)

```bash
# Edit .env file when you're ready for a backend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🎯 App Modes

### Demo Mode (Default)
- ✅ **Full functionality** - All features work perfectly
- ✅ **Local storage** - Data persists in your browser
- ✅ **No setup required** - Works immediately out of the box
- ✅ **Perfect for testing** - Try all features without any configuration
- ✅ **Offline capable** - Works without internet connection

### Backend Mode (Optional)
- 🔗 **Cloud sync** - Data synced across devices
- 👥 **Multi-user** - Separate accounts and data
- 🔒 **Secure auth** - Production-ready authentication
- 📊 **Advanced features** - AI insights with OpenAI integration

## 🛠️ Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📱 Deployment

### Quick Deploy (Vercel)

```bash
npm run build
npx vercel --prod
```

### Quick Deploy (Netlify)

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## 🔧 Environment Variables

The app works without any environment variables, but you can optionally configure:

```bash
# Optional: Backend features
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: AI insights
VITE_OPENAI_API_KEY=your-openai-key

# Optional: Development settings
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_MOCK_DATA=true
```

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Custom Design System
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Supabase (Optional - Database + Auth + Edge Functions)
- **PWA**: Vite PWA Plugin + Workbox
- **Charts**: Recharts
- **Icons**: Lucide React

## 📂 Project Structure

```
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Authentication components
│   ├── onboarding/     # Onboarding flow
│   └── ...
├── contexts/           # React Context providers
├── utils/              # Utility functions
├── services/           # API services
├── styles/             # CSS and styling
└── supabase/           # Supabase configuration (optional)
```

## 💡 Key Features Explained

### 🏠 Home Screen
- **Daily Check-ins**: 4 interactive sliders for morning, midday, afternoon, evening
- **Energy Tracking**: Circular progress indicator showing overall energy levels
- **Smart Insights**: AI-powered daily recommendations
- **Quick Actions**: Customizable widget tiles for rapid logging

### 📊 Analytics Screen
- **Trend Analysis**: Interactive charts showing patterns over time
- **Correlation Insights**: How different factors affect your energy
- **Weekly/Monthly Views**: Flexible time range analysis
- **Data Export**: Download your insights anytime

### 📝 Track Screen
- **Mood Selection**: Visual emoji-based mood picker
- **Lifestyle Factors**: Comprehensive tracking (sleep, exercise, caffeine, etc.)
- **Stress Monitoring**: Quick stress level assessment
- **Notes & Context**: Add personal observations

### 🔐 Authentication
- **Demo Mode**: Instant access without signup
- **Local Storage**: All data saved in your browser
- **Optional Backend**: Connect Supabase for cloud sync
- **Secure**: Production-ready auth when using backend

### 📱 PWA Features
- **Installable**: Add to home screen on mobile
- **Offline Support**: Works without internet
- **Push Notifications**: Check-in reminders (when configured)
- **App Shortcuts**: Quick access to key features

## 🔍 FAQ

### Q: I see "Supabase not configured" - is this an error?
**A: No!** This is expected behavior. The app is designed to work perfectly in demo mode without any setup required.

### Q: Do I need a database to use this app?
**A: No!** The app works completely offline using your browser's local storage. A backend is optional for cloud sync.

### Q: How do I access my data?
**A: In demo mode**, your data is stored locally in your browser. You can export it anytime from the analytics screen.

### Q: Can I use this in production?
**A: Yes!** Both demo mode and backend mode are production-ready. Choose based on your needs.

## 🎨 Customization

The app uses a comprehensive design system with:
- **Color Palette**: Magenta, Fuchsia, Orange, Yellow, Purple variants
- **Responsive Design**: Mobile-first with desktop support
- **Dark Mode**: Automatic theme switching
- **Accessibility**: Full keyboard navigation and screen reader support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- 📖 **Documentation**: This README and inline code comments
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/energy-tracker/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/energy-tracker/discussions)

---

**Built with ❤️ for better energy awareness and habit formation.**

🎯 **Ready to track your energy? Just run `npm run dev` and start exploring!**