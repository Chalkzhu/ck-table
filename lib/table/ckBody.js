import React, { useContext, useRef, useEffect } from 'react';
import { useVirtual } from "react-virtual";
import Context from '../context';
import CkRow from './ckRow';

const Body = () => {
  const bodyRef = useRef(null);
  const { dispatch, state, tableInstance, size = 'small' } = useContext(Context);
  const { prepareRow, rows, getTableBodyProps } = tableInstance;

  const rowVirtualizer = useVirtual({
    size: rows.length,
    parentRef: bodyRef,
    estimateSize: React.useCallback(() => {
      switch (size) {
        case 'large':
          return 64
        case 'small':
          return 48
        case 'mini':
          return 36
        default:
          return 48
      }
    }, [size]),
    overscan: 2
  });

  const onScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    if (scrollLeft !== state.curScroll.scrollLeft) {
      if (state.headerElem) { state.headerElem.current.scrollLeft = scrollLeft };
      if (state.footerElem) { state.footerElem.current.scrollLeft = scrollLeft };
    }

    dispatch({
      type: 'changeScroll',
      curScroll: { scrollLeft, scrollWidth, clientWidth },
    });
  };

  useEffect(() => {
    if (bodyRef) {
      dispatch({
        type: 'bodyElem',
        bodyElem: bodyRef
      });
    };
  }, []);

  return (
    <>
      <div className="ck-body" {...getTableBodyProps()}>
        <div ref={bodyRef} className='ck-tbody' onScroll={onScroll}>
          <div
            style={{
              height: `${rowVirtualizer.totalSize}px`,
              width: "100%",
              position: "relative"
            }}
          >
            {rowVirtualizer.virtualItems.map(virtualRow => {
              prepareRow(rows[virtualRow.index]);
              const style = {
                position: "absolute",
                top: 0,
                left: 0,
                minWidth: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }
              return <CkRow row={rows[virtualRow.index]} {...rows[virtualRow.index].getRowProps({ style })} />
            })}
          </div>

          {/* {rows.map((row) => {
            prepareRow(row);
            return <CkRow row={row} {...row.getRowProps()} />
          })} */}
        </div>
      </div>
    </>
  );
};

export default Body;
