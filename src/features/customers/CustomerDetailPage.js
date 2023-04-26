import React from 'react';
import { Typography, Grid, Divider, Link, Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDeleteCustomerMutation, useGetCustomerQuery } from './customersApi';
import MainCard from 'components/MainCard';
import DeleteIcon from '@mui/icons-material/Delete';
import { ErrorToast, SuccessToast } from 'components/Toasts/Toasts';
import { useNavigate } from 'react-router-dom';

const CustomerDetailPage = () => {
    const { id } = useParams();
    const { data: customer, isLoading } = useGetCustomerQuery(id);
    const [deleteCustomer] = useDeleteCustomerMutation();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteCustomer(id);
            SuccessToast('Customer deleted successfully');
            navigate('/customers');
        } catch (err) {
            ErrorToast('Error deleting customer');
        }
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
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', padding: 2 }}>
                    <Tooltip title="Delete customer">
                        <IconButton aria-label="delete" onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <MainCard title={`Customer #${customer.id}`}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {customer.display_name}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                            {customer.type === 'business' ? 'Business' : 'Individual'} Customer
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Contact Information
                        </Typography>
                        <Typography variant="body1">
                            {customer.name}
                            <br />
                            {customer.company_name}
                            <br />
                            {customer.email}
                            <br />
                            {customer.phone}
                            <br />
                            {customer.website && (
                                <Link href={customer.website} target="_blank" rel="noopener">
                                    {customer.website}
                                </Link>
                            )}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Additional Information
                        </Typography>
                        <Typography variant="body1">
                            ID: {customer.id}
                            <br />
                            Created At: {new Date(customer.created_at).toLocaleDateString()}
                        </Typography>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default CustomerDetailPage;
