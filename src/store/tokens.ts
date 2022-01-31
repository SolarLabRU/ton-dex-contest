import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockAPIgetTokensList } from '../mocks';

export interface IToken {
  id: string;
  name: string;
}

export interface ITokenPair {
  token1: IToken;
  token2: IToken;
}

// fetch from API
export const getTokens = createAsyncThunk('getTokens', async () => {
  return await mockAPIgetTokensList();
});

const defaultState: Array<IToken> = [];

const tokens = createSlice({
  name: 'tokens',
  initialState: defaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTokens.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const tokensReducer = tokens.reducer;
