import React, { useCallback, useState } from 'react';
import { useGetInvoicesQuery } from 'features/invoices/invoicesApi';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import TableSortLabel from '@mui/material/TableSortLabel';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from 'react-router';
import { ErrorToast } from '../../components/Toasts/Toasts';
import { Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

const headCells = [
    {
        id: 'date',
        numeric: false,
        disablePadding: true,
        label: 'DATE',
        sortable: true
    },
    {
        id: 'id',
        numeric: false,
        disablePadding: false,
        label: 'INVOICE NUMBER',
        sortable: true
    },
    {
        id: 'order_number',
        numeric: false,
        disablePadding: false,
        label: 'ORDER NUMBER',
        sortable: true
    },
    {
        id: 'payment_status',
        numeric: false,
        disablePadding: false,
        label: 'PAYMENT STATUS',
        sortable: true
    },
    {
        id: 'customer_name',
        numeric: false,
        disablePadding: false,
        label: 'CUSTOMER NAME',
        sortable: false
    },
    {
        id: 'due_date',
        numeric: false,
        disablePadding: false,
        label: 'DUE DATE',
        sortable: true
    },
    {
        id: 'created_at',
        numeric: false,
        disablePadding: false,
        label: 'CREATED AT',
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

const InvoiceTable = () => {
    const theme = useTheme();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('created_at');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState(null);
    const navigate = useNavigate();
    const offset = page * 10;
    const { data, isLoading, isError } = useGetInvoicesQuery({ orderBy, order, offset, filters });

    if (isError) {
        ErrorToast('Failed to fetch invoices');
    }

    const filterOptions = [
        { title: 'Active', value: 'active' },
        { title: 'Draft', value: 'draft' },
        { title: 'Complete', value: 'complete' },
        { title: 'Paid', value: 'paid' },
        { title: 'Unpaid', value: 'unpaid' }
    ];

    const handleFilterChange = (event, selectedOptions) => {
        const selectedValues = selectedOptions.map((option) => option.value);
        var q = '';
        if (selectedValues.includes('paid')) {
            q = q + 'payment_status=paid&';
        }
        if (selectedValues.includes('unpaid')) {
            q = q + 'payment_status=unpaid&';
        }
        if (selectedValues.includes('active')) {
            q = q + 'status=active&';
        }
        if (selectedValues.includes('draft')) {
            q = q + 'status=draft&';
        }
        if (selectedValues.includes('complete')) {
            q = q + 'status=complete&';
        }
        setFilters(q);
    };

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
        navigate(`/invoices/${id}`);
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
                                                      <TableCell>{invoice.date}</TableCell>
                                                      <TableCell>{invoice.id}</TableCell>
                                                      <TableCell>{invoice.order_number}</TableCell>
                                                      <TableCell>{invoice.payment_status}</TableCell>
                                                      <TableCell>{invoice.customer?.name}</TableCell>
                                                      <TableCell>{invoice.due_date}</TableCell>
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
                        <Typography variant="body1">Your invoices will show here when you add them</Typography>
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

    return (
        <>
            {data?.results?.length > 0 && (
                <Grid container display="flex" justifyContent="end" sx={{ marginBottom: 2, marginTop: 2 }}>
                    <Grid item xs={12} sm={6} lg={4}>
                        <Autocomplete
                            multiple
                            id="tags-outlined"
                            options={filterOptions}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            getOptionLabel={(option) => option.title}
                            filterSelectedOptions
                            onChange={handleFilterChange}
                            renderInput={(params) => <TextField {...params} label="Filter invoices" placeholder="Favorites" />}
                        />
                    </Grid>
                </Grid>
            )}
            <InvoicesTable />
        </>
    );
};

export default InvoiceTable;
