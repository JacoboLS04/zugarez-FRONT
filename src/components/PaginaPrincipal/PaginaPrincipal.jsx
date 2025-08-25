
import React from 'react';
import { AuthProvider } from './../../contexts/AuthContext';
import ProtectedRoute from './../../components/ProtectedRoute';
import Header from './../../components/Header';
import CrudMongoApp from './../../components/CrudMongoApp/CrudMongoApp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './../../components/PaginaPrincipal/TopBar/TopBar';
import Carousel from './../../components/PaginaPrincipal/Carousel/Carousel';
import InfoSection from './../../components/PaginaPrincipal/InfoSection/InfoSection';
import Footer from './Footer/Footer';

import './PaginaPrincipal.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="pagina-principal">

            <TopBar />
            <Carousel />
            <InfoSection />
          
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
            
            <Footer/>

        </div>
        

      </Router>
    </AuthProvider>
  );
}

export default App;
