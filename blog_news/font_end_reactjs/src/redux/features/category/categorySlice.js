import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "./categoryService";

export const getCategories = createAsyncThunk(
  "getcategory",
  async (thunkAPI) => {
    try {
      const data = await categoryService.getListCategory();
      return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const categorySlice = createSlice({
  name: "category",
  initialState: {
    listCategory: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  extraReducers: {
    //get list category
    [getCategories.pending]: (state) => {
      state.isLoading = true
    },
    [getCategories.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.listCategory = payload.listcategory;
      return state;
    },
    [getCategories.rejected]: (state) => {
      state.isLoading = false;
      state.isError = true;
      state.message = "lỗi truy vấn";
    },
  },
});
export default categorySlice.reducer;