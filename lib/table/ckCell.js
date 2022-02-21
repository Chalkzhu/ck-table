import React, { useMemo, useContext } from 'react';
import Checkbox from '../components/Checkbox';
import Context from '../context';

const Cell = ({ cell, style }) => {
  const { tableInstance } = useContext(Context);
  const { totalColumnsWidth } = tableInstance;
  const { row, column, render, value } = cell;
  const fixed = column.fixed ? `fixed-${column.fixed} `: '';
  const ellipsis = column.ellipsis ? 'ellipsis' : '';
  const sty = useMemo(() => {
    const obj = { ...style };
    if (column.fixed === 'left') {
      obj.left = column.totalLeft;
    }
    if (column.fixed === 'right') {
      obj.right = totalColumnsWidth - column.totalLeft - column.totalWidth;
    }
    if (column.align) {
      obj.textAlign = column.align;
    }
    return obj
  }, [totalColumnsWidth, column, style]);

  return (
    <div className={`ck-td ${fixed} ${ellipsis}`} style={sty}>
      <div className="ck-cell" title={column.ellipsis ? value : null}>
        {column.type === 'checkbox' ? <Checkbox {...row.getToggleRowSelectedProps()} /> : column.type === 'seq' ? cell.row.index + 1 : render('Cell')}
      </div>
    </div>
  );
};

export default Cell;
