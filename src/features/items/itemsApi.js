import { apiSlice } from 'app/api/apiSlice';

export const itemsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getItems: builder.query({
            query: ({ orderBy, order, offset }) => `accounting/items/?offset=${offset}&order=${order === 'asc' ? orderBy : `-${orderBy}`}`,
            providesTags: (result, error, id) => [{ type: 'Items', id: 'LIST' }]
        }),
        getAllItems: builder.query({
            query: () => `accounting/items/`,
            providesTags: (result, error, id) => [{ type: 'Items', id: 'LIST' }]
        }),
        getItem: builder.query({
            query: (id) => `accounting/items/${id}`,
            providesTags: (id) => [{ type: 'Items', id: id }]
        }),
        addItem: builder.mutation({
            query: (item) => ({
                url: 'accounting/items/',
                method: 'POST',
                body: item
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Items', id: 'LIST' }]
        }),
        deleteItem: builder.mutation({
            query: (id) => ({
                url: `accounting/items/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Items', id: 'LIST' }]
        })
    })
});

export const { useGetItemsQuery, useLazyGetItemsQuery, useGetItemQuery, useAddItemMutation, useGetAllItemsQuery, useDeleteItemMutation } =
    itemsApiSlice;
