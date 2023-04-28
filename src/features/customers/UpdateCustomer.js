import React from 'react';
import { Grid, TextField, Button, Typography, MenuItem } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useUpdateCustomerMutation, useGetCustomerQuery } from './customersApi';
import { ErrorToast, SuccessToast } from 'components/Toasts/Toasts';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    company_name: Yup.string().required('Company name is required'),
    type: Yup.string().required('Type is required'),
    display_name: Yup.string().required('Display name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    website: Yup.string().url('Invalid website URL'),
    shipping_address: Yup.string().required('Shipping address is required'),
    billing_address: Yup.string()
});

const UpdateCustomer = () => {
    const {id} = useParams()
    const [updateCustomer] = useUpdateCustomerMutation();
    const { data, isLoading } = useGetCustomerQuery(id)
    const navigate = useNavigate();
    const initialValues = {
        name: data?.name || '',
        company_name: data?.company_name || '',
        type: data?.type || '',
        display_name: data?.display_name || '',
        email: data?.email || '',
        phone: data?.phone || '',
        website: data?.website || '',
        shipping_address: data?.shipping_address || '',
        billing_address: data?.billing_address || ''
    };

    const handleSubmit = async (values, actions) => {
        console.log(values);
        actions.setSubmitting(false);
        try {
            await updateCustomer({id:id,...values});
            SuccessToast('Customer updated successfully');
            navigate('/customers');
        } catch (err) {
            ErrorToast('Failed to update customer!');
        }
    };

    return isLoading ? (
        <>
            <span>loading...</span>;
        </>
    ) : (
        <Grid container spacing={3} justifyContent="flex-start">
            <Grid item xs={12}>
                <Typography variant="h4" component="h1">
                    Update Customer
                </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {(props) => (
                        <Form>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Field fullWidth name="name" label="Name" as={TextField} />
                                    <ErrorMessage name="name">{(msg) => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field fullWidth name="company_name" label="Company Name" as={TextField} />
                                    <ErrorMessage name="company_name">{(msg) => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field fullWidth name="type" label="Type" as={TextField} select>
                                        <MenuItem value="business">Business</MenuItem>
                                        <MenuItem value="individual">Individual</MenuItem>
                                    </Field>
                                    <ErrorMessage name="type">{(msg) => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field fullWidth name="display_name" label="Display Name" as={TextField} />
                                    <ErrorMessage name="display_name">{(msg) => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field fullWidth name="email" label="Email" as={TextField} />
                                    <ErrorMessage name="email">{(msg) => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field fullWidth name="phone" label="Phone" as={TextField} />
                                    <ErrorMessage name="phone">{(msg) => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field fullWidth name="website" label="Website" as={TextField} />
                                    <ErrorMessage name="website">{(msg) => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field fullWidth name="shipping_address" label="Shipping Address" as={TextField} />
                                    <ErrorMessage name="phone">{(msg) => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field fullWidth name="billing_address" label="Billing Address" as={TextField} />
                                    <ErrorMessage name="website">{(msg) => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
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
    )
};

export default UpdateCustomer;
