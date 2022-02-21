import React, { useRef, useContext, useEffect, useMemo } from 'react';
import Context from '../context';

const FooterCell = ({ column, style, ...resetProps }) => {
  const { tableInstance } = useContext(Context);
  const { totalColumnsWidth } = tableInstance;
  const fixed = column.fixed ? `ck-td fixed-${column.fixed}` : 'ck-td'
  const sty = useMemo(() => {
    const obj = { ...style };
    if (column.fixed === 'left') {
      obj.left = column.totalLeft;
    }
    if (column.fixed === 'right') {
      obj.right = totalColumnsWidth - column.totalLeft - column.totalWidth;
    }
    return obj
  }, [totalColumnsWidth, column, style]);

  return (
    <div className={fixed} style={sty} {...resetProps}>
      <div className='ck-cell'>{column.render('Footer')}</div>
    </div>
  );
};

// 设置单元格样式
const footerProps = (props, { column }) => [
  props,
  {
    style: {
      position: column.fixed ? 'sticky' : 'relative', // 相对定位用来固定列拖拽区域
      textAlign: column.align === 'center' ? 'center' : column.align === 'right' ? 'right' : null,
    },
  },
];

const Footer = () => {
  const tfootRef = useRef(null);
  const { dispatch, tableInstance } = useContext(Context);
  const { footerGroups, totalColumnsWidth } = tableInstance;

  useEffect(() => {
    if (tfootRef) {
      dispatch({
        type: 'footerElem',
        footerElem: tfootRef
      })
    }
  }, [])

  return (
    <>
      <div className="ck-footer">
        <div ref={tfootRef} className="ck-tfoot">
          {footerGroups.map((footerGroup) => {
            return (
              <div className="ck-tr" {...footerGroup.getFooterGroupProps({ style: { width: totalColumnsWidth, minWidth: '100%' } })}>
                {footerGroup.headers.map((column) => {
                  return <FooterCell column={column} {...column.getFooterProps(footerProps)} />
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Footer;
