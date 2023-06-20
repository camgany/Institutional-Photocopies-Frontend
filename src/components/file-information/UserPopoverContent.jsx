import React, { useState } from 'react';
import { Box, Typography, Button, Link, Select, MenuItem } from '@mui/material';
import axios from 'axios';

function UserPopoverContent({ selectedRequest, handleStatusChange }) {
  const [ringSize, setRingSize] = useState('');

  const handleMarkAsCompleted = () => {
    const token = localStorage.getItem('token');

    axios
      .patch(
        `https://fotocopias-upb.herokuapp.com/api/v1/requests/${selectedRequest.id}`,
        { isCompleted: true },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        handleStatusChange();
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleDeleteRequest = () => {
    const token = localStorage.getItem('token');

    axios
      .delete(`https://fotocopias-upb.herokuapp.com/api/v1/requests/${selectedRequest.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        handleStatusChange();
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleDownloadFile = () => {
    const fileName = selectedRequest.fileName;

    if (fileName === 'NO_FILE_INCLUDED') {
      console.log('NO SE ADJUNTO ARCHIVO');
      return;
    }

    const downloadUrl = `https://fotocopias-upb.herokuapp.com/api/v1/files/${fileName}`;

    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get(downloadUrl, {
        responseType: 'blob',
        headers,
      })
      .then((response) => {
        if (response.status === 200) {
          const contentDisposition = response.headers['content-disposition'];
          const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const match = regex.exec(contentDisposition);
          const downloadedFileName = match && match[1] ? match[1].replace(/['"]/g, '') : fileName;

          const downloadLink = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = downloadLink;
          link.download = downloadedFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          throw new Error('Error en la descarga del archivo');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleRingSizeChange = (event) => {
    setRingSize(event.target.value);
    const token = localStorage.getItem('token');

    axios
      .patch(
        `https://fotocopias-upb.herokuapp.com/api/v1/requests/ringed/${selectedRequest.id}`,
        { ringSize: event.target.value },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log('Datos:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        <strong>NOMBRE: </strong>
        {selectedRequest && selectedRequest.user}
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        <strong>FACULTAD: </strong>
        {selectedRequest && selectedRequest.faculty}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Numero de Copias: </strong>
        {selectedRequest && selectedRequest.numberOfCopies}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Numero de Paginas: </strong>
        {selectedRequest && selectedRequest.numberOfPages}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Fecha de entrega: </strong>
        {selectedRequest && selectedRequest.pickUpDate}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Hora de Entrega: </strong>
        {selectedRequest && selectedRequest.pickUpTime}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Caracteristicas: </strong>
        <br />
        {selectedRequest.isColoured ? 'A color' : 'Blanco y negro'}
        <br />
        {selectedRequest.isFrontAndBack ? 'Anverso y Reverso' : 'Una sola cara'}
        <br />
        {selectedRequest.isRinged && !selectedRequest.requestIsCompleted && (
          <>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Seleccionar tamaño del anillado: </strong>
            </Typography>
            <Select value={ringSize} onChange={handleRingSizeChange} fullWidth
            >
              <MenuItem value={7}>7 mm</MenuItem>
              <MenuItem value={9}>9 mm</MenuItem>
              <MenuItem value={12}>12 mm</MenuItem>
              <MenuItem value={14}>14 mm</MenuItem>
              <MenuItem value={17}>17 mm</MenuItem>
              <MenuItem value={20}>20 mm</MenuItem>
              <MenuItem value={23}>23 mm</MenuItem>
              <MenuItem value={25}>25 mm</MenuItem>
              <MenuItem value={29}>29 mm</MenuItem>
              <MenuItem value={33}>33 mm</MenuItem>
              <MenuItem value={40}>40 mm</MenuItem>
              <MenuItem value={45}>45 mm</MenuItem>
            </Select>
          </>
        )}
      </Typography>
      {!selectedRequest.requestIsCompleted && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Documento: </strong>
          {selectedRequest.fileName === 'NO_FILE_INCLUDED' ? (
            <Typography variant="body2">NO SE ADJUNTO ARCHIVO</Typography>
          ) : (
            <Link href="#" variant="body2" sx={{ display: 'block', mt: 2 }} onClick={handleDownloadFile}>
              Descargar archivo
            </Link>
          )}
        </Typography>
      )}
      {selectedRequest.specifications && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Especificaciones: </strong>
          {selectedRequest.specifications}
        </Typography>
      )}
      {!selectedRequest.requestIsCompleted && (
        <Button variant="outlined" color="primary" onClick={handleMarkAsCompleted} sx={{ margin: 1 }}>
          Realizado
        </Button>
      )}
      {!selectedRequest.requestIsCompleted && (
        <Button variant="outlined" color="error" onClick={handleDeleteRequest} sx={{ margin: 1 }}>
          Eliminar
        </Button>
      )}
      {selectedRequest.requestIsCompleted && selectedRequest.isRinged && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Tamaño del anillo: </strong>
          {selectedRequest.ringSize} mm
        </Typography>
      )}
    </Box>
  );
}

export default UserPopoverContent;
