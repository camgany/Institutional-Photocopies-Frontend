import { useState } from 'react';
import axios from 'axios';
import { Grid, IconButton, InputAdornment, MenuItem, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [repeatError, setRepeatError] = useState(false);
  const [upbCodeError, setUpbCodeError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [backendError, setBackendError] = useState('');

  const handleClick = async () => {
    try {
      if (upbcode.length !== 5) {
        setUpbCodeError(true);
        return;
      }

      if (password !== confirmpassword) {
        setPasswordError(true);
        return;
      }
      await axios.post('https://fotocopias-upb.herokuapp.com/api/v1/users/signup', {
        name,
        upbCode: upbcode,
        email,
        faculty,
        password,
        confirmPassword: confirmpassword,
      });

      // Navigate to the login screen after successful signup
      window.location.href = '/';
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setBackendError('El correo electrónico o el código UPB ya están registrados, por favor intente con otros datos');
      } else {
        setRepeatError(true);
        console.error(error);
      }
    }
  };

  const handleUpbCodeChange = (e) => {
    const value = e.target.value;
    if (value.length === 5) {
      setUpbCodeError(false);
    }
    setUpbcode(value);
  };

  const handleAlertClose = () => {
    setUpbCodeError(false);
  };

  const handleCloseErrorPopup = () => {
    setUpbCodeError(false);
    setPasswordError(false);
    setBackendError('');
  };

  const [name, setName] = useState('');
  const [upbcode, setUpbcode] = useState('');
  const [email, setEmail] = useState('');
  const [faculty, setFaculty] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');

  return (
    <>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} textAlign="center">
          <TextField name="name" label="Nombre" type='text' onChange={(e) => setName(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6} textAlign="center">
          <TextField
            name="upbcode"
            label="Codigo UPB"
            type="number"
            onChange={handleUpbCodeChange}
            error={upbCodeError}
            helperText={upbCodeError && 'Ingrese un código UPB válido'}
          />
        </Grid>
        <Grid item xs={12} sm={6} textAlign="center">
          <TextField name="email" label="Correo electrónico" type='email' onChange={(e) => setEmail(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6} textAlign="center">
          <TextField
            name="faculty"
            label="Facultad"
            select
            sx={{ width: '100%' }} // Ajusta el ancho al 100%
            onChange={(e) => setFaculty(e.target.value)}
          >
            <MenuItem value={'FACED'}>FIA</MenuItem>
            <MenuItem value={'FIA'}>FACED</MenuItem>
            <MenuItem value={'DAAE'}>DAAE</MenuItem>
            <MenuItem value={'ADM'}>ADM</MenuItem>
            <MenuItem value={'VRA'}>VRA</MenuItem>
            <MenuItem value={'MKT'}>MKT</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} textAlign="center">
          <TextField
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} textAlign="center">
          <TextField
            name="confirmpassword"
            label="Confirmar contraseña"
            onChange={(e) => setConfirmpassword(e.target.value)}
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
          />
        </Grid>
      </Grid>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} sx={{ mt: 3 }}>
        Registrarse
      </LoadingButton>
      <Stack direction="row" justifyContent="center" alignItems="center" sx={repeatError ? { visibility: 'visible' } : { visibility: 'hidden' }}>
        <span>Codigo repetido</span>
      </Stack>

      {/* Error Popup */}
      <Dialog open={upbCodeError || passwordError || backendError !== ''} onClose={handleCloseErrorPopup}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          {upbCodeError && <p>El código UPB debe tener exactamente 5 dígitos.</p>}
          {passwordError && <p>Las contraseñas no coinciden.</p>}
          {backendError && <p>{backendError}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorPopup}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}