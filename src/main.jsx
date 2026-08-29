import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for 100% offline cache
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nouvelle version disponible.');
  },
  onOfflineReady() {
    console.log('Application prête à fonctionner 100% hors-ligne.');
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
