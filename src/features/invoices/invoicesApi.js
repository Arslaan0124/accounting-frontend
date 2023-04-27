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
            providesTags: [{ type: 'Invoices', id: 'LIST' }]
        }),
        addInvoice: builder.mutation({
            query: (invoice) => ({
                url: 'accounting/invoices/',
                method: 'POST',
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
        })
    })
});

export const {
    useGetInvoicesQuery,
    useLazyGetInvoicesQuery,
    useGetInvoiceQuery,
    useAddInvoiceMutation,
    useDeleteInvoiceMutation,
    useSendInvoiceEmailMutation
} = invoicesApiSlice;
