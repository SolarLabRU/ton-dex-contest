import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../router';
import logo from '../../assets/logo.svg';
import Tabs from '../Tabs';
import './index.scss';

function Header() {
  const location = useLocation();

  const [activeTabIndex, setActiveTabIndex] = useState(1);

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
    </div>
  );
}

export default Header;
