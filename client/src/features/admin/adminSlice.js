import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import adminService from './adminService';

// Thunks
export const fetchAllUsers = createAsyncThunk("ADMIN/FETCH_USERS", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await adminService.getAllUsers(token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const updateUserInfo = createAsyncThunk("ADMIN/UPDATE_USER", async ({ userId, userData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await adminService.updateUser(userId, userData, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const fetchAllEvents = createAsyncThunk("ADMIN/FETCH_EVENTS", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await adminService.getAllEvents(token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const updateEventInfo = createAsyncThunk("ADMIN/UPDATE_EVENT", async ({ eventId, eventData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await adminService.updateEvent(eventId, eventData, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const fetchAllOrders = createAsyncThunk("ADMIN/FETCH_ORDERS", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await adminService.getAllOrders(token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const fetchAllCoupons = createAsyncThunk("ADMIN/FETCH_COUPONS", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await adminService.getAllCoupons(token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const createNewCoupon = createAsyncThunk("ADMIN/CREATE_COUPON", async (couponData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await adminService.createCoupon(couponData, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const deleteOrder = createAsyncThunk("ADMIN/DELETE_ORDER", async (orderId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await adminService.deleteOrder(orderId, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

const initialState = {
    users: [],
    events: [],
    orders: [],
    coupons: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
}

export const updateCoupon = createAsyncThunk("ADMIN/UPDATE_COUPON", async ({ couponId, couponData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await adminService.updateCoupon(couponId, couponData, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const deleteCoupon = createAsyncThunk("ADMIN/DELETE_COUPON", async (couponId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await adminService.deleteCoupon(couponId, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

export const deleteEvent = createAsyncThunk("ADMIN/DELETE_EVENT", async (eventId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await adminService.deleteEvent(eventId, token)
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        resetAdmin: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            // Users
            .addCase(fetchAllUsers.pending, (state) => { state.isLoading = true })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.isLoading = false
                state.users = action.payload
            })
            .addCase(updateUserInfo.fulfilled, (state, action) => {
                state.isLoading = false
                state.users = state.users.map(u => u._id === action.payload._id ? action.payload : u)
            })
            // Events
            .addCase(fetchAllEvents.pending, (state) => { state.isLoading = true })
            .addCase(fetchAllEvents.fulfilled, (state, action) => {
                state.isLoading = false
                state.events = action.payload
            })
            .addCase(updateEventInfo.fulfilled, (state, action) => {
                state.isLoading = false
                state.events = state.events.map(e => e._id === action.payload._id ? action.payload : e)
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.isLoading = false
                state.events = state.events.filter(e => e._id !== action.payload.id)
            })
            // Orders
            .addCase(fetchAllOrders.pending, (state) => { state.isLoading = true })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.isLoading = false
                state.orders = action.payload
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.isLoading = false
                state.orders = state.orders.filter(o => o._id !== action.payload.id)
            })
            // Coupons
            .addCase(fetchAllCoupons.pending, (state) => { state.isLoading = true })
            .addCase(fetchAllCoupons.fulfilled, (state, action) => {
                state.isLoading = false
                state.coupons = action.payload
            })
            .addCase(createNewCoupon.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.coupons.push(action.payload)
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.isLoading = false
                state.coupons = state.coupons.map((c) => c._id === action.payload._id ? action.payload : c)
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.isLoading = false
                state.coupons = state.coupons.filter((c) => c._id !== action.payload.id)
            })
    }
});

export const { resetAdmin } = adminSlice.actions
export default adminSlice.reducer
