import React from 'react';
import CkCell from './ckCell';

const Row = ({ row, style }) => {
  return (
    <div className="ck-tr" style={style}>
      {row.cells.map((cell) => {
        return <CkCell cell={cell} {...cell.getCellProps()} />
      })}
    </div>
  );
};

export default Row;
