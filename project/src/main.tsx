import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <ToastContainer
          autoClose={2200}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover={false}
          theme="light"
        />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
