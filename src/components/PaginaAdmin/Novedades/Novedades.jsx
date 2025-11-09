import React, { useState, useEffect } from 'react';
import { Upload, Download, FileSpreadsheet, Calendar } from 'lucide-react';
import './Novedades.css';

const Novedades = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('novedades-files');
    if (savedFiles) {
      try {
        setUploadedFiles(JSON.parse(savedFiles));
      } catch (error) {
        console.error('Error loading files from localStorage:', error);
      }
    }
  }, []);

  // Save files to localStorage whenever uploadedFiles changes
  useEffect(() => {
    localStorage.setItem('novedades-files', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const excelFiles = files.filter(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );

    if (excelFiles.length === 0) {
      alert('Por favor, selecciona solo archivos de Excel (.xlsx, .xls)');
      return;
    }

    setIsUploading(true);

    try {
      for (const file of excelFiles) {
        // Convert file to base64 for storage
        const fileData = await fileToBase64(file);
        
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          data: fileData
        };

        setUploadedFiles(prev => [...prev, newFile]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error al subir los archivos');
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleDownload = (file) => {
    try {
      // Convert base64 back to blob
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error al descargar el archivo');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="novedades-container">
      <div className="novedades-header">
        <h2>Gestión de Novedades</h2>
        <p>Sube archivos de Excel con las novedades del personal</p>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-area">
          <input
            type="file"
            id="file-input"
            multiple
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleFileUpload}
            className="file-input"
            disabled={isUploading}
          />
          <label htmlFor="file-input" className={`upload-label ${isUploading ? 'uploading' : ''}`}>
            <Upload className="upload-icon" />
            <span className="upload-text">
              {isUploading ? 'Subiendo archivos...' : 'Seleccionar archivos Excel'}
            </span>
            <span className="upload-hint">
              Formatos soportados: .xlsx, .xls
            </span>
          </label>
        </div>
      </div>

      {/* Files List */}
      <div className="files-section">
        <h3>Archivos Subidos ({uploadedFiles.length})</h3>
        
        {uploadedFiles.length === 0 ? (
          <div className="no-files">
            <FileSpreadsheet className="no-files-icon" />
            <p>No hay archivos subidos aún</p>
            <p className="no-files-hint">Sube tu primer archivo de Excel para comenzar</p>
          </div>
        ) : (
          <div className="files-grid">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="file-card">
                <div className="file-icon">
                  <FileSpreadsheet />
                </div>
                <div className="file-info">
                  <h4 className="file-name" title={file.name}>
                    {file.name}
                  </h4>
                  <p className="file-size">{formatFileSize(file.size)}</p>
                  <div className="file-date">
                    <Calendar className="date-icon" />
                    <span>Subido: {formatDate(file.uploadDate)}</span>
                  </div>
                </div>
                <div className="file-actions">
                  <button
                    onClick={() => handleDownload(file)}
                    className="download-btn"
                    title="Descargar archivo"
                  >
                    <Download />
                    Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Novedades;
