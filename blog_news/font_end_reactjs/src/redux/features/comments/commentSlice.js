import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commentService from "./commentService";

// export const createComment = createAsyncThunk(
//   "createcomment",
//   async ( { idpost , content},thunkAPI) => {
//     try {
//       const data = await commentService.postCreateComment(idpost , content);
//       return data;
//     } catch (error) {
//       return error.message;
//     }
//   }
// );
export const getComment = createAsyncThunk(
  "getcomment",
  async ( {id , page},thunkAPI) => {
    try {
      const data = await commentService.getComment(id , page);
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const commentSlice = createSlice({
  name: "comments",
  initialState: {
    listcomment: [],
    total : '',
    isLoading: false,
  }, 
  reducers: {
    clearStatecmt: (state) => {
      state.listcomment = [];
      state.total = '';
      state.isLoading = false;
    },
    createCmt: (state, {payload}) =>{
      state.listcomment.unshift(payload)
      state.total = state.total + 1
      return state;
    }
  },
  extraReducers: {
    [getComment.pending]: (state) => {
      state.isLoading = true
    },
    [getComment.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      for (var i = 0; i < payload.listcomments.length; i++){
        state.listcomment.push(payload.listcomments[i]);
      }
      state.total = payload.count;
      return state;
    },
  },
});
export const { clearStatecmt, createCmt } = commentSlice.actions;
export default commentSlice.reducer;
