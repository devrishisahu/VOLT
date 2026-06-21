import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

//Register User
export const registerUser = createAsyncThunk(
  "AUTH/REGISTER",
  async (formData, thunkAPI) => {
    try {
      return await authService.register(formData);
    } catch (error) {
      let message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

//Login User
export const loginUser = createAsyncThunk(
  "AUTH/LOGIN",
  async (formData, thunkAPI) => {
    try {
      return await authService.login(formData);
    } catch (error) {
      let message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// LogOut User
export const logoutUser = createAsyncThunk("AUTH/LOGOUT", async () => {
  localStorage.removeItem('user');
});

// Sync User
export const syncUser = createAsyncThunk(
  "AUTH/SYNC",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await authService.syncUser(token);
    } catch (error) {
      let message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

let userExist = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: userExist || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isError = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.isError = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = null
      })
      .addCase(syncUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
