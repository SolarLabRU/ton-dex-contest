import { configureStore } from '@reduxjs/toolkit';
import { tokensReducer } from './tokens';
import { swapReducer } from './swap';
import { walletReducer } from './wallet';
import { poolReducer } from './pool';
import { liquidityReducer } from './liquidity';

const store = configureStore({
  reducer: {
    tokens: tokensReducer,
    swap: swapReducer,
    wallet: walletReducer,
    pool: poolReducer,
    liquidity: liquidityReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
