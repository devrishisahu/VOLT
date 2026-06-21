import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import chatService from './chatService';

// Get Bot Response
export const getBotResponse = createAsyncThunk("CHAT/GET_RESPONSE", async (question, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await chatService.getResponse(question, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const initialState = {
    chatHistory: [],
    isLoading: false,
    isError: false,
    message: ""
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.message = ""
        },
        addMessage: (state, action) => {
            state.chatHistory.push(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBotResponse.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getBotResponse.fulfilled, (state, action) => {
                state.isLoading = false
                state.chatHistory.push({ sender: 'bot', text: action.payload.response })
            })
            .addCase(getBotResponse.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.chatHistory.push({ sender: 'bot', text: `Error: ${action.payload}` })
            })
    }
});

export const { reset, addMessage } = chatSlice.actions
export default chatSlice.reducer
