import React from 'react';
import { Typography, Grid, Divider, Link, Box, CircularProgress, IconButton, Tooltip, Stack, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useDeleteCustomerMutation, useGetCustomerInvoicesQuery, useGetCustomerQuery } from './customersApi';
import MainCard from 'components/MainCard';
import { ErrorToast, SuccessToast } from 'components/Toasts/Toasts';
import { useNavigate } from 'react-router-dom';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';

const CustomerDetailPage = () => {
    const { id } = useParams();
    const { data: customer, isLoading } = useGetCustomerQuery(id);
    const { data: invoices, isLoading: loadingInvoices } = useGetCustomerInvoicesQuery(id);
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
    const handleEdit = () => navigate('update');

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (loadingInvoices) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
                Loading invoices...
            </Box>
        );
    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        marginTop: 5
    }));

    const InfoItem = ({ label, value, link }) => (
        <Box mb={1}>
            <Typography variant="body1">
                <strong>{label}:</strong>
                {link ? (
                    <Link href={link} target="_blank" rel="noopener">
                        {value}
                    </Link>
                ) : (
                    <span>{value}</span>
                )}
            </Typography>
        </Box>
    );

    const AddressItem = ({ label, address }) => (
        <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {label}
            </Typography>
            <Typography variant="body1">
                <strong>Country:</strong> {address.country}
            </Typography>
            <Typography variant="body1">
                <strong>City:</strong> {address.city}
            </Typography>
            <Typography variant="body1">
                <strong>Address:</strong> {address.address}
            </Typography>
            <Typography variant="body1">
                <strong>State:</strong> {address.state}
            </Typography>
            <Typography variant="body1">
                <strong>Zip Code:</strong> {address.zip_code}
            </Typography>
            <Typography variant="body1">
                <strong>Phone:</strong> {address.phone}
            </Typography>
        </Box>
    );

    return (
        <>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', padding: 2 }}>
                    <Tooltip title="Edit item">
                        <IconButton aria-label="delete" onClick={handleEdit}>
                            <EditTwoTone style={{ fontSize: '150%' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete customer">
                        <IconButton aria-label="delete" onClick={handleDelete}>
                            <DeleteTwoTone style={{ fontSize: '150%' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <MainCard title={`Customer #${customer.id}`}>
                <Grid container spacing={3}>
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
                        <Box mb={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Contact Information
                            </Typography>
                            <InfoItem label="Name" value={customer.name} />
                            <InfoItem label="Company Name" value={customer.company_name} />
                            <InfoItem label="Email" value={customer.email} />
                            <InfoItem label="Phone" value={customer.phone} />
                            {customer.website && <InfoItem label="Website" value={customer.website} link={customer.website} />}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box mb={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Additional Information
                            </Typography>
                            <InfoItem label="ID" value={customer.id} />
                            <InfoItem label="Created At" value={new Date(customer.created_at).toLocaleDateString()} />
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Addresses
                            </Typography>
                            <AddressItem label="Shipping Address" address={customer.shipping_address} />
                            <AddressItem label="Billing Address" address={customer.billing_address} />
                        </Box>
                    </Grid>
                </Grid>
            </MainCard>

            <MainCard title={`Invoices`} sx={{ marginTop: 5 }}>
                <Box spacing={2} sx={{ maxHeight: 800, overflow: 'auto', cursor: 'pointer' }}>
                    {invoices && invoices.length > 0 ? (
                        invoices.map((invoice) => (
                            <Tooltip title="Go to Invoice details">
                                <Item onClick={() => navigate(`/invoices/${invoice.id}`)}>
                                    <h3>Invoice No#{invoice.id}</h3>
                                    <p>Order No#{invoice.order_number}</p>
                                    <p>Payment Status{invoice.payment_status}</p>
                                </Item>
                            </Tooltip>
                        ))
                    ) : (
                        <h4>No invoices</h4>
                    )}
                </Box>
            </MainCard>
        </>
    );
};

export default CustomerDetailPage;
