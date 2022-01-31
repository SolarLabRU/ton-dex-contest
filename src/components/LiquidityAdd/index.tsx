import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IToken } from '../../store/tokens';
import { ReactComponent as Left } from '../../assets/Arrow_Left_MD.svg';
import { ReactComponent as Add } from '../../assets/plus.svg';
import { ReactComponent as Info } from '../../assets/Info.svg';
import TokenInput from '../TokenInput';
import { RootState } from '../../store';
import { getSwapCoefficient } from '../../store/swap';
import { connect } from '../../store/wallet';
import { addLiquidity } from '../../store/liquidity';
import Button from '../Button';
import { notification } from '../Notification';
import './index.scss';
import { useNavigate, useParams } from 'react-router-dom';

interface ISwap {
  giveToken1: IToken | null;
  giveToken2: IToken | null;
}

function LiquidityAdd() {
  const { tokens } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const availableTokens = useSelector((state: RootState) => state.tokens);
  const { swapCoefficient } = useSelector((state: RootState) => state.swap);
  const walletAddress = useSelector((state: RootState) => state.wallet);

  const [connectingWallet, setConnectingWallet] = useState<boolean>(false);
  const [addingLiquidity, setAddingLiquidity] = useState<boolean>(false);
  const [amountGiveToken1, setAmountGiveToken1] = useState<number>();
  const [amountGiveToken2, setAmountGiveToken2] = useState<number>();
  const [coefficientNotActual, setCoefficientNotActual] = useState(false);
  const [liquidity, setLiquidity] = useState<ISwap>({
    giveToken1: null,
    giveToken2: null,
  });

  useEffect(() => {
    if (tokens) {
      const [token1, token2] = tokens.split('-');
      setLiquidity({
        giveToken1: { id: token1, name: token1 },
        giveToken2: { id: token2, name: token2 },
      });
    } else if (availableTokens) {
      setLiquidity({
        giveToken1: { ...availableTokens[0] },
        giveToken2: { ...availableTokens[1] },
      });
    }
  }, [tokens, availableTokens]);

  useEffect(() => {
    if (walletAddress) {
      setConnectingWallet(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (liquidity?.giveToken1?.id && liquidity?.giveToken2?.id) {
      dispatch(getSwapCoefficient({
        giveCoin: liquidity.giveToken1.id,
        getCoin: liquidity.giveToken2.id,
      }));
    }
  }, [liquidity?.giveToken1?.id, liquidity?.giveToken2?.id, dispatch]);

  useEffect(() => {
    setCoefficientNotActual(false);
    if (amountGiveToken1 && swapCoefficient) {
      setAmountGiveToken2(amountGiveToken1 * swapCoefficient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapCoefficient]);

  if (!liquidity) {
    return null;
  }

  return (
    <div className="add-liquidity">
      <div className="title">
        <Left onClick={() => { navigate(-1); }} />
        Add liquidity
      </div>

      <div className="label">You give</div>
      <TokenInput
        token={liquidity.giveToken1}
        value={amountGiveToken1}
        onChangeValue={(value) => {
          if (value >= 0 && swapCoefficient) {
            setAmountGiveToken1(value);
          }
        }}
        onChangeToken={(give) => {
          setLiquidity((prev) => ({ ...prev, giveToken1: give }));
          setCoefficientNotActual(true);
        }}
        tokens={availableTokens.filter((current) => current.id !== liquidity.giveToken2?.id)}
      />

      <div className="change">
        <div className="divider" />
        <div className="change-button">
          <Add />
        </div>
      </div>

      <div className="label">You get</div>
      <TokenInput
        token={liquidity.giveToken2}
        value={amountGiveToken2}
        onChangeValue={(value) => {
          if (value >= 0 && swapCoefficient) {
            setAmountGiveToken2(value);
          }
        }}
        onChangeToken={(get) => {
          setLiquidity((prev) => ({ ...prev, giveToken2: get }));
          setCoefficientNotActual(true);
        }}
        tokens={availableTokens.filter((current) => current.id !== liquidity.giveToken1?.id)}
      />

      <div className="description">
        <div>Share of pool</div>
        <div>Fee tier</div>
        {/* fix: value is hardcoded, get it from API */}
        <div className="value">0.09%</div>
        {/* fix: value is hardcoded, get it from pool */}
        <div className="value">0.3%</div>
        <div>By adding liquidity you’ll earn 0,3% of all trades on this pair proportional to your share of the pool.</div>
      </div>

      <div className="info">
        {swapCoefficient && liquidity.giveToken1 && liquidity.giveToken2 && (
          <>
            <Info />
            <span className={coefficientNotActual ? 'not-actual' : 'actual'}>
              {`1 ${liquidity.giveToken1?.id.toUpperCase()} = `}
              {`${swapCoefficient.toFixed(2)} ${liquidity.giveToken2?.id.toUpperCase()}`}
            </span>
            <div className="info__split" />
            <span className={coefficientNotActual ? 'not-actual' : 'actual'}>
              {`1 ${liquidity.giveToken2?.id.toUpperCase()} = `}
              {`${(1 / swapCoefficient).toFixed(2)} ${liquidity.giveToken1?.id.toUpperCase()}`}
            </span>
          </>
        )}
      </div>

      <Button
        disabled={connectingWallet || (!!walletAddress && (!amountGiveToken1 || !amountGiveToken2))}
        loading={connectingWallet || addingLiquidity}
        onClick={() => {
          if (walletAddress && liquidity.giveToken1?.id && liquidity.giveToken2?.id && amountGiveToken1 && amountGiveToken2) {
            setAddingLiquidity(true);

            dispatch(addLiquidity({
              data: {
                liquidityToken1: liquidity.giveToken1,
                liquidityToken2: liquidity.giveToken2,
                liquidityAmountToken1: amountGiveToken1,
                liquidityAmountToken2: amountGiveToken2,
              },
              callback: () => {
                navigate(-1);
                notification('Liquidity added');
              }
            }));
          } else {
            setConnectingWallet(true);
            dispatch(connect(() => {
              notification('Wallet has been connected!');
            }));
          }
        }}
      >
        {walletAddress ? 'Add liquidity' : 'Connect Wallet'}
      </Button>
    </div>
  );
}

export default LiquidityAdd;
