import { createSlice } from "@reduxjs/toolkit";



export const socketSlice = createSlice({
  name: "socket",
  initialState: {
    
  },
  reducers: {
    websocket:(state, action) =>{
        return action.payload;
      }
  },
  extraReducers: {
  },
});
export const { websocket } = socketSlice.actions;
export default socketSlice.reducer;