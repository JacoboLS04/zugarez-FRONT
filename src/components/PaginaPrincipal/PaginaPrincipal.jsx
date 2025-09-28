
import React from 'react';
import ProtectedRoute from './../../components/ProtectedRoute';
import Header from '../PaginaAdmin/Header/Header';
import CrudMongoApp from './../../components/CrudMongoApp/CrudMongoApp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './../../components/PaginaPrincipal/TopBar/TopBar';
import Carousel from './../../components/PaginaPrincipal/Carousel/Carousel';
import InfoSection from './../../components/PaginaPrincipal/InfoSection/InfoSection';
import Footer from './Footer/Footer';
import ContactSocialMedia from './ContactSocialMedia/ContactSocialMedia';
import PreMenuContainer from './Menu/PreMenu/PreMenu/PreMenu/PreMenu';

import './PaginaPrincipal.css';

function App() {
  return (
    
      
        <div className="pagina-principal">

            <TopBar />
            <Carousel />
            <InfoSection />
            
            <PreMenuContainer />
          
            <ContactSocialMedia />
            <Footer/>
        </div>
        
  
    
  );
}

export default App;
