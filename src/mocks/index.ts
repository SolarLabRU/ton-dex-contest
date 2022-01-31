import { IPool, ITransaction, operation } from '../store/pool';
import { IToken, ITokenPair } from '../store/tokens';
import { IAddLiquidity, ILiquidity } from '../store/liquidity';

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomTokenPair(items: IToken[]): IToken[] {
  const index = Math.floor(Math.random() * items.length);
  return [items[index], items[index + 1] || items[index - 1]];
}

// ============================================================ //
// THESE ARE THE MOCKS WHICH ARE USED INSTEAD OF REAL API CALLS //
// ============================================================ //

const tokens: IToken[] = [
  { id: 'btc', name: 'Bitcoin' },
  { id: 'eth', name: 'Etherium' },
  { id: 'etc', name: 'Etherium classic' },
  { id: 'dot', name: 'Polkadot' },
  { id: 'ada', name: 'Cardano' },
  { id: 'usdt', name: 'USDT', },
  { id: 'usdc', name: 'USDC', },
];

// tokens
export function mockAPIgetTokensList() {
  return new Promise((resolve: (value: IToken[]) => void, reject) => {
    setTimeout(() => {
      resolve(tokens);
    }, 200);
  });
};

// wallet
export function mockAPIconnectWallet() {
  return new Promise((resolve: (value: string) => void, reject) => {
    setTimeout(() => {
      resolve(`0xa${Math.random()}`.replace('.', ''));
    }, 2000);
  });
};

// pools
export function mockAPIgetPools() {
  let pools: IPool[] = [];

  for (let i = 0; i < 45; i++) {
    const [token1, token2] = randomTokenPair(tokens);
    pools.push({
      id: `${i}`,
      token1,
      token2,
      liquidity: Math.random() * 1000,
      volume: Math.random() * 100,
      apy: Math.random() * 10,
      earn: Math.random().toFixed(2),
    });
  }

  pools.sort((a, b) => b.liquidity - a.liquidity);

  return new Promise((resolve: (pools: IPool[]) => void, reject) => {
    setTimeout(() => {
      resolve(pools);
    }, 1000);
  });
};

export function mockAPIgetPoolData(poolId: string) {
  let transactions: ITransaction[] = [];
  for (let i = 0; i < 25; i++) {
    transactions.push({
      id: `${Math.random()}`.replace('.', ''),
      account: `0x${Math.random()}`.replace('.', ''),
      operation: randomItem([operation.ADD, operation.REMOVE, operation.SWAP]),
      token1Amount: Math.random(),
      token2Amount: Math.random(),
      total: Math.random() * 100,
      timestamp: Date.now() - 100000000 * i,
    });
  }

  const [token1, token2] = randomTokenPair(tokens);
  const pool: IPool = {
    id: `${poolId}`,
    token1,
    token2,
    liquidity: Math.random() * 1000,
    volume: Math.random() * 100,
    apy: Math.random() * 10,
    earn: Math.random().toFixed(2),
    transactions: transactions.sort((a, b) => b.timestamp - a.timestamp),
  }

  return new Promise((resolve: (pool: IPool) => void, reject) => {
    setTimeout(() => {
      resolve(pool);
    }, 1000);
  });
};

// swap
export function mockAPIgetSwapCoefficient() {
  return new Promise((resolve: (value: number) => void, reject) => {
    setTimeout(() => {
      resolve(Math.random() + 0.01);
    }, 1000);
  });
};

// liquidity
export function getDefaultLiquidityList() {
  let liquidityList: ILiquidity[] = [];

  for (let i = 0; i < 3; i++) {
    const [token1, token2] = randomTokenPair(tokens);
    liquidityList.push({
      id: `${i}`,
      token1: token1,
      token2: token2,
      liquidityAmountToken1: Math.random() * 1000,
      liquidityAmountToken2: Math.random() * 1000,
      poolTokens: Math.random(),
      poolShare: Math.random(),
      earn: Math.random(),
    });
  }

  return liquidityList;

  // return new Promise((resolve: (value: ILiquidity[]) => void, reject) => {
  //   setTimeout(() => {
  //     resolve(liquidityList);
  //   }, 1000);
  // });
};

export function mockAPIgetMyLiquidity() {
  let liquidityList: ILiquidity[] = [];

  for (let i = 0; i < 3; i++) {
    const [token1, token2] = randomTokenPair(tokens);
    liquidityList.push({
      id: `${i}`,
      token1: token1,
      token2: token2,
      liquidityAmountToken1: Math.random() * 1000,
      liquidityAmountToken2: Math.random() * 1000,
      poolTokens: Math.random(),
      poolShare: Math.random(),
      earn: Math.random(),
    });
  }

  return new Promise((resolve: (value: ILiquidity[]) => void, reject) => {
    setTimeout(() => {
      resolve(liquidityList);
    }, 1000);
  });
};

export function mockAPIAddLiquidity(data: IAddLiquidity) {
  return new Promise((resolve: (data: ILiquidity) => void, reject) => {
    setTimeout(() => {
      resolve({
        token1: data.liquidityToken1,
        token2: data.liquidityToken2,
        liquidityAmountToken1: data.liquidityAmountToken1,
        liquidityAmountToken2: data.liquidityAmountToken2,
        id: `${Math.random()}`,
        earn: Math.random(),
        poolShare: Math.random(),
        poolTokens: Math.random(),
      });
    }, 1000);
  });
};

export function mockAPIgetLiquidityData(tokens: ITokenPair) {
  const liquidity: ILiquidity = {
    id: `${Math.random()}`,
    token1: tokens.token1,
    token2: tokens.token2,
    liquidityAmountToken1: Math.random() * 1000,
    liquidityAmountToken2: Math.random() * 1000,
    poolTokens: Math.random(),
    poolShare: Math.random(),
    earn: Math.random(),
  };

  return new Promise((resolve: (value: ILiquidity) => void, reject) => {
    setTimeout(() => {
      resolve(liquidity);
    }, 1000);
  });
}
