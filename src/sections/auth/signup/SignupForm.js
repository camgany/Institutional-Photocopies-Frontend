import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid, IconButton, InputAdornment, MenuItem, Popover, Select, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';



export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    try {
      console.log(name, upbcode, email, faculty, password, confirmpassword);
      const response = await axios.post('http://localhost:3000/api/v1/users/signup', {
        name,
        upbCode: upbcode,
        email,
        faculty,
        password,
        confirmPassword: confirmpassword,
        
      });
       
    } catch (error) {
      setRepeatError(true);
      console.error(error);
    }
  };

  const [name, setName] = useState('');
  const [upbcode, setUpbcode] = useState('');
  const [email, setEmail] = useState('');
  const [faculty, setFaculty] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [repeatError, setRepeatError] = useState(false);

  return (
    <>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} textAlign="center">
          <TextField name="name" label="Nombre" type='text' onChange={(e) => setName(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6} textAlign="center">
          <TextField name="upbcode" label="Codigo UPB" type='number' onChange={(e) => setUpbcode(e.target.value)} />
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
      <Stack direction="row" justifyContent="center" alignItems="center" sx={repeatError?{ visibility: 'visible' }:{ visibility: 'hidden' }}>
        <span>Codigo repetido</span>
      </Stack>
    </>
  );
}
