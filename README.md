# ck-table

>  针对React的一款高性能的表格组件

- 使用 div + css 替换原始的table布局
- 表头/表体分离化
- 保留基础功能：表格数据复选/表头列自定义/列筛选/列排序/固定列/文字超出隐藏
- 表体虚拟化数据，成千上万条数据丝滑流畅
- 表格自动获取父级高度，也可自定义高度
- 保留高度自定义

## install

------

```
$ npm i ck-table
# or 
$ yarn add ck-table
```

## Example

------

- [ck-table](http://www.wuliwu.top/ck-table)

## Usage

------

```jsx
import CkTable from 'ck-table';

const columns = [
    {
      title: 'checkbox',
      type: 'checkbox',
      accessor: 'checkbox',
      width: 100,
      fixed: 'left',
    },
    {
      title: '#',
      type: 'seq',
      accessor: 'seq',
      width: 100,
      fixed: 'left',
    },
    {
      title: () => <span>'First Name'</span>,
      accessor: 'firstName',
      sort: true,
      filter: 'input',
    },
    {
      Header: 'Last Name',
      title: 'Last Name',
      accessor: 'lastName',
      width: 100,
      fixed: 'left',
    },
    {
      Header: 'type',
      title: 'Type',
      accessor: 'type',
      fixed: 'left',
      width: 100,
      filter: 'checkbox',
    },
    {
      Header: '物料',
      title: '物料',
      accessor: 'material',
    },
    {
      title: '备注',
      accessor: 'remark',
      ellipsis: true,
    },
    {
      Header: 'Age',
      title: 'Age',
      accessor: 'age',
      align: 'right',
      sort: true,
      filter: 'checkbox',
    },
    {
      Header: 'Visits',
      title: 'Visits',
      accessor: 'visits',
      width: 300,
      fixed: 'right',
    },
    {
      Header: 'Status',
      title: 'Status',
      accessor: 'status',
      width: 600,
    },
    {
      Header: 'Profile Progress',
      title: 'Profile Progress',
      accessor: 'progress',
      width: 200,
    },
    {
      title: 'phone',
      accessor: 'phone',
      fixed: 'right',
      width: 200,
    }
  ];

const data = new Array(size).fill().map((item, index) => {
      return {
        id: index,
        seq: index + 1,
        title: '物料的名称',
        code: `MLY001Y002009${index}Y`,
        name: '',
        material: '物料名称',
        materialCode: `MLY001Y002009${index}Y`,
        state: index % 3 ? 'ok' : index % 2 ? 'disable' : 'wait',
        supplier: '供应商名称',
        number: 'MLY001',
        contactUser: '联系人',
        phone: '13131313131',
        category: index % 2 ? '牛仔' : '非牛仔',
        type: index % 2 ?  '面料' : '辅料',
        firstName: index % 2 ? '张' : '王',
        lastName: index % 3 ? '3' : '4',
        age: index % 3 ? '17' : '28',
        visits: index % 3 ? '78' : '62',
        progress: index % 3 ? '88' : '99',
        status: index % 3 ? 'single' : 'relationship',
        remark: '这是备注这是备注这是备注这是备注这是备注这是备注这是备注这是备注',
      };
    })

const Demo = () => {
  const tableRef = React.useRef(null);
  
  // 获取选中的行数组
  const getCheckboxRecords = () => {
    const v = tableRef.current.getCheckboxRecords;
    console.log(v);
  };
    
  return (
    <div style={{ height: 600 }} className="container">
      <CkTable ref={tableRef} columns={columns} data={data} size="small" />
    </div>
  )
}
```



## API

------

```js
// Ref
getCheckboxRecords
```

### Ref

- `getCheckboxRecords: Function`
  - get selected rows of the ck-table 

### **Options**

- `columns: Array`
  - **Required**
  - The columns of the ck-table
- `data: Array`
  - **Required**
  - The data of the ck-table
- `size: String`
  - Optional: large/small/mini
  - default: 'small'
  - The size of the ck-table
- `height: Integer || String`
  - Optional: '100%'/600/......
  - default: '100%'
  - The height of the ck-table

# Contributors

- Chalk（乔克）

