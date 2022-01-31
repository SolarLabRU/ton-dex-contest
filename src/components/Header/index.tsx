import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../../router';
import logo from '../../assets/logo.svg';
import { ReactComponent as Wallet } from '../../assets/wallet.svg';
import Tabs from '../Tabs';
import Button from '../Button';
import { RootState } from '../../store';
import { notification } from '../Notification';
import { connect } from '../../store/wallet';
import './index.scss';

function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const walletAddress = useSelector((state: RootState) => state.wallet);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [connectingWallet, setConnectingWallet] = useState<boolean>(false);

  useEffect(() => {
    if (walletAddress) {
      setConnectingWallet(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (location.pathname.includes(ROUTES.swap) || location.pathname === ROUTES.main) {
      setActiveTabIndex(0);
    }
    if (location.pathname === ROUTES.pool.list
      || location.pathname === ROUTES.pool.create
      || location.pathname.includes(ROUTES.pool.get)
    ) {
      setActiveTabIndex(1);
    }
    if (location.pathname === ROUTES.liquidity.my
      || location.pathname.includes(ROUTES.liquidity.add)
      || location.pathname.includes(ROUTES.liquidity.remove)
    ) {
      setActiveTabIndex(2);
    }
  }, [location.pathname, setActiveTabIndex]);

  return (
    <div className="header-menu">
      <div className="logo">
        <img src={logo} className="app-logo" alt="logo" />
        TON
      </div>

      <Tabs activeTabIndex={activeTabIndex}>
        {[
          (<Link
            className={activeTabIndex === 0 ? 'link-active' : 'link'}
            to={ROUTES.swap}
            key={ROUTES.swap}
          >
            Swap
          </Link>),

          (<Link
            className={activeTabIndex === 1 ? 'link-active' : 'link'}
            to={ROUTES.pool.list}
            key={ROUTES.pool.list}
          >
            Pools
          </Link>),

          (<Link
            className={activeTabIndex === 2 ? 'link-active' : 'link'}
            to={ROUTES.liquidity.my}
            key={ROUTES.liquidity.my}
          >
            Your liquidity
          </Link>),
        ]}
      </Tabs>

      <div className="wallet">
        {walletAddress
          ? (
            <>
              <Wallet />
              {walletAddress.substr(0, 5)}...{walletAddress.substr(-1)}
            </>
          )
          : (
            <Button
              className="connect"
              loading={connectingWallet}
              onClick={() => {
                setConnectingWallet(true);
                dispatch(connect(() => {
                  notification('Wallet has been connected!');
                }));
              }}
            >
              Connect wallet
            </Button>
          )
        }
      </div>
    </div>
  );
}

export default Header;
