import React, { useCallback, useEffect, useState } from 'react';
import { useLazyGetInvoicesQuery } from 'features/invoices/invoicesApi';
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
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('date');
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [paddingHeight, setPaddingHeight] = useState(0);
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState(null);
    const [fetchInvoices, { isLoading }] = useLazyGetInvoicesQuery();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetchInvoices({ orderBy, order }).unwrap();
                setInvoices(response.results);
            } catch (err) {
                ErrorToast("Couldn't fetch invoices");
            }
        }
        fetchData();
    }, [order, orderBy]);

    console.log(invoices);

    const handleRequestSort = (event, newOrderBy) => {
        const isAsc = orderBy === newOrderBy && order === 'asc';
        const toggledOrder = isAsc ? 'desc' : 'asc';
        setOrder(toggledOrder);
        setOrderBy(newOrderBy);
    };
    const handleChangePage = useCallback(
        (event, newPage) => {
            setPage(newPage);
            // Avoid a layout jump when reaching the last page with empty rows.
            const numEmptyRows = newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - invoices.length) : 0;
            const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
            setPaddingHeight(newPaddingHeight);
        },
        [order, orderBy, dense, rowsPerPage]
    );

    const handleChangeRowsPerPage = useCallback(
        (event) => {
            const updatedRowsPerPage = parseInt(event.target.value, 10);
            setRowsPerPage(updatedRowsPerPage);
            setPage(0);
            setPaddingHeight(0);
        },
        [order, orderBy]
    );

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const handleClick = () => {};

    const InvoicesTable = () => {
        return (
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
                                rowCount={invoices?.length}
                            />
                            <TableBody>
                                {invoices && invoices.length > 0
                                    ? invoices.map((invoice) => (
                                          <TableRow
                                              hover
                                              key={invoice.id}
                                              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                              onClick={(event) => handleClick(event, invoice)}
                                          >
                                              <TableCell>{invoice.date}</TableCell>
                                              <TableCell>{invoice.id}</TableCell>
                                              <TableCell>{invoice.order_number}</TableCell>
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
                        count={invoices?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
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

export default InvoiceTable;
