import { apiSlice } from '../../app/api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'users/auth/login/',
                method: 'POST',
                body: { ...credentials }
            }),
            transformResponse: (response) => ({
                access: response.access,
                refresh: response.refresh
            }),
            transformErrorResponse: (response) => ({
                status: response.status,
                error: response.error,
                message: response.data?.message
            })
        }),

        register: builder.mutation({
            query: (body) => ({
                url: 'users/auth/register/',
                method: 'POST',
                body: { ...body }
            }),
            invalidatesTags: ['Doctors'],
            transformResponse: (response) => response,
            transformErrorResponse: (response) => {
                const errors = response.data;
                const errorList = [];
                for (const key in errors) {
                    if (errors.hasOwnProperty(key)) {
                        const errorMessages = errors[key];
                        for (const message of errorMessages) {
                            errorList.push(`${key}: ${message}`);
                        }
                    }
                }
                const errorString = errorList.join('\n');
                return errorString;
            }
        })
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useAddProfileMutation,
    useGetUserMutation,
    useUpdatePatientProfileMutation,
    useUpdateDoctorProfileMutation,
    useLazyGetProfileQuery,
    useGetProfileQuery
} = authApiSlice;
