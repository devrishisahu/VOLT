import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import orderService from './orderService';

// Book Ticket
export const bookTicket = createAsyncThunk("ORDER/BOOK", async ({ eventId, bookingData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await orderService.bookTicket(eventId, bookingData, token)
    } catch (error) {
        const message = error.response?.data?.message || error.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Get My Orders
export const getMyOrders = createAsyncThunk("ORDER/GET_MY", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await orderService.getMyTickets(token)
    } catch (error) {
        const message = error.response?.data?.message || error.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Cancel Ticket
export const cancelTicket = createAsyncThunk("ORDER/CANCEL", async (ticketId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await orderService.cancelTicket(ticketId, token)
    } catch (error) {
        const message = error.response?.data?.message || error.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Verify Coupon
export const verifyCoupon = createAsyncThunk("ORDER/VERIFY_COUPON", async (couponCode, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await orderService.checkCoupon(couponCode, token)
    } catch (error) {
        const message = error.response?.data?.message || error.message
        return thunkAPI.rejectWithValue(message)
    }
})

const initialState = {
    orders: [],
    appliedCoupon: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ""
            state.appliedCoupon = null
        },
        removeCoupon: (state) => {
            state.appliedCoupon = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(bookTicket.pending, (state) => {
                state.isLoading = true
            })
            .addCase(bookTicket.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.orders.push(action.payload)
            })
            .addCase(bookTicket.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getMyOrders.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.orders = action.payload
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(cancelTicket.pending, (state) => {
                state.isLoading = true
            })
            .addCase(cancelTicket.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                // update the order in the list
                const index = state.orders.findIndex(o => o._id === action.payload._id)
                if (index !== -1) {
                    state.orders[index] = action.payload
                }
            })
            .addCase(cancelTicket.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(verifyCoupon.fulfilled, (state, action) => {
                state.appliedCoupon = action.payload
            })
            .addCase(verifyCoupon.rejected, (state, action) => {
                state.appliedCoupon = null
                state.isError = true
                state.message = action.payload
            })
    }
});

export const { reset, removeCoupon } = orderSlice.actions
export default orderSlice.reducer
