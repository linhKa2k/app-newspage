import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import homeService from "./homeService";

export const getListPostByCategory = createAsyncThunk(
  "getListPostByCategory",
  async (thunkAPI) => {
    try {
      const data = await homeService.getPostByCategory();
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const PostsByCategorySlice = createSlice({
  name: "PostsByCategory",
  initialState: {
    data: [],
    isLoading: false,
  },
  extraReducers: {
    [getListPostByCategory.pending]: (state) => {
      state.isLoading = true;
    },
    [getListPostByCategory.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.data = payload.listpostsbycategory;
      return state;
    },
  },
});
export default PostsByCategorySlice.reducer;