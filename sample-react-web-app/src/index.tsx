import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WebRTCService } from 'ts-webrtc-react-client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const videoChatService = new WebRTCService();
root.render(
  <React.StrictMode>
    <App videoChatService={videoChatService} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
