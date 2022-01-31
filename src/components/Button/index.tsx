import React from 'react';
import Loader from '../Loader';
import './index.scss';

interface IProps {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  primary?: boolean;
  onClick: () => void;
}

const Button: React.FC<IProps> = ({
  children,
  loading = false,
  className = '',
  disabled = false,
  primary = true,
  onClick
}) => (
  <button
    className={
      `${disabled || loading ? 'button--disabled' : 'button'} ${primary ? 'primary' : ''} ${className}`.trim()
    }
    disabled={disabled}
    onClick={onClick}
  >
    {loading ? (<Loader />) : children}
  </button>
);

export default Button;
