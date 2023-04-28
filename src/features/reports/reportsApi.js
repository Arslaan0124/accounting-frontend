import { apiSlice } from 'app/api/apiSlice';

export const reportsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSalesByCustomer: builder.query({
            query: () => 'accounting/customer-sales',
            providesTags: (result, error, id) => [{ type: 'Reports', id: 'LIST' }]
        }),
        getProfitLoss: builder.query({
            query: () => 'accounting/profit-loss',
            providesTags: (result, error, id) => [{ type: 'Reports', id: 'LIST' }]
        })
    })
});

export const { useGetSalesByCustomerQuery, useGetProfitLossQuery } = reportsApiSlice;
