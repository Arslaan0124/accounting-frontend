import {
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Box,
    Modal,
    Tooltip,
    Button
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useParams } from 'react-router-dom';
import InvoicePDF from './InvoicePDF';
import { useDeleteInvoiceMutation, useGetInvoiceQuery, useSendInvoiceEmailMutation } from './invoicesApi';
import { useCallback, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { DownloadOutlined, SendOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import { ErrorToast, SuccessToast } from 'components/Toasts/Toasts';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { PromiseToast } from 'components/Toasts/Toasts';
import { toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

function InvoiceDetailPage() {
    const { id } = useParams();
    const { data: invoice, isLoading } = useGetInvoiceQuery(id);
    const [deleteInvoice] = useDeleteInvoiceMutation();
    const [sendInvoiceEmail] = useSendInvoiceEmailMutation();
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const calculateAmount = useCallback((quantity, rate, discount, tax) => {
        const discountedRate = rate - rate * (discount / 100);
        const taxedRate = discountedRate + discountedRate * (tax / 100);
        const amount = quantity * taxedRate;
        return amount.toFixed(2);
    }, []);

    const calculateTotalAmount = () => {
        let totalAmount = 0;

        invoice?.items.forEach((item) => {
            let itemTotal = item.quantity * item.rate;
            itemTotal -= itemTotal * (item.discount / 100);
            itemTotal += itemTotal * (item.tax / 100);
            totalAmount += itemTotal;
        });

        return totalAmount.toFixed(2);
    };

    const handleSendInvoiceEmail = async () => {
        const id = toast.loading('Dispatching your email');
        try {
            await sendInvoiceEmail(invoice?.id).unwrap();
            toast.update(id, { render: 'Email successfully sent', type: 'success', isLoading: false, autoClose: 2000 });
        } catch (err) {
            toast.update(id, { render: 'Failed to send email', type: 'error', isLoading: false, autoClose: 2000 });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteInvoice(id);
            SuccessToast('Invoice deleted successfully');
            navigate('/invoices');
        } catch (err) {
            ErrorToast('Error deleting invoice');
        }
    };

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
                    <Tooltip title="Delete Invoice">
                        <Button startIcon={<DeleteIcon />} onClick={handleDelete} sx={{ marginRight: 2 }} variant="outlined" color="error">
                            Delete
                        </Button>
                    </Tooltip>

                    <Button
                        startIcon={<DownloadOutlined />}
                        onClick={handleOpen}
                        variant="contained"
                        color="primary"
                        sx={{ marginRight: 2 }}
                    >
                        Download PDF
                    </Button>
                    <Button
                        startIcon={<SendOutlined />}
                        onClick={handleSendInvoiceEmail}
                        variant="outlined"
                        color="primary"
                        sx={{ marginRight: 2 }}
                    >
                        Send to Customer
                    </Button>
                </Box>
                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <PDFViewer style={{ height: '100%', width: '100%', margin: '0 auto' }}>
                            <InvoicePDF invoice={invoice} />
                        </PDFViewer>
                    </Box>
                </Modal>
            </Box>
            <MainCard title={`Invoice #${invoice.id}`}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 5, height: '100%', border: `1px solid ${theme.palette.divider}`, boxShadow: 0 }}>
                            <Typography variant="h5">Customer Details</Typography>
                            <hr />
                            <Typography variant="subtitle1">{invoice.customer.display_name}</Typography>
                            <Typography variant="subtitle2">{invoice.customer.company_name}</Typography>
                            <Typography variant="body1">{invoice.customer.email}</Typography>
                            <Typography variant="body2">{invoice.customer.phone}</Typography>
                            <Typography variant="body2">{invoice.customer.website}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ padding: 5, height: '100%', border: `1px solid ${theme.palette.divider}`, boxShadow: 0 }}>
                            <Typography variant="h5">Invoice Details</Typography>
                            <hr />
                            <Typography variant="body1">Order Number: {invoice.order_number}</Typography>
                            <Typography variant="body1">Date: {invoice.date}</Typography>
                            <Typography variant="body1">Due Date: {invoice.due_date}</Typography>
                            <Typography variant="body1">Status: {invoice.status}</Typography>
                            <Typography variant="body1">Email status: {invoice.sent_times}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ padding: 5, border: `1px solid ${theme.palette.divider}`, boxShadow: 0 }}>
                            <Typography variant="h5">Item Details</Typography>
                            <hr />
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Rate</TableCell>
                                            <TableCell align="right">Discount</TableCell>
                                            <TableCell align="right">Tax</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoice.items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.item.name}</TableCell>
                                                <TableCell align="right">{item.quantity}</TableCell>
                                                <TableCell align="right">{item.rate}</TableCell>
                                                <TableCell align="right">{item.discount}</TableCell>
                                                <TableCell align="right">{item.tax}</TableCell>
                                                <TableCell align="right">
                                                    {calculateAmount(item.quantity, item.rate, item.discount, item.tax)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box display="flex" justifyContent="end">
                                <Typography variant="h5">Total: {calculateTotalAmount()}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ padding: 5, border: `1px solid ${theme.palette.divider}`, boxShadow: 0 }}>
                            <Typography variant="h5">Additional Information</Typography>
                            <hr />
                            <Typography variant="body1">{invoice.remarks}</Typography>
                            <Typography variant="body1">{invoice.customer_notes}</Typography>
                            <Typography variant="body1">{invoice.terms_and_conditions}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
}

export default InvoiceDetailPage;
