import { useState, useEffect } from 'react';
import { Transfer } from 'antd';
import AppDataFetchController from '../../controllers/AppDataFetchController';

// const { Option } = Select;

const MultiEntityPicker = ({
  entityType = 'location',
  defaultTargetKeys = null,
  onChangeCallback,
  disabled = false,
  customFetch = null,
  customFetchParams = null,
}) => {
  const [entities, setEntities] = useState([]);
  const [nameProp, setNameProp] = useState('name');
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

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
    if (defaultTargetKeys !== null) {
      setTargetKeys(defaultTargetKeys);
    }
  }, [defaultTargetKeys]); // eslint-disable-line

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
        setTargetKeys(defaultTargetKeys !== null ? defaultTargetKeys : []);
        setSelectedKeys([]);
      }).catch(error => {
        console.log('||--FAIL', error);
      });
    }
  }, [customFetch, entityType]); // eslint-disable-line

  const fetchCustomEntities = () => {
    // switch(customFetch){
    //   case 'areasByLocation':
    //     AppDataFetchController.fetchAreasByLocation(customFetchParams.locationId).then((fetchedEntities) => {
    //       setNameProp('name');
    //       setEntities(fetchedEntities);
    //     }).catch(error => {
    //       console.log('||--FAIL', error);
    //     });
    //     break;
    //   case 'allSequencedActs':
    //     AppDataFetchController.fetchSequencedActs().then((fetchedEntities) => {
    //       setNameProp('name');
    //       setEntities(fetchedEntities);
    //     }).catch(error => {
    //       console.log('||--FAIL', error);
    //     });
    //     break;
    //   default:
    //     break;
    // }
  };

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    // console.log('targetKeys:', nextTargetKeys);
    // console.log('direction:', direction);
    // console.log('moveKeys:', moveKeys);
    setTargetKeys(nextTargetKeys);
    onChangeCallback(nextTargetKeys, nextTargetKeys.map(id => getEntityName(id)));
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    // console.log('sourceSelectedKeys:', sourceSelectedKeys);
    // console.log('targetSelectedKeys:', targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const getEntityName = (id) => {
    return (id !== -1) ? entities.find(entity => entity.id === id).name : '';
  };

  return (
    <Transfer 
      dataSource={entities}
      disabled={disabled}
      titles={['To-add', 'Default']}
      render={item => item[nameProp]}
      showSelectAll={false}
      rowKey={record => record.id}
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={onChange}
      onSelectChange={onSelectChange}
    />
  );
};

export default MultiEntityPicker;
