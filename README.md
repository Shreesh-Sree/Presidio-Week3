# Presidio SDE Internship - Week 3: Frontend Engineering & UX

A premium React + TypeScript + Tailwind CSS v4 dashboard application built as an interactive learning playground and proof-of-work. It showcases the complete Week 3 curriculum requirements including advanced state synchronizations, isolated error boundaries, secure storage systems, accessibility standards, TanStack data fetches, dynamic charts, Zod forms, JWT token security sandboxes, and Vitest unit testing suites.

## 🌟 Live Demo Preview
- **Local Dev Server**: [http://localhost:5173/](http://localhost:5173/)

---

## 🛠️ Architecture & Core Stack

- **Core Framework**: React 19 + TypeScript (Strict Type Checks)
- **Scaffolding & Dev Server**: Vite 8
- **Styles & Layouts**: Tailwind CSS v4 (native `@tailwindcss/vite` configuration, harmonious custom HSL variables, glassmorphic panels, and transitions)
- **State Management**: Context API (Theme Provider context) + Zustand v5 (Persisted Client Store for checklists)
- **Data Fetching Engine**: TanStack Query (React Query) v5 (async/await mapping, caching, refetch actions, skeleton state mockers, and fault injection handles)
- **Forms & Validation**: React Hook Form + Zod (Strict schema resolver constraints)
- **Analytics Visualization**: Chart.js + React Chart.js 2 (Grouped Bar chart)
- **Testing Engine**: Vitest + React Testing Library + JSDOM
- **Icons**: Lucide React

---

## 📂 Project Structure

```
├── .env                         # Vite environment variables config
├── vitest.config.ts             # Vitest test runner configuration
├── src/
│   ├── main.tsx                 # Main entry wrapped in Theme & TanStack Query providers
│   ├── App.tsx                  # App routing shell & Sidebar navigation
│   ├── App.css                  # Custom styling overrides
│   ├── index.css                # Tailwind v4 configuration, themes, & animation flashes
│   ├── components/
│   │   ├── ErrorBoundary.tsx    # Class-based isolated React error bounds catcher
│   │   ├── CustomSelect.tsx     # Custom, keyboard-accessible dropdown component
│   │   └── CustomAlertModal.tsx # Global state-triggered custom alert modal
│   ├── context/
│   │   └── ThemeContext.tsx     # Light/Dark mode state switching Context
│   ├── store/
│   │   └── useStore.ts          # Zustand store with persistent tasks
│   ├── hooks/
│   │   ├── useOfflineStatus.ts  # Custom network online/offline listener
│   │   ├── useWindowSize.ts     # Custom window dimensions tracker
│   │   └── useWindowSize.test.ts # RTL hook unit test suite
│   ├── pages/
│   │   ├── Dashboard.tsx        # Overview stats, milestones, network/window hooks, and logs
│   │   ├── ReactAdvanced.tsx    # Memoized useCallback/useMemo vs raw re-renders and boundaries
│   │   ├── StateManagement.tsx  # Context API settings vs Zustand side-by-side sync
│   │   ├── ApiPlayground.tsx    # TanStack card list fetch with error testing
│   │   ├── Analytics.tsx        # Chart.js milestone graphs and Zod registration forms
│   │   └── A11yStorage.tsx      # Secure Storage explorer & JWT Access Token Security Arena
│   ├── utils/
│   │   ├── profiler.ts          # Plain JS profiler container (avoids re-render infinite loops)
│   │   └── profiler.test.ts     # Vitest utility unit test suite
```

---

## 🚀 Key Learning Milestones Implemented

### 1. React Advanced Concepts
- **Re-render Visualizer**: Interactive page displaying side-by-side optimized vs unoptimized child components. Triggers parents, prompting flash alerts (red = unoptimized render, green = memoized render).
- **Error Boundaries**: Isolate UI crashes in sub-modules without crashing the entire shell. Includes a "Reset & Retry" recovery state.
- **Custom Hooks**: Responsive screen sizing (`useWindowSize`) and connection states (`useOfflineStatus`).
- **useMemo**: Caches an expensive loop calculation (1,000,000 runs mapping `Math.sin`).

### 2. State Management Showcase
- **Context API**: Handles global styles and responsive UI states.
- **Zustand Persistence**: Decoupled task milestones store persisting directly into `localStorage`. Displays live JSON payloads of the store.

### 3. API Consumption & Error Handling
- **TanStack Query (React Query)**: Asynchronously queries a directory from JSONPlaceholder, featuring cached states, background fetching alerts, and skeleton screens.
- **Fault Injection**: Includes a healthy/faulty server toggle to demonstrate custom error boundaries catching API outages reactively.

### 4. Forms & Analytics Visualization
- **Grouped Bar Charts**: Renders active Zustand tasks analytics. Shows completed vs pending milestones in each category, updating reactively in real time.
- **Zod Form Resolver**: Internship onboarding registration form validation. Enforces strict length limits, email validity, and password complexity rules (requires digit, special character, 6+ chars) in React Hook Form.

### 5. Accessibility (a11y) & Token Security
- **Secure Storage Console**: Interface to interact with `localStorage`, `sessionStorage`, and `cookies`. Features a mock encryption toggler (Base64 encoding/decoding) illustrating secure payload processing.
- **JWT Storage Arena**: Interactive access token simulator highlighting security trade-offs (InMemory, LocalStorage, HTTP-only Cookies) against XSS script leaks and CSRF auto-submits. Includes direct attack simulation triggers.
- **Aria Live Announcer**: Announcements using `aria-live="polite"` reading console events to screen readers.
- **Custom UI Components**: Replaced native browser select lists and default `alert()` dialogues with premium glassmorphic, keyboard-accessible components: `CustomSelect` and `CustomAlertModal` integrated via Zustand.
- **Semantic HTML**: Fully focusable inputs and tab-indexed badges handling keyboard triggers (`onKeyDown`).

### 6. Vitest & React Testing Library (RTL)
- Unit tests written for our custom `useWindowSize` hook and plain JS `profiler` counters.
- Executed on a virtual simulated `jsdom` document.

---

## 💻 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) inside your browser.

### 3. Run Test Suites
```bash
npm run test
```
Executes all Vitest test specifications once.

### 4. Compile Production Bundle
```bash
npm run build
```
This runs the TypeScript check compiler and builds production-ready optimized assets in the `dist/` directory.
