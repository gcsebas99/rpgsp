import { useState, useEffect } from 'react';
import { Select } from 'antd';
import AppDataFetchController from '../../controllers/AppDataFetchController';

const { Option } = Select;

const EntitySelectorView = ({
  entityType = 'location',
  value,
  onChangeCallback,
  disabled = false,
  placeholder = '',
  emptyOption = false,
  customFetch = null,
  customFetchParams = null,
}) => {
  const [entities, setEntities] = useState([]);
  const [nameProp, setNameProp] = useState('name');

  useEffect(() => {
    //Mount
    if (customFetch) {
      fetchCustomEntities();
    } else {
      AppDataFetchController.fetchStoryEntities(entityType).then((fetchedEntities) => {
        if(entityType === 'area') {
          setNameProp('displayName');
        }else{
          setNameProp('name');
        }
        setEntities(fetchedEntities);
      }).catch(error => {
        console.log('||--FAIL', error);
      });
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (customFetch) {
      fetchCustomEntities();
    } else {
      AppDataFetchController.fetchStoryEntities(entityType).then((fetchedEntities) => {
        if(entityType === 'area') {
          setNameProp('displayName');
        }else{
          setNameProp('name');
        }
        setEntities(fetchedEntities);
      }).catch(error => {
        console.log('||--FAIL', error);
      });
    }
  }, [customFetch, entityType]); // eslint-disable-line

  const fetchCustomEntities = () => {
    switch(customFetch){
      case 'areasByLocation':
        AppDataFetchController.fetchAreasByLocation(customFetchParams.locationId).then((fetchedEntities) => {
          setNameProp('name');
          setEntities(fetchedEntities);
        }).catch(error => {
          console.log('||--FAIL', error);
        });
        break;
      default:
        break;
    }
  };

  const getEntityName = (id) => {
    return (id !== -1) ? entities.find(entity => entity.id === id).name : '';
  };

  return (
    <Select value={value} onChange={(value) => { onChangeCallback(value, getEntityName(value)) }} style={{width: '100%'}} disabled={disabled} placeholder={placeholder}>
      {emptyOption && <Option key='empty-opt' value={-1}>(empty)</Option>}
      { entities && entities.length > 0 && entities.map(entity => {
          return (<Option key={entity.id} value={entity.id}>{entity[nameProp]}</Option>);
        })
      }
    </Select>
  );
};

export default EntitySelectorView;
