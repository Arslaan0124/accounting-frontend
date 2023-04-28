import { apiSlice } from 'app/api/apiSlice';

export const invoicesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getInvoices: builder.query({
            query: ({ orderBy, order, offset, filters }) =>
                `accounting/invoices/?offset=${offset}&order=${order === 'asc' ? orderBy : `-${orderBy}`}&${filters}`,
            providesTags: [{ type: 'Invoices', id: 'LIST' }]
        }),
        getInvoice: builder.query({
            query: (id) => `accounting/invoices/${id}`,
            providesTags: (error, results, id) => [{ type: 'Invoices', id: 'RESOURCE' }]
        }),
        addInvoice: builder.mutation({
            query: (invoice) => ({
                url: 'accounting/invoices/',
                method: 'POST',
                body: invoice
            }),
            invalidatesTags: [{ type: 'Invoices', id: 'LIST' }]
        }),
        updateInvoice: builder.mutation({
            query: ({ id, ...invoice }) => ({
                url: `accounting/invoices/${id}`,
                method: 'PATCH',
                body: invoice
            }),
            invalidatesTags: [{ type: 'Invoices', id: 'LIST' }]
        }),
        deleteInvoice: builder.mutation({
            query: (id) => ({
                url: `accounting/invoices/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: 'Invoices', id: 'LIST' }]
        }),
        sendInvoiceEmail: builder.mutation({
            query: (id) => ({
                url: `accounting/invoices/${id}/send_email/`,
                method: 'POST'
            })
        }),
        paymentStatus: builder.mutation({
            query: ({ id, payment_status }) => ({
                url: `accounting/invoices/${id}/update_payment_status/`,
                method: 'POST',
                body: { payment_status }
            }),
            invalidatesTags: (error, results, id) => [
                { type: 'Invoices', id: 'RESOURCE' },
                { type: 'Invoices', id: 'LIST' }
            ]
        })
    })
});

export const {
    useGetInvoicesQuery,
    useLazyGetInvoicesQuery,
    useGetInvoiceQuery,
    useAddInvoiceMutation,
    useDeleteInvoiceMutation,
    useUpdateInvoiceMutation,
    useSendInvoiceEmailMutation,
    usePaymentStatusMutation
} = invoicesApiSlice;
