import React, { useState } from "react";
import "./LotesModule.css";
import LoteForm from "../Formulario/LoteForm";

const LotesModule = () => {
  const [lotes, setLotes] = useState([]);
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
    });
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...formData, [name]: value };

    // reglas automáticas
    if (name === "cantidadInicial") {
      newData.cantidadDisponible = value;
      if (newData.precioLote) {
        newData.precioUnidad = (newData.precioLote / value).toFixed(2);
      }
    }
    if (name === "precioLote" && newData.cantidadInicial) {
      newData.precioUnidad = (value / newData.cantidadInicial).toFixed(2);
    }

    setFormData(newData);
  };


  const handleSubmit = (newLote) => {
    setLotes([...lotes, newLote]);
  };

  return (
    <div className="lotes-module">
      <h2>Gestion de Lotes</h2>
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
        </tbody>
      </table>

      {showModal && (
        <LoteForm
          formData={formData}
          onChange={handleChange}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default LotesModule;
