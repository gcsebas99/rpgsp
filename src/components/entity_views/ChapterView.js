import { useContext } from 'react';
import { Card, Typography, Button, Popconfirm, Collapse, message } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import ActView from './ActView';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';
import AppLogicController from '../../controllers/AppLogicController';
import { AppContext } from '../../stores/AppStore';
import '../../styles/components/entity_views/ChapterView.scss';

const { Text } = Typography;
const { Panel } = Collapse;

const ChapterView = ({ 
  chapter,
  chapterIndex = null,
  totalChapters = 0,
  canEdit = true, 
  canRemove = true,
  onRemove = () => {},
  onEdit = () => {},
  onMoveOrderUp = () => {},
  onMoveOrderDown = () => {},
  //
  onAddAct = () => {},
  onEditAct = () => {},
  onRemoveAct = () => {},
  //
  onAddEditCondition = () => {},
}) => {
  const [,dispatch] = useContext(AppContext);

  const acts = useLiveQuery(() => db.acts.where('chapter_id').equals(chapter.id).toArray() );

  const options = [];
  options.push(
    <Button 
      type="default"
      key='move-up' 
      icon={<CaretUpOutlined />} 
      size='small' style={{marginRight: '4px'}} 
      disabled={chapterIndex === 0}
      onClick={onMoveOrderUp} />
  );
  options.push(
    <Button 
      type="default" 
      key='move-down' 
      icon={<CaretDownOutlined />} 
      size='small' 
      style={{marginRight: '24px'}} 
      disabled={chapterIndex === (totalChapters-1)}
      onClick={onMoveOrderDown} />
  );
  if(canEdit) {
    options.push(<Button key='edit-chapter' type='link' size='small' onClick={onEdit}>Edit</Button>);
  }
  if(canRemove) {
    options.push(
      <Popconfirm
        key='remove-chapter'
        title={() => { return (<p>Are you sure you want to remove this chapter?<br/>All acts, sequence actions and end conditions associated will be removed.</p>); }}
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

  const moveActUp = (act) => {
    const orderInfo = {oldOrder: act.order, order: act.order - 1, chapter_id: chapter.id};
    AppLogicController.updateActOrder(dispatch, act.id, orderInfo).then(result => {
      //
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const moveActDown = (act) => {
    const orderInfo = {oldOrder: act.order, order: act.order + 1, chapter_id: chapter.id};
    AppLogicController.updateActOrder(dispatch, act.id, orderInfo).then(result => {
      //
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const title = 'Chapter ' + chapter.order + ': ' + chapter.name;
  const totalActs = (acts !== undefined) ? acts.length : 0;
  const actsCollapseHeader = (totalActs === 0) ? 'No acts' : ((totalActs === 1) ? '1 act' : totalActs + ' acts');

  return (
    <Card className='chapter-view' size='small' title={title} extra={options} headStyle={{ background: '#f5f5f5'}} >
      <Text>{chapter.description}</Text>
      <Collapse defaultActiveKey={['1']} ghost>
        <Panel header={actsCollapseHeader} key="1">
          { acts !== undefined && acts.sort((a, b) => { return a.order - b.order; }).map((act, index) =>
            <ActView 
              key={act.id} 
              act={act}
              actIndex={index} 
              totalActs={totalActs}
              onRemove={() => { onRemoveAct(act) }} 
              onEdit={() => { onEditAct(act) }} 
              onMoveOrderUp={() => { moveActUp(act) }} 
              onMoveOrderDown={() => { moveActDown(act) }} 
              onAddEditCondition={onAddEditCondition}
            />
            )
          }
          <Button type='default' size='small' onClick={() => { onAddAct(totalActs)}}>
            Add Act
          </Button>
        </Panel>
      </Collapse>
    </Card>
  );
};
/*
              onMoveOrderUp={() => { moveCharpterUp(chapter) }} 
              onMoveOrderDown={() => { moveCharpterDown(chapter) }} */

export default ChapterView;
