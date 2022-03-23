import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

export const getuser = createAsyncThunk(
  "user/getuser",
  async (thunkAPI) => {
    try {
      const data = await userService.getuser();
        return data;
    } catch (error) {
      return error.message;
    }
  }
);
export const userSlice = createSlice({
  name: "user",
  initialState: {
    dataUser: "",
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {
    clearUserlogout: (state) => {
      state.dataUser = [];
      state.isLoading = '';
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: {
    //get user
    [getuser.pending]: (state) => {
      state.isLoading = true
    },
    [getuser.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.dataUser = payload.results;
      return state;
    },
    [getuser.rejected]: (state) => {
      state.isLoading = false;
      state.isError = true;
      state.message = "lỗi truy vấn";
    },
  },
});
export const { clearUserlogout } = userSlice.actions;
export default userSlice.reducer;