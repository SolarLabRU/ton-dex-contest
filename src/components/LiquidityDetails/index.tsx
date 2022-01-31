import React from 'react';
import Coin from '../Coin';
import { IToken } from '../../store/tokens';
import './index.scss';

interface IProps {
  token1: IToken;
  token2: IToken;
  liquidityAmountToken1: number;
  liquidityAmountToken2: number;
  poolShare: number;
  poolTokens: number;
}

const Liquidity: React.FC<IProps> = ({ token1, token2, liquidityAmountToken1, liquidityAmountToken2, poolShare, poolTokens }) => (
  <div className="liquidity-details">
    <div>Your position</div>

    <div>
      <span>Pooled {token1.id.toUpperCase()}</span>
      <span className="coin">
        <Coin token={token1.id} />
        {liquidityAmountToken1.toFixed(6)}
      </span>
    </div>

    <div>
      <span>Pooled {token2.id.toUpperCase()}</span>
      <span className="coin">
        <Coin token={token2.id} />
        {liquidityAmountToken2.toFixed(6)}
      </span>
    </div>

    <div>
      <span>Your pool tokens</span>
      <span>{poolTokens.toFixed(6)}</span>
    </div>

    <div>
      <span>Your pool share</span>
      <span>{poolShare.toFixed(4)}%</span>
    </div>
  </div>
);

export default Liquidity;
