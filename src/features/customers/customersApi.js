import { apiSlice } from 'app/api/apiSlice';

export const customersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCustomers: builder.query({
            query: ({ orderBy, order }) => 'accounting/customers'
        }),
        customersSearch: builder.query({
            query: (value) => `accounting/customers/?name=${value}`
        })
    })
});

export const { useGetCustomersQuery, useLazyCustomersSearchQuery } = customersApiSlice;
