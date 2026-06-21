import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import commentService from './commentService';

// Get Comments
export const getComments = createAsyncThunk("COMMENT/GET_ALL", async (eventId, thunkAPI) => {
    try {
        return await commentService.getComments(eventId);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Add Comment
export const addComment = createAsyncThunk("COMMENT/ADD", async ({ eventId, commentData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await commentService.addComment(eventId, commentData, token);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete Comment
export const deleteComment = createAsyncThunk("COMMENT/DELETE", async (commentId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await commentService.deleteComment(commentId, token);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    comments: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getComments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.comments = action.payload;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addComment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.comments.push(action.payload);
            })
            .addCase(addComment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteComment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.comments = state.comments.filter((c) => c._id !== action.payload.id);
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export const { reset } = commentSlice.actions;
export default commentSlice.reducer;
