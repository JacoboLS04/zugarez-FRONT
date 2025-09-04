
import React from 'react';

import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/PaginaAdmin/Header/Header';
import CrudMongoApp from './components/CrudMongoApp/CrudMongoApp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/PaginaPrincipal/TopBar/TopBar';
import Carousel from './components/PaginaPrincipal/Carousel/Carousel';
import InfoSection from './components/PaginaPrincipal/InfoSection/InfoSection';
import PaginaPrincipal from './components/PaginaPrincipal/PaginaPrincipal';
import AuthPage from './components/auth/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/LoginPage/LoginPage';
import AccessibilityWidget from './components/Accesibility/AccessibilityWidget';

function App() {
  return (
      


      <React.StrictMode>
        <Router>
          <Routes>
            {/* Página principal */}
            <Route path="/" element={<PaginaPrincipal/>} />

            {/* Login */}
            <Route path="/login" element={ <LoginPage/>} />
          </Routes>
        </Router>
        <AccessibilityWidget/>
      </React.StrictMode>
  
  );
}

export default App;
