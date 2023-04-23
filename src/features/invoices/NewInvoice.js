import React, { useCallback, useEffect, useState } from 'react';
import { TextField, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';
import { ErrorToast } from 'components/Toasts/Toasts';
import { useLazyCustomersSearchQuery } from 'features/customers/customersApi';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import MainCard from 'components/MainCard';

const AddInvoice = () => {
    const [search] = useLazyCustomersSearchQuery();
    const theme = useTheme();
    const [formValues, setFormValues] = useState({
        orderNumber: '',
        date: '',
        dueDate: '',
        status: 'Active',
        billingAddress: '',
        shippingAddress: '',
        remarks: '',
        shippingCharges: '',
        adjustment: '',
        customerNotes: '',
        termsAndConditions: '',
        fileUpload: null
    });
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await search('').unwrap();
                console.log(response);
            } catch (err) {
                ErrorToast('Failed to load customers!');
            }
        }
        fetchData();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formValues);
    };

    const handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleFileUpload = (event) => {
        setFormValues({
            ...formValues,
            fileUpload: event.target.files[0]
        });
    };

    const handleSelectChange = (choice) => {
        choice ? setCustomer(choice.value) : setCustomer(null);
    };

    const promiseOptions = async (inputValue) => {
        try {
            const response = await search(inputValue).unwrap();
            const customers = response?.results;
            return formSelectOptions(customers);
        } catch (err) {
            ErrorToast(err.message);
        }
    };

    const debouncedSearch = useCallback(
        debounce(async (inputText, callback) => {
            const response = await promiseOptions(inputText);
            callback(response);
        }, 300),
        [promiseOptions]
    );

    const formSelectOptions = (customers) => {
        return customers?.map((customer) => ({
            value: customer.id,
            label: customer.name
        }));
    };

    return (
        <MainCard title="New Invoice">
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <span>Select a customer</span>
                        <AsyncSelect loadOptions={debouncedSearch} isClearable={true} onChange={handleSelectChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="orderNumber"
                            name="orderNumber"
                            label="Order Number"
                            value={formValues.orderNumber}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="date"
                            name="date"
                            label="Date"
                            type="date"
                            value={formValues.date}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="dueDate"
                            name="dueDate"
                            label="Due Date"
                            type="date"
                            value={formValues.dueDate}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select labelId="status-label" id="status" name="status" value={formValues.status} onChange={handleInputChange}>
                                <MenuItem value={'Active'}>Active</MenuItem>
                                <MenuItem value={'Draft'}>Draft</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="billingAddress"
                            name="billingAddress"
                            label="Billing Address"
                            multiline
                            rows={4}
                            value={formValues.billingAddress}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="shippingAddress"
                            name="shippingAddress"
                            label="Shipping Address"
                            multiline
                            rows={4}
                            value={formValues.shippingAddress}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="remarks"
                            name="remarks"
                            label="Remarks"
                            multiline
                            rows={4}
                            value={formValues.remarks}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            id="shippingCharges"
                            name="shippingCharges"
                            label="Shipping Charges"
                            type="number"
                            value={formValues.shippingCharges}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            id="adjustment"
                            name="adjustment"
                            label="Adjustment"
                            type="number"
                            value={formValues.adjustment}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            id="customerNotes"
                            name="customerNotes"
                            label="Customer Notes"
                            type="number"
                            value={formValues.customerNotes}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="termsAndConditions"
                            name="termsAndConditions"
                            label="Terms and Conditions"
                            multiline
                            rows={4}
                            value={formValues.termsAndConditions}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            accept="application/pdf"
                            style={{ display: 'none' }}
                            id="fileUpload"
                            name="fileUpload"
                            type="file"
                            onChange={handleFileUpload}
                        />
                        <label htmlFor="fileUpload">
                            <Button variant="contained" component="span">
                                Upload
                            </Button>
                            {formValues.fileUpload && formValues.fileUpload.name}
                        </label>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </MainCard>
    );
};

export default AddInvoice;
