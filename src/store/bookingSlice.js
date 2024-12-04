import { createSlice } from '@reduxjs/toolkit';
import { initialBookingData } from '../constants/bookingIndex';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookingData: initialBookingData,
    bookingInfo: null,
    totalPrice: 0,
    step: 1,
    usageUnit: null
  },
  reducers: {
    saveBookingData: (state, action) => {
      state.bookingData = action.payload.bookingData;
      state.bookingInfo = action.payload.bookingInfo;
      state.totalPrice = action.payload.totalPrice;
      state.usageUnit = action.payload.usageUnit;
    },
    updateBookingData: (state, action) => {
      state.bookingData = {
        ...state.bookingData,
        [action.payload.name]: action.payload.value
      };
    },
    setBookingInfo: (state, action) => {
      state.bookingInfo = action.payload;
      state.usageUnit = action.payload.usageUnit;
    },
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    resetBooking: (state) => {
      state.bookingData = initialBookingData;
      state.bookingInfo = null;
      state.totalPrice = 0;
      state.step = 1;
      state.usageUnit = null;
    }
  }
});

export const { 
  saveBookingData, 
  updateBookingData, 
  setBookingInfo,
  setTotalPrice, 
  setStep, 
  resetBooking 
} = bookingSlice.actions;

export default bookingSlice.reducer;