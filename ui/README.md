# SYNOVA NEXUS UI

A modern, responsive React interface for the SYNOVA NEXUS ecosystem with comprehensive features and professional UX.

## 🚀 Features

### Core UI Components
- **Persistent Chat Sidebar** - Collapsible conversations with recent history
- **Clean Header Bar** - Logo, navigation, user avatar, model switcher
- **Message Bubble Layout** - Left-aligned human, right-aligned Synova responses
- **Professional Typography** - System fonts, proper spacing, timestamps
- **Dark/Light Mode** - Full theme system with auto-detection
- **Responsive Design** - Mobile-first approach with breakpoints

### Settings & Personalization
- **General Settings** - Theme, layout, language preferences
- **Personalization** - Personality/tone selection, custom instructions
- **Advanced Controls** - Temperature, streaming, context, agent behavior
- **Memory Management** - Retention controls, conversation pinning

### Professional Features
- **Agent Selection** - Specialized AI agents for different domains
- **Project Organization** - Folder system with tags and search
- **Keyboard Shortcuts** - Comprehensive hotkey system
- **Code Blocks** - Syntax highlighting with copy functionality
- **Export/Share** - Multiple format support
- **Typing Indicators** - Real-time status display
- **Error Handling** - Graceful error states and messages

## 🛠 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom design system
- **Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React icon library
- **State Management**: Zustand for global state
- **Animations**: Framer Motion for smooth transitions
- **Code Highlighting**: React Syntax Highlighter
- **Markdown**: React Markdown with GitHub-flavored support

## 📁 Project Structure

```
ui/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx           # Main dashboard with all features
│   └── globals.css         # Global styles and design tokens
├── components/
│   └── ui/               # Reusable UI components
│       ├── avatar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── tabs.tsx
│       ├── switch.tsx
│       ├── slider.tsx
│       ├── badge.tsx
│       ├── separator.tsx
│       └── scroll-area.tsx
├── lib/
│   └── utils.ts            # Utility functions
├── pages/
│   └── api/
│       └── health.js      # Health check endpoint
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🎨 Design System

### Color Palette
- **Synova Blue**: Primary brand color (#0ea5e9)
- **Semantic Colors**: Success, warning, error, info
- **Neutral Grays**: 10-step gray scale for text and borders
- **Theme Variables**: CSS custom properties for consistent theming

### Typography
- **Primary Font**: Inter (system font stack fallback)
- **Monospace Font**: JetBrains Mono for code
- **Font Sizes**: Responsive scaling with proper line height
- **Text Hierarchy**: Clear heading and body text styles

### Components
- **Consistent Spacing**: 4px base unit, 8px rhythm
- **Rounded Corners**: 0.5rem radius for modern look
- **Subtle Shadows**: Multi-layer shadow system for depth
- **Smooth Animations**: 0.2s base duration, easing functions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with ES6+ support

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/synova-ui.git

# Install dependencies
cd synova-ui
npm install

# Start development server
npm run dev
```

### Environment Variables
```bash
# Create .env.local file
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

## 🎯 Usage

### Development
```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

### Production
```bash
# Build optimized production bundle
npm run build

# Start production server
npm start

# Export static files
npm run export
```

## 🔧 Configuration

### Theme Customization
The theme system uses CSS custom properties for easy customization:

```css
:root {
  --synova-primary: 59 130 246;
  --synova-secondary: 107 114 128;
  --synova-accent: 99 102 241;
  --synova-radius: 0.5rem;
  --synova-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Component Variants
All components support variant props for consistent styling:

```tsx
<Button variant="primary" size="lg">
  Primary large button
</Button>

<Badge variant="secondary">
  Secondary badge
</Badge>
```

## 📱 Responsive Design

- **Mobile First**: Progressive enhancement approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Appropriate tap targets and spacing
- **Adaptive Layout**: Sidebar collapses on mobile, full width on desktop

## 🔒 Security & Best Practices

- **Input Validation**: All inputs are sanitized and validated
- **XSS Protection**: Content Security Policy headers
- **Type Safety**: Strict TypeScript configuration
- **Dependency Security**: Regular security updates
- **Environment Variables**: Sensitive data in environment, not code

## 🌐 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **ES6+ Support**: All modern JavaScript features
- **CSS Grid/Flexbox**: Modern layout features
- **Web Standards**: HTML5, CSS3, ES6+

## 📊 Performance

- **Bundle Optimization**: Code splitting and tree shaking
- **Image Optimization**: Next.js Image component
- **Font Loading**: Optimized font loading strategy
- **Caching**: Appropriate cache headers and strategies
- **Core Web Vitals**: Performance monitoring built-in

## 🔍 API Integration

### Health Check Endpoint
`GET /api/health` returns service health status:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "service": "synova-ui",
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "api": "healthy",
    "database": "connected",
    "auth": "healthy",
    "storage": "healthy"
  },
  "uptime": 3600,
  "memory": {
    "used": 128,
    "total": 512,
    "percentage": 25
  }
}
```

## 🎨 Theme Packs

### Built-in Themes
- **Light**: High contrast, clean interface
- **Dark**: True dark with reduced eye strain
- **Auto**: Respects system preference
- **Synova Blue**: Brand accent theme

### Custom Themes
Theme system supports custom CSS variables for complete customization:

```css
.theme-terminal {
  --bg-primary: 0 0 0;
  --text-primary: 0 255 0;
  --accent: 0 255 0;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript types
4. Add tests for new components
5. Follow the existing code style and patterns
6. Submit a pull request with clear description

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Next.js** - React framework and development platform
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library
- **Framer Motion** - Production-ready animation library
