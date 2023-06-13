import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import axios from 'axios';
import { Stack, IconButton, InputAdornment, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error] = useState('');
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    try {
      const response = await axios.post('https://fotocopias-upb.herokuapp.com/api/v1/users/login', {
        email,
        password,
      });
      if (response.data.status === 'success') {
        const { token, data } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));

        navigate('/dashboard/app', { replace: true });
      } else {
        setOpen(true);
      }
    } catch (error) {
      setOpen(true);
      console.error(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Correo Electrónico"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Stack>

      {error && (
        <Typography variant="body2" color="error" align="center">
          {error}
        </Typography>
      )}

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} sx={{ mt: 3 }} loadingIndicator="Cargando...">
        Iniciar sesión
      </LoadingButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="error" align="center">
            Correo o contraseña inválidos. Por favor, inténtelo nuevamente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
