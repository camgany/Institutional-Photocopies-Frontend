import React from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import axios from 'axios';

function UserPopoverContent({ selectedRequest, handleStatusChange }) {
  const handleMarkAsCompleted = () => {
    // Obtener el token del usuario del local storage
    const token = localStorage.getItem('token');

    // Realizar la solicitud al backend para marcar como completado
    axios.patch(
      `http://localhost:3000/api/v1/requests/${selectedRequest.id}`,
      { isCompleted: true },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Adjuntar el token en el encabezado de la solicitud
        },
      }
    )
      .then((response) => {
        // Realizar acciones adicionales si es necesario
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleDownloadFile = () => {
    const fileName = selectedRequest.fileName;
    const downloadUrl = `http://localhost:3000/api/v1/files/${fileName}`;
    console.log(downloadUrl);

    // Obtener el token del usuario del local storage
    const token = localStorage.getItem('token');

    // Crear un encabezado de autenticación con el token
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Descargar el archivo utilizando Axios
    axios.get(downloadUrl, {
      responseType: 'blob',
      headers,
    })
      .then((response) => {
        console.log("Archivo",response);
        if (response.status === 200) {
          // Obtener el nombre del archivo desde el encabezado Content-Disposition
          const contentDisposition = response.headers['content-disposition'];
          const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const match = regex.exec(contentDisposition);
          const downloadedFileName = match && match[1] ? match[1].replace(/['"]/g, '') : fileName;

          // Crear un enlace temporal para descargar el archivo
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

  return (
    console.log('selected request:',selectedRequest),
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
        {selectedRequest.isRinged ? 'Anillado' : ''}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Documento: </strong>
        <Link
          href="#"
          variant="body2"
          sx={{ display: 'block', mt: 2 }}
          onClick={handleDownloadFile}
        >
          Descargar archivo
        </Link>
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Especificaciones: </strong>
        {selectedRequest && selectedRequest.specifications}
      </Typography>
      <Button variant="outlined" color="primary" onClick={handleMarkAsCompleted}>
        Realizado
      </Button>
    </Box>
  );
}

export default UserPopoverContent;
