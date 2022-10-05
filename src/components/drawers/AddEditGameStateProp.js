import { useState, useEffect, useContext, Fragment } from 'react';
import { Drawer, Form, Button, Col, Row, Input, InputNumber, Select, Switch, message } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';
import EntitySelectorView from '../entity_views/EntitySelectorView';
import MultiEntityPicker from '../entity_views/MultiEntityPicker';

const { TextArea } = Input;
const { Option } = Select;

const NO_TREF_TYPES = ['int', 'intarr', 'boolean', 'booleanarr', 'string', 'stringarr'];

const AddEditGameStateProp = ({ gameStateProp = null, isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [defaultValueInt, setDefaultValueInt] = useState(0);
  const [defaultValueBool, setDefaultValueBool] = useState(true);
  const [defaultValueString, setDefaultValueString] = useState('');
  const [defaultValueEntity, setDefaultValueEntity] = useState(-1);
  const [defaultValueEntityName, setDefaultValueEntityName] = useState(null);
  const [defaultValueEntityArray, setDefaultValueEntityArray] = useState([]);
  const [defaultValueEntityArrayNames, setDefaultValueEntityArrayNames] = useState([]);
  const [defaultValueArray, setDefaultValueArray] = useState(true);

  const customEntityDefs = useLiveQuery(() => db.custom_entity_defs.toArray());

  useEffect(() => {
    const populateDefault = (gameStateProp) => {
      const defaultValue = gameStateProp.default;
      if(!gameStateProp.type.endsWith('arr')) { //not array
        switch(gameStateProp.type) {
          case 'int':
            form.setFieldsValue({defaultValueInt: defaultValue});
            break;
          case 'boolean':
            form.setFieldsValue({defaultValueBool: defaultValue});
            setDefaultValueBool(defaultValue);
            break;
          case 'string':
            form.setFieldsValue({defaultValueString: defaultValue});
            break;
          case 'location':
          case 'area':
          case 'character':
          default: //custom entity
            setDefaultValueEntity(gameStateProp.default_tids !== null ? gameStateProp.default_tids : -1);
            setDefaultValueEntityName(defaultValue);
            break;
        }
      } else { //array
        if(isMultiPicker(gameStateProp.type)) {
          setDefaultValueEntityArray(gameStateProp.default_tids !== null ? gameStateProp.default_tids : []);
        } else {
          if(defaultValue.length === 0) {
            return;
          }
          const valuesArray = defaultValue.split(',');
          switch(gameStateProp.type) {
            case 'intarr':
            case 'booleanarr':
              form.setFieldsValue({defaultValueArray: valuesArray.join('\n')});
              break;
            case 'stringarr':
              let unquotedEntries = [];
              for (const entry of valuesArray) {
                unquotedEntries.push(entry.slice(1, -1));
              }
              form.setFieldsValue({defaultValueArray: unquotedEntries.join('\n')});
              break;
            default:
              break;
          }
        }
      }
    };

    if(isDrawerVisible) { //opening drawer
      form.resetFields();
      setType('');
      if (gameStateProp) {
        form.setFieldsValue({name: gameStateProp.name, type: gameStateProp.type});
        setType(gameStateProp.type);
        populateDefault(gameStateProp);
      }
      openDrawer();
    }
  }, [isDrawerVisible, form, gameStateProp]); // eslint-disable-line

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  const handleTypeChange = (value) => {
    if(value === 'int') {
      form.setFieldsValue({defaultValueInt: ''});
    }
    if(value === 'boolean') {
      form.setFieldsValue({defaultValueBool: defaultValueBool});
    }
    if(value === 'string') {
      form.setFieldsValue({defaultValueString: ''});
    }
    if(value.endsWith('arr')){
      form.setFieldsValue({defaultValueArray: ''});
      setDefaultValueEntityArray([]);
      setDefaultValueEntityArrayNames([]);
    }
    if(value !== '' && value !== 'int' && value !== 'boolean' && value !== 'string' && !value.endsWith('arr')){
      setDefaultValueEntity(-1);
    }
    setType(value);
  };

  const displaySingleLineDefaultField = () => {
    return type === 'string';
  };

  const displaySingleEntityDefaultField = () => {
    return type !== '' && type !== 'int' && type !== 'boolean' && type !== 'string' && !type.endsWith('arr');
  };

  const displayArrayDefaultField = () => {
    return type.endsWith('arr') && (type === 'intarr' || type === 'booleanarr' || type === 'stringarr');
  };

  const displayArrayPickerField = () => {
    return type.endsWith('arr') && (type !== 'intarr' & type !== 'booleanarr' && type !== 'stringarr');
  };

  const isMultiPicker = (type) => {
    return type.endsWith('arr') && (type !== 'intarr' & type !== 'booleanarr' && type !== 'stringarr');
  };

  const arrayFieldLabelAndPlaceholder = (label = true) => {
    switch(type) {
      case 'intarr':
        return label ? 'int[]' : 'Place one integer per line';
      case 'booleanarr':
        return label ? 'boolean[]' : 'Place one boolean per line';
      case 'stringarr':
        return label ? 'string[]' : 'Place one string per line';
      case 'locationarr':
        return label ? 'location[]' : 'Place one location per line';
      case 'areaarr':
        return label ? 'area[]' : 'Place one area per line';
      case 'characterarr':
        return label ? 'character[]' : 'Place one character per line';
      default:
        if(type.endsWith('arr')) {
          const singular_name = type.slice(0, -3);
          return label ? singular_name+'[]' : 'Place one '+singular_name+' per line';
        } else {
          return label ? '[]' : 'Place one item per line';
        }
    }
  };

  const onFinish = (values) => {
    const name = values.name.trim();
    if(name === ''){
      message.error('Do not leave name empty');
      return;
    }
    //validate type & default value
    switch(type) {
      case 'int':
        if(!Number.isInteger(parseInt(values.defaultValueInt))){
          message.error('Default is not an integer');
        } else {
          saveGameStateProp(values);
        }
        break;
      case 'boolean':
      case 'string':
      case 'location':
      case 'area':
      case 'character':
        saveGameStateProp(values);
        break;
      default:
        if(!type.endsWith('arr')) { 
          //custom entity
          saveGameStateProp(values);
        } else { //any array type
          if(isMultiPicker(type)) {
            saveGameStateProp(values);
          } else {
            valudateArrayTypes(values);
          }
        }
        break;
    }
  };

  const valudateArrayTypes = (values) => {
    const defaultValues = values.defaultValueArray;
    if(defaultValues.length === 0) {
      saveGameStateProp(values);
    } else {
      const valuesArray = defaultValues.split('\n');
      switch(type) {
        case 'intarr':
          for (const integerValue of valuesArray) {
            if(!Number.isInteger(parseInt(integerValue))){
              message.error('All values in array must be integers');
              return;
            }
          }
          saveGameStateProp(values);
          break;
        case 'booleanarr':
          for (const booleanValue of valuesArray) {
            if(!(booleanValue === 'true' || booleanValue === 'false')){
              message.error('All values in array must be "true" or "false"');
              return;
            }
          }
          saveGameStateProp(values);
          break;
        case 'stringarr':
          for (const stringValue of valuesArray) {
            if(stringValue.trim() === ''){
              message.error('Do not leave empty strings (just spaces are considered empty)');
              return;
            }
          }
          saveGameStateProp(values);
          break;
        default:
          break;
      }
    }
  };

  const saveGameStateProp = (values) => {
    if (gameStateProp === null) { //new gameStateProp
      const name = values.name.trim();
      const defaults = getDefaultValue(values);
      const editMode = 'name|default';
      const removable = true;
      const newData = {name, type, ...defaults, editMode, removable};
      AppLogicController.createNewGameStateProp(dispatch, newData).then(result => {
        closeDrawer();
        message.success('New game state prop created!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    } else { //editing gameStateProp
      const name = values.name.trim();
      const defaults = getDefaultValue(values);
      const editMode = gameStateProp.edit_mode;
      const removable = gameStateProp.removable;
      const editData = {name, type, ...defaults, editMode, removable};
      AppLogicController.updateGameStateProp(dispatch, gameStateProp.id, editData).then(result => {
        closeDrawer();
        message.success('Game state prop edited!');
      }).catch(error => {
        closeDrawer();
        message.error('Something went wrong, sorry :(');
      });
    }
  };

  const getDefaultValue = (values) => {
    let defs = {defaultValue: null, defaultTable: null, defaultTids: null};
    //set table
    if(!NO_TREF_TYPES.includes(type)) {
      switch(type) {
        case 'location':
        case 'locationarr':
          defs.defaultTable = 'locations';
          break;
        case 'area':
        case 'areaarr':
          defs.defaultTable = 'areas';
          break;
        case 'character':
        case 'characterarr':
          defs.defaultTable = 'characters';
          break;
        default: //custom entity
          defs.defaultTable = 'custom_entities';
          break;
      }
    }
    //set default and tids
    if(!type.endsWith('arr')) { //not array
      switch(type) {
        case 'int':
          defs.defaultValue = parseInt(values.defaultValueInt);
          break;
        case 'boolean':
          defs.defaultValue = values.defaultValueBool;
          break;
        case 'string':
          defs.defaultValue = values.defaultValueString;
          break;
        case 'location':
        case 'area':
        case 'character':
        default: //custom entity
          if(defaultValueEntity !== -1) {
            defs.defaultValue = defaultValueEntityName;
            defs.defaultTids = defaultValueEntity;
          }
          break;
      }
    } else { //array
      let quotesWrappedEntries = [];
      if(displayArrayPickerField()) {
        for (const entry of defaultValueEntityArrayNames) {
          quotesWrappedEntries.push('"' + entry + '"');
        }
        defs.defaultValue = quotesWrappedEntries.join(',');
        defs.defaultTids = defaultValueEntityArray;
      } else {
        const defaultValues = values.defaultValueArray;
        if(defaultValues.length === 0) {
          defs.defaultValue = '';
        } else {
          const valuesArray = defaultValues.split('\n');
          switch(type) {
            case 'intarr':
            case 'booleanarr':
              defs.defaultValue = valuesArray.join(',');
              break;
            case 'stringarr':
              for (const entry of valuesArray) {
                quotesWrappedEntries.push('"' + entry + '"');
              }
              defs.defaultValue = quotesWrappedEntries.join(',');
              break;
            default:
              break;
          }
        }
      }
    }
    return defs;
  };

  const isNameDisabled = () => {
    if(gameStateProp === null) {
      return false;
    } else {
      const editMode = gameStateProp.edit_mode.split('|');
      return editMode.indexOf('all') < 0 && editMode.indexOf('name') < 0;
    } 
  };

  const isTypeDisabled = () => {
    if(gameStateProp === null) {
      return false;
    } else {
      const editMode = gameStateProp.edit_mode.split('|');
      return editMode.indexOf('all') < 0 && editMode.indexOf('type') < 0;
    } 
  };

  const isDefaultDisabled = () => {
    if(gameStateProp === null) {
      return false;
    } else {
      const editMode = gameStateProp.edit_mode.split('|');
      return editMode.indexOf('all') < 0 && editMode.indexOf('default') < 0;
    } 
  };

  return (
    <Drawer
      title={(gameStateProp === null) ? 'New prop' : 'Edit prop'}
      width={displayArrayPickerField() ? 490 : 360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" form='add-edit-game-state-prop-id'>
            {(gameStateProp === null) ? 'Create' : 'Update'}
          </Button>
        </div>
      }
    >
      <Form layout='vertical' name='add-edit-game-state-prop' id='add-edit-game-state-prop-id' form={form} onFinish={onFinish} requiredMark={false}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input placeholder="Please enter a name" value={name} onChange={(e) => { setName(e.target.value) }} disabled={isNameDisabled()} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Please select a type' }]}
            >
              <Select value={type} onChange={(e) => { handleTypeChange(e) }} disabled={isTypeDisabled()}>
                <Option value='int'>int</Option>
                <Option value='intarr'>int[]</Option>
                <Option value='boolean'>boolean</Option>
                <Option value='booleanarr'>boolean[]</Option>
                <Option value='string'>string</Option>
                <Option value='stringarr'>string[]</Option>
                <Option value='location'>location</Option>
                <Option value='locationarr'>location[]</Option>
                <Option value='area'>area</Option>
                <Option value='areaarr'>area[]</Option>
                <Option value='character'>character</Option>
                <Option value='characterarr'>character[]</Option>
                { customEntityDefs !== undefined && customEntityDefs.map((customEntityDef) =>
                  <Fragment key={customEntityDef.singular_name}>
                    <Option value={customEntityDef.singular_name}>{customEntityDef.singular_name}</Option>
                    <Option value={customEntityDef.singular_name + 'arr'}>{customEntityDef.singular_name}[]</Option>
                  </Fragment>
                  )
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{display: (type === 'int' ? 'block' : 'none')}}>
          <Col span={24}>
            <Form.Item
              name="defaultValueInt"
              label="Default value (int)"
              rules={[{ required: (type === 'int'), message: 'Please enter an integer' }]}
            >
              <InputNumber disabled={isDefaultDisabled()} placeholder="Please enter an integer" value={defaultValueInt} onChange={(e) => { setDefaultValueInt(e) }} style={{width: '100%'}} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{display: (type === 'boolean' ? 'block' : 'none')}}>
          <Col span={24}>
            <Form.Item
              name="defaultValueBool"
              label="Default value (boolean)"
            >
              <Switch disabled={isDefaultDisabled()} checkedChildren="true" unCheckedChildren="false" checked={defaultValueBool} defaultChecked onChange={(e) => { setDefaultValueBool(e) }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{display: (displaySingleLineDefaultField() ? 'block' : 'none')}}>
          <Col span={24}>
            <Form.Item
              name="defaultValueString"
              label="Default value (string)"
              rules={[{ required: displaySingleLineDefaultField() && type !== 'string', message: 'Please enter a default value' }]}
            >
              <Input disabled={isDefaultDisabled()} placeholder="Please enter a default value" value={defaultValueString} onChange={(e) => { setDefaultValueString(e.target.value) }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{display: (displaySingleEntityDefaultField() ? 'block' : 'none')}}>
          <Col span={24}>
            <Form.Item
              label="Default value"
            >
              {displaySingleEntityDefaultField() &&
                <EntitySelectorView entityType={type} value={defaultValueEntity} onChangeCallback={(e, n) => { setDefaultValueEntity(e); setDefaultValueEntityName(n); }} disabled={isDefaultDisabled()} placeholder="Please select a default value" emptyOption={true} />
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{display: (displayArrayDefaultField() ? 'block' : 'none')}}>
          <Col span={24}>
            <Form.Item
              name="defaultValueArray"
              label={'Default value (' + arrayFieldLabelAndPlaceholder() + ')'}
            >
              <TextArea disabled={isDefaultDisabled()} rows={10} placeholder={arrayFieldLabelAndPlaceholder(false) + ' Leave empty for empty array.'} value={defaultValueArray} onChange={(e) => { setDefaultValueArray(e.target.value) }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{display: (displayArrayPickerField() ? 'block' : 'none')}}>
          <Col span={24}>
            <Form.Item
              label={'Default value'}
            >
              {displayArrayPickerField() &&
                <MultiEntityPicker entityType={type.slice(0, -3)} defaultTargetKeys={defaultValueEntityArray} onChangeCallback={(e, n) => { setDefaultValueEntityArray(e); setDefaultValueEntityArrayNames(n); }} disabled={isDefaultDisabled()}/>
              }
            </Form.Item>
          </Col>
        </Row>



      </Form>
    </Drawer>
  );
};

export default AddEditGameStateProp;
