import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, Select } from '@mui/material';
// components
import { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, ...other }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedYear2, setSelectedYear2] = useState(new Date().getFullYear()); // Nuevo estado para el segundo gráfico

  const handleChangeYear = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleChangeYear2 = (event) => {
    setSelectedYear2(event.target.value);
  }; // Nueva función para cambiar el año del segundo gráfico

  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} visits`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <CardHeader title={title} subheader={subheader} />
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
          <Select native value={selectedYear} onChange={handleChangeYear} sx={{ mx: 1, minWidth: 120 }}>
            <option value={2021}>2021</option>
            <option value={2022}>2022</option>
            <option value={2023}>2023</option>
          </Select>
        </Box>
        <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}