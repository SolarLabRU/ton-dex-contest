import { ReactElement, useEffect, useState } from 'react';
import './index.scss';

interface IProps {
  children: ReactElement[];
  activeTabIndex?: number;
  className?: string;
}

const Header: React.FC<IProps> = ({ children, activeTabIndex = 0, className = '' }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>();

  useEffect(() => {
    if (activeTabIndex >= 0) {
      setCurrentTabIndex(activeTabIndex);
    }
  }, [activeTabIndex]);

  return (
    <div className={`tabs ${className}`.trim()}>
      {children.map((tab, index) => (
        <div
          key={tab.key}
          className={currentTabIndex === index ? 'tab--active' : 'tab'}
          onClick={() => {
            setCurrentTabIndex(index);
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

export default Header;
