import { useState, useContext } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { Button, Popconfirm, message } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';
import SimpleEntityView from '../SimpleEntityView';
import AddEditCustomEntity from '../AddEditCustomEntity';

const CustomEntityConfigSection = ({ entityDef }) => {
  const [,dispatch] = useContext(AppContext);
  const singularCapitalized = entityDef.singular_name.toLowerCase().charAt(0).toUpperCase() + entityDef.singular_name.toLowerCase().slice(1);
  const [addEditCustomEntityVisible, setAddEditCustomEntityVisible] = useState(false);
  const [currentCustomEntity, setCurrentCustomEntity] = useState(null);

  const entities = useLiveQuery(() => db.custom_entities.where('custom_entity_def_id').equals(entityDef.id).toArray());

  const addCustomEntity = () => {
    setCurrentCustomEntity(null);
    setAddEditCustomEntityVisible(true);
  };

  const editEntity = (entity) => {
    setCurrentCustomEntity(entity);
    setAddEditCustomEntityVisible(true);
  };

  const removeEntity = (entity) => {
    AppLogicController.deleteCustomEntity(dispatch, entity.id).then(result => {
      message.success(singularCapitalized + ' removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const onRemoveEntityDef = () => {
    AppLogicController.deleteCustomEntityDef(dispatch, entityDef.id).then(result => {
      message.success(entityDef.name + ' removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  return (
    <div>
      <div style={{textAlign: 'right', marginBottom: '20px'}} >
        <Popconfirm
          key='remove-entity-def'
          title={`This section and all its content will be removed!! Are you sure you want to remove this entity?`}
          onConfirm={onRemoveEntityDef}
          onCancel={() => {}}
          okText='Yes'
          cancelText='No'
          placement='bottomRight'
        >
          <Button type='default' danger>
            Remove entity
          </Button>
        </Popconfirm>
      </div>
      { entities !== undefined && entities.map(entity =>
        <SimpleEntityView 
          key={entity.id} 
          entity={entity} 
          entityName={entityDef.singular_name.toLowerCase()} 
          onRemove={() => { removeEntity(entity) }} 
          onEdit={() => { editEntity(entity) }} 
        />
        )
      }
      <Button type='primary' onClick={addCustomEntity}>
        Add {singularCapitalized}
      </Button>
      <AddEditCustomEntity
        entity={currentCustomEntity}
        entityDef={entityDef}
        isDrawerVisible={addEditCustomEntityVisible} 
        onDrawerClose={() => { setAddEditCustomEntityVisible(false); }} 
      />
    </div>
  );
};

export default CustomEntityConfigSection;
