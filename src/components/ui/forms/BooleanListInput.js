import { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const BooleanListInput = ({ value = [], onChange, disabled = false }) => {
  const [values, setValues] = useState([]);

  useEffect(() => {
    if(Array.isArray(value)) {
      setValues(value);
    }
  }, [value]);

  const addTrue = () => {
    let newVal = [...values, 'true'];
    setValues(newVal);
    onChange(newVal, null);
  };

  const addFalse = () => {
    let newVal = [...values, 'false'];
    setValues(newVal);
    onChange(newVal, null);
  };

  const clear = () => {
    setValues([]);
    onChange([], null);
  };

  return (
    <Input.Group compact>
      <Input 
        readOnly 
        value={values.join(', ')} 
        style={{ width: (disabled ? '100%' : 'calc(100% - 96px)') }}
        disabled={disabled}
      />
      {!disabled &&
        <>
          <Button icon={<CheckCircleOutlined />} onClick={addTrue} />
          <Button icon={<CloseCircleOutlined />} onClick={addFalse} />
          <Button icon={<DeleteOutlined />} onClick={clear} />
        </>
      }
      
    </Input.Group>
  );
};

export default BooleanListInput;
