import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useUpdateItemMutation, useGetItemQuery } from './itemsApi';

import { ErrorToast, SuccessToast } from 'components/Toasts/Toasts';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const UpdateItemForm = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [rate, setRate] = useState('');
    const [stockOnHand, setStockOnHand] = useState('');
    const [unit, setUnit] = useState('');
    const [hsnCode, setHsnCode] = useState('');
    const [createdSource, setCreatedSource] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [updateItem] = useUpdateItemMutation();
    const { data: item, isLoading } = useGetItemQuery(id);
    const navigate = useNavigate();

    useEffect(() => {
        if (item) {
            setName(item.name);
            setDescription(item.description);
            setRate(item.rate);
            setStockOnHand(item.stock_on_hand);
            setUnit(item.unit);
            setHsnCode(item.hsn_code);
            setCreatedSource(item.created_source);
            setCostPrice(item.cost_price);
            setSellingPrice(item.selling_price);
        }
    }, [item]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedItem = {
            id,
            name,
            description,
            rate,
            stock_on_hand: stockOnHand,
            unit,
            hsn_code: hsnCode,
            created_source: 'User',
            cost_price: costPrice,
            selling_price: sellingPrice
        };
        try {
            await updateItem(updatedItem).unwrap();
            SuccessToast('Item updated successfully');
            navigate('/items');
        } catch (err) {
            ErrorToast('Failed to update item!');
        }
    };

    return isLoading ? (
        <div>Loading...</div>
    ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" align="center">
                Update Item
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleSubmit}>
                <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
                <TextField label="Description" value={description} onChange={(event) => setDescription(event.target.value)} required />
                <TextField label="Rate" type="number" value={rate} onChange={(event) => setRate(event.target.value)} required />
                <TextField
                    label="Stock on Hand"
                    type="number"
                    value={stockOnHand}
                    onChange={(event) => setStockOnHand(event.target.value)}
                    required
                />
                <TextField label="Unit" value={unit} onChange={(event) => setUnit(event.target.value)} required />
                <TextField label="HSN Code" value={hsnCode} onChange={(event) => setHsnCode(event.target.value)} required />
                <TextField
                    label="Created Source"
                    value={createdSource}
                    onChange={(event) => setCreatedSource(event.target.value)}
                    required
                />
                <TextField
                    label="Cost Price"
                    type="number"
                    value={costPrice}
                    onChange={(event) => setCostPrice(event.target.value)}
                    required
                />
                <TextField
                    label="Selling Price"
                    type="number"
                    value={sellingPrice}
                    onChange={(event) => setSellingPrice(event.target.value)}
                    required
                />
                <Button variant="contained" type="submit">
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

export default UpdateItemForm;
