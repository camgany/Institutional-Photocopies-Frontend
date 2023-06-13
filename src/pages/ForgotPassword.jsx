import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

function ForgotPassword() {
  const handleSubmit = (event) => {
    event.preventDefault();

    const email = event.target.email.value;

    // Realizar la solicitud al backend para enviar el correo de restablecimiento de contraseña
    axios
      .post('https://fotocopias-upb.herokuapp.com/api/v1/users/forgotPassword', { email })
      .then((response) => {
        // Realizar acciones adicionales si es necesario
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 3 }}>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="h6" gutterBottom>
          Olvidaste tu contraseña
        </Typography>
        <Typography variant="body2" gutterBottom>
          Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            type="email"
            label="Correo electrónico"
            autoComplete="email"
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Enviar enlace de restablecimiento
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}

export default ForgotPassword;
