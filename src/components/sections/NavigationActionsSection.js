import { Row, Col, Card, Button, message } from 'antd';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { useLiveQuery } from 'dexie-react-hooks';
import NavActionBuilderView from '../entity_views/NavActionBuilderView';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import AddEditNavigationGameAction from '../drawers/AddEditNavigationGameAction';


const NavigationActionsSection = ({ sectionActive, onAddEditCondition }) => {
  const [,dispatch] = useContext(AppContext);
  const [areas, setAreas] = useState(null);
  const [addEditSingleActionVisible, setAddEditSingleActionVisible] = useState(false);
  //live
  const navActionBuilders = useLiveQuery(AppDataFetchController.fetchLiveNavBuilders({}));

  useEffect(() => {
    if (sectionActive) {
      loadAreas();
    }
  }, [sectionActive]);

  const loadAreas = () => {
    AppDataFetchController.fetchStoryEntities('area').then((areas) => {
      setAreas(areas);
    }).catch(error => {
      setAreas(null);
      console.log('||--FAIL', error);
    });
  };

  const addNavigationAction = () => {
    setAddEditSingleActionVisible(true);
  };

  const removeNavActionBuilder = (navActionBuilder) => {
    AppLogicController.deleteNavigationActions(dispatch, navActionBuilder.id).then(result => {
      message.success('Actions removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  return (
    <div>
      <Row gutter={[0, 8]} style={{paddingBottom: 24}}>
        <Col span={24}>
          <Card size='small'>
            <Button type='primary' onClick={addNavigationAction} style={{ marginRight: 8 }}>
              Add Nav Action
            </Button>
            {/*<Button type='primary' onClick={() => {}} style={{ marginRight: 8 }}>
              Add Associated Nav Action
            </Button>
            <Button type='primary' onClick={() => {}}>
              Add Nav Actions Matrix
            </Button>*/}
          </Card>
        </Col>
        <Col span={24}>
          <Card size='small'>
            Filters
          </Card>
        </Col>
        <Col span={24}>
          { (navActionBuilders !== undefined && areas !== null) && navActionBuilders.map(navActionBuilder =>
            <NavActionBuilderView 
              key={navActionBuilder.id} 
              navActionBuilder={navActionBuilder} 
              areas={areas}
              onRemove={() => { removeNavActionBuilder(navActionBuilder) }} 
              onEdit={() => { }} 
            />
            )
          }
        </Col>
      </Row>
      <AddEditNavigationGameAction 
        navActionBuilder={null}
        gameActions={null}
        isDrawerVisible={addEditSingleActionVisible} 
        onDrawerClose={() => { setAddEditSingleActionVisible(false); }} 
        onAddEditCondition={onAddEditCondition}
      />
    </div>
  );
};

export default NavigationActionsSection;
