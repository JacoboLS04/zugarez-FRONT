
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import CrudMongoApp from './components/CrudMongoApp/CrudMongoApp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/PaginaPrincipal/TopBar/TopBar';
import Carousel from './components/PaginaPrincipal/Carousel/Carousel';
import InfoSection from './components/PaginaPrincipal/InfoSection/InfoSection';
import PaginaPrincipal from './components/PaginaPrincipal/PaginaPrincipal';

function App() {
  return (
      <React.StrictMode>
          <PaginaPrincipal />
        </React.StrictMode>
  
  );
}

export default App;
