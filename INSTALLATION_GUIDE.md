# Synova AI Installation Guide

This guide covers installation for Desktop, Mobile (Android), and Web versions of Synova AI.

## 🖥️ Desktop Installation (Windows)

### Prerequisites
- Windows 10 or higher
- 2GB RAM minimum
- 500MB disk space

### Installation Steps
1. Download `Synova AI Setup.exe` from the `desktop\dist\` folder
2. Run the installer as Administrator
3. Follow the installation wizard:
   - Choose installation directory (default: `C:\Program Files\Synova AI`)
   - Select "Create desktop shortcut"
   - Click "Install"
4. Launch Synova AI from:
   - Desktop shortcut
   - Start Menu → Synova AI
   - Installation folder

### Uninstallation
1. Go to Control Panel → Programs and Features
2. Find "Synova AI" and click "Uninstall"
3. Follow the uninstallation wizard

## 📱 Mobile Installation (Android)

### Prerequisites
- Android 6.0 (API level 23) or higher
- 100MB storage space
- Internet connection for initial setup

### Installation Steps
1. Download `synova-mobile.apk` from the build output
2. Transfer APK to your Android device (USB, email, cloud storage)
3. Enable "Install from unknown sources":
   - Go to Settings → Security → Unknown Sources
   - Or Settings → Apps → Special Access → Install Unknown Apps
4. Tap the APK file to begin installation
5. Grant necessary permissions:
   - Camera (for image analysis)
   - Microphone (for voice input)
   - Storage (for file uploads)
6. Launch from App Drawer

### Permissions Explained
- **Camera**: Analyze images and documents
- **Microphone**: Voice input and audio processing
- **Storage**: Save conversations and upload files

## 🌐 Web Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- 1GB RAM recommended

### Installation Options

#### Option 1: Self-Hosted
1. Deploy the `build\` folder to your web server
2. Configure environment variables
3. Access via your domain

#### Option 2: Cloud Deployment
The web app can be deployed to:
- **Vercel**: `vercel --prod`
- **Netlify**: Upload `build\` folder
- **AWS S3 + CloudFront**: Static hosting
- **GitHub Pages**: Free hosting for public repos

### Environment Configuration
Create `.env.production` with:
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=wss://your-api-domain.com
```

## 🔧 Development Setup

### Desktop Development
```bash
cd desktop
npm install
npm start
```

### Mobile Development
```bash
cd mobile
npm install
npx expo start
npx expo start --android  # For Android emulator
```

### Web Development
```bash
npm install
npm run dev
```

## 📋 System Requirements

### Desktop
- **OS**: Windows 10+, macOS 10.14+, Ubuntu 18.04+
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 500MB available space
- **Network**: Broadband internet connection

### Mobile
- **OS**: Android 6.0+ (API 23+)
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 100MB available space
- **Network**: WiFi or mobile data

### Web
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM**: 1GB minimum, 2GB recommended
- **Network**: Broadband internet connection

## 🔒 Security Notes

- Desktop app runs in a sandboxed environment
- Mobile app requests permissions only when needed
- Web app uses HTTPS for all communications
- All data is encrypted in transit
- Local storage is encrypted on mobile devices

## 🐛 Troubleshooting

### Desktop Issues
- **App won't start**: Check if antivirus is blocking the installation
- **Connection errors**: Verify API server is running and accessible
- **Performance issues**: Close other applications to free up RAM

### Mobile Issues
- **Installation blocked**: Enable "Install from unknown sources"
- **App crashes**: Clear app cache and restart
- **Connection errors**: Check internet connection and API URL

### Web Issues
- **404 errors**: Verify deployment configuration
- **CORS errors**: Check API server CORS settings
- **Performance issues**: Enable browser caching

## 📞 Support

For installation issues:
1. Check this guide first
2. Review error logs
3. Visit our GitHub Issues page
4. Contact support at support@synova.ai

## 🔄 Updates

### Desktop Updates
- Automatic updates are enabled by default
- Manual updates: Download latest installer from releases

### Mobile Updates
- Updates available through Google Play Store
- For APK installs: Download latest APK and reinstall

### Web Updates
- Updates are deployed automatically
- Refresh browser to get latest version
