import { Card, Button, Popconfirm, Row, Col, Divider } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import ConditionEditorUtils from '../../utils/ConditionEditorUtils';

const NavActionBuilderView = ({ 
  navActionBuilder,
  areas,
  onRemove = () => {},
  // onEdit = () => {},
}) => {

  const getActionIds = () => {
    let ids = [navActionBuilder.nav1_id];
    if(navActionBuilder.two_way) {
      ids.push(navActionBuilder.nav2_id);
    }
    return ids;
  };

  const navActions = useLiveQuery(AppDataFetchController.fetchLiveNavigationActionsByIds(navActionBuilder && getActionIds()), [navActionBuilder]);

  const options = [];
  // options.push(<Button key='edit-conversation' type='link' size='small' onClick={onEdit}>Edit</Button>);
  options.push(
    <Popconfirm
      key='remove-nav-action-builder'
      title={`Are you sure you want to remove this/these action(s)?`}
      onConfirm={onRemove}
      onCancel={() => {}}
      okText='Yes'
      cancelText='No'
      placement='bottomRight'
    >
      <Button type='link' size='small'>Remove</Button>
    </Popconfirm>
  );

  const getTitle = () => {
    const area1Name = areas.find(area => area.id === navActionBuilder.area1);
    const area2Name = areas.find(area => area.id === navActionBuilder.area2);
    return '[' + area1Name.displayName + '] ' + (navActionBuilder.two_way ? '<->' : '->') + ' [' + area2Name.displayName + ']';
  };

  const renderNavActions = (navActions) => {
    let actions = [];
    actions.push(renderAction(navActions[0]));
    if(navActions.length > 1) {
      actions.push(<Divider></Divider>);
      actions.push(renderAction(navActions[1]));
    }
    return actions;
  };

  const renderAction = (action) => {
    const requiredCondition = action.required_condition && JSON.parse(action.required_condition);
    return (
      <>
        <Row>
          <Col span={20}>
            <p>{action.description}</p>
          </Col>
          <Col span={4} style={{textAlign: 'right'}}>
            <p>Repeat? {action.allow_repeat ? 'Yes' : 'No'}</p>
          </Col>
        </Row>
        {requiredCondition.expressions.length > 1 &&
          <Row>
            <Col span={24}>
              {ConditionEditorUtils.renderConditionDisplay(requiredCondition)}
            </Col>
          </Row>
        }
      </>
    );
  };

  return (
    <Card className='nav-action-builder-view' size='small' title={getTitle()} extra={options} headStyle={{ background: '#f5f5f5'}} style={{marginBottom: 16}}>
      { (navActions !== undefined && navActions.length > 0) && renderNavActions(navActions) }
    </Card>
  );
};

export default NavActionBuilderView;
