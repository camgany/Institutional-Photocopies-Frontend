import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const OrderSuccess = () => {
  const handleNewOrder = () => {
    // Redirigir a la página /user
    window.location.href = '/user';
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          ¡Pedido realizado con éxito!
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Gracias por realizar tu pedido. Procesaremos tu solicitud y te informaremos sobre la disponibilidad y la fecha de recogida.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleNewOrder} sx={{ mt: 3 }}>
          Realizar otro pedido
        </Button>
        <Typography variant="body2" sx={{ mt: 3, fontWeight: 'bold' }}>
          ¿Deseas cerrar sesión?
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 3 }}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default OrderSuccess;
