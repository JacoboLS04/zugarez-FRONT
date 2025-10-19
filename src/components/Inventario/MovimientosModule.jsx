import React, { useState, useEffect } from "react";
import "./MovimientosModule.css";
import MovimientoForm from "./MovmientoForm";
import { useAuthenticatedRequest } from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const MovimientosModule = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'ascending'
  });
  
  const { makeRequest } = useAuthenticatedRequest();
  const LOTES_URL = '/inventory/lotes';

  useEffect(() => {
    loadLotes();
  }, []);

  const loadLotes = async () => {
    try { 
      setLoading(true);
      const data = await makeRequest(LOTES_URL, { method: 'GET' });
      setLotes(data || []);
    } catch (error) {
      console.error('Error cargando lotes:', error);
      Swal.fire('Error', 'No se pudieron cargar los lotes: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovimiento = (nuevo) => {
    setMovimientos([...movimientos, { ...nuevo, id: movimientos.length + 1 }]);
    setShowModal(false); // cerrar modal al guardar
  };

  // Sort handling function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to get the sort direction indicator
  const getSortDirectionIndicator = (column) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Apply sorting to movimientos
  const sortedMovimientos = React.useMemo(() => {
    let sortableMovimientos = [...movimientos];
    if (sortConfig.key) {
      sortableMovimientos.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle string comparison case-insensitive
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        // Handle date comparison
        if (sortConfig.key === 'fecha') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableMovimientos;
  }, [movimientos, sortConfig]);

  return (
    <div className="movimientos-module">
      <h2>Movimientos de Inventario</h2>
      <button className="btn-add" onClick={() => setShowModal(true)}>
        ➕ Registrar Movimiento
      </button>

      <table>
        <thead>
          <tr>
            <th className="sortable-header" onClick={() => requestSort('id')}>
              #{getSortDirectionIndicator('id')}
            </th>
            <th className="sortable-header" onClick={() => requestSort('lote')}>
              Lote{getSortDirectionIndicator('lote')}
            </th>
            <th className="sortable-header" onClick={() => requestSort('tipo')}>
              Tipo{getSortDirectionIndicator('tipo')}
            </th>
            <th className="sortable-header" onClick={() => requestSort('cantidad')}>
              Cantidad{getSortDirectionIndicator('cantidad')}
            </th>
            <th className="sortable-header" onClick={() => requestSort('fecha')}>
              Fecha{getSortDirectionIndicator('fecha')}
            </th>
            <th className="sortable-header" onClick={() => requestSort('motivo')}>
              Motivo{getSortDirectionIndicator('motivo')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedMovimientos.length > 0 ? (
            sortedMovimientos.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.lote}</td>
                <td>{m.tipo}</td>
                <td>{m.cantidad}</td>
                <td>{m.fecha}</td>
                <td>{m.motivo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                No hay movimientos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <MovimientoForm
          lotes={lotes}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddMovimiento}
          loading={loading}
        />
      )}
    </div>
  );
};

export default MovimientosModule;
