import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';
import { ErrorToast, SuccessToast } from 'components/Toasts/Toasts';
import { useLazyCustomersSearchQuery } from 'features/customers/customersApi';
import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import { useAddInvoiceMutation } from './invoicesApi';
import {
    Grid,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Autocomplete
} from '@mui/material';

import { useGetAllItemsQuery } from 'features/items/itemsApi';
import { useNavigate } from 'react-router-dom';

const AddInvoice = () => {
    const navigate = useNavigate();
    const [search] = useLazyCustomersSearchQuery();
    const [addInvoice] = useAddInvoiceMutation();
    const { data: allItems } = useGetAllItemsQuery();
    const theme = useTheme();
    const [formValues, setFormValues] = useState({
        orderNumber: '',
        date: '',
        dueDate: '',
        status: 'active',
        payment_status: 'unpaid',
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
    const [items, setItems] = useState([{ item: null, quantity: 0, rate: 0, discount: 0, tax: 0 }]);

    const mutateFormValues = (values) => ({
        billing_address: values.billingAddress,
        customer_notes: values.customerNotes,
        due_date: values.dueDate,
        order_number: values.orderNumber,
        shipping_address: values.shippingAddress,
        shipping_charges: values.shippingCharges,
        status: values.status,
        terms_and_conditions: values.termsAndConditions,
        remarks: values.remarks,
        date: values.date,
        adjustment: values.adjustment,
        customer: customer.id,
        items: items
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = mutateFormValues(formValues);
        try {
            await addInvoice(payload);
            SuccessToast('Invoice added successfully');
            navigate('/invoices');
        } catch (err) {
            ErrorToast('Failed to create invoice!');
        }
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
            value: {
                id: customer.id,
                ...customer
            },
            label: customer.name
        }));
    };

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        const newItems = [...items];
        newItems[index][name] = value;
        setItems(newItems);
    };

    const handleItemChange = (event, newValue, index) => {
        const name = 'item';
        const newItems = [...items];
        newItems[index][name] = newValue?.id;
    };

    const handleAddItem = () => {
        setItems([...items, { item: null, quantity: 0, rate: 0, discount: 0, tax: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const getTotalAmount = () => {
        const total = items.reduce((total, item) => {
            const amount = item.quantity * item.rate * (1 - item.discount / 100) * (1 + item.tax / 100);
            return total + amount;
        }, 0);

        return total.toFixed(2);
    };

    const calculateAmount = useCallback((quantity, rate, discount, tax) => {
        const discountedRate = rate - rate * (discount / 100);
        const taxedRate = discountedRate + discountedRate * (tax / 100);
        const amount = quantity * taxedRate;
        return amount.toFixed(2);
    }, []);

    const formItemOptions = (allItems) => {
        if (!allItems) {
            return [];
        }
        const items = allItems?.results.map((item) => ({
            label: item.name,
            id: item.id,
            rate: item.rate,
            stock_on_hand: item.stock_on_hand
        }));
        return items;
    };

    const RenderItemTable = useMemo(
        () => (
            <Grid item xs={12} sx={{ marginTop: 2 }}>
                <div>
                    <span>Add items</span>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Rate</TableCell>
                                    <TableCell>Discount (%)</TableCell>
                                    <TableCell>Tax (%)</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Autocomplete
                                                disablePortal
                                                id={`combo-box-demo-${index}`}
                                                options={formItemOptions(allItems)}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                sx={{ width: 300 }}
                                                onChange={(event, newValue) => handleItemChange(event, newValue, index)}
                                                renderInput={(params) => <TextField {...params} label="Item" />}
                                                renderOption={(props, option) => (
                                                    <Box component="li" {...props}>
                                                        <div>
                                                            <h4>{option.label}</h4>
                                                            <span>
                                                                Rate: {option.rate}
                                                                {' | '}
                                                            </span>
                                                            <span>Stock: {option.stock_on_hand}</span>
                                                        </div>
                                                    </Box>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                name="quantity"
                                                value={item.quantity}
                                                onChange={(event) => handleChange(event, index)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                name="rate"
                                                value={item.rate}
                                                onChange={(event) => handleChange(event, index)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                name="discount"
                                                value={item.discount}
                                                onChange={(event) => handleChange(event, index)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                name="tax"
                                                value={item.tax}
                                                onChange={(event) => handleChange(event, index)}
                                            />
                                        </TableCell>
                                        <TableCell>{calculateAmount(item.quantity, item.rate, item.discount, item.tax)}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleRemoveItem(index)}>Remove</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={6}>Total Amount</TableCell>
                                    <TableCell>{getTotalAmount()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button onClick={handleAddItem}>Add Item</Button>
                </div>
            </Grid>
        ),
        [allItems, handleAddItem, handleChange, handleItemChange, handleRemoveItem]
    );

    const renderSelect = useCallback(
        () => (
            <AsyncSelect
                loadOptions={debouncedSearch}
                isClearable={true}
                onChange={handleSelectChange}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
            />
        ),
        [debouncedSearch]
    );
    return (
        <MainCard title="New Invoice">
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3} sx={{ width: '80%', padding: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <span>Select a customer</span>
                        {renderSelect()}
                    </Grid>
                    {customer && (
                        <>
                            <Grid item xs={12}>
                                <Box padding={5} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                        Shipping Address
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Street:</strong> {customer.shipping_address.address}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>City:</strong> {customer.shipping_address.city}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>State:</strong> {customer.shipping_address.state}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>ZIP Code:</strong> {customer.shipping_address.zip_code}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Country:</strong> {customer.shipping_address.country}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box padding={5} sx={{ border: `1px solid ${theme.palette.divider}`, marginTop: 3 }}>
                                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                        Billing Address
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Street:</strong> {customer.billing_address.address}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>City:</strong> {customer.billing_address.city}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>State:</strong> {customer.billing_address.state}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>ZIP Code:</strong> {customer.billing_address.zip_code}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Country:</strong> {customer.billing_address.country}
                                    </Typography>
                                </Box>
                            </Grid>
                        </>
                    )}
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
                    <Grid item sm={12} sx={12}>
                        <hr />
                    </Grid>
                    {RenderItemTable}
                    <Grid item sm={12} sx={12}>
                        <hr />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select labelId="status-label" id="status" name="status" value={formValues.status} onChange={handleInputChange}>
                                <MenuItem value={'active'}>Active</MenuItem>
                                <MenuItem value={'draft'}>Draft</MenuItem>
                                <MenuItem value={'complete'}>Complete</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="status-label">Payment</InputLabel>
                            <Select
                                labelId="status-label"
                                id="payment_status"
                                name="payment_status"
                                value={formValues.payment_status}
                                onChange={handleInputChange}
                            >
                                <MenuItem value={'paid'}>Paid</MenuItem>
                                <MenuItem value={'unpaid'}>Unpaid</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            sx={{ width: '100%' }}
                            id="remarks"
                            name="remarks"
                            label="Remarks"
                            multiline
                            rows={4}
                            value={formValues.remarks}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            sx={{ width: '100%' }}
                            id="shippingCharges"
                            name="shippingCharges"
                            label="Shipping Charges"
                            type="number"
                            value={formValues.shippingCharges}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            sx={{ width: '100%' }}
                            id="adjustment"
                            name="adjustment"
                            label="Adjustment"
                            type="number"
                            value={formValues.adjustment}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            sx={{ width: '100%' }}
                            id="customerNotes"
                            name="customerNotes"
                            label="Customer Notes"
                            multiline
                            rows={4}
                            value={formValues.customerNotes}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item sm={12} sx={12}>
                        <hr />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            sx={{ width: '100%' }}
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
