
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RegisterProperty from './pages/RegisterProperty';
import BuyerPage from './pages/BuyerPage';
import Backoffice from './pages/Backoffice';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vender" element={<RegisterProperty />} />
          <Route path="/comprar" element={<BuyerPage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/gestao" 
            element={
              <RequireAuth>
                <Backoffice />
              </RequireAuth>
            } 
          />
          {/* Catch-all: Redirect any unknown URL to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
