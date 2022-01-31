import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { ReactComponent as Check } from '../../assets/Check.svg';
import { ReactComponent as Close } from '../../assets/close-small.svg';
import './index.scss';

interface IProps {
  text: string;
  delay: number;
  success?: boolean;
}

const Notification: React.FC<IProps> = ({ text, delay, success = true }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 300);
  }, [setIsVisible]);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setIsVisible(false);
      }, delay);
    }
  }, [isVisible, delay]);


  return (
    <div className={isVisible ? 'notification' : 'notification--hidden'}>
      {success
        ? (
          <div className="icon">
            <Check />
          </div>
        )
        : null
      }

      <div className="message">
        {text}
      </div>

      <div className="close">
        <Close onClick={() => { setIsVisible(false); }} />
      </div>
    </div>
  )
};

export default Notification;

export function notification(text: string, delay: number = 4000) {
  const container = document.getElementById('notification');
  if (container) {
    ReactDOM.render(<Notification text={text} delay={delay - 1000} />, container, () => {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(container);
      }, delay);
    });
  }
}
