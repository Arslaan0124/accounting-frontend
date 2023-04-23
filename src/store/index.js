// third-party
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from 'app/api/apiSlice';
import menuReducer from '../store/reducers/menu';
import authReducer from '../features/auth/authSlice';
// project import
import reducers from './reducers';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        menu: menuReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

const { dispatch } = store;

export { store, dispatch };
