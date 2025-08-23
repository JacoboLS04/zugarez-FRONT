
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import CrudMongoApp from './components/CrudMongoApp/CrudMongoApp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={
            <ProtectedRoute>
              <div style={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #312e81 0%, #581c87 50%, #be185d 100%)'
              }}>
                <Header />
                <CrudMongoApp />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
