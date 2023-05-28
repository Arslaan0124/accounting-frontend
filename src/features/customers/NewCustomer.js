import React from 'react';
import { Grid, TextField, Button, Typography, MenuItem } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAddCustomerMutation } from './customersApi';
import { ErrorToast, SuccessToast } from 'components/Toasts/Toasts';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    company_name: Yup.string().required('Company name is required'),
    type: Yup.string().required('Type is required'),
    display_name: Yup.string().required('Display name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    website: Yup.string().url('Invalid website URL'),
    shipping_address: Yup.object().shape({
        country: Yup.string().required('Country is required'),
        city: Yup.string().required('City is required'),
        address: Yup.string().required('Address is required'),
        state: Yup.string().required('State is required'),
        zip_code: Yup.string().required('Zip code is required'),
        phone: Yup.string().required('Phone number is required')
    }),
    billing_address: Yup.object().shape({
        country: Yup.string().required('Country is required'),
        city: Yup.string().required('City is required'),
        address: Yup.string().required('Address is required'),
        state: Yup.string().required('State is required'),
        zip_code: Yup.string().required('Zip code is required'),
        phone: Yup.string().required('Phone number is required')
    })
});

const NewCustomer = () => {
    const [addCustomer] = useAddCustomerMutation();
    const navigate = useNavigate();

    const initialValues = {
        name: '',
        company_name: '',
        type: '',
        display_name: '',
        email: '',
        phone: '',
        website: '',
        shipping_address: { country: '', city: '', address: '', state: '', zip_code: '', phone: '' },
        billing_address: { country: '', city: '', address: '', state: '', zip_code: '', phone: '' }
    };

    const handleSubmit = async (values, actions) => {
        console.log(values);
        actions.setSubmitting(false);
        try {
            await addCustomer(values).unwrap();
            SuccessToast('Customer added successfully');
            navigate('/customers');
        } catch (err) {
            ErrorToast('Failed to create customer!');
        }
    };

    return (
        <MainCard>
            <Grid container spacing={3} justifyContent="flex-start">
                <Grid item xs={12}>
                    <Typography variant="h4" component="h1">
                        Add Customer
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {(props) => (
                            <Form>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Field fullWidth name="name" label="Name" as={TextField} />
                                                <ErrorMessage name="name">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field fullWidth name="company_name" label="Company Name" as={TextField} />
                                                <ErrorMessage name="company_name">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field fullWidth name="type" label="Type" as={TextField} select>
                                                    <MenuItem value="business">Business</MenuItem>
                                                    <MenuItem value="individual">Individual</MenuItem>
                                                </Field>
                                                <ErrorMessage name="type">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field fullWidth name="display_name" label="Display Name" as={TextField} />
                                                <ErrorMessage name="display_name">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field fullWidth name="email" label="Email" as={TextField} />
                                                <ErrorMessage name="email">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field fullWidth name="phone" label="Phone" as={TextField} />
                                                <ErrorMessage name="phone">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field fullWidth name="website" label="Website" as={TextField} />
                                                <ErrorMessage name="website">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item sx={12} display="flex" justifyContent="center" gap={10}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Typography variant="h5">Shipping Address</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field fullWidth name="shipping_address.country" label="Country" as={TextField} />
                                                <ErrorMessage name="shipping_address.country">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field fullWidth name="shipping_address.city" label="City" as={TextField} />
                                                <ErrorMessage name="shipping_address.city">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field fullWidth name="shipping_address.address" label="Address" as={TextField} />
                                                <ErrorMessage name="shipping_address.address">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field fullWidth name="shipping_address.state" label="State" as={TextField} />
                                                <ErrorMessage name="shipping_address.state">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field fullWidth name="shipping_address.zip_code" label="Zip Code" as={TextField} />
                                                <ErrorMessage name="shipping_address.zip_code">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field fullWidth name="shipping_address.phone" label="Phone" as={TextField} />
                                                <ErrorMessage name="shipping_address.phone">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Typography variant="h5">Billing Address</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field fullWidth name="billing_address.country" label="Country" as={TextField} />
                                                <ErrorMessage name="billing_address.country">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field fullWidth name="billing_address.city" label="City" as={TextField} />
                                                <ErrorMessage name="billing_address.city">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field fullWidth name="billing_address.address" label="Address" as={TextField} />
                                                <ErrorMessage name="billing_address.address">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field fullWidth name="billing_address.state" label="State" as={TextField} />
                                                <ErrorMessage name="billing_address.state">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Field fullWidth name="billing_address.zip_code" label="Zip Code" as={TextField} />
                                                <ErrorMessage name="billing_address.zip_code">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field fullWidth name="billing_address.phone" label="Phone" as={TextField} />
                                                <ErrorMessage name="billing_address.phone">
                                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button type="submit" variant="contained" color="primary" disabled={props.isSubmitting}>
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default NewCustomer;
