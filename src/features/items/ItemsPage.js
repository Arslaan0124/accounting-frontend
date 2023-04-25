import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import ItemsTable from './ItemsTable';

const ItemsPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'end', padding: 2 }}>
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => navigate('/new-item')}>
                    New
                </Button>
            </Box>
            <ItemsTable />
        </>
    );
};

export default ItemsPage;
