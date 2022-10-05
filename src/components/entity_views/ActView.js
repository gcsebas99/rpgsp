import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../stores/AppStore';
import { Card, Typography, Button, Popconfirm, Divider } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import AppLogicController from '../../controllers/AppLogicController';
import ConditionEditorUtils from '../../utils/ConditionEditorUtils';
import '../../styles/components/entity_views/ActView.scss';

const { Text } = Typography;

const ActView = ({ 
  act,
  actIndex = null,
  totalActs = 0,
  canEdit = true, 
  canRemove = true,
  onRemove = () => {},
  onEdit = () => {},
  onMoveOrderUp = () => {},
  onMoveOrderDown = () => {},
  onAddEditCondition = () => {},
}) => {
  const [state, dispatch] = useContext(AppContext);
  const [sequencedActSteps, setSequencedActSteps] = useState(0);
  const [endCondition, setEndCondition] = useState(null);

  useEffect(() => {
    if(act.type === 'sequence') {
      AppDataFetchController.fetchSequencedActionsByAct(act.id).then((actions) => {
        setSequencedActSteps(actions.length);
      }).catch(error => {
        console.log('||--FAIL', error);
      });
    } else {
      if (act.end_condition) {
        setEndCondition(JSON.parse(act.end_condition));
      }
    }
  }, [act]);

  useEffect(() => {
    if(state.activeConditionDone) {
      setEndCondition(state.activeCondition);
      //save end condition
      AppLogicController.updateActEndCondition(dispatch, act.id, {'endCondition': JSON.stringify(state.activeCondition)}).then(result => {
        //all set
      }).catch(error => {
        //error
      });
    }
  }, [state.activeConditionDone, state.activeCondition]);

  const options = [];
  options.push(<Text key='act-type' type='success' style={{marginRight: '24px'}}>{(act.type === 'interactive') ? 'Interactive' : 'Sequence'}</Text>);
  options.push(
    <Button 
      type="default"
      key='move-up' 
      icon={<CaretUpOutlined />} 
      size='small' style={{marginRight: '4px'}} 
      disabled={actIndex === 0}
      onClick={onMoveOrderUp} />
  );
  options.push(
    <Button 
      type="default" 
      key='move-down' 
      icon={<CaretDownOutlined />} 
      size='small' 
      style={{marginRight: '24px'}} 
      disabled={actIndex === (totalActs-1)}
      onClick={onMoveOrderDown} />
  );
  if(canEdit) {
    options.push(<Button key='edit-act' type='link' size='small' onClick={onEdit}>Edit</Button>);
  }
  if(canRemove) {
    options.push(
      <Popconfirm
        key='remove-act'
        title={() => { return (<p>Are you sure you want to remove this act?<br/>All sequence actions and end conditions associated will be removed.</p>); }}
        onConfirm={onRemove}
        onCancel={() => {}}
        okText='Yes'
        cancelText='No'
        placement='bottomRight'
      >
        <Button type='link' size='small'>Remove</Button>
      </Popconfirm>
    );
  }

  const title = 'Act ' + act.order + ': ' + act.name;

  const changeEndCondition = () => {
    dispatch({type: 'SET_ACTIVE_CONDITION', payload: endCondition});
    onAddEditCondition();
  };

  const renderActEndCondition = () => {
    const expressions = ConditionEditorUtils.renderConditionDisplay(endCondition);
    if(expressions !== null) {
      return (<div style={{paddingBottom: 20}}>
        <Text strong>This act ENDS when:</Text>
        {expressions}
      </div>);
    }
    return null;
  };

  return (
    <Card className='act-view' size='small' title={title} extra={options} headStyle={{ background: '#d9d9d9'}} >
      <Text>{act.description}</Text>
      <Divider></Divider>
      {(act.type === 'interactive')
        ? 
          <div>
            {renderActEndCondition()}
            {endCondition === null
              ? <Button type='primary' size='small' onClick={onAddEditCondition}>Set end condition</Button>
              : <Button type='primary' size='small' onClick={changeEndCondition}>Change end condition</Button>
            }
          </div>
        : 
          <Text strong>This act contains {sequencedActSteps} steps</Text>
      }
    </Card>
  );
};

export default ActView;
