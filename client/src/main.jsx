import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const initializeApp = () => {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error('Root element not found!');
      document.body.innerHTML = '<div class="error">Error: Root element not found</div>';
      return;
    }
    
    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
  } catch (error) {
    console.error('Failed to render application:', error);
    document.body.innerHTML = `
      <div class="error">
        <h2>Application Error</h2>
        <p>Failed to render application: ${error.message}</p>
        <button onclick="location.reload()">Reload</button>
      </div>
    `;
  }
};

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
