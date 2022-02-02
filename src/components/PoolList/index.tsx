import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getPools, sortType, sort } from '../../store/pool';
import Button from '../Button';
import Coin from '../Coin';
import List from '../List';
import { ReactComponent as ArrowDown } from '../../assets/Arrow_Down_SM.svg';
import { ReactComponent as Add } from '../../assets/plus.svg';
import { ROUTES } from '../../router';
import { Link, useNavigate } from 'react-router-dom';
import './index.scss';

function PoolList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pools = useSelector((state: RootState) => state.pool);

  const [liquiditySortIsDESC, setLiquiditySortIsDESC] = useState(true);

  useEffect(() => {
    dispatch(getPools());
  }, [dispatch]);

  useEffect(() => {
    dispatch(sort(liquiditySortIsDESC ? sortType.DESC : sortType.ASC));
  }, [dispatch, liquiditySortIsDESC]);

  return (
    <div className="pool-list">
      <div className="title">
        <div className="title-text">Pools</div>
        <Button
          className="create-pool"
          onClick={() => {
            navigate(ROUTES.liquidity.add);
          }}
        >
          <Add />
          Create a pool
        </Button>
      </div>

      <List firstChildIsHeader>
        {[
          (<div className="pool-list__header" key="header">
            <div>#</div>
            <div>Pool</div>
            <div
              className="liquidity"
              onClick={() => {
                setLiquiditySortIsDESC(!liquiditySortIsDESC);
              }}
            >
              Liquidity
              <ArrowDown className={`liquidity-sort ${liquiditySortIsDESC ? 'desc' : 'asc'}`} />
            </div>
            <div>Volume 24h</div>
            <div>APY</div>
          </div>),

          ...pools.map((currentPool, index) => (
            <Link
              key={currentPool.id}
              className="pool-list__item"
              to={`${ROUTES.pool.get}/${currentPool.id}`}
            >
              <div className="pool-list__item__number">{index + 1}</div>
              <div>
                <Coin token={currentPool.token1.id} size={20} className="coin" />
                <Coin token={currentPool.token2.id} size={20} className="coin" />
                <span>
                  {currentPool.token1.id.toUpperCase()}/{currentPool.token2.id.toUpperCase()}
                </span>
                <div className="pool-list__item__earn">{currentPool.earn}%</div>
              </div>
              <div>
                <span className="pool-list__item__number">$</span>
                {currentPool.liquidity.toFixed(2)}m
              </div>
              <div>
                <span className="pool-list__item__number">$</span>
                {currentPool.volume.toFixed(2)}k
              </div>
              <div>{currentPool.apy.toFixed(2)}%</div>
            </Link>
          ))
        ]}
      </List>
    </div>
  );
}

export default PoolList;
