import React, { useReducer, useMemo, forwardRef, useImperativeHandle } from 'react';
import {
  useTable,
  useSortBy,
  useRowSelect,
  useFilters,
  useColumnOrder,
  useResizeColumns,
  useFlexLayout,
} from 'react-table';
import Context from './context';

import Header from './table/ckHeader';
import Body from './table/ckBody';

import { DefaultColumnFilter, CheckboxFilter, SelectColumnFilter } from './filter/select';

const initialState = {
  rowHeight: 0, // 行的高度
  totalLen: 0, // 总行数
  curScroll: {
    scrollLeft: 0,
    scrollTop: 0,
  },
  headerElem: null,
  bodyElem: null,
};

const reducer = (state, action) => {
  const { curScroll, headerElem, bodyElem } = action;

  switch (action.type) {
    case 'changeScroll':
      const { scrollLeft, scrollWidth, clientWidth } = curScroll;
      if (scrollLeft > 0) {
        state.pingLeft = false
      }
      if (clientWidth + scrollLeft === scrollWidth) {
        state.pingRight = true
      }
      return {
        ...state,
        curScroll,
      };
    case 'headerElem':
      return {
        ...state,
        headerElem,
      };
    case 'bodyElem':
      return {
        ...state,
        bodyElem,
      };
    default:
      throw new Error();
  }
};


const Table = forwardRef((props, ref) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, columns, height = '100%', size = 'small' } = props;

  // 列处理，固定列分组
  const nColumns = useMemo(() => {
    const leftColumn = [];
    const rightColumn = [];
    const filterColumn = columns.filter(col => {
      if (col.fixed) {
        if (col.fixed === 'left') {
          if (leftColumn.length) {
            const preCol = leftColumn[leftColumn.length - 1];
            col.left = preCol.width + (preCol.left || 0);
          }
          leftColumn.push(col)
        }
        if (col.fixed === 'right') {
          const preCol = rightColumn[0];
          col.right = preCol ? preCol.width + (preCol.right || 0) : 0
          rightColumn.unshift(col)
        }
      }
      if (col.filter) {
        switch (col.filter) {
          case 'input':
            col.Filter = DefaultColumnFilter
            break;
          case 'select':
            col.Filter = SelectColumnFilter
            break;
          case 'checkbox':
            col.Filter = CheckboxFilter
            break;

          default:
            break;
        }
      }
      return !col.fixed
    })
    return [...leftColumn, ...filterColumn, ...rightColumn]
  }, [columns])

  // 列过滤
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const tableInstance = useTable(
    {
      columns: nColumns,
      data,
      defaultColumn: { width: 250, minWidth: 60, Filter: CheckboxFilter },
      filterTypes,
    },
    useFlexLayout,
    useResizeColumns,
    useFilters, // 列数据过滤
    useSortBy, // 排序
    useRowSelect, // 复选框
    useColumnOrder, // 列排序
  );

  const { getTableProps, selectedFlatRows } = tableInstance;

  useImperativeHandle(ref, () => ({
    getCheckboxRecords: selectedFlatRows.map(v => v.original)
  }));

  return (
    <Context.Provider value={{ dispatch, state, tableInstance, ...props }}>
      <div className={`ck-table ${size}`} {...getTableProps({ style: { height } })}>
        <Header />
        <Body />
      </div>
    </Context.Provider>
  );
});

export default Table;
