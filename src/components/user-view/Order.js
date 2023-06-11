import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import { useState } from 'react';

export default function Order() {

  const [showAlert, setShowAlert] = useState(false);
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

 

  const handleFormSubmit = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const name = user.name;
    const faculty = user.faculty;
    const individualDate = pickUpDate.split('-');
    const newPickUpDate = `${individualDate[2]}-${individualDate[1]}-${individualDate[0]}`;
    const data = {
      user: name,
      faculty,
      fileName,
      fileSize,
      numberOfCopies,
      numberOfPages,
      pickUpDate: newPickUpDate,
      pickUpTime,
      isColoured,
      isFrontAndBack,
      isRinged,
      specifications: especificaciones,
    };
    console.log(data);
    const formData = new FormData();
    formData.append('file', file);


    axios.post('http://localhost:3000/api/v1/files', formData, {
      headers: {
        'Content-Type': file.mimetype,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    axios.post('http://localhost:3000/api/v1/requests', data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
   };
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const date = new Date();
    setFile(file);
    setFileName(`${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}--${file.name}`);
    setFileSelected(true);
    setFileSize(file.size);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Detalles de las fotocopias
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="numberOfCopies"
            name="numberOfCopies"
            label="Cantidad de fotocopias"
            fullWidth
            variant="standard"
            type='number'
            onChange={e => setNumberOfCopies(e.target.value)}
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
            type='number'
            onChange={e => setNumberOfPages(e.target.value)}
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
            onChange={e => setPickUpDate(e.target.value)}
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
            onChange={e => setPickUpTime(e.target.value)}
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
                onChange={e => setIsColoured(e.target.checked)}
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
                onChange={e => setIsRinged(e.target.checked)}
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
                name=" isFrontAndBack"
                checked={isFrontAndBack || false}
                onChange={e => setIsFrontAndBack(e.target.checked)}
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
            onChange={e => setEspecificaciones(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Button
            variant="contained"
            component="label"
            fullWidth
          >
            {fileSelected ? "Cambiar archivo" : "Subir archivo"}
            <input
              type="file"
              hidden
              onChange={handleFileSelect}
            />
          </Button>
        </Grid>
        <Grid item xs={12} md={7}>
          {fileName &&
            <>
              <Typography fullWidth variant="standard" gutterBottom>
                Archivo: {fileName}
              </Typography>
              {fileSelected &&
                <Button variant="text" color="error" onClick={() => { setFileName(''); setFileSelected(false) }}>
                  Quitar archivo
                </Button>
              }
            </>
          }
        </Grid>
        <Button
          variant="contained"
          onClick={handleFormSubmit}
          sx={{ mt: 3, ml: 1 }}
        >
          Enviar
        </Button>
      </Grid>
    </>
  );
}
