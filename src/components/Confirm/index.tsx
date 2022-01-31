import ReactDOM from 'react-dom';
import React, { ReactElement, useEffect, useState } from 'react';
import { ReactComponent as Close } from '../../assets/close-small.svg';
import Button from '../Button';
import './index.scss';

interface IProps {
  title?: string;
  info: ReactElement;
  footer?: ReactElement;
  onConfirm: () => void;
}

const Confirm: React.FC<IProps> = ({ info, footer, title = '', onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 300);
  }, [setIsVisible]);

  const close = () => {
    setIsVisible(false);
    const container = document.getElementById('confirmation');
    setTimeout(() => {
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
      }
    }, 500);
  };

  return (
    <div className={isVisible ? 'confirmation-wrapper' : 'confirmation-wrapper--hidden'}>
      <div className={isVisible ? 'confirmation' : 'confirmation hidden'}>
        {title && <div className="title">{title}</div>}

        <div className="close">
          <Close onClick={close} />
        </div>

        <div className="confirmation__info">
          {info}
        </div>

        <div className="confirmation__footer">
          {footer && <div className="confirmation__footer__data">
            {footer}
          </div>}

          <Button
            disabled={false}
            loading={false}
            onClick={() => {
              onConfirm();
              close();
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
};

export default Confirm;

export function confirmation(data: IProps) {
  const { info, footer, title, onConfirm } = data;
  const container = document.getElementById('confirmation');
  if (container) {
    ReactDOM.render(<Confirm title={title} info={info} footer={footer} onConfirm={onConfirm} />, container);
  }
}
