import React from 'react';
import InvoiceTable from './InvoiceTable';
import { PlusOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const InvoicePage = () => {
    const navigate = useNavigate();
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'end', padding: 2 }}>
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => navigate('/new-invoice')}>
                    New
                </Button>
            </Box>
            <InvoiceTable />
        </>
    );
};

export default InvoicePage;
