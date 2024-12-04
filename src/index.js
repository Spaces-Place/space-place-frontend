import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from './utils/AuthContext';
import { ThemeProvider } from './utils/ThemeContext'; 
import { SearchProvider } from './utils/SearchContext';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

<React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <CookiesProvider>
        <ThemeProvider>
          <AuthProvider>
            <SearchProvider>
              <App />
            </SearchProvider>
          </AuthProvider>
        </ThemeProvider>
      </CookiesProvider>
    </BrowserRouter>
  </Provider>
</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
