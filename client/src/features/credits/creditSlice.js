import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import creditService from './creditService'

export const requestCredits = createAsyncThunk("CREDITS/REQUEST", async (amount, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await creditService.requestCredits(amount, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const getAdminRequests = createAsyncThunk("CREDITS/GET_ADMIN", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await creditService.getAdminRequests(token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const updateRequestStatus = createAsyncThunk("CREDITS/UPDATE_STATUS", async ({ id, status }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await creditService.updateRequestStatus(id, status, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

const initialState = {
    requests: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
}

const creditSlice = createSlice({
    name: 'credits',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(requestCredits.pending, (state) => {
                state.isLoading = true
            })
            .addCase(requestCredits.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(requestCredits.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getAdminRequests.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAdminRequests.fulfilled, (state, action) => {
                state.isLoading = false
                state.requests = action.payload
            })
            .addCase(updateRequestStatus.fulfilled, (state, action) => {
                state.requests = state.requests.map(req => req._id === action.payload._id ? action.payload : req)
            })
    }
})

export const { reset } = creditSlice.actions
export default creditSlice.reducer;
