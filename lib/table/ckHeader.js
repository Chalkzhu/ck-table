import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import { Dropdown } from 'antd';
import Context from '../context';
import CheckBox from '../components/Checkbox.js';

// 遍历子列（遍历分组列）
function getLeafHeaders(header) {
  const leafHeaders = []
  const recurseHeader = header => {
    if (header.columns && header.columns.length) {
      header.columns.map(recurseHeader)
    }
    leafHeaders.push(header)
  }
  recurseHeader(header)
  return leafHeaders
}

const ColumnResize = ({ column }) => {
  const [left, setLeft] = useState(0);

  // 移动时获取的clientX - 点击时获取的clientX = 偏移的距离
  const handleResize = (props, { instance, header }) => {
    const { dispatch } = instance;

    const onResizeStart = (e) => {
      e.preventDefault();
      const headersToResize = getLeafHeaders(header)
      const headerIdWidths = headersToResize.map(d => [d.id, d.totalWidth])

      const dispatchMove = clientXPos => {
        setLeft(clientXPos - e.clientX);
      }

      // 拖拽停止,拖拽条状态重置复原
      const dispatchEnd = () => {
        dispatch({ type: 'columnDoneResizing' })
        setLeft(0);
      }

      // 监听移动事件，默认鼠标事件mouse，触碰事件touch未加
      const handlersAndEvents = {
        mouse: {
          moveEvent: 'mousemove',
          moveHandler: e => dispatchMove(e.clientX),
          upEvent: 'mouseup',
          upHandler: e => {
            document.removeEventListener(
              'mousemove',
              handlersAndEvents.mouse.moveHandler
            )
            document.removeEventListener(
              'mouseup',
              handlersAndEvents.mouse.upHandler
            )
            dispatch({ type: 'columnResizing', clientX: e.clientX });
            dispatchEnd();
          },
        },
      };

      document.addEventListener('mousemove',
        handlersAndEvents.mouse.moveHandler,
        false,
      )
      document.addEventListener('mouseup',
        handlersAndEvents.mouse.upHandler,
        false
      )

      dispatch({
        type: 'columnStartResizing',
        columnId: header.id,
        columnWidth: header.totalWidth,
        headerIdWidths,
        clientX: e.clientX,
      })
    }

    return [
      props,
      {
        onMouseDown: e => e.persist() || onResizeStart(e),
        style: {
          transform: `translateX(${left}px)`,
        },
      }
    ];
  };

  return (
    <div {...column.getResizerProps(handleResize)} className={`ck-table-resize ${column.isResizing ? 'isResizing' : ''}`}
    >
      <div className="resize-bar" />
    </div>
  )
};

// 列头单元格
const HeaderCell = ({ column, style, ...reset }) => {
  const { tableInstance } = useContext(Context);
  const { getToggleAllRowsSelectedProps } = tableInstance;
  const cn = column.fixed ? `fixed-${column.fixed} ck-th` : 'ck-th'
  const sty = useMemo(() => {
    return {
      ...style,
      left: column.left,
      right: column.right,
    }
  }, [column, style]);

  return (
    <div className={cn} style={sty} {...reset}>
      <div className="ck-column-title">
        {column.type === 'checkbox' ? <CheckBox {...getToggleAllRowsSelectedProps()} /> : column.render('title')}
      </div>
      <div className='ck-column-expand'>
        {/* 列排序 */}
        {column.sort && <div className="ck-column-sorter" {...column.getSortByToggleProps()}>
          <i className={`sort-asc ${column.isSortedDesc ? 'sort-active' : ''}`} />
          <i className={`sort-desc ${(column.isSorted && !column.isSortedDesc) ? 'sort-active' : ''}`} />
        </div>}

        {/* 列过滤 */}
        {column.canFilter && column.filter
          && <div className={`ck-column-filter ${(column.filterValue && column.filterValue.length) ? 'filter-active' : null}`}>
            <Dropdown trigger="click" placement="bottomRight" overlay={column.render('Filter')}>
              <i className="iconfont lmweb-filter-fill icon-filter" />
            </Dropdown>
          </div>}

        {column.canResize && <ColumnResize column={column} />}
      </div>
    </div>
  );
};

// 设置头部单元格样式
const getStyles = (props, align = 'left', fixed = false) => [
  props,
  {
    style: {
      position: fixed ? 'sticky' : 'relative',
      textAlign: align === 'right' ? 'right' : 'left',
    },
  },
];
const headerProps = (props, { column }) => getStyles(props, column.align, column.fixed);

// 列头
const Header = () => {
  const theadRef = useRef(null);
  const { dispatch, tableInstance } = useContext(Context);

  const { headerGroups, totalColumnsWidth } = tableInstance;

  useEffect(() => {
    if (theadRef) {
      dispatch({
        type: 'headerElem',
        headerElem: theadRef
      })
    }
  }, [])

  return (
    <>
      <div className="ck-header">
        <div ref={theadRef} className="ck-thead">
          {headerGroups.map((headerGroup) => {
            return (
              <div className="ck-tr" {...headerGroup.getHeaderGroupProps({ style: { width: totalColumnsWidth, minWidth: '100%' } })}>
                {headerGroup.headers.map((column) => {
                  return <HeaderCell column={column} {...column.getHeaderProps(headerProps)} />
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Header;
