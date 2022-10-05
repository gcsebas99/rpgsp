import { useState, useEffect } from 'react';
import { Select } from 'antd';
import AppDataFetchController from '../../controllers/AppDataFetchController';

const { Option } = Select;

const NoEffectActionSelectorView = ({
  value,
  onChangeCallback,
  disabled = false,
  placeholder = '',
  emptyOption = false,
  emptyOptionLabel = '(empty)',
}) => {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    //Mount
    AppDataFetchController.fetchNoEffectActions().then((fetchedActions) => {
      setActions(fetchedActions);
    }).catch(error => {
      console.log('||--FAIL', error);
    });
  }, []); // eslint-disable-line

  return (
    <Select 
      value={value} 
      onChange={onChangeCallback}
      style={{width: '100%'}} 
      disabled={disabled} 
      placeholder={placeholder}
    >
      {emptyOption && <Option key='empty-opt' value={-1}>{emptyOptionLabel}</Option>}
      { actions && actions.length > 0 && actions.map(action => {
          return (<Option key={action.id} value={action.id}>{action.description.substr(0, 27) + '..'}</Option>);
        })
      }
    </Select>
  );
};

export default NoEffectActionSelectorView;
