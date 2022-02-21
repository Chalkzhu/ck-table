import React, { forwardRef, useRef } from 'react';
import { Checkbox } from 'antd';

const GridCheckbox = forwardRef(({ ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  return <Checkbox ref={resolvedRef} {...rest} />;
});

export default GridCheckbox;
