import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IToken } from '../../store/tokens';
import { ReactComponent as Arrows } from '../../assets/Arrows_Reload_01.svg';
import { ReactComponent as Info } from '../../assets/Info.svg';
import TokenInput from '../TokenInput';
import { RootState } from '../../store';
import { getSwapCoefficient } from '../../store/swap';
import { connect } from '../../store/wallet';
import Button from '../Button';
import { notification } from '../Notification';
import './index.scss';

interface ISwap {
  give: IToken | null;
  get: IToken | null;
}

function Swap() {
  const { tokens } = useParams();
  const dispatch = useDispatch();
  const availableTokens = useSelector((state: RootState) => state.tokens);
  const { swapCoefficient } = useSelector((state: RootState) => state.swap);
  const walletAddress = useSelector((state: RootState) => state.wallet);

  const [connectingWallet, setConnectingWallet] = useState<boolean>(false);
  const [amountGive, setAmountGive] = useState<number>();
  const [amountGet, setAmountGet] = useState<number>();
  const [coefficientNotActual, setCoefficientNotActual] = useState(false);

  const [swap, setSwap] = useState<ISwap>({
    give: null,
    get: null,
  });

  useEffect(() => {
    if (tokens) {
      const [token1, token2] = tokens.split('-');
      setSwap({
        give: { id: token1, name: token1 },
        get: { id: token2, name: token2 },
      });
    } else if (availableTokens) {
      setSwap({
        give: { ...availableTokens[0] },
        get: { ...availableTokens[1] },
      });
    }
  }, [tokens, availableTokens]);

  useEffect(() => {
    if (swap?.give?.id && swap?.get?.id) {
      dispatch(getSwapCoefficient({
        giveCoin: swap.give.id,
        getCoin: swap.get.id,
      }));
    }
  }, [swap?.give?.id, swap?.get?.id, dispatch]);

  useEffect(() => {
    if (walletAddress) {
      setConnectingWallet(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    setCoefficientNotActual(false);
    if (amountGive && swapCoefficient) {
      setAmountGet(amountGive * swapCoefficient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapCoefficient]);

  if (!swap) {
    return null;
  }

  return (
    <div className="swap">
      <div className="title">Swap</div>

      <div className="label">You give</div>
      <TokenInput
        token={swap.give}
        value={amountGive}
        onChangeValue={(value) => {
          if (value >= 0 && swapCoefficient) {
            setAmountGive(value);
            setAmountGet(value * swapCoefficient);
          }
        }}
        onChangeToken={(give) => {
          setSwap((prev) => ({ ...prev, give }));
          setCoefficientNotActual(true);
        }}
        tokens={availableTokens.filter((current) => current.id !== swap.get?.id)}
      />

      <div className="change">
        <div className="divider" />
        <div className="change-button" onClick={() => {
          setCoefficientNotActual(true);
          setSwap({ give: swap.get, get: swap.give });
        }}>
          <Arrows />
        </div>
      </div>

      <div className="label">You get</div>
      <TokenInput
        className={coefficientNotActual ? 'value-not-actual' : ''}
        token={swap.get}
        value={amountGet}
        onChangeValue={(value) => {
          if (value >= 0 && swapCoefficient) {
            setAmountGive(value / swapCoefficient);
            setAmountGet(value);
          }
        }}
        onChangeToken={(get) => {
          setSwap((prev) => ({ ...prev, get }));
          setCoefficientNotActual(true);
        }}
        tokens={availableTokens.filter((current) => current.id !== swap.give?.id)}
      />

      <div className="info">
        {swapCoefficient && swap.give && swap.get && (
          <>
            <Info />
            <span className={coefficientNotActual ? 'not-actual' : 'actual'}>
              {`1 ${swap.give?.id.toUpperCase()} = `}
              {`${swapCoefficient.toFixed(8)} ${swap.get?.id.toUpperCase()}`}
            </span>
          </>
        )}
      </div>

      <Button
        disabled={connectingWallet || (!!walletAddress && (!amountGive || !amountGet))}
        loading={connectingWallet}
        onClick={() => {
          if (walletAddress) {
            console.log('call swap request');
          } else {
            setConnectingWallet(true);
            dispatch(connect(() => {
              notification('Wallet has been connected!');
            }));
          }
        }}
      >
        {walletAddress ? 'Swap' : 'Connect Wallet'}
      </Button>
    </div>
  );
}

export default Swap;