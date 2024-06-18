import { createAsyncThunk, createSlice , PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

type User ={
    phoneNumber : string;
    password : string;
};

type NewUser = User & {
    name : string;
};

type UserBasicInfo = {
    id: string;
    name: string;
    phoneNumber: string;
};

type UserProfileData = {
    name: string;
    phoneNumber: string;
};

type AuthApiState = {
    basicUserInfo?: UserBasicInfo | null;
    userProfileData: UserProfileData | null;
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
}

const initialState: AuthApiState = {
    basicUserInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo") as string)
        : null,
    userProfileData: null,
    status: 'idle',
    error: null,
};

export const login = createAsyncThunk("login", async (data: User) => {
    try {
        const response = await axiosInstance.post("/login", data);
        const resData = response.data;
      
        localStorage.setItem("userInfo", JSON.stringify(resData));
      
        return resData;
    } catch (error) {
        console.log(error);
        throw error;
    }
});

export const registerSlice = createAsyncThunk("register", async (data: NewUser) => {
    try {
        const response = await axiosInstance.post(
            "/register",
            data
          );
          const resData = response.data;
        
          localStorage.setItem("userInfo", JSON.stringify(resData));
        
          return resData;
    } catch (error) {
        throw error;
    }
});

export const logout = createAsyncThunk("logout", async () => {
    try {
        const response = await axiosInstance.post("/logout", {});
        const resData = response.data;
      
        localStorage.removeItem("userInfo");
      
        return resData;
    } catch (error) {
        throw error;
    }
});

export const getUser = createAsyncThunk(
    "users/profile",
    async (userId: string) => {
      const response = await axiosInstance.get(
        `/users/${userId}`
      );
      return response.data;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<UserBasicInfo>) => {
                    state.status = 'idle';
                    state.basicUserInfo = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || "Login failed";
            })
            .addCase(registerSlice.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(
                registerSlice.fulfilled,
                (state, action: PayloadAction<UserBasicInfo>) => {
                    state.status = 'idle';
                    state.basicUserInfo = action.payload;
            })
            .addCase(registerSlice.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || "Registration failed";
            })
            .addCase(logout.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(logout.fulfilled,(state) => {
                state.status = 'idle';
                state.basicUserInfo = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || "Logout failed";
            })
            .addCase(getUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state) => {
                state.status = "idle";
            })
            .addCase(getUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Get user profile data failed";
            });
    }
});

export default authSlice.reducer;