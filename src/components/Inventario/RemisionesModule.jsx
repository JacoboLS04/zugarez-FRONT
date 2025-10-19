import React, { useState } from 'react';
import { FileText, Upload, Trash2, Download, Calendar, AlertCircle } from 'lucide-react';
import './RemisionesModule.css';

const RemisionesModule = () => {
  const [remisiones, setRemisiones] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const fileInputRef = React.createRef();

  // Manejar clic en botón de añadir remisión
  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validar que el archivo sea Excel
    const validExcelTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroEnabled.12'
    ];

    if (!validExcelTypes.includes(selectedFile.type)) {
      setUploadError('El archivo debe ser un documento de Excel (.xls, .xlsx)');
      setUploadSuccess(null);
      // Limpiar el input para permitir seleccionar el mismo archivo
      e.target.value = null;
      return;
    }

    // Simular carga del archivo
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    // Simular tiempo de carga (en un caso real esto sería una llamada a API)
    setTimeout(() => {
      // Crear nueva remisión con datos del archivo
      const newRemision = {
        id: Date.now(),
        nombre: selectedFile.name,
        fecha: new Date().toISOString(),
        tamaño: selectedFile.size,
        tipo: selectedFile.type,
        // En un caso real, aquí guardaríamos la URL del servidor
        url: URL.createObjectURL(selectedFile)
      };

      // Agregar a la lista
      setRemisiones([...remisiones, newRemision]);
      setIsUploading(false);
      setUploadSuccess('Remisión subida correctamente');

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setUploadSuccess(null);
      }, 3000);

      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
      e.target.value = null;
    }, 1000);
  };

  // Eliminar una remisión
  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro que desea eliminar esta remisión?')) {
      setRemisiones(remisiones.filter(remision => remision.id !== id));
    }
  };

  // Formatear el tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="remisiones-container">
      <div className="remisiones-header">
        <h1>Remisiones de Inventario</h1>
        <button 
          className="add-remision-btn" 
          onClick={handleAddClick}
          disabled={isUploading}
        >
          <Upload size={18} />
          Añadir Remisión
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".xls,.xlsx"
        />
      </div>

      {/* Mensaje de error o éxito */}
      {uploadError && (
        <div className="upload-message error">
          <AlertCircle size={18} />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="upload-message success">
          <span>{uploadSuccess}</span>
        </div>
      )}

      {isUploading && (
        <div className="upload-loading">
          <div className="loader"></div>
          <span>Subiendo archivo...</span>
        </div>
      )}

      <div className="remisiones-list-container">
        <h2>Lista de Remisiones</h2>
        
        {remisiones.length === 0 ? (
          <div className="no-remisiones">
            <FileText size={32} />
            <p>No hay remisiones disponibles</p>
            <p className="subtext">Las remisiones que subas aparecerán aquí</p>
          </div>
        ) : (
          <div className="remisiones-table-container">
            <table className="remisiones-table">
              <thead>
                <tr>
                  <th>Nombre del archivo</th>
                  <th>Fecha</th>
                  <th>Tamaño</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {remisiones.map(remision => (
                  <tr key={remision.id}>
                    <td className="remision-name">
                      <FileText size={18} className="excel-icon" />
                      <span>{remision.nombre}</span>
                    </td>
                    <td className="remision-date">
                      <Calendar size={16} />
                      <span>{formatDate(remision.fecha)}</span>
                    </td>
                    <td>{formatFileSize(remision.tamaño)}</td>
                    <td className="remision-actions">
                      <button 
                        className="action-btn download" 
                        title="Descargar"
                        onClick={() => window.open(remision.url, '_blank')}
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        className="action-btn delete" 
                        title="Eliminar"
                        onClick={() => handleDelete(remision.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemisionesModule;
