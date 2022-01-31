import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getLiquidityList } from '../../store/liquidity';
import Button from '../Button';
import List from '../List';
import Liquidity from '../Liquidity';
import { ReactComponent as Add } from '../../assets/plus.svg';
import './index.scss';
import { ROUTES } from '../../router';
import { useNavigate } from 'react-router-dom';


function LiquidityList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const liquidityList = useSelector((state: RootState) => state.liquidity);

  useEffect(() => {
    dispatch(getLiquidityList());
  }, [dispatch]);

  return (
    <div className="my-liquidity">
      <div className="top">
        <div>
          <div className="title">Your liquidity</div>
          <div className="description">By adding liquidity you’ll earn 0,3% of all trades on this pair proportional to your share of the pool.</div>
        </div>

        <Button
          className="add-liquidity-button"
          onClick={() => {
            navigate(ROUTES.liquidity.add);
          }}
        >
          <Add />
          Add liquidity
        </Button>
      </div>

      <List className="my-liquidity__list">
        {liquidityList.map((liquidity) => (
          <Liquidity key={liquidity.id} data={liquidity} />
        ))}
      </List>
    </div>
  );
}

export default LiquidityList;
