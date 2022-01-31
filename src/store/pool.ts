import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockAPIgetPools } from '../mocks';
import { IToken } from './tokens';

export enum operation {
  ADD = 'Add',
  REMOVE = 'Remove',
  SWAP = 'Swap',
}
export interface ITransaction {
  id: string;
  operation: operation;
  total: number;
  token1Amount: number;
  token2Amount: number;
  account: string;
  timestamp: number;
}

export interface IPool {
  id: string;
  token1: IToken;
  token2: IToken;
  liquidity: number;
  volume: number;
  apy: number;
  earn: string;
  transactions?: ITransaction[];
}

export enum sortType {
  ASC = 'asc',
  DESC = 'desc',
}

// fetch from API
export const getPools = createAsyncThunk('getPools', async () => {
  return await mockAPIgetPools();
});

const defaultState: IPool[] = [];

const pool = createSlice({
  name: 'pool',
  initialState: defaultState,
  reducers: {
    sort: (state, action) => {
      if (action.payload === sortType.DESC) {
        state.sort((a, b) => b.liquidity - a.liquidity);
      } else {
        state.sort((a, b) => a.liquidity - b.liquidity);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPools.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const poolReducer = pool.reducer;
export const { sort } = pool.actions;

