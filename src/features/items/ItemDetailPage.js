import { Typography, Grid, Paper, CircularProgress, Box, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MainCard from 'components/MainCard';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDeleteItemMutation, useGetItemQuery } from './itemsApi';
import { ErrorToast, SuccessToast } from 'components/Toasts/Toasts';
import { useNavigate } from 'react-router-dom';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';

function ItemDetailPage() {
    const { id } = useParams();
    const { data: item, isLoading } = useGetItemQuery(id);
    const theme = useTheme();
    const [deleteItem] = useDeleteItemMutation();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteItem(id);
            SuccessToast('Item deleted successfully');
            navigate('/items');
        } catch (err) {
            ErrorToast('Error deleting item');
        }
    };

    const handleEdit = () => navigate('update');

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', padding: 2 }}>
                    <Tooltip title="Edit item">
                        <IconButton aria-label="delete" onClick={handleEdit}>
                            <EditTwoTone style={{ fontSize: '150%' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete item">
                        <IconButton aria-label="delete" onClick={handleDelete}>
                            <DeleteTwoTone style={{ fontSize: '150%' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <MainCard title={`Item #${item.id}`}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 5, height: '100%', border: `1px solid ${theme.palette.divider}`, boxShadow: 0 }}>
                            <Typography variant="h5">Item Details</Typography>
                            <hr />
                            <Typography variant="subtitle1">{item.name}</Typography>
                            <Typography variant="subtitle2">{item.rate}</Typography>
                            <Typography variant="body1">{item.stock_on_hand}</Typography>
                            <Typography variant="body2">{item.unit}</Typography>
                            <Typography variant="body2">{item.hsn_code}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 5, height: '100%', border: `1px solid ${theme.palette.divider}`, boxShadow: 0 }}>
                            <Typography variant="h5">Purchase Information</Typography>
                            <hr />
                            <Typography variant="subtitle1">{item.cost_price}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 5, height: '100%', border: `1px solid ${theme.palette.divider}`, boxShadow: 0 }}>
                            <Typography variant="h5">Sales Information</Typography>
                            <hr />
                            <Typography variant="subtitle1">{item.selling_price}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
}

export default ItemDetailPage;
