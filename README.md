# React Meetup App

A React application for managing meetups with advanced navigation, favorites functionality, and scroll animations.

## 🚀 Implemented Features

### 📱 Header with Scroll Animation
- **Behavior**: Header hides on scroll down and reappears on scroll up
- **Implementation**: Custom hook `useScrollDirection` that detects scroll direction
- **Animation**: Smooth transition with CSS transforms
- **Threshold**: Activates only after 100px of scroll to prevent flickering

### 🧭 SEO-Friendly Navigation
- **React Router**: Navigation between pages with semantic URLs
- **Implemented routes**:
  - `/` - Main page with all meetups
  - `/favorites` - Favorites page
  - `/new-meetup` - Form to create new meetups
- **SEO-friendly**: URLs reflect page content

### ⭐ Favorites System
- **Complete functionality**: Add and remove meetups from favorites
- **Global state**: Context API to manage favorites across the app
- **Persistence**: Favorites are maintained during the session
- **Dynamic badge**: Counter in header showing number of favorites
- **Responsive UI**: Buttons dynamically change between "Add to favorites" and "Remove from favorites"

### 🧪 Comprehensive Test Suite
- **Unit Tests**: Testing of `useScrollDirection` hook with scroll simulation
- **E2E Tests**: Testing complete header behavior with scroll
- **Integration Tests**: Testing complete favorites flow
- **Technologies**: Jest, React Testing Library, Enzyme
- **Coverage**: Advanced mocking of browser APIs (fetch, scroll, requestAnimationFrame)

## 🛠️ Technologies Used

- **React 18** - Main framework
- **React Router v6** - Navigation and routing
- **Context API** - Global state management
- **CSS Modules** - Modular and scoped styles
- **Custom Hooks** - Reusable logic (useScrollDirection, useFetch)
- **Jest & React Testing Library** - Testing framework
- **Enzyme** - Additional testing utilities

## 📦 Installation and Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Steps to run the project

1. **Clone the repository**
```bash
git clone [REPOSITORY_URL]
cd react_meetup
```

2. **Install dependencies**
```bash
npm install
```

3. **Run in development mode**
```bash
npm start
```
The application will open at [http://localhost:3000](http://localhost:3000)

4. **Run tests**
```bash
npm test
```

5. **Build for production**
```bash
npm run build
```

## 🏗️ Project Architecture

```
src/
├── components/          # Reusable components
│   ├── layout/         # Header, Navigation, Layout
│   ├── meetups/        # MeetupItem, MeetupList, NewMeetupForm
│   └── ui/             # Card, LoadingSpinner
├── contexts/           # Context providers (FavoritesContext)
├── pages/              # Main pages
├── util-hooks/         # Custom hooks
├── utils/              # Utilities and constants
└── App.js              # Main component with routing
```

## 🎯 Implementation Decisions

### Header Scroll Animation
- **Approach**: Custom hook instead of external libraries for better control
- **Performance**: Use of `requestAnimationFrame` for smooth animations
- **UX**: 100px threshold to avoid erratic behavior

### State Management
- **Context API**: Chosen over Redux for simplicity and project size
- **Local Storage**: Not implemented intentionally to maintain simplicity

### Testing Strategy
- **Pyramid approach**: More unit tests, fewer E2E tests
- **Mocking strategy**: Complete mocking of browser APIs for deterministic tests
- **Helper functions**: Code duplication reduction in tests

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Runs the test suite
- `npm run build` - Builds the app for production
- `npm run eject` - Exposes webpack configuration (not recommended)

## 📝 Additional Notes

- The application is fully responsive
- Meetup data is loaded from `public/data.json`
- Tests include advanced mocking to simulate browser behaviors
- Code follows React best practices and is optimized for performance
