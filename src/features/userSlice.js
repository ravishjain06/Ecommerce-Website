import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({

    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setLogout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.accessToken = null;
        }
    }

});

export const { setUser,setAccessToken,setLogout } = authSlice.actions;
export default authSlice.reducer;

