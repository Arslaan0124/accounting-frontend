import { apiSlice } from 'app/api/apiSlice';

export const invoicesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getInvoices: builder.query({
            query: ({ orderBy, order }) => `accounting/invoices/?order=${order === 'asc' ? orderBy : `-${orderBy}`}`
        })
    })
});

export const { useGetInvoicesQuery, useLazyGetInvoicesQuery } = invoicesApiSlice;
