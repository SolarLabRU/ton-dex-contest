import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockAPIconnectWallet } from '../mocks';

// fetch from API
export const connect = createAsyncThunk('connectWallet', async (callback: () => void) => {
  const address = await mockAPIconnectWallet();
  if (callback) {
    callback();
  }
  return address;
});

const defaultState: string = '';

const wallet = createSlice({
  name: 'coins',
  initialState: defaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(connect.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const walletReducer = wallet.reducer;
