import React, { useMemo } from 'react';
import Checkbox from '../components/Checkbox';

const Cell = ({ cell, style }) => {
  const { row, column, render, value } = cell;
  const cn = column.fixed ? `fixed-${column.fixed} ck-td` : 'ck-td';
  const ellipsis = column.ellipsis ? 'ellipsis' : '';
  const sty = useMemo(() => {
    return {
      ...style,
      left: column.left,
      right: column.right
    }
  }, [column, style]);

  return (
    <div className={`${cn} ${ellipsis}`} style={sty}>
      <span className="ck-td-label" title={column.ellipsis ? value : null}>
        {column.type === 'checkbox' ? <Checkbox {...row.getToggleRowSelectedProps()} /> : render('Cell')}
      </span>
    </div>
  );
};

export default Cell;
