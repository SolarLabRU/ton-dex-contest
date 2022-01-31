import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as Left } from '../../assets/Arrow_Left_MD.svg';
import { ReactComponent as Down } from '../../assets/Arrow_Down_SM.svg';
import { ReactComponent as Info } from '../../assets/Info.svg';
import LiquidityDetails from '../LiquidityDetails';
import { RootState } from '../../store';
import { getSwapCoefficient } from '../../store/swap';
import { connect } from '../../store/wallet';
import { ILiquidity } from '../../store/liquidity';
import { mockAPIgetLiquidityData } from '../../mocks';
import { ITokenPair } from '../../store/tokens';
import Button from '../Button';
import { notification } from '../Notification';
import Loader from '../Loader';
import Tabs from '../Tabs';
import Coin from '../Coin';
import { confirmation } from '../Confirm';
import { ROUTES } from '../../router';
import './index.scss';

function LiquidityRemove() {
  const { tokens } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const availableTokens = useSelector((state: RootState) => state.tokens);
  const { swapCoefficient } = useSelector((state: RootState) => state.swap);
  const walletAddress = useSelector((state: RootState) => state.wallet);

  const [percentage, setPercentage] = useState<number>(25);

  const [connectingWallet, setConnectingWallet] = useState<boolean>(false);
  const [liquidity, setLiquidity] = useState<ILiquidity>();

  useEffect(() => {
    const getDataDromAPI = (tokens: ITokenPair) => {
      mockAPIgetLiquidityData(tokens).then((response) => {
        setLiquidity(response);
      });

      dispatch(getSwapCoefficient({
        giveCoin: tokens.token1.id,
        getCoin: tokens.token2.id,
      }));
    };

    if (tokens) {
      const [token1, token2] = tokens.split('-');
      getDataDromAPI({
        token1: { id: token1, name: token1 },
        token2: { id: token2, name: token2 },
      });
    } else if (availableTokens) {
      getDataDromAPI({
        token1: { ...availableTokens[0] },
        token2: { ...availableTokens[1] },
      });
    }
  }, [tokens, availableTokens, dispatch]);

  useEffect(() => {
    if (walletAddress) {
      setConnectingWallet(false);
    }
  }, [walletAddress]);

  if (!liquidity) {
    return <Loader className="loading-liquidity" />;
  }

  return (
    <div className="remove-liquidity">
      <div className="remove-liquidity__block">
        <div className="title">
          <Left onClick={() => { navigate(-1); }} />
          Remove liquidity
        </div>

        <div className="subtitle">
          <span>Amount</span>
          <span>Detailed</span>
        </div>

        <span className="percentage">{percentage}%</span>

        <input
          className="range"
          type="range"
          id="volume"
          name="volume"
          min={0}
          max={100}
          value={percentage}
          onChange={(e) => {
            setPercentage(parseInt(e.target.value, 10));
          }}
          style={{ background: `linear-gradient(to right, #0088cc ${percentage}%, #e6eaee ${percentage}%)` }}
        />

        <Tabs className="percentage-tabs">
          <span key="25%" onClick={() => { setPercentage(25); }}>25%</span>
          <span key="50%" onClick={() => { setPercentage(50); }}>50%</span>
          <span key="75%" onClick={() => { setPercentage(75); }}>75%</span>
          <span key="max" onClick={() => { setPercentage(100); }}>Max</span>
        </Tabs>

        <div className="down">
          <Down />
        </div>

        <div className="remove-coins">
          <div>
            <Coin token={liquidity.token1.id} />
            {liquidity.token1.id.toUpperCase()}
          </div>
          <div>{(liquidity.liquidityAmountToken1 / 100 * percentage).toFixed(2)}</div>
          <div>
            <Coin token={liquidity.token2.id} />
            {liquidity.token2.id.toUpperCase()}
          </div>
          <div>{(liquidity.liquidityAmountToken2 / 100 * percentage).toFixed(2)}</div>
        </div>

        <div className="remove-info">
          {swapCoefficient && liquidity.token1 && liquidity.token2 && (
            <>
              <Info />
              <span>
                {`1 ${liquidity.token1?.id.toUpperCase()} = `}
                {`${swapCoefficient.toFixed(2)} ${liquidity.token2?.id.toUpperCase()}`}
              </span>
              <div className="info__split" />
              <span>
                {`1 ${liquidity.token2?.id.toUpperCase()} = `}
                {`${(1 / swapCoefficient).toFixed(2)} ${liquidity.token1?.id.toUpperCase()}`}
              </span>
            </>
          )}
        </div>

        <Button
          disabled={connectingWallet}
          loading={connectingWallet}
          onClick={() => {
            if (walletAddress && percentage) {
              confirmation({
                title: 'Remove liquidity',
                info: (
                  <div className="confirm-data">
                    <div>
                      <Coin token={liquidity.token1.id} />
                      {liquidity.token1.id.toUpperCase()}
                    </div>
                    <div>{(liquidity.liquidityAmountToken1 / 100 * percentage).toFixed(2)}</div>
                    <div>
                      <Coin token={liquidity.token2.id} />
                      {liquidity.token2.id.toUpperCase()}
                    </div>
                    <div>{(liquidity.liquidityAmountToken2 / 100 * percentage).toFixed(2)}</div>
                  </div>
                ),
                footer: (
                  <div className="confirm__footer__data">
                    {swapCoefficient && liquidity.token1 && liquidity.token2 && (
                      <>
                        <Info />
                        <span>
                          {`1 ${liquidity.token1?.id.toUpperCase()} = `}
                          {`${swapCoefficient.toFixed(2)} ${liquidity.token2?.id.toUpperCase()}`}
                        </span>
                        <div className="info__split" />
                        <span>
                          {`1 ${liquidity.token2?.id.toUpperCase()} = `}
                          {`${(1 / swapCoefficient).toFixed(2)} ${liquidity.token1?.id.toUpperCase()}`}
                        </span>
                      </>
                    )}
                  </div>
                ),
                onConfirm: () => {
                  // dispatch action with API request here
                  navigate(ROUTES.liquidity.my);
                  notification('Liquidity removed');
                },
              });
            } else {
              setConnectingWallet(true);
              dispatch(connect(() => {
                notification('Wallet has been connected!');
              }));
            }
          }}
        >
          {walletAddress ? 'Approve' : 'Connect Wallet'}
        </Button>
      </div>

      <div className="footer">
        <LiquidityDetails
          token1={liquidity.token1}
          token2={liquidity.token2}
          liquidityAmountToken1={liquidity.liquidityAmountToken1}
          liquidityAmountToken2={liquidity.liquidityAmountToken2}
          poolShare={liquidity.poolShare}
          poolTokens={liquidity.poolTokens}
        />
      </div>
    </div>
  );
}

export default LiquidityRemove;
