// src/App.js
import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './components/HomePage';
import MatrixPage from './components/MatrixPage';
import PlaybookPage from './components/PlaybookPage';
import StrategicAlignmentPage from './components/StrategicAlignmentPage';
import ChatPage from './components/ChatPage';
import SettingsPage from './components/SettingsPage';
import LogoutPage from './components/LogoutPage';
import AnalyticsSummaryWidget from './components/AnalyticsSummaryWidget'; // Explicitly imported new component

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const lookerStudioEmbedUrl = process.env.REACT_APP_LOOKER_STUDIO_EMBED_URL;

// Example data for AnalyticsSummaryWidget
const analyticsSummaryData = [
  { label: 'Total Users', value: '1,234' },
  { label: 'Active Sessions', value: '567' },
  { label: 'Bounce Rate', value: '45%' },
];

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-grow flex flex-col overflow-hidden">
          <Header />
          <main className="flex-grow overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/matrix"
                element={
                  <MatrixPage
                    __firebase_config={JSON.stringify(firebaseConfig)}
                    __looker_studio_embed_url={lookerStudioEmbedUrl}
                    __app_id={firebaseConfig.appId}
                  />
                }
              />
              <Route path="/playbook" element={<PlaybookPage />} />
              <Route
                path="/strategic-alignment"
                element={
                  <>
                    <StrategicAlignmentPage />
                    <AnalyticsSummaryWidget
                      title="Analytics Summary"
                      data={analyticsSummaryData}
                    />
                  </>
                }
              />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;