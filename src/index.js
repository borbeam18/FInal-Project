import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// ลบ reportWebVitals หากไม่ต้องการใช้งานจริง
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// หากต้องการใช้งาน reportWebVitals ให้เปิดการใช้งานตามต้องการ
// reportWebVitals();
