import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Container, Typography, Grid, Button } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import { LoginForm } from '../sections/auth/login';
import logoupb from '../assets/buho.png';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  height: '100vh', // Occupy full screen height
  overflow: 'hidden', // Hide scrollbars
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
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

const StyledLinksContainer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4), // Aumenta el espacio inferior para separarlo del botón
  display: 'flex',
  justifyContent: 'center', // Centra el contenido horizontalmente
}));

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> Iniciar Sesión | Fotocopias </title>
      </Helmet>

      <StyledRoot>
        {mdUp && (
          <StyledSection>
            <img src={logoupb} alt="logo" style={{ width: '100%', height: 'auto' }} />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Fotocopias UPB
            </Typography>

            <LoginForm />

            <StyledLinksContainer container>
              <Grid item>
                <Link to="/forgot-password" variant="body2">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Grid>
            </StyledLinksContainer>

            <Button
              component={Link}
              to="/signup"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }} // Añade espacio superior para separarlo del enlace
            >
              Regístrate
            </Button>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
