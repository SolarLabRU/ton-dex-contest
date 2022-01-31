import React, { ReactElement, useEffect, useState } from 'react';
import { IPool } from '../../store/pool';
import Button from '../Button';
import Coin from '../Coin';
import List from '../List';
import { ReactComponent as ArrowDown } from '../../assets/Arrow_Down_SM.svg';
import { ReactComponent as Left } from '../../assets/Arrow_Left_MD.svg';
import { ReactComponent as Plus } from '../../assets/plus.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { mockAPIgetPoolData } from '../../mocks';
import Loader from '../Loader';
import { ROUTES } from '../../router';
import './index.scss';

enum tabs {
  all = 'All',
  swap = 'Swap',
  add = 'Add',
  remove = 'Remove',
}

const Pool: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poolData, setPoolData] = useState<IPool>();
  const [sortIsDESC, setSortIsDESC] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs.all);

  useEffect(() => {
    if (id) {
      mockAPIgetPoolData(id).then((data) => {
        setPoolData(data);
      });
    }
  }, [id]);

  useEffect(() => {
    if (sortIsDESC) {
      poolData?.transactions?.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      poolData?.transactions?.sort((a, b) => a.timestamp - b.timestamp);
    }
    setPoolData(poolData);
  }, [sortIsDESC, poolData]);


  if (!poolData) {
    return (
      <div className="pool">
        <div className="pool__loading">
          <Loader />
        </div>
      </div>
    );
  }

  const transactionsToDisplay: ReactElement[] = poolData.transactions ? poolData.transactions
    .filter((transaction) => activeTab === tabs.all || `${transaction.operation}` === `${activeTab}`)
    .map((transaction) => (
      <div key={transaction.id} className="transactions__list__item">
        <div className="operation">{transaction.operation} BTC add USDT</div>
        <div>
          ${transaction.total.toFixed(2)}k
        </div>
        <div>
          {transaction.token1Amount.toFixed(2)} {poolData.token1.id.toUpperCase()}
        </div>
        <div>
          {transaction.token2Amount.toFixed(2)} {poolData.token2.id.toUpperCase()}
        </div>
        <div className="account">{transaction.account.substr(0, 6)}...{transaction.account.substr(-2)}</div>
        <div>{Math.ceil((Date.now() - transaction.timestamp) / (1000 * 60 * 60 * 24))} days ago</div>
      </div>
    ))
    : [<div className="no-data">No transactions</div>];

  return (
    <div className="pool">
      <div className="pool__data">
        <Left className="back" onClick={() => { navigate(-1); }} />

        <div className="pool__data__details">
          <div className="controls">
            <Button onClick={() => { navigate(`${ROUTES.liquidity.add}/${poolData.token1.id}-${poolData.token2.id}`); }}>
              <Plus />
              Add liquidity
            </Button>
            <Button onClick={() => { navigate(`${ROUTES.swap}/${poolData.token1.id}-${poolData.token2.id}`); }}>
              Swap
            </Button>
          </div>

          <span>
            <Coin token={poolData.token1.id} size={24} />
            <Coin token={poolData.token2.id} size={24} />
            <span className="tokens">
              {poolData.token1.id.toUpperCase()}/{poolData.token2.id.toUpperCase()}
            </span>
            <span className="earn">0.3%</span>
          </span>

          <span className="row2">
            <span className="earn">
              <Coin token={poolData.token1.id} size={16} />
              1 {poolData.token1.id.toUpperCase()} = 0.000 {poolData.token2.id.toUpperCase()}
            </span>

            <span className="earn">
              <Coin token={poolData.token2.id} size={16} />
              1 {poolData.token2.id.toUpperCase()} = 0.000 {poolData.token1.id.toUpperCase()}
            </span>
          </span>

          <div className="grid">
            <span>Liquidity</span>
            <span>Volume 24h</span>
            <span>APY</span>
            <span>${poolData.liquidity.toFixed(2)}m</span>
            <span>${poolData.volume.toFixed(2)}k</span>
            <span>{poolData.apy.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="transactions">
        <div className="title">Transactions</div>

        <div className="tabs">
          <div
            className={activeTab === tabs.all ? 'tab active' : 'tab'}
            onClick={() => { setActiveTab(tabs.all); }}
          >
            {tabs.all}
          </div>
          <div
            className={activeTab === tabs.swap ? 'tab active' : 'tab'}
            onClick={() => { setActiveTab(tabs.swap); }}
          >
            {tabs.swap}s
          </div>
          <div
            className={activeTab === tabs.add ? 'tab active' : 'tab'}
            onClick={() => { setActiveTab(tabs.add); }}
          >
            {tabs.add}s
          </div>
          <div
            className={activeTab === tabs.remove ? 'tab active' : 'tab'}
            onClick={() => { setActiveTab(tabs.remove); }}
          >
            {tabs.remove}s
          </div>
        </div>

        <List firstChildIsHeader className="transactions__list">
          {[
            (<div className="transactions__list__header" key="header">
              <div>Operation</div>
              <div>Total value</div>
              <div>Token amount</div>
              <div>Token amount</div>
              <div>Account</div>
              <div
                className="time"
                onClick={() => {
                  setSortIsDESC(!sortIsDESC);
                }}
              >
                Time
                <ArrowDown className={`time-sort ${sortIsDESC ? 'desc' : 'asc'}`} />
              </div>
            </div>),

            ...transactionsToDisplay,
          ]}
        </List>
      </div>
    </div>
  );
}

export default Pool;
