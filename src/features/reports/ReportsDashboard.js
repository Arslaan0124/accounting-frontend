import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useNavigate, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const StyledCard = styled(Card)({
    backgroundColor: '#f5f5f5',
    borderRadius: '16px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    '&:hover': {
        transform: 'scale(1.05)',
        transition: 'transform 0.2s ease-in-out'
    }
});

const StyledTitle = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '8px'
});

const StyledDescription = styled(Typography)({
    color: '#555'
});

const ReportsDashboard = () => {
    const navigate = useNavigate();
    const reports = [
        { id: 1, title: 'Sales by customer', description: 'Report for all the sales grouped by customers', url: 'sales-by-customer' },
        { id: 2, title: 'Profit & Loss', description: 'Records of Profit and Loss', url: 'profit-loss' },
        { id: 3, title: 'Report 3', description: 'Description for Report 3', url: 'report3' },
        { id: 4, title: 'Report 4', description: 'Description for Report 4', url: 'report4' }
    ];

    const handleReportCardClick = (report) => {
        navigate(report.url);
    };

    return (
        <>
            <Grid container spacing={2}>
                {reports.map((report) => (
                    <Grid item xs={12} sm={6} md={4} key={report.id}>
                        <StyledCard onClick={() => handleReportCardClick(report)}>
                            <CardContent>
                                <StyledTitle variant="h5" component="h2" gutterBottom>
                                    {report.title}
                                </StyledTitle>
                                <StyledDescription color="textSecondary">{report.description}</StyledDescription>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ marginTop: 10 }}>
                <Outlet />
            </Box>
        </>
    );
};

export default ReportsDashboard;
