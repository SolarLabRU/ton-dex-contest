import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDefaultLiquidityList, mockAPIAddLiquidity, mockAPIgetLiquidityData, mockAPIgetMyLiquidity } from '../mocks';
import { IToken, ITokenPair } from './tokens';

export interface ILiquidity {
  id: string;
  token1: IToken;
  token2: IToken;
  earn: number;
  liquidityAmountToken1: number;
  liquidityAmountToken2: number;
  poolTokens: number;
  poolShare: number;
}

export interface IAddLiquidity {
  liquidityToken1: IToken;
  liquidityToken2: IToken;
  liquidityAmountToken1: number;
  liquidityAmountToken2: number;
}

// API calls
export const getLiquidityList = createAsyncThunk('getLiquidityList', async () => {
  return await mockAPIgetMyLiquidity();
});
export const getLiquidityData = createAsyncThunk('getLiquidityData', async (tokens: ITokenPair) => {
  return await mockAPIgetLiquidityData(tokens);
});

export const addLiquidity = createAsyncThunk('addLiquidity', async ({ data, callback }: { data: IAddLiquidity, callback: () => void }) => {
  return await mockAPIAddLiquidity(data).then((response) => {
    callback();
    return response;
  });
});

const defaultState: ILiquidity[] = getDefaultLiquidityList();

const liquidity = createSlice({
  name: 'liquidity',
  initialState: defaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLiquidityList.fulfilled, (state, action) => {
      // return action.payload;
      // this is mock (action.payload must be returned)
      return state;
    });
    builder.addCase(addLiquidity.fulfilled, (state, action) => {
      // this is mock (only getLiquidityList should be able to set a state)
      state.push(action.payload);
    });
  },
});

export const liquidityReducer = liquidity.reducer;
