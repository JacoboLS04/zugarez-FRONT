<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { useAuthenticatedRequest } from '../../hooks/useAuth';
import { useAuth } from '../../contexts/AuthContext';
=======
import React, { useState } from "react";
>>>>>>> parent of 1aab6ca (modulo de movimientos realizado)
import "./LotesModule.css";
import LoteForm from "./LoteForm";

const LotesModule = () => {
  const [lotes, setLotes] = useState([]);
<<<<<<< HEAD
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    expirationDate: "",
    initialQuantity: "",
    availableQuantity: "",
    batchPrice: "",
    unitPrice: ""
  });

  const { makeRequest } = useAuthenticatedRequest();
  const { user } = useAuth();

  const LOTES_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app/inventory/lotes';
  const PRODUCTS_URL = 'https://better-billi-zugarez-sys-ed7b78de.koyeb.app/products';

  useEffect(() => {
    loadLotes();
    loadProducts();
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

  const loadProducts = async () => {
    try {
      const data = await makeRequest(PRODUCTS_URL, { method: 'GET' });
      setProducts(data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({
      productId: "",
      expirationDate: "",
      initialQuantity: "",
      availableQuantity: "",
      batchPrice: "",
      unitPrice: ""
=======
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    idLote: "",
    idProducto: "",
    fechaVencimiento: "",
    cantidadInicial: "",
    cantidadDisponible: "",
    precioLote: "",
    precioUnidad: ""
  });

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({
      idLote: "",
      idProducto: "",
      fechaVencimiento: "",
      cantidadInicial: "",
      cantidadDisponible: "",
      precioLote: "",
      precioUnidad: ""
>>>>>>> parent of 1aab6ca (modulo de movimientos realizado)
    });
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...formData, [name]: value };

<<<<<<< HEAD
    // Reglas automáticas
    if (name === "initialQuantity") {
      newData.availableQuantity = value;
      if (newData.batchPrice && value > 0) {
        newData.unitPrice = (newData.batchPrice / value).toFixed(2);
      }
    }
    if (name === "batchPrice" && newData.initialQuantity > 0) {
      newData.unitPrice = (value / newData.initialQuantity).toFixed(2);
=======
    // reglas automáticas
    if (name === "cantidadInicial") {
      newData.cantidadDisponible = value;
      if (newData.precioLote) {
        newData.precioUnidad = (newData.precioLote / value).toFixed(2);
      }
    }
    if (name === "precioLote" && newData.cantidadInicial) {
      newData.precioUnidad = (value / newData.cantidadInicial).toFixed(2);
>>>>>>> parent of 1aab6ca (modulo de movimientos realizado)
    }

    setFormData(newData);
  };

<<<<<<< HEAD
  const handleSubmit = async (formDataToSubmit) => {
    if (!formDataToSubmit.productId || !formDataToSubmit.expirationDate || 
        !formDataToSubmit.initialQuantity || !formDataToSubmit.batchPrice) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos', 'error');
      return;
    }

    try {
      setLoading(true);
      await makeRequest(LOTES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataToSubmit)
      });
      
      Swal.fire('¡Éxito!', 'Lote creado correctamente', 'success');
      await loadLotes(); // Recargar la lista
      handleCloseModal();
    } catch (error) {
      console.error('Error creando lote:', error);
      Swal.fire('Error', 'No se pudo crear el lote: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Producto ${productId}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
=======
  // ✅ Ahora solo recibe datos, no el evento
  const handleSubmit = (newLote) => {
    setLotes([...lotes, newLote]);
>>>>>>> parent of 1aab6ca (modulo de movimientos realizado)
  };

  return (
    <div className="lotes-module">
<<<<<<< HEAD
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner-lg">
            <div className="spinner"></div>
            <span>Cargando...</span>
          </div>
        </div>
      )}
      
      <h2>Gestión de Lotes</h2>
=======
      <h2>Gestion de Lotes</h2>
>>>>>>> parent of 1aab6ca (modulo de movimientos realizado)
      <button className="btn-add" onClick={handleOpenModal}>➕ Agregar Lote</button>

      <table>
        <thead>
          <tr>
            <th># Lote</th>
            <th>Producto</th>
            <th>Fecha Vencimiento</th>
            <th>Cantidad Inicial</th>
            <th>Cantidad Disponible</th>
            <th>Precio Lote</th>
            <th>Precio Unidad</th>
          </tr>
        </thead>
        <tbody>
<<<<<<< HEAD
          {lotes.length > 0 ? (
            lotes.map((lote) => (
              <tr key={lote.id}>
                <td>{lote.id}</td>
                <td>{getProductName(lote.product?.id)}</td>
                <td>{formatDate(lote.expirationDate)}</td>
                <td>{lote.initialQuantity}</td>
                <td>{lote.availableQuantity}</td>
                <td>${lote.batchPrice.toFixed(2)}</td>
                <td>${lote.unitPrice.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                No hay lotes registrados
              </td>
            </tr>
          )}
=======
          {lotes.map((lote, idx) => (
            <tr key={idx}>
              <td>{lote.idLote}</td>
              <td>{lote.idProducto}</td>
              <td>{lote.fechaVencimiento}</td>
              <td>{lote.cantidadInicial}</td>
              <td>{lote.cantidadDisponible}</td>
              <td>{lote.precioLote}</td>
              <td>{lote.precioUnidad}</td>
            </tr>
          ))}
>>>>>>> parent of 1aab6ca (modulo de movimientos realizado)
        </tbody>
      </table>

      {showModal && (
        <LoteForm
          formData={formData}
<<<<<<< HEAD
          products={products}
          onChange={handleChange}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          loading={loading}
=======
          onChange={handleChange}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
>>>>>>> parent of 1aab6ca (modulo de movimientos realizado)
        />
      )}
    </div>
  );
};

<<<<<<< HEAD
export default LotesModule;
=======
export default LotesModule;
>>>>>>> parent of 1aab6ca (modulo de movimientos realizado)
