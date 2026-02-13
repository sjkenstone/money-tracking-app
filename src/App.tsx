import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction';
import CalendarPage from './pages/CalendarPage';
import Charts from './pages/Charts';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
