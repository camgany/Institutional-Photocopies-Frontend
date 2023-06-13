import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Importar axios
// @mui
import {
  Button,
  Card,
  Table,
  Stack,
  Popover,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Grid,
} from '@mui/material';

// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock
import UserPopoverContent from '../components/file-information/UserPopoverContent';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user', label: 'Nombre', alignRight: false },
  { id: 'faculty', label: 'Facultad', alignRight: false },
  { id: 'pickUpDate', label: 'Fecha de entrega', alignRight: false },
  { id: 'pickUpTime', label: 'Hora de entrega', alignRight: false },

  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OrdersPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [request, setRequest] = useState([]);
  const [showCompletedRequests, setShowCompletedRequests] = useState(false); // Nuevo estado para mostrar pedidos completados o no completados

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://fotocopias-upb.herokuapp.com/api/v1/requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setRequest(data.data.requests); // Actualizar la variable de estado users aquí
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleOpenMenu = (event, user) => {
    setOpen(event.currentTarget);
    setSelectedRequest(user);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = request.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://fotocopias-upb.herokuapp.com/api/v1/files/reports', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'report.csv'; // Nombre de archivo predeterminado

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(?<filename>[^;]+)/);
        if (filenameMatch && filenameMatch.groups && filenameMatch.groups.filename) {
          filename = filenameMatch.groups.filename;
        }
      }

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } catch (error) {
      console.error('Error al descargar el informe:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleShowCompletedRequests = (event) => {
    setShowCompletedRequests(event.target.checked);

  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - request.length) : 0;

  const filteredRequests = request.filter((req) => {
    if (showCompletedRequests) {
      return req.requestIsCompleted === true;
    }
    return req.requestIsCompleted === false;

  });

  const filteredUsers = applySortFilter(filteredRequests, getComparator(order, orderBy), filterName);

  const handleStatusChange = () => {
    handleCloseMenu();
  };

  return (
    <>
      <Helmet>
        <title>Pedidos | Fotocopias</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Pedidos
          </Typography>
          <Button variant="contained" onClick={handleDownloadReport}>
            Descargar reporte
          </Button>
          
        </Stack>
        <Grid container justifyContent="flex-end" alignItems="center" sx={{ mt: 2}}>
        <Grid item>
          <Checkbox
            checked={showCompletedRequests}
            onChange={handleShowCompletedRequests}
            color="primary"
          />
        </Grid>
        <Grid item>
          <Typography variant="body2">Mostrar pedidos completados</Typography>
        </Grid>
      </Grid>
        <Card>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={request.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}

                />
                <TableBody >
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, user, faculty, pickUpDate, pickUpTime } = row;
                    const selectedRequest = selected.indexOf(user) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedRequest}>


                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={4} sx={{ marginLeft: 1 }}>
                            <Typography variant="subtitle2" noWrap >
                              {user}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{faculty}</TableCell>

                        <TableCell align="left">{pickUpDate}</TableCell>
                        <TableCell align="left">{pickUpTime}</TableCell>

                        <TableCell align="right">
                          <IconButton onClick={(event) => handleOpenMenu(event, row)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            maxWidth: '100%',
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
          style: {
            width: '90%',
            height: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: '5%',
            left: '5%',
            right: '5%',
            margin: 'auto',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
          },
        }}
      >
        <UserPopoverContent selectedRequest={selectedRequest} handleStatusChange={handleStatusChange} />
      </Popover>
    </>
  );
}
