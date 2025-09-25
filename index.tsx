import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import { Toaster } from './components/ui/Toaster';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <HashRouter>
            <AuthProvider>
                <ThemeProvider>
                    <LanguageProvider>
                        <ToastProvider>
                            <AppProvider>
                                <App />
                                <Toaster />
                            </AppProvider>
                        </ToastProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </AuthProvider>
        </HashRouter>
    </React.StrictMode>
);
