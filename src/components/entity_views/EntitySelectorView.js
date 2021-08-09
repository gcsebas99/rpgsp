import { useState, useEffect } from 'react';
import { Select } from 'antd';
import AppDataFetchController from '../../controllers/AppDataFetchController';

const { Option } = Select;

const EntitySelectorView = ({
  entityType = 'location',
  value,
  onChangeCallback,
}) => {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    //Mount
    AppDataFetchController.fetchStoryEntities(entityType).then((fetchedEntities) => {
      setEntities(fetchedEntities);
    }).catch(error => {
      console.log('||--FAIL', error);
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    AppDataFetchController.fetchStoryEntities(entityType).then((fetchedEntities) => {
      setEntities(fetchedEntities);
    }).catch(error => {
      console.log('||--FAIL', error);
    });
  }, [entityType]);


  return (
    <Select value={value} onChange={(value) => { onChangeCallback(value) }} style={{width: '100%'}}>
      { entities && entities.length > 0 && entities.map(entity => {
          return (<Option key={entity.id} value={entity.id}>{entity.name}</Option>);
        })
      }
    </Select>
  );
};

export default EntitySelectorView;
