import React, { useContext } from 'react';
import { Checkbox, Dropdown, Button } from 'antd';
import Context from '../context';
import { swapArr } from '../utils';

const Setting = () => {
  const { tableInstance } = useContext(Context);
  const { columns, toggleHideAllColumns, setHiddenColumns, setColumnOrder } = tableInstance;

  const handleChange = (item) => {
    item.toggleHidden()
  };

  const handleAllChange = (val) => {
    toggleHideAllColumns?.(!val.target.checked);
  };

  // 列重置
  const handleReset = () => {
    // 接收默认隐藏的列字段
    setHiddenColumns(columns.filter(v => typeof v.visible === 'boolean' && !v.visible).map(v => v.id))
  };

  // 设为固定列
  const handleFixed = (field, position = 'right') => {
    const currentItem = columns.splice(columns.findIndex(v => v.id === field), 1)[0];
    currentItem.fixed = position
    columns.push(currentItem);
    setColumnOrder(columns.map(d => d.id));
  };

  return (
    <div className="ck-table-setting-dropdown">
      <div className="ck-table-setting-header" />
      <div className="ck-table-setting-body">
        <div className="ck-table-setting-reset">
          <Checkbox defaultChecked onChange={handleAllChange} className="ck-table-setting-item-content">全选</Checkbox>

          <div><Button type="link" size="small" onClick={handleReset}>重置</Button></div>
        </div>
        <ul className="ck-table-setting-list">
          {
            columns.map((item, i) => {
              return (
                <li key={item.id || i} className="ck-table-setting-item">
                  <Checkbox checked={item.isVisible} onChange={() => handleChange(item)} className="ck-table-setting-item-content">{typeof item.title === 'function' ? item.title() : item.title}</Checkbox>
                </li>
              )
            })
          }
        </ul>
      </div>
      <div className="ck-table-setting-footer" />
    </div>
  )
};

const Wrapper = () => {
  return (
    <Dropdown trigger="click" placement="bottomRight" overlay={<Setting />}>
      <i className="iconfont lmweb-setting icon-setting" />
    </Dropdown>
  )
};

export default Wrapper;