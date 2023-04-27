import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { useCallback } from 'react';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 12
    },
    header: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10
    },
    companyInfo: {
        flex: 1,
        marginRight: 10
    },
    companyName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5
    },
    address: {
        marginBottom: 5
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    email: {
        marginRight: 10
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 10
    },
    sectionHeader: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 20,
        marginBottom: 10
    },
    table: {
        display: 'table',
        width: 'auto',
        marginBottom: 10
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
        alignItems: 'center',
        height: 24
    },
    tableCell: {
        width: '20%',
        textAlign: 'center'
    },
    tableHeader: {
        backgroundColor: '#eee'
    },
    total: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 20
    }
});

const InvoicePDF = ({ invoice }) => {
    const calculateAmount = useCallback((quantity, rate, discount, tax) => {
        const discountedRate = rate - rate * (discount / 100);
        const taxedRate = discountedRate + discountedRate * (tax / 100);
        const amount = quantity * taxedRate;
        return amount.toFixed(2);
    }, []);

    const customerName = invoice.customer.name;
    const companyName = invoice.customer.company_name;
    const customerEmail = invoice.customer.email;
    const orderNumber = invoice.order_number;
    const invoiceDate = invoice.date;
    const dueDate = invoice.due_date;
    const billingAddress = invoice.billing_address;
    const shippingAddress = invoice.shipping_address;
    const shippingCharges = invoice.shipping_charges;
    const adjustment = invoice.adjustment;
    const customerNotes = invoice.customer_notes;
    const termsAndConditions = invoice.terms_and_conditions;

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>{companyName}</Text>
                        <Text style={styles.address}>{billingAddress}</Text>
                        <View style={styles.contactInfo}>
                            <Text style={styles.email}>{customerEmail}</Text>
                        </View>
                    </View>
                    <View>
                        <Text>Invoice # {orderNumber}</Text>
                        <Text>Date: {invoiceDate}</Text>
                        <Text>Due Date: {dueDate}</Text>
                    </View>
                </View>

                <View>
                    <Text style={styles.sectionHeader}>Bill To:</Text>
                    <Text>{customerName}</Text>
                    <Text>{billingAddress}</Text>
                    <Text>{customerEmail}</Text>
                </View>
                <View>
                    <Text style={styles.sectionHeader}>Ship To:</Text>
                    <Text>{customerName}</Text>
                    <Text>{shippingAddress}</Text>
                </View>

                <View>
                    <Text style={styles.sectionHeader}>Order Summary:</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Item</Text>
                            <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Quantity</Text>
                            <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Rate</Text>
                            <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Discount</Text>
                            <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Tax</Text>
                            <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Amount</Text>
                        </View>

                        {invoice.items.map((itemDetails, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{itemDetails.item.name}</Text>
                                <Text style={styles.tableCell}>{itemDetails.quantity}</Text>
                                <Text style={styles.tableCell}>{itemDetails.rate}</Text>
                                <Text style={styles.tableCell}>{itemDetails.discount}%</Text>
                                <Text style={styles.tableCell}>{itemDetails.tax}%</Text>
                                <Text style={styles.tableCell}>
                                    {calculateAmount(itemDetails.quantity, itemDetails.rate, itemDetails.discount, itemDetails.tax)}
                                </Text>
                            </View>
                        ))}

                        <View style={[styles.tableRow, { height: 30 }]}>
                            <Text style={[styles.tableCell, { borderBottomWidth: 0 }]}></Text>
                            <Text style={[styles.tableCell, { borderBottomWidth: 0 }]}></Text>
                            <Text style={[styles.tableCell, { borderBottomWidth: 0 }]}></Text>
                            <Text style={[styles.tableCell, { fontWeight: 'bold', textAlign: 'right' }]}>Shipping Charges:</Text>
                            <Text style={[styles.tableCell, { textAlign: 'right' }]}>{shippingCharges}</Text>
                        </View>

                        <View style={[styles.tableRow, { height: 30 }]}>
                            <Text style={[styles.tableCell, { borderBottomWidth: 0 }]}></Text>
                            <Text style={[styles.tableCell, { borderBottomWidth: 0 }]}></Text>
                            <Text style={[styles.tableCell, { borderBottomWidth: 0 }]}></Text>
                            <Text style={[styles.tableCell, { fontWeight: 'bold', textAlign: 'right' }]}>Adjustment:</Text>
                            <Text style={[styles.tableCell, { textAlign: 'right' }]}>{adjustment}</Text>
                        </View>

                        <View style={[styles.tableRow, { height: 30 }]}>
                            <Text style={[styles.tableCell, { borderBottomWidth: 0 }]}></Text>
                            <Text style={[styles.tableCell, { borderBottomWidth: 0 }]}></Text>
                            <Text style={[styles.tableCell, { borderBottomWidth: 0 }]}></Text>
                            <Text style={[styles.tableCell, { fontWeight: 'bold', textAlign: 'right' }]}>Total:</Text>
                            <Text style={[styles.tableCell, { fontWeight: 'bold', textAlign: 'right' }]}>{invoice.total}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
