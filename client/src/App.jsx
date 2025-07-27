import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TopMovers from './components/TopMovers';
import TrendPrediction from './components/TrendPrediction';
import { FiMoon, FiSun } from 'react-icons/fi';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-5xl mx-auto">
          <p className="text-red-500 font-medium">Something went wrong. Please try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Mstock Dashboard</h1>
            <div className="flex space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={realTimeUpdates}
                  onChange={() => setRealTimeUpdates((prev) => !prev)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Real-time Updates</span>
              </label>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <ErrorBoundary>
            <TopMovers realTimeUpdates={realTimeUpdates} />
          </ErrorBoundary>
          <ErrorBoundary>
            <TrendPrediction realTimeUpdates={realTimeUpdates} />
          </ErrorBoundary>
        </main>
      </div>
    </QueryClientProvider>
  );
}