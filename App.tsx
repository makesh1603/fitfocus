
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AICoach from './pages/AICoach';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';
import Trainers from './pages/Trainers';
import Admin from './pages/Admin';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/ai-coach" element={<AICoach />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;
