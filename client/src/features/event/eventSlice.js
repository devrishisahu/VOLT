import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import eventService from './eventService';

// Get All Events
export const getEvents = createAsyncThunk("EVENT/GET_ALL", async (_, thunkAPI) => {
    try {
        return await eventService.fetchEvents()
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Create Event
export const createEvent = createAsyncThunk("EVENT/CREATE", async (formData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await eventService.createEvent(formData, token)
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

const initialState = {
    events: [],
    event: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
}

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEvents.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getEvents.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.events = action.payload
            })
            .addCase(getEvents.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(createEvent.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
});

export const { reset } = eventSlice.actions
export default eventSlice.reducer