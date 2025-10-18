import React, { useState } from 'react';
import ClientShopping from './ClientShopping';
import Unsubscribe from './Unsubscribe';
import './ClientShopping.css';

const ClientePage = () => {
  const [active, setActive] = useState('compra'); // 'compra' | 'baja'

  return (
    <div className="cliente-page">
      <aside className="cliente-sidebar" role="navigation" aria-label="Módulos cliente">
        <button
          className={`cliente-nav-btn ${active === 'compra' ? 'active' : ''}`}
          onClick={() => setActive('compra')}
        >
          Compra
        </button>
        <button
          className={`cliente-nav-btn ${active === 'baja' ? 'active' : ''}`}
          onClick={() => setActive('baja')}
        >
          Dar de baja
        </button>
      </aside>

      <main className="cliente-content" role="main">
        {active === 'compra' ? <ClientShopping /> : <Unsubscribe />}
      </main>
    </div>
  );
};

export default ClientePage;
