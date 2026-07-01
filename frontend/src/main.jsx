import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { BudgetProvider } from './context/BudgetContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <ThemeProvider>
          <ExpenseProvider>
            <BudgetProvider>
              <App />
            </BudgetProvider>
          </ExpenseProvider>
        </ThemeProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
);
