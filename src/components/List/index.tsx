import React, { ReactElement, useEffect, useState } from 'react';
import { ReactComponent as ArrowLeft } from '../../assets/Arrow_Left_MD.svg';
import { ReactComponent as ArrowRight } from '../../assets/Arrow_Right_MD.svg';
import Loader from '../Loader';
import './index.scss';

interface IProps {
  className?: string;
  firstChildIsHeader?: boolean;
  children: ReactElement[];
  itemsPerPage?: number;
}

const LIst: React.FC<IProps> = ({
  children,
  firstChildIsHeader = false,
  itemsPerPage = 10,
  className = '',
}) => {
  const listSize = firstChildIsHeader ? children.length - 1 : children.length;

  const [currentPage, setCurrentPage] = useState(1);

  const [fullListChildren, setFullListChildren] = useState<ReactElement[]>([]);
  const [displayIngList, setDisplayIngList] = useState<ReactElement[]>([]);
  const [header, setHeader] = useState<ReactElement>();

  useEffect(() => {
    if (firstChildIsHeader) {
      setHeader((
        <div className="list-header">
          {children[0]}
        </div>
      ));
      setFullListChildren(React.Children.map(children, ((child, index) => {
        if (index === 0) {
          return null;
        }
        return (
          <div key={child.key} className="list-item">
            {child}
          </div>
        );
      })));
    } else {
      setFullListChildren(React.Children.map(children, ((child, index) => {
        const className = index === 0 && firstChildIsHeader ? 'list-header' : 'list-item';
        return (
          <div key={child.key} className={className}>
            {child}
          </div>
        );
      })));
    }
  }, [children, firstChildIsHeader, className, setHeader, setFullListChildren]);


  useEffect(() => {
    if (fullListChildren.length <= itemsPerPage) {
      setDisplayIngList(fullListChildren);
    } else {
      const currentPageData = fullListChildren.slice(itemsPerPage * (currentPage - 1), itemsPerPage * currentPage)
      if (!!currentPageData.length) {
        setDisplayIngList(currentPageData);
      } else {
        setCurrentPage(1);
      }
    }
  }, [fullListChildren, currentPage, itemsPerPage]);

  const prevPageActive = currentPage > 1;
  const nextPageActive = currentPage * itemsPerPage < listSize;

  const prevPage = () => {
    if (prevPageActive) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (nextPageActive) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={`list ${className}`.trim()} >
      {header}

      {!!displayIngList.length ? displayIngList : (<Loader className="list__loader" />)}

      {listSize > itemsPerPage && (
        <div className="list__pagination">
          <ArrowLeft
            className={prevPageActive ? "arrow" : "arrow arrow-disabled"}
            onClick={prevPage}
          />
          {`Page ${currentPage} of ${Math.ceil(listSize / itemsPerPage)}`}
          <ArrowRight
            className={nextPageActive ? "arrow" : "arrow arrow-disabled"}
            onClick={nextPage}
          />
        </div>
      )}
    </div>
  );
};

export default LIst;
