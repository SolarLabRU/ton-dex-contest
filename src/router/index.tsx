import { ReactElement, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import CreatePool from '../components/CreatePool';
import Pool from '../components/Pool';
import PoolList from '../components/PoolList';
import Swap from '../components/Swap';
import Liquidity from '../components/LiquidityList';
import LiquidityAdd from '../components/LiquidityAdd';
import LiquidityRemove from '../components/LiquidityRemove';

export const ROUTES = {
  main: '/',
  swap: '/swap',
  pool: {
    create: '/create',
    get: '/pool',
    list: '/pools',
  },
  liquidity: {
    my: '/myliquidity',
    add: '/add',
    remove: '/remove',
  }
};

const Router = (): ReactElement => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<Swap />} />

      <Route path={ROUTES.swap} element={<Swap />} />
      <Route path={`${ROUTES.swap}/:tokens`} element={<Swap />} />

      <Route path={ROUTES.pool.create} element={<CreatePool />} />

      <Route path={ROUTES.pool.list} element={<PoolList />} />

      <Route path={`${ROUTES.pool.get}/:id`} element={<Pool />} />

      <Route path={ROUTES.liquidity.my} element={<Liquidity />} />

      <Route path={ROUTES.liquidity.add} element={<LiquidityAdd />} />
      <Route path={`${ROUTES.liquidity.add}/:tokens`} element={<LiquidityAdd />} />

      <Route path={ROUTES.liquidity.remove} element={<LiquidityRemove />} />
      <Route path={`${ROUTES.liquidity.remove}/:tokens`} element={<LiquidityRemove />} />

      <Route path="*" element={<Swap />} />
    </Routes>
  </Suspense>
);

export default Router;
