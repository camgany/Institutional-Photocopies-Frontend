import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Icon, colors } from '@mui/material';

// sections
import {
  YearPlannerBar,
  YearPlannerBarIncomplete,
  FacultyStats,
} from '../sections/@dashboard/app';

export default function DashboardAppPage() {
  const theme = useTheme();
  const [facultyStats, setFacultyStats] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [completedRequests, setCompletedRequests] = useState([]);
  const [incompletedRequests, setIncompletedRequests] = useState([]);
  const currentYear = new Date().getFullYear();

  const getIconByFaculty = (faculty) => {
    if (faculty === 'FIA') {
      return 'carbon:finance'; // Reemplaza 'ingenieria-icono' con el nombre del icono para FIA
    } if (faculty === 'FACED') {
      return 'material-symbols:engineering'; // Reemplaza 'finanzas-icono' con el nombre del icono para FACED
    } if (faculty === 'DAAE') {
      return 'wpf:administrator'; // Reemplaza 'admin-icono' con el nombre del icono para DAAE
    }
    return 'ant-design:android-filled'; // Reemplaza 'ant-design:android-filled' con el nombre del icono para las demás facultades
  };

  const getIconColorByFaculty = (faculty) => {
    if (faculty === 'FIA') {
      return theme.palette.primary.main; // Reemplaza 'primary' con el color para FIA
    } if (faculty === 'FACED') {
      return theme.palette.info.main; // Reemplaza 'info' con el color para FACED
    } if (faculty === 'DAAE') {
      return theme.palette.warning.main; // Reemplaza 'warning' con el color para DAAE
    }
    return theme.palette.secondary.main; // Reemplaza 'secondary' con el color para las demás facultades
  };

  const handleChangeYear = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    const fetchFacultyStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `https://fotocopias-upb.herokuapp.com/api/v1/requests/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setFacultyStats(data.data.stats);
      } catch (error) {
        console.error('Error fetching faculty stats:', error);
      }
    };

    const fetchCompletedRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `https://fotocopias-upb.herokuapp.com/api/v1/requests/completed/year/${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setCompletedRequests(data.data.plan);
      } catch (error) {
        console.error('Error fetching completed requests:', error);
      }
    };

    const fetchInCompletedRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `https://fotocopias-upb.herokuapp.com/api/v1/requests/plan/year/${selectedYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setIncompletedRequests(data.data.plan);
      } catch (error) {
        console.error('Error fetching planned requests:', error);
      }
    };

    fetchFacultyStats();
    fetchCompletedRequests();
    fetchInCompletedRequests();
  }, [selectedYear]);

  const chartLabels = completedRequests.map((request) => {
    const month = parseInt(request._id.pointInTime, 10);
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${formattedMonth}/01/${selectedYear}`;
  });

  const chartData = [
    {
      name: 'Pedidos',
      type: 'column',
      fill: 'solid',
      data: completedRequests.map((request) => request.totalRequests),
    },
  ];

  const chartLabelsIncompleted = incompletedRequests.map((request2) => {
    const month = parseInt(request2._id.pointInTime, 10);
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${formattedMonth}/01/${selectedYear}`;
  });

  const chartDataIncompleted = [
    {
      name: 'Incompletos',
      type: 'column',
      fill: 'solid',
      data: incompletedRequests.map((request2) => request2.totalRequests),
    },
  ];

  return (
    <>
      <Helmet>
        <title> Inicio | Fotocopias </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bienvenido a Fotocopias UPB
        </Typography>

        <Grid container spacing={3} sx={{ alignItems: 'center', justifyContent: 'center' }} xs={12}>
          {facultyStats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat._id}  >
              <FacultyStats
                title={`Pedidos ${stat._id}`}
                total={stat.totalRequests}
                icon={getIconByFaculty(stat._id)}
                iconColor={getIconColorByFaculty(stat._id)}
              />
            </Grid>
          ))}

          <Grid item xs={12} md={12} lg={12}>
            <YearPlannerBar
              title={`Pedidos realizados en el año ${currentYear}`}
              chartLabels={chartLabels}
              chartData={chartData}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <YearPlannerBarIncomplete
              title={`Pedidos no realizados en el año ${currentYear}`}
              chartLabels={chartLabelsIncompleted}
              chartData={chartDataIncompleted}
            />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}