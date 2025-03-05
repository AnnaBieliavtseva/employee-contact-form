import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  employeeData: {},
  driverLicense: [],
  family: [],
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    nextStep: state => {
      state.step += 1;
    },
       setEmployeeData: (state, action) => {
      state.employeeData = action.payload;
    },
    setDriverLicense: (state, action) => {
      state.driverLicense = action.payload;
    },
    setFamily: (state, action) => {
      state.family = action.payload;
    },
    submitForm: state => {
      console.log('Зібрані дані:', {
        employeeData: current(state.employeeData),
        driverLicense: current(state.driverLicense),
        family: current(state.family),
      });
    },
  },
});

export const {nextStep, prevStep, setEmployeeData, setDriverLicense, setFamily, submitForm} = formSlice.actions


export default formSlice.reducer;