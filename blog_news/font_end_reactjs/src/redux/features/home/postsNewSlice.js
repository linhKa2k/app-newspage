import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import homeService from "./homeService";

export const getListPostNewAndViews = createAsyncThunk(
  "getListPostNewAndViews",
  async (thunkAPI) => {
    try {
      const data = await homeService.getPostNew();
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const PostsNewSlice = createSlice({
  name: "getListPostNewAndViews",
  initialState: {
    datapostnew: [],
    datapostviews: [],
    isLoading: false,
  },
  extraReducers: {
    [getListPostNewAndViews.pending]: (state) => {
      state.isLoading = true;
    },
    [getListPostNewAndViews.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.datapostnew = payload.postnew;
      state.datapostviews = payload.postviews;
      return state;
    },
  },
});
export default PostsNewSlice.reducer;