import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';


export default function Order() {
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileSelected, setFileSelected] = useState(false);
  const [numberOfCopies, setNumberOfCopies] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [pickUpDate, setPickUpDate] = useState('');
  const [pickUpTime, setPickUpTime] = useState('');
  const [isColoured, setIsColoured] = useState(false);
  const [isRinged, setIsRinged] = useState(false);
  const [isFrontAndBack, setIsFrontAndBack] = useState(false);
  const [especificaciones, setEspecificaciones] = useState('');
  const [file, setFile] = useState(null);
  const theme = createTheme();
  const [loading, setLoading] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate >= currentDate) {
      setPickUpDate(selectedDate);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ['application/pdf']; // Array of allowed MIME types
    if (file && allowedTypes.includes(file.type)) {
      const date = new Date();
      setFile(file);
      setFileName(`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}--${file.name}`);
      setFileSelected(true);
      setFileSize(file.size);
      setErrorPopupOpen(false); // Clear any previous error popups
    } else {
      // Show error popup
      setErrorPopupOpen(true);
    }
  };

  const handleFormSubmit = () => {
    // Check if required fields are filled
    if (!pickUpDate || !pickUpTime || numberOfCopies === 0 || numberOfPages === 0) {
      setErrorPopupOpen(true);
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const name = user.name;
    const faculty = user.faculty;
    const individualDate = pickUpDate.split('-');
    const newPickUpDate = `${individualDate[2]}-${individualDate[1]}-${individualDate[0]}`;
  
    let fileNameToSend = fileName;
    let fileSizeToSend = fileSize;
  
    if (file === null) {
      fileNameToSend = 'NO_FILE_INCLUDED';
      fileSizeToSend = 0;
    }
  
    const data = {
      user: name,
      faculty,
      fileName: fileNameToSend,
      fileSize: fileSizeToSend,
      numberOfCopies,
      numberOfPages,
      pickUpDate: newPickUpDate,
      pickUpTime,
      isColoured,
      isFrontAndBack,
      isRinged,
      specifications: especificaciones,
    };

    axios.post('https://fotocopias-upb.herokuapp.com/api/v1/requests', data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setLoading(false);
      window.location.href = '/success';
    })
    .catch((error) => {
      console.error('Error:', error);
      setLoading(false);
      setErrorPopupOpen(true);
    });

    if (file !== null) {
      const formData = new FormData();
      formData.append('file', file);
  
      axios.post('https://fotocopias-upb.herokuapp.com/api/v1/files', formData, {
        headers: {
          'Content-Type': file.mimetype,
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {

      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center" sx={{ mb: 3 }}>
            Formulario
          </Typography>
          <Typography variant="h6" gutterBottom>
            Detalles de las fotocopias
          </Typography>
          <Grid item xs={12} md={5}>
            <Button variant="contained" component="label" fullWidth>
              {fileSelected ? 'Cambiar archivo' : 'Subir archivo'}
              <input type="file" hidden onChange={handleFileSelect} />
            </Button>
          </Grid>
          <Grid item xs={12} md={7}>
            {fileName && (
              <>
                <Typography fullWidth variant="standard" gutterBottom>
                  Archivo: {fileName}
                </Typography>
                {fileSelected && (
                  <Button variant="text" color="error" onClick={() => { setFileName(''); setFileSelected(false) }}>
                    Quitar archivo
                  </Button>
                )}
              </>
            )}
          </Grid>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                id="numberOfCopies"
                name="numberOfCopies"
                label="Cantidad de copias"
                fullWidth
                variant="standard"
                type="number"
                onChange={(e) => setNumberOfCopies(e.target.value)}
                helperText="Ingrese la cantidad de copias que desea realizar"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                id="numberOfPages"
                name="numberOfPages"
                label="Número de páginas"
                fullWidth
                autoComplete="cc-name"
                variant="standard"
                type="number"
                onChange={(e) => setNumberOfPages(e.target.value)}
                helperText="Ingrese el número de páginas que se van a fotocopiar"
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                required
                id="pickUpDate"
                name="pickUpDate"
                label="Fecha de entrega"
                fullWidth
                autoComplete="cc-name"
                variant="standard"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={pickUpDate}
                defaultValue={currentDate}
                onChange={handleDateChange}
                helperText="Ingrese la fecha en la que desea recoger las fotocopias"
                inputProps={{
                  min: currentDate,
                }}
                error={pickUpDate === ''}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                required
                id="pickUpTime"
                name="pickUpTime"
                label="Hora de entrega"
                fullWidth
                autoComplete="cc-name"
                variant="standard"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setPickUpTime(e.target.value)}
                helperText="Ingrese la hora en la que desea recoger las fotocopias"
                error={pickUpTime === ''}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <p>Seleccione las opciones de impresión</p>
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    required
                    id="isColoured"
                    name="isColoured"
                    checked={isColoured || false}
                    onChange={(e) => setIsColoured(e.target.checked)}
                  />
                }
                label="A color"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    required
                    id="isRinged"
                    name="isRinged"
                    checked={isRinged || false}
                    onChange={(e) => setIsRinged(e.target.checked)}
                  />
                }
                label="Anillado"
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    required
                    id="isFrontAndBack"
                    name="isFrontAndBack"
                    checked={isFrontAndBack || false}
                    onChange={(e) => setIsFrontAndBack(e.target.checked)}
                  />
                }
                label="Anverso/Reverso"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="especificaciones"
                name="especificaciones"
                label="Especificaciones"
                fullWidth
                multiline
                rows={2}
                variant="standard"
                onChange={(e) => setEspecificaciones(e.target.value)}
                helperText="Ingrese las especificaciones que desea para sus fotocopias, como por ejemplo: tamaño de hoja, tipo de papel, etc."
              />
            </Grid>
            {errorPopupOpen && (
              <Typography color="error" sx={{ mt: 2 }}>
                Por favor, complete los campos obligatorios.
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleFormSubmit}
              sx={{
                mt: 3,
                margin: '20px auto',
                display: 'block',
                width: '100%',
                maxWidth: 300,
              }}
            >
              Enviar
            </Button>
          </Grid>
        </Paper>
      </Container>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog open={errorPopupOpen} onClose={() => setErrorPopupOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, complete los campos obligatorios antes de enviar el formulario.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorPopupOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
