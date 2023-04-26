import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import CustomerTable from './CustomerTable';

const CustomersPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'end', padding: 2 }}>
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => navigate('/new-customer')}>
                    New
                </Button>
            </Box>
            <CustomerTable />
        </>
    );
};

export default CustomersPage;
