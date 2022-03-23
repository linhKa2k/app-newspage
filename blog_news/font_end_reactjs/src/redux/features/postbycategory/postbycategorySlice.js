import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getpostbycategoryService from "./postbycategoryService";

export const getpostbycategory = createAsyncThunk(
  "getpostbycategory",
  async ( {idcategory , page},thunkAPI) => {
    try {
      const data = await getpostbycategoryService.getpostbycategory(idcategory , page);
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const postbycategorySlice = createSlice({
  name: "getpostbycategory",
  initialState: {
    listpostbycategory: [],
    total: '',
    isLoading: false,
  }, 
  reducers: {
    clearStatepostbycategory: (state) => {
      state.listpostbycategory = [];
      state.total = "";
      state.isLoading = false;
    },
  },
  extraReducers: {

    [getpostbycategory.pending]: (state) => {
      state.isLoading = true
    },
    [getpostbycategory.fulfilled]: (state, { payload }) => {
      state.isLoading = false
      for (var i = 0; i < payload.datapost.length; i++){
        state.listpostbycategory.push(payload.datapost[i]);
      }
      state.total = payload.total
      return state;
    },
  },
});
export const { clearStatepostbycategory } = postbycategorySlice.actions;
export default postbycategorySlice.reducer;