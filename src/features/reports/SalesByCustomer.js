import { Typography, Grid, Paper, CircularProgress, Box, IconButton, Tooltip, Divider } from '@mui/material';
import { useGetSalesByCustomerQuery } from './reportsApi';
import MainCard from 'components/MainCard';

const SalesByCustomer = () => {
    const { data: customerData, isLoading } = useGetSalesByCustomerQuery();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }
    const customerTotals = customerData?.customer_totals;

    return (
        <MainCard title="Sales by customers">
            <Box sx={{ maxHeight: 700, overflow: 'auto' }}>
                {customerTotals?.map((customer) => (
                    <Box key={customer.id}>
                        <Typography variant="h5" sx={{ mt: 2 }}>
                            {customer.name}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Paid Invoices: {customer.paid_invoices} | Unpaid Invoices: {customer.unpaid_invoices}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            {customer.invoices.map((invoice) => (
                                <Box key={invoice.id}>
                                    <Typography variant="body1">
                                        Order Number: {invoice.order_number} | Date: {invoice.date} | Total Sale: {invoice.total_sale}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                        <Box display="flex" justifyContent="end" sx={{ mr: 2 }}>
                            <h3 sx={{ mt: 2 }}>
                                Total Sale:<strong style={{ color: 'green' }}>{customer.total_sale}</strong>
                            </h3>
                        </Box>
                        <Divider />
                    </Box>
                ))}
            </Box>
        </MainCard>
    );
};

export default SalesByCustomer;
