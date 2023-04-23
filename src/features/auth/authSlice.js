import { createSlice } from '@reduxjs/toolkit';
import { auth } from '../../constants/constants';
import jwtDecode from 'jwt-decode';
const { accessToken, refreshToken } = auth;

const isLoggedIn = localStorage.getItem(accessToken);

const initialState = {
    accessToken: localStorage.getItem(accessToken),
    refreshToken: localStorage.getItem(refreshToken),
    user: isLoggedIn ? jwtDecode(localStorage.getItem(accessToken)) : null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { access, refresh } = action.payload;
            state.accessToken = access;
            state.refreshToken = refresh;
            state.user = jwtDecode(state.accessToken);
            localStorage.setItem(accessToken, access);
            localStorage.setItem(refreshToken, refresh);
        },
        logOut: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            localStorage.clear();
        }
    }
});

export const { setCredentials, logOut, setUser } = authSlice.actions;

export default authSlice.reducer;

export const selectAccessToken = (state) => state.auth.accessToken;
export const selectRefreshToken = (state) => state.auth.refreshToken;

export const selectUser = (state) => {
    return state.auth.user;
};
export const selectUserId = (state) => {
    if (state.auth.accessToken) {
        return jwtDecode(state.auth.accessToken).user_id;
    }
    return null;
};
