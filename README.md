# Chronus Web App

A modern, feature-rich web application for managing emails, calendar events, and AI-powered productivity tools. Built with Angular and designed with a beautiful clay-toned aesthetic.

## 🌟 Features

### 📧 Email Management

- **Gmail Integration**: Full Gmail sync and management
- **Advanced Email List**: Sortable, filterable email list with pagination
- **Rich Email Viewer**: HTML email rendering with attachment support
- **Compose & Send**: Full-featured email composition
- **Smart Folders**: Inbox, Sent, Drafts, Starred, Important, Spam, Trash
- **Search**: Fast email search with Gmail query syntax
- **Bulk Actions**: Select multiple emails for batch operations

### 📅 Calendar

- **Google Calendar Integration**: Sync and manage calendar events
- **Multiple Views**: Month, week, day views
- **Event Management**: Create, edit, delete events with drag-and-drop
- **Event Details**: Full event information with attendees

### 💬 AI Assistant

- **Intelligent Chat**: AI-powered productivity assistant
- **Context-Aware**: Understands your emails and calendar
- **Proactive Suggestions**: Smart recommendations

### 🎨 Design

- **Clay-Toned Theme**: Warm, professional color palette
- **Responsive**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface
- **Smooth Animations**: Polished user experience

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Angular CLI**: 17.x or higher

### Installation

1. **Clone the repository**

   ```bash
   cd chronus-webapp
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**

   Update `src/environments/environment.ts`:

   ```typescript
   export const environment = {
     production: false,
     apiUrl: "http://localhost:8000/api/v1",
     googleClientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
   };
   ```

4. **Run development server**

   ```bash
   ng serve
   ```

5. **Open browser**
   ```
   http://localhost:4200
   ```

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── services/       # Core services (auth, API)
│   │   ├── guards/         # Route guards
│   │   └── interceptors/   # HTTP interceptors
│   ├── features/
│   │   ├── auth/           # Authentication module
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── mail/           # Email module
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── store/      # NgRx state management
│   │   │   └── models/
│   │   ├── calendar/       # Calendar module
│   │   └── chat/           # AI chat module
│   ├── shared/
│   │   ├── components/     # Reusable components
│   │   └── pipes/          # Custom pipes
│   └── app.module.ts
├── assets/
├── environments/
└── styles/
    └── _theme.scss         # Global theme variables
```

## 🎨 Theme Customization

The app uses a clay-toned color palette defined in `_theme.scss`:

```scss
$clay-50: #fffdf8;
$clay-100: #fff8ee;
$clay-200: #ffeccd;
$clay-300: #ffe2b3;
$clay-400: #f5c785;
$clay-500: #e5ad64;
$clay-600: #c98938;
$clay-700: #9a5f23;
$clay-800: #6a3b16;
$clay-900: #3a210c;
```

## 🏗️ Architecture

### State Management

- **NgRx**: For complex state (email, calendar)
- **Services**: For simpler state (auth, settings)

### Design Patterns

- **Feature Modules**: Lazy-loaded modules
- **Smart/Dumb Components**: Container and presentational components
- **Reactive Forms**: Form validation and handling
- **RxJS**: Reactive programming with observables

### Performance Optimizations

- **Lazy Loading**: Load modules on demand
- **OnPush Change Detection**: Optimize rendering
- **Virtual Scrolling**: Handle large email lists
- **Memoization**: Cache computed values
- **Debouncing**: Reduce API calls

## 📦 Key Dependencies

### Core

- `@angular/core: ^17.x` - Angular framework
- `@angular/router: ^17.x` - Routing
- `@angular/forms: ^17.x` - Forms
- `@angular/common: ^17.x` - Common utilities

### State Management

- `@ngrx/store: ^17.x` - State management
- `@ngrx/effects: ^17.x` - Side effects
- `@ngrx/router-store: ^17.x` - Router integration

### UI

- `@angular/material: ^17.x` - Material Design (optional)
- `lucide-angular: ^0.x` - Icons
- `ngx-quill: ^25.x` - Rich text editor (for compose)

### Utilities

- `rxjs: ^7.x` - Reactive programming
- `date-fns: ^3.x` - Date utilities

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
ng test

# Run with coverage
ng test --code-coverage

# Run in headless mode
ng test --browsers=ChromeHeadless --watch=false
```

### E2E Tests

```bash
# Run e2e tests
ng e2e
```

## 🔨 Build

### Development Build

```bash
ng build
```

### Production Build

```bash
ng build --configuration production
```

### Build with AOT

```bash
ng build --aot
```

### Analyze Bundle Size

```bash
ng build --stats-json
npx webpack-bundle-analyzer dist/chronus-webapp/stats.json
```

## 🚀 Deployment

### Deploy to Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init

# Deploy
firebase deploy
```

### Deploy to Netlify

```bash
# Build
ng build --configuration production

# Deploy
netlify deploy --prod --dir=dist/chronus-webapp
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/chronus-webapp /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t chronus-webapp .
docker run -p 80:80 chronus-webapp
```

## 🔧 Configuration

### Environment Files

**Development** (`environment.ts`):

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:8000/api/v1",
  googleClientId: "your-dev-client-id",
};
```

**Production** (`environment.prod.ts`):

```typescript
export const environment = {
  production: true,
  apiUrl: "https://api.chronus.app/api/v1",
  googleClientId: "your-prod-client-id",
};
```

### Proxy Configuration

For development, create `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true
  }
}
```

Update `angular.json`:

```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

## 📊 Features in Detail

### Email Module

**Components:**

- `MailComponent` - Main email container
- `MailListComponent` - Email list with filters
- `MailDetailComponent` - Email viewer
- `MailSidebarComponent` - Folder navigation
- `ComposeEmailComponent` - Email composition
- `EmailBodyComponent` - HTML email renderer

**State Management:**

```typescript
interface MailState {
  emails: Email[];
  selectedEmail: Email | null;
  folders: MailFolder[];
  loading: boolean;
  error: string | null;
  filters: {
    label: string;
    unreadOnly: boolean;
    starredOnly: boolean;
  };
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
```

### Calendar Module

**Features:**

- Month/Week/Day views
- Event creation with form
- Drag-and-drop rescheduling
- Event details modal
- Multiple calendar support

### Chat Module

**Features:**

- Real-time chat interface
- Message history
- Typing indicators
- AI-powered responses

## 🐛 Troubleshooting

### Common Issues

**Module not found errors**

```bash
rm -rf node_modules package-lock.json
npm install
```

**CORS errors**

- Configure proxy in `proxy.conf.json`
- Or enable CORS on backend

**Build errors**

```bash
ng cache clean
ng build --configuration production
```

**Slow development server**

- Disable source maps in development
- Use `--optimization=false`

## 🔒 Security

- **Authentication**: JWT tokens with HTTP-only cookies
- **XSS Protection**: Angular's built-in sanitization
- **CSRF Protection**: CSRF tokens
- **Content Security Policy**: Strict CSP headers
- **HTTPS**: Force HTTPS in production

## 📱 Responsive Design

Breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus management

## 🌐 Internationalization (i18n)

```bash
# Extract translations
ng extract-i18n

# Build for specific locale
ng build --configuration production --localize
```

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow Angular style guide
4. Write tests
5. Submit pull request

## 🔗 Related Repositories

- [Chronos Mobile](../chronos-mobile) - Flutter mobile app
- [Chronus AI Backend](../chronus-ai) - FastAPI backend

## 📞 Support

For issues and questions:

- Create an issue in this repository
- Check existing documentation
- Contact development team

---

**Built with Angular and ❤️**
