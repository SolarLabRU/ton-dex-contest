import React from 'react';
import './index.scss';

interface IProps {
  size?: "S" | "M" | "L";
  className?: string;
}

const Loader: React.FC<IProps> = ({ size = "S", className }) => {
  return (
    <div className={`loader ${size} ${className}`} />
  );
};

export default Loader;
