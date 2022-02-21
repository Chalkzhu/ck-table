
import React, { useState, useRef } from 'react';
import { Button, Input, Select, Checkbox } from 'antd';

// 默认过滤器
const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const onChange = (e) => {
    setFilter(e.target.value || undefined);
  };

  return (
    <div className="ck-table-filter-dropdown">
      <div className="ck-table-filter-header">
        <Input value={filterValue || ''} placeholder="搜索筛选项" onChange={onChange} />
      </div>
    </div>
  )
};

// 下拉过滤器
const CheckboxFilter = ({
  column: { filterValue = [], setFilter, preFilteredRows, id },
}) => {
  const inputRef = useRef(null);
  const [checkedValues, setCheckedValues] = useState(filterValue);
  const [hasValue, setHasValue] = useState();
  const options = React.useMemo(() => {
    const obj = new Set();
    preFilteredRows.forEach(row => {
      obj.add(row.values[id])
    });
    return [...obj.values()];
  }, [])

  const onChange = (values) => {
    setCheckedValues(values || undefined);
  };

  const handleFilter = (e) => {
    const v = e.target.value;
    setHasValue(v);
  };

  const handleSure = () => {
    setFilter(checkedValues);
  };

  const handleReset = () => {
    inputRef.current.state.value = ''
    setFilter(undefined);
    setHasValue(undefined);
    setCheckedValues(undefined);
  };

  return (
    <div className="ck-table-filter-dropdown">
      <div className="ck-table-filter-header">
        <Input ref={inputRef} placeholder="搜索筛选项" onChange={handleFilter} />
      </div>
      <Checkbox.Group value={checkedValues} onChange={onChange} className="ck-table-filter-body">
        <ul className="ck-table-filter-list">
          {
            options.map((item, i) => (
              <li key={item || i} className="ck-table-filter-item" disabled={hasValue && item.indexOf(hasValue) < 0}>
                <Checkbox value={item} className="ck-table-filter-item-content">{item}</Checkbox>
              </li>
            ))
          }
        </ul>
        {
          hasValue && !options.some(item => item.indexOf(hasValue) > -1) && <div className="ck-table-filter-empty">暂无数据</div>
        }
      </Checkbox.Group>
      <div className="ck-table-filter-footer">
        <Button size="small" onClick={handleReset}>重置</Button>
        <Button type="primary" size="small" onClick={handleSure}>确定</Button>
      </div>
    </div>
  )
};

// 下拉过滤器
const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  const onChange = (value) => {
    setFilter(value || undefined);
  };

  // Render a multi-select box
  return (
    <Select value={filterValue} onChange={onChange} style={{ width: 120, fontSize: 12 }} allowClear size="small" placeholder="请选择">
      {options.map((option, i) => (
        <Select.Option key={i} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  )
};

export {
  DefaultColumnFilter,
  CheckboxFilter,
  SelectColumnFilter,
};
