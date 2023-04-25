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

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <h4>Simple Accounting</h4>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>Your Company Name</Text>
                        <Text style={styles.address}>1234 Main St, Anytown USA 12345</Text>
                        <View style={styles.contactInfo}>
                            <Text style={styles.email}>hello@yourcompany.com</Text>
                            <Text>|</Text>
                            <Text>555-123-4567</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={styles.sectionHeader}>Invoice #{invoice.id}</Text>
                    <Text>Order Number: {invoice.order_number}</Text>
                    <Text>Date: {invoice.date}</Text>
                    <Text>Due Date: {invoice.due_date}</Text>
                    <Text>Status: {invoice.status[1]}</Text>
                </View>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, styles.header]}>Item</Text>
                        <Text style={[styles.tableCell, styles.header]}>Quantity</Text>
                        <Text style={[styles.tableCell, styles.header]}>Price</Text>
                        <Text style={[styles.tableCell, styles.header]}>Total</Text>
                    </View>
                    {invoice.items.map((item) => (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>{item.name}</Text>
                            <Text style={styles.tableCell}>{item.quantity}</Text>
                            <Text style={styles.tableCell}>${item.rate}</Text>
                            <Text style={styles.tableCell}>${item.rate * item.quantity}</Text>
                        </View>
                    ))}
                </View>
                {/* <Text style={styles.total}>Total: $ {calculateAmount(item.quantity, item.rate, item.discount, item.tax)}</Text> */}
                <View style={styles.footer}>
                    <Text>This is a sample invoice.</Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
