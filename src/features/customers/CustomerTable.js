import React, { useCallback, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from 'react-router';
import { ErrorToast } from '../../components/Toasts/Toasts';
import { useGetCustomersQuery } from './customersApi';
import { Button, Typography } from '@mui/material';

// import { useNavigate } from 'react-router-dom';

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'DATE',
        sortable: true
    },
    {
        id: 'company_name',
        numeric: false,
        disablePadding: false,
        label: 'COMPANY NAME',
        sortable: true
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        label: 'TYPE',
        sortable: true
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'EMAIL',
        sortable: false
    },
    {
        id: 'created_at',
        numeric: false,
        disablePadding: false,
        label: 'JOINED AT',
        sortable: true
    }
];

const EnhancedTableHead = (props) => {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (newOrderBy) => (event) => {
        onRequestSort(event, newOrderBy);
    };
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <>
                        {headCell.sortable ? (
                            <TableCell
                                key={headCell.id}
                                padding={headCell.disablePadding ? 'none' : 'normal'}
                                sortDirection={orderBy === headCell.id ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        ) : (
                            <TableCell key={headCell.id} padding={headCell.disablePadding ? 'none' : 'normal'}>
                                {headCell.label}
                            </TableCell>
                        )}
                    </>
                ))}
            </TableRow>
        </TableHead>
    );
};

const CustomerTable = () => {
    const theme = useTheme();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('created_at');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const offset = page * 10;
    const { data, isLoading, isError } = useGetCustomersQuery({ orderBy, order, offset });

    if (isError) {
        ErrorToast('Failed to fetch customers');
    }

    const handleRequestSort = (event, newOrderBy) => {
        const isAsc = orderBy === newOrderBy && order === 'asc';
        const toggledOrder = isAsc ? 'desc' : 'asc';
        setOrder(toggledOrder);
        setOrderBy(newOrderBy);
    };
    const handleChangePage = useCallback(
        (event, newPage) => {
            setPage(newPage);
        },
        [order, orderBy, rowsPerPage]
    );

    const handleChangeRowsPerPage = useCallback(
        (event) => {
            const updatedRowsPerPage = parseInt(event.target.value, 10);
            setRowsPerPage(updatedRowsPerPage);
            setPage(0);
        },
        [order, orderBy]
    );

    const handleClick = (event, id) => {
        event.preventDefault();
        navigate(`/customers/${id}`);
    };

    const InvoicesTable = () => {
        return (
            <>
                {data?.results.length > 0 ? (
                    <Box sx={{ width: '100%', boxShadow: 0 }}>
                        <Paper sx={{ width: '100%', mb: 2, boxShadow: 0 }}>
                            <TableContainer
                                component={Paper}
                                sx={{
                                    boxShadow: 0,
                                    border: `1px solid ${theme.palette.divider}`
                                }}
                            >
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <EnhancedTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                        rowCount={data?.results.length}
                                    />
                                    <TableBody>
                                        {data?.results && data?.results.length > 0
                                            ? data?.results.map((invoice) => (
                                                  <TableRow
                                                      hover
                                                      key={invoice.id}
                                                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                                      onClick={(event) => handleClick(event, invoice.id)}
                                                  >
                                                      <TableCell>{invoice.name}</TableCell>
                                                      <TableCell>{invoice.company_name}</TableCell>
                                                      <TableCell>{invoice.type}</TableCell>
                                                      <TableCell>{invoice.email}</TableCell>
                                                      <TableCell>{moment(invoice.created_at).fromNow()}</TableCell>
                                                  </TableRow>
                                              ))
                                            : null}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10]}
                                component="div"
                                count={data?.count}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h2" sx={{ fontSize: '1rem', fontWeight: 700, color: '#000', margin: 0, marginBottom: 2 }}>
                            Nothing to see yet
                        </Typography>
                        <Typography variant="body1">Your customers will show here when you add them</Typography>
                    </Box>
                )}
            </>
        );
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return <InvoicesTable />;
};

export default CustomerTable;
