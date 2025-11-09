import React from 'react';
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
