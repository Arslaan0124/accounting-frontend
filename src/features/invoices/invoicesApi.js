import { apiSlice } from 'app/api/apiSlice';

export const invoicesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getInvoices: builder.query({
            query: ({ orderBy, order, offset }) =>
                `accounting/invoices/?offset=${offset}&order=${order === 'asc' ? orderBy : `-${orderBy}`}`,
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
        })
    })
});

export const { useGetInvoicesQuery, useLazyGetInvoicesQuery, useGetInvoiceQuery, useAddInvoiceMutation, useDeleteInvoiceMutation } =
    invoicesApiSlice;
