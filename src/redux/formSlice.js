import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  employeeData: {},
  driverLicense: [],
  family: [],
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    
  },
});


export default formSlice.reducer;