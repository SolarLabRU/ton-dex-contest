import React from 'react';

interface IProps {
  token: string;
  size?: number;
  className?: string;
}

const Coin: React.FC<IProps> = ({ token, size = 20, className = '' }) => {
  return (
    <img
      className={className}
      style={{ width: size, height: size }}
      src={`/Cryptocurrency_Icons/${token.toLocaleUpperCase()}.png`}
      alt=""
    />
  );
};

export default Coin;
