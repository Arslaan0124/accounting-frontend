import React from 'react';
import { Box, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useGetProfitLossQuery } from './reportsApi';
import MainCard from 'components/MainCard';

const ProfitAndLoss = () => {
    const { data, isLoading } = useGetProfitLossQuery();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <MainCard title="Profits">
                <Box>
                    <Box sx={{ mb: 2 }}>
                        <h3 style={{ color: 'red' }}>Total Costs: {data.total_cost}</h3>
                        <h3 style={{ color: 'green' }}>
                            Total Profits: <strong>{parseFloat(data.total_profit).toFixed(2)}</strong>
                        </h3>
                    </Box>
                    <hr />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Order Number</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Revenue</TableCell>
                                    <TableCell>Cost</TableCell>
                                    <TableCell>Profit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell>{invoice.id}</TableCell>
                                        <TableCell>{invoice.order_number}</TableCell>
                                        <TableCell>{invoice.date}</TableCell>
                                        <TableCell>{invoice.revenue}</TableCell>
                                        <TableCell>{invoice.cost}</TableCell>
                                        <TableCell>{parseFloat(invoice.profit).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </MainCard>
            <MainCard title="Losses" sx={{ marginTop: 5 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Coming soon...
                </Typography>
            </MainCard>
        </>
    );
};

export default ProfitAndLoss;
