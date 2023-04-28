import { apiSlice } from 'app/api/apiSlice';

export const customersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCustomers: builder.query({
            query: ({ orderBy, order, offset }) =>
                `accounting/customers/?offset=${offset}&order=${order === 'asc' ? orderBy : `-${orderBy}`}`,
            providesTags: [{ type: 'Customers', id: 'LIST' }]
        }),
        getCustomer: builder.query({
            query: (id) => `accounting/customers/${id}`,
            providesTags: [{ type: 'Customers', id: 'LIST' }]
        }),
        getCustomerInvoices: builder.query({
            query: (id) => `accounting/customers/${id}/get_invoices`,
            providesTags: [{ type: 'Customers', id: 'Customer invoices' }]
        }),
        customersSearch: builder.query({
            query: (value) => `accounting/customers/?name=${value}`
        }),
        addCustomer: builder.mutation({
            query: (customer) => ({
                url: 'accounting/customers/',
                method: 'POST',
                body: customer
            }),
            invalidatesTags: [{ type: 'Customers', id: 'LIST' }]
        }),
        updateCustomer: builder.mutation({
            query: ({ id, ...customer }) => ({
                url: `accounting/customers/${id}/`,
                method: 'PATCH',
                body: customer
            }),
            invalidatesTags: [{ type: 'Customers', id: 'LIST' }]
        }),
        deleteCustomer: builder.mutation({
            query: (id) => ({
                url: `accounting/customers/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: 'Customers', id: 'LIST' }]
        })
    })
});

export const {
    useGetCustomersQuery,
    useLazyCustomersSearchQuery,
    useGetCustomerQuery,
    useGetCustomerInvoicesQuery,
    useAddCustomerMutation,
    useDeleteCustomerMutation,
    useUpdateCustomerMutation
} = customersApiSlice;
