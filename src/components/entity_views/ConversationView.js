import { Card, Button, Popconfirm, Typography, List, Row, Col, Collapse } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import DialogListItem from './DialogListItem';

const { Text } = Typography;
const { Panel } = Collapse;

const ConversationView = ({ 
  conversation,
  characters,
  onRemove = () => {},
  onEdit = () => {},
  //
  onAddDialog = () => {},
  onEditDialog = () => {},
  onRemoveDialog = () => {},
  onMoveDialogUp = () => {},
  onMoveDialogDown = () => {},
}) => {

  const dialogs = useLiveQuery(AppDataFetchController.fetchLiveConversationDialogs(conversation && conversation.id), [conversation]);

  const options = [];
  options.push(<Button key='edit-conversation' type='link' size='small' onClick={onEdit}>Edit</Button>);
  options.push(
    <Popconfirm
      key='remove-conversation'
      title={`Are you sure you want to remove this conversation and all its dialogs?`}
      onConfirm={onRemove}
      onCancel={() => {}}
      okText='Yes'
      cancelText='No'
      placement='bottomRight'
    >
      <Button type='link' size='small'>Remove</Button>
    </Popconfirm>
  );

  const dialogsHeader = (
    <Row>
      <Col span={2}><Text strong>Order</Text></Col>
      <Col span={13}><Text strong>Dialog</Text></Col>
      <Col span={3}><Text strong>Character</Text></Col>
      <Col span={6} style={{textAlign: 'right'}}><Text strong>Options</Text></Col>
    </Row>
  );

  const totalDialogs = (dialogs !== undefined) ? dialogs.length : 0;
  const dialogsCollapseHeader = (totalDialogs === 1) ? '1 dialog' : totalDialogs + ' dialogs';

  return (
    <Card className='conversation-view' size='small' title={conversation.name} extra={options} headStyle={{ background: '#f5f5f5'}} style={{marginBottom: 16}}>
      {(dialogs !== undefined && dialogs.length > 0) 
        ?
        <Collapse defaultActiveKey={['1']} ghost>
          <Panel header={dialogsCollapseHeader} key="1">
            <List
              style={{marginBottom: '20px'}}
              header={dialogsHeader}
              dataSource={dialogs.sort((a, b) => { return a.order - b.order; })}
              renderItem={(item, index) => (
                <DialogListItem
                  dialog={item}
                  dialogIndex={index}
                  totalDialogs={dialogs.length}
                  characters={characters} 
                  onEditDialog={() => { onEditDialog(item) }} 
                  onRemoveDialog={() => { onRemoveDialog(item) }}
                  onMoveDialogUp={() => { onMoveDialogUp(item) }} 
                  onMoveDialogDown={() => { onMoveDialogDown(item) }} 
                />
              )}
            />
          </Panel>
        </Collapse>
        : 
        <p><Text>This conversation hasn't dialogs yet</Text></p>
      }
      <Button type='default' size='small' onClick={() => { onAddDialog(totalDialogs)}}>
        Add Dialog
      </Button>
    </Card>
  );
};

export default ConversationView;
