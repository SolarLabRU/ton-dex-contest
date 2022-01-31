import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ILiquidity } from '../../store/liquidity';
import Coin from '../Coin';
import Button from '../Button';
import LiquidityDetails from '../LiquidityDetails';
import { ReactComponent as Down } from '../../assets/Chevron_Down.svg';
import { ReactComponent as Add } from '../../assets/plus.svg';
import { ReactComponent as Minus } from '../../assets/minus.svg';
import { ROUTES } from '../../router';
import './index.scss';

const Liquidity: React.FC<{ data: ILiquidity }> = ({ data }) => {
  const { token1, token2, liquidityAmountToken1, liquidityAmountToken2, earn, poolShare, poolTokens } = data;

  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="liquidity">
      <div className="liquidity-coins">
        <Coin token={token1.id} />
        <Coin token={token2.id} />
        {token1.id.toLocaleUpperCase()}/{token2.id.toLocaleUpperCase()}
      </div>

      <div>
        <div className="liquidity-earn">{earn.toFixed(2)}%</div>
      </div>

      <div
        className={`liquidity-manage ${expanded ? 'expanded' : ''}`.trim()}
        onClick={() => { setExpanded(!expanded); }}
      >
        Manage
        <Down />
      </div>

      <div className={`liquidity__details${expanded ? '--expanded' : ''}`}>
        <LiquidityDetails
          token1={token1}
          token2={token2}
          liquidityAmountToken1={liquidityAmountToken1}
          liquidityAmountToken2={liquidityAmountToken2}
          poolShare={poolShare}
          poolTokens={poolTokens}
        />

        <div className="liquidity-controls">
          <Button className="add" onClick={() => { navigate(`${ROUTES.liquidity.add}/${token1.id}-${token2.id}`); }}>
            <Add />
            Add liquidity
          </Button>

          <Button className="remove" onClick={() => { navigate(`${ROUTES.liquidity.remove}/${token1.id}-${token2.id}`); }} primary={false}>
            <Minus />
            Remove liquidity
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Liquidity;
