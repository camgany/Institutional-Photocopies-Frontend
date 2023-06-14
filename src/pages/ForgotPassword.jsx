import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { Alert } from '@mui/material';

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const email = event.target.email.value;

    setLoading(true);

    // Realizar la solicitud al backend para enviar el correo de restablecimiento de contraseña
    axios
      .post('https://fotocopias-upb.herokuapp.com/api/v1/users/forgotPassword', { email })
      .then((response) => {
        setLoading(false);
        setSuccess(true);
        setError(false);
      })
      .catch((error) => {
        setLoading(false);
        setSuccess(false);
        setError(true);
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
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Revisa tu correo electrónico para obtener el enlace de restablecimiento.
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Correo electrónico inválido. Inténtalo de nuevo.
          </Alert>
        )}
      </Grid>
    </Grid>
  );
}

export default ForgotPassword;
