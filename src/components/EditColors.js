import { useState, useEffect, useContext } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db/AppDatabase';
import { Drawer, Button, List, Row, Col, Divider, message } from 'antd';
import { AppContext } from '../stores/AppStore';
import AppLogicController from '../controllers/AppLogicController';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

const EditColors = ({ isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [newDefaultColors, setNewDefaultColors] = useState({});
  const [newCustomColors, setNewCustomColors] = useState({});
  const [saveSucceed, setSaveSucceed] = useState(true);

  const customEntityDefs = useLiveQuery(() => db.custom_entity_defs.toArray());
  const defaultEntityColors = useLiveQuery(() => db.default_entity_colors.toArray());

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      openDrawer();
    }
  }, [isDrawerVisible]);

  const openDrawer = () => {
    setNewDefaultColors({});
    setNewCustomColors({});
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  const setDefaultEntityColor = (id, color) => {
    let newColors = newDefaultColors;
    newColors[id] = color;
    setNewDefaultColors(newColors);
  };

  const setCustomEntityColor = (id, color) => {
    let newColors = newCustomColors;
    newColors[id] = color;
    setNewCustomColors(newColors);
  };

  const updateNewColors = () => {
    setSaveSucceed(true);
    if(Object.keys(newDefaultColors).length === 0 && Object.keys(newCustomColors).length === 0 ) {
      closeDrawer();
      return;
    }
    for (const id in newDefaultColors) {
      AppLogicController.updateDefaultEntityColor(dispatch, parseInt(id), {'color': newDefaultColors[id]}).then(result => {
        //
      }).catch(error => {
        setSaveSucceed(false);
      });
    }
    for (const id in newCustomColors) {
      AppLogicController.updateCustomEntityDefColor(dispatch, parseInt(id), {'color': newCustomColors[id]}).then(result => {
        //
      }).catch(error => {
        setSaveSucceed(false);
      });
    }
    if(saveSucceed) {
      closeDrawer();
      message.success('Colors updated!');
    } else {
      closeDrawer();
      message.error('Something went wrong, sorry :(');
    }    
  };

  return (
    <Drawer
      title="Edit Colors"
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={updateNewColors}>
            Update
          </Button>
        </div>
      }
    >
      { (defaultEntityColors !== undefined && defaultEntityColors.length > 0) && 
        <List
          dataSource={defaultEntityColors}
          renderItem={item => (
            <List.Item className='default-ent-color-list-item'>
              <Row style={{width: '100%'}}>
                <Col span={18} style={{textTransform: 'capitalize'}}>{item.name}</Col>
                <Col span={6} style={{textAlign: 'right'}}>
                  <ColorPicker
                    animation='slide-up'
                    placement='bottomRight'
                    enableAlpha={false}
                    color={item.color}
                    onChange={(colors) => { setDefaultEntityColor(item.id, colors.color) }}
                  />
                </Col>
              </Row>
            </List.Item>
          )}
        />
      }
      { (customEntityDefs !== undefined && customEntityDefs.length > 0) && 
        <>
          <Divider style={{margin: '0'}} />
          <List
            dataSource={customEntityDefs}
            renderItem={item => (
              <List.Item className='custom-ent-color-list-item'>
                <Row style={{width: '100%'}}>
                  <Col span={18}>{item.name}</Col>
                  <Col span={6} style={{textAlign: 'right'}}>
                    <ColorPicker
                      animation='slide-up'
                      placement='bottomRight'
                      enableAlpha={false}
                      color={item.color}
                      onChange={(colors) => { setCustomEntityColor(item.id, colors.color) }}
                    />
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </>
      }
    </Drawer>
  );
};

export default EditColors;
