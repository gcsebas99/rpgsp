import { useState, useEffect, useContext } from 'react';
import { Drawer, Form, Button, Col, Row, Space, List, Typography, message, Switch } from 'antd';
import { AppContext } from '../../stores/AppStore';
import EffectListItem from '../entity_views/EffectListItem';
import EditorUtils from '../../utils/EditorUtils';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import EffectsEditorUtils from '../../utils/EffectsEditorUtils';
import ConversationSelectorView from '../entity_views/ConversationSelectorView';

const { Text } = Typography;

const EffectsEditor = ({ isDrawerVisible, onDrawerClose, type = 'inter' }) => {
  const [state, dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [stateEffects, setStateEffects] = useState(null); //effects from global state
  const [effects, setEffects] = useState([]); // in-edit effects
  const [validEffects, setValidEffects] = useState(false); //valid effects in list and/or conversation
  //
  const [activeEffect, setActiveEffect] = useState(EditorUtils.getEmptyEffect());
  //
  const [conversation, setConversation] = useState(-1);
  const [conversationName, setConversationName] = useState('');
  const [conversationAt, setConversationAt] = useState('START');
  const [withConversation, setWithConversation] = useState(false);

  //GS props
  const [gameStates, setGameStates] = useState(undefined);

  useEffect(() => {
    //Mount
    AppDataFetchController.fetchGameStateProps().then((fetchedGameStateProps) => {
      let availableGameStates;
      if (type === 'inter') {
        availableGameStates = fetchedGameStateProps.filter(gameState => {
          return !['currentChapter','currentAct','currentActSequence','currentLocation','currentArea'].includes(gameState.name);
        });
      } else {
        availableGameStates = [fetchedGameStateProps.find(gameState => {
          return gameState.name = 'currentArea';
        })]; 
      }
      setGameStates(availableGameStates);
    }).catch(error => {
      console.log('||--FAIL', error);
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      resetEditor();
      form.resetFields();
      setStateEffects(state.activeEffects);
      fillEffects();
      openDrawer();
    }
  }, [isDrawerVisible, form]);  // eslint-disable-line

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  const resetEditor = () => {
    clearEffect();
    setEffects([]);
    setConversation(-1);
    setConversationName('');
    setConversationAt('START');
    setWithConversation(false);
    setValidEffects(false);
  };

  const fillEffects = () => {
    if (stateEffects !== null) {
      //setEffects(stateEffects.effectsOrderedList);
      //TODO set conversation stateEffects.conversation
      setValidEffects(false);
    }
  };

  const handleGSPropChange = (value) => {
    const effect = activeEffect;
    const prop = gameStates[value];
    effect.gsProp = prop.name;
    effect.gsPropType = prop.type;
    effect.mutatorId = null;
    effect.valueInputType = null;
    effect.value = null;
    effect.valueDisplay = null;
    setActiveEffect({ ...effect });
  };

  const handleMutatorChange = (value) => {
    const effect = activeEffect;
    effect.mutatorId = value;
    effect.valueInputType = EditorUtils.getInputTypeForMutator(effect.gsPropType, effect.mutatorId);
    effect.value = (effect.valueInputType === 'SELECTOR_MULTI_ENTITY') ? [] : (effect.valueInputType === 'BOOLEAN' ? false : null);
    effect.valueDisplay = (effect.valueInputType === 'SELECTOR_MULTI_ENTITY') ? [] : null;
    setActiveEffect({ ...effect });
  };

  const handleValueChange = (value, valueDisplay) => {
    const effect = activeEffect;
    effect.value = value;
    effect.valueDisplay = valueDisplay;
    setActiveEffect({ ...effect });
  };

  const clearEffect = () => {
    setActiveEffect(EditorUtils.getEmptyEffect());
  };

  const addEffect = () => {
    if(checkEffectValid()) {
      let newEffects = [...effects];
      newEffects.push({...activeEffect});
      setEffects(newEffects);
      setValidEffects(false);
      clearEffect();
    } else {
      message.error('Effect does not appear to be valid.');
    }
  };

  const checkEffectValid = () => {
    //prop
    if(activeEffect.gsProp === null) {
      return false;
    }
    //mutator
    if(activeEffect.mutatorId === null) {
      return false;
    }
    //value
    if(activeEffect.valueInputType === null) {
      return false;
    }
    switch(activeEffect.valueInputType) {
      case 'SELECTOR_ENTITY':
        if(activeEffect.value === null) {
          return false;
        }
        break;
      case 'SELECTOR_TAG_INT':
        if(activeEffect.value === null || activeEffect.value.length === 0) {
          return false;
        } else {
          const nonInt = activeEffect.value.find(element => isNaN(element));
          if(nonInt !== undefined) {
            return false;
          }
        }
        break;
      case 'SELECTOR_TAG_STRING':
      case 'SELECTOR_MULTI_ENTITY':
      case 'PICKER_BOOLEAN':
        if(activeEffect.value === null || activeEffect.value.length === 0) {
          return false;
        }
        break;
      case 'TEXT_INT':
        if(activeEffect.value === null || isNaN(activeEffect.value)) {
          return false;
        }
        break;
      case 'TEXT_STRING': 
        if(activeEffect.value === null || activeEffect.value.trim().length === 0) {
          return false;
        }
        break;
      case 'BOOLEAN':
      case 'NONE':
      default:
        //no validation required for value
        break;
    }
    return true;
  };

  const onRemoveEffect = index => {
    let newEffects = [...effects];
    newEffects.splice(index, 1);
    setEffects(newEffects);
    setValidEffects(false);
  };

  const toggleConversation = () => {
    if(withConversation) {
      setWithConversation(false);
      setConversation(-1);
      setConversationName('');
      setConversationAt('START');
    } else {
      setWithConversation(true);
    }
    setValidEffects(false);
  };

  const changeConversationAt = value => {
    setConversationAt(value ? 'START' : 'END');
  };

  const onChangeConversation = (value, name) => {
    setConversation(value);
    setConversationName(name);
    setValidEffects(false);
  };

  const validateCurrentEffects = () => {
    const hasConv = withConversation;
    const convOk = conversation !== -1;
    const hasEffects = effects.length > 0;
    setValidEffects((hasConv && convOk) || (hasEffects && !hasConv));
  };

  const buildEffects = () => {
    let gameStateProp;
    let builtEffects = [];
    effects.forEach((effect, index) => {
      gameStateProp = gameStates.find(gameState => gameState.name === effect.gsProp);
      builtEffects.push({gsp_id: gameStateProp.id, mutatorId: effect.mutatorId, value: effect.value, valueDisplay: effect.valueDisplay, order: index, type: 'prop'});
    });
    return builtEffects;
  };

  const buildConversation = () => {
    return withConversation ? {type: 'conv', conv_id: conversation, conv_at: conversationAt} : null;
  };

  const buildDisplayEffects = () => {
    let mutator;
    let valueDisplay;
    let builtEffects = [];
    effects.forEach(effect => {
      mutator = EditorUtils.getMutatorName(effect.mutatorId);
      valueDisplay = effect.valueDisplay !== null ? effect.valueDisplay : effect.value;
      builtEffects.push({type: 'prop', propName: effect.gsProp, mutator: mutator, value: valueDisplay});
    });
    if(withConversation) {
      let conv = {type: 'conv', name: conversationName};
      if(conversationAt === 'START') {
        builtEffects.unshift(conv);
      }else{
        builtEffects.push(conv);
      }
    }
    return builtEffects;
  };


  const onFinish = (values) => {
    let result = {
      effects: buildEffects(),
      conversation: buildConversation(),
      display: buildDisplayEffects(),
    };
    console.log('||--', result);
    dispatch({type: 'SET_ACTIVE_EFFECTS_COMPLETED', payload: result});
    closeDrawer();
  };

  //renders
  const effectsListHeader = (
    <Row>
      <Col span={7}><Text strong>Game State Prop</Text></Col>
      <Col span={7}><Text strong>Mutation</Text></Col>
      <Col span={7}><Text strong>Value</Text></Col>
      <Col span={3}><Text strong>Remove</Text></Col>
    </Row>
  );


  return (
    <Drawer
      title='Effects'
      className='effects-editor'
      placement='bottom'
      height={460}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      zIndex={1005}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" style={{ marginRight: 8 }} onClick={validateCurrentEffects}>
            Validate
          </Button>
          <Button type="primary" htmlType="submit" form='add-edit-effects-id' disabled={!validEffects}>
            {(stateEffects !== null) ? 'Update' : 'Set'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-effects' id='add-edit-effects-id' form={form} onFinish={onFinish} requiredMark={false}>
        <Row gutter={[24, 0]} style={{marginBottom: 20}}>
          <Col span={24}>
            <Space>
              <Button type='default' size='small' onClick={toggleConversation}>{withConversation ? 'Remove conversation' : 'Trigger conversation'}</Button>
              {withConversation &&
                <>
                  <Form.Item
                    name="convAt"
                    label="Conv at:"
                    style={{flexDirection: 'row', marginBottom: 0, alignItems: 'baseline'}}
                  >
                    <Switch checkedChildren="START" unCheckedChildren="END" checked={conversationAt === 'START'} onChange={(e) => { changeConversationAt(e) }} />
                  </Form.Item>
                  <div style={{minWidth: 300}}>
                    <ConversationSelectorView value={conversation} onChangeCallback={onChangeConversation} emptyOption />
                  </div>
                </>
              }
            </Space>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col span={8}>
            <Form.Item
              label="Game State Prop"
              style={{marginBottom: 4}}
            >
              {EffectsEditorUtils.renderGameStatePropsSelector(activeEffect.gsProp, handleGSPropChange, gameStates)}
            </Form.Item>
          </Col>
          <Col span={8} style={{display: (activeEffect.gsProp !== null ? 'block' : 'none')}}>
            <Form.Item
              label="Mutation"
              style={{marginBottom: 4}}
            >
              {EffectsEditorUtils.renderMutatorSelector(activeEffect.gsPropType, activeEffect.mutatorId, handleMutatorChange)}
            </Form.Item>
          </Col>
          <Col span={8} style={{display: (activeEffect.mutatorId !== null && activeEffect.valueInputType !== 'NONE' ? 'block' : 'none')}}>
            <Form.Item
              label="Value"
              style={{marginBottom: 4}}
            >
              {EffectsEditorUtils.renderValueSelector(activeEffect.gsPropType, activeEffect.valueInputType, activeEffect.value, handleValueChange)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Space>
              <Button type='default' size='small' onClick={addEffect}>Add</Button>
              <Button type='default' size='small' onClick={clearEffect}>Clear</Button>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <List
              style={{maxWidth: '94%'}}
              header={effectsListHeader}
              dataSource={effects}
              renderItem={(item, index) => (
                <EffectListItem
                  effect={item}
                  gameStates={gameStates}
                  onRemove={() => { onRemoveEffect(index) }}
                />
              )}
            />
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default EffectsEditor;
