import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockAPIgetSwapCoefficient } from '../mocks';

// fetch from API
export const getSwapCoefficient = createAsyncThunk('getSwapCoefficient', async (payload: { giveCoin: string, getCoin: string }) => {
  return await mockAPIgetSwapCoefficient();
});

const defaultState: { swapCoefficient: number | null } = { swapCoefficient: null };

const swap = createSlice({
  name: 'swap',
  initialState: defaultState,
  reducers: {
    resetCoefficient: (state) => {
      state.swapCoefficient = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSwapCoefficient.fulfilled, (state, action) => {
      return { swapCoefficient: action.payload };
    });
  },
});

export const swapReducer = swap.reducer;
export const { resetCoefficient } = swap.actions;
