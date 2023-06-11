import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';

// sections
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
} from '../sections/@dashboard/app';

export default function DashboardAppPage() {
  const theme = useTheme();
  const [facultyStats, setFacultyStats] = useState([]);

  useEffect(() => {
    const fetchFacultyStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/v1/requests/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFacultyStats(data.data.stats);
      } catch (error) {
        console.error('Error fetching faculty stats:', error);
      }
    };

    fetchFacultyStats();
  }, []);

  return (
    <>
      <Helmet>
        <title> Inicio | Fotocopias </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bienvenida de nuevo, Beatriz!
        </Typography>

        <Grid container spacing={3}>
          {facultyStats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat._id}>
              <AppWidgetSummary
                title={`Pedidos ${stat._id}`}
                total={stat.totalRequests}
                icon={'ant-design:android-filled'}
              />
            </Grid>
          ))}

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Pedidos realizados"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Demanda de Carreras"
              chartData={[
                { label: 'Ing. Sistemas', value: 4344 },
                { label: 'Marketing', value: 5435 },
                { label: 'Derecho', value: 1443 },
                { label: 'Ing. Ambiental', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
