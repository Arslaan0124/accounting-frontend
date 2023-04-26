import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

const NotFound = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}
        >
            <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 700, color: '#000', margin: 0 }}>
                404
            </Typography>
            <Typography variant="h2" sx={{ fontSize: '1rem', fontWeight: 700, color: '#000', margin: 0, marginBottom: 2 }}>
                Oops! Page not found.
            </Typography>
            <Typography variant="body1">Sorry, but the page you are looking for does not exist.</Typography>
            <Link to="/" sx={{ textDecoration: 'none', marginTop: 2 }}>
                <Button variant="contained" color="primary">
                    Go back to home
                </Button>
            </Link>
        </Box>
    );
};

export default NotFound;
