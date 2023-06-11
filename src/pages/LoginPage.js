import { Helmet } from 'react-helmet-async';
// @mui
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Container, Typography, Grid } from '@mui/material';
import axios from 'axios';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';

// sections
import { LoginForm } from '../sections/auth/login';
import logoupb from '../assets/buho.png';



const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> Login | Fotocopias </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Bienvenido a <br /> <b>UPB</b>
            </Typography>
            <img src={logoupb} alt="logo" width="100%" height="100%" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Iniciar Sesión
            </Typography>

            <LoginForm />
            <Grid container justifyContent="flex-end" p={2}>
              <Grid item>
                <Link to="/forgot-password" variant="body2">
                  Olvidaste tu contraseña? 
                </Link>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end" p={2}>  
            <Grid item>
                <Link to="/signup" variant="body2">
                  No tienes una cuenta? Registrate
                </Link>
              </Grid>
            </Grid>
          </StyledContent>
          
        </Container>
        
      </StyledRoot>
    </>
  );
}
