import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Set up axios defaults
import axios from 'axios'
// Set base URL for API requests from environment variables
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Check for token in localStorage and set auth header
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
