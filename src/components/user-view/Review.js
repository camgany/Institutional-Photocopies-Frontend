import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Review() {
  const [value, setValue] = React.useState(null);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Detalles de la entrega
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} marginTop={2}>
          <Typography variant="h15" gutterBottom>
            Fecha de entrega
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>

      </Grid>
    </>
  );
}