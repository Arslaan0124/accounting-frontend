import React, { useCallback, useEffect, useState } from 'react';
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
import { useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from 'react-router';
import { ErrorToast } from '../../components/Toasts/Toasts';
import { useGetItemsQuery, useLazyGetItemsQuery } from './itemsApi';
// import { useNavigate } from 'react-router-dom';

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
        sortable: true
    },
    {
        id: 'rate',
        numeric: true,
        disablePadding: false,
        label: 'Rate',
        sortable: true
    },
    {
        id: 'stock_on_hand',
        numeric: true,
        disablePadding: false,
        label: 'Stock on Hand',
        sortable: true
    },
    {
        id: 'unit',
        numeric: false,
        disablePadding: false,
        label: 'Unit',
        sortable: true
    },
    {
        id: 'hsn_code',
        numeric: false,
        disablePadding: false,
        label: 'HSN Code',
        sortable: true
    },
    {
        id: 'cost_price',
        numeric: true,
        disablePadding: false,
        label: 'Cost Price',
        sortable: true
    },
    {
        id: 'selling_price',
        numeric: true,
        disablePadding: false,
        label: 'Selling Price',
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

const ItemsTable = () => {
    const theme = useTheme();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('rate');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const offset = page * 10;
    const { data, isLoading, isError } = useGetItemsQuery({ order, orderBy, offset });

    if (isError) {
        ErrorToast('Failed to fetch items');
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
        navigate(`/items/${id}`);
    };

    const ItemTable = () => {
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
                                rowCount={data?.results?.length}
                            />
                            <TableBody>
                                {data?.results && data?.results.length > 0
                                    ? data?.results.map((item) => (
                                          <TableRow
                                              hover
                                              key={item.id}
                                              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                              onClick={(event) => handleClick(event, item.id)}
                                          >
                                              <TableCell>{item.name}</TableCell>
                                              <TableCell>{item.rate}</TableCell>
                                              <TableCell>{item.stock_on_hand}</TableCell>
                                              <TableCell>{item.unit}</TableCell>
                                              <TableCell>{item.hsn_code}</TableCell>
                                              <TableCell>{item.cost_price}</TableCell>
                                              <TableCell>{item.selling_price}</TableCell>
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
        );
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return <ItemTable />;
};

export default ItemsTable;
