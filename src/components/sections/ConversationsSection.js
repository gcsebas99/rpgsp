import { Row, Col, Card, Button, Typography, message } from 'antd';
import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { useLiveQuery } from 'dexie-react-hooks';
import ConversationView from '../entity_views/ConversationView';
import EntitySelectorView from '../entity_views/EntitySelectorView';
import AddEditConversation from '../drawers/AddEditConversation';
import AddEditConversationDialog from '../drawers/AddEditConversationDialog';
import AppDataFetchController from '../../controllers/AppDataFetchController';

const { Text } = Typography;

const ConversationsSection = ({ sectionActive }) => {
  const [,dispatch] = useContext(AppContext);
  const [characters, setCharacters] = useState(null);
  const [addEditConversationVisible, setAddEditConversationVisible] = useState(false);
  const [addEditConversationDialogVisible, setAddEditConversationDialogVisible] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [currentDialog, setCurrentDialog] = useState(null);
  const [currentConversationTotalDialogs, setCurrentConversationTotalDialogs] = useState(0);
  const [filterCharacterId, setFilterCharacterId] = useState(-1);
  //live
  const conversations = useLiveQuery(AppDataFetchController.fetchLiveConversations({character: filterCharacterId}), [filterCharacterId]);

  useEffect(() => {
    if (sectionActive) {
      setFilterCharacterId(-1);
      loadCharacters();
    }
  }, [sectionActive]);

  const loadCharacters = () => {
    AppDataFetchController.fetchStoryEntities('character').then((characters) => {
      setCharacters(characters);
    }).catch(error => {
      setCharacters(null);
      console.log('||--FAIL', error);
    });
  };

  const addConversation = () => {
    setCurrentConversation(null);
    setAddEditConversationVisible(true);
  };

  const editConversation = (conversation) => {
    setCurrentConversation(conversation);
    setAddEditConversationVisible(true);
  };

  const removeConversation = (conversation) => {
    AppLogicController.deleteConversation(dispatch, conversation.id).then(result => {
      message.success('Conversation removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const addConversationDialog = (conversation, totalDialogs) => {
    setCurrentDialog(null);
    setCurrentConversation(conversation);
    setCurrentConversationTotalDialogs(totalDialogs);
    setAddEditConversationDialogVisible(true);
  };

  const editConversationDialog = (dialog, conversation) => {
    setCurrentConversation(conversation);
    setCurrentDialog(dialog);
    setAddEditConversationDialogVisible(true);
  };

  const removeConversationDialog = (dialog, conversation) => {
    AppLogicController.deleteConversationDialog(dispatch, dialog.id, conversation.id).then(result => {
      message.success('Dialog removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const moveConversationDialogUp = (dialog, conversation) => {
    const orderInfo = {oldOrder: dialog.order, order: dialog.order - 1, conversationId: conversation.id};
    AppLogicController.updateConversationDialogOrder(dispatch, dialog.id, orderInfo).then(result => {
      //
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const moveConversationDialogDown = (dialog, conversation) => {
    const orderInfo = {oldOrder: dialog.order, order: dialog.order + 1, conversationId: conversation.id};
    AppLogicController.updateConversationDialogOrder(dispatch, dialog.id, orderInfo).then(result => {
      //
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  return (
    <div>
      <Row gutter={[0, 8]} style={{paddingBottom: 24}}>
        <Col span={24}>
          <Card size='small'>
            <Button type='primary' onClick={addConversation}>
              Add Conversation
            </Button>
          </Card>
        </Col>
        <Col span={24}>
          <Card size='small'>
            <Row gutter={[16, 0]} justify='start' align='middle'>
              <Col span={2}>
                <Text type='secondary'>Filters</Text>
              </Col>
              <Col span={6}>
                <EntitySelectorView entityType={'character'} value={filterCharacterId} onChangeCallback={(e, n) => { setFilterCharacterId(e); }} placeholder="Filter character" emptyOption={true} emptyOptionLabel='Filter character' />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          { conversations !== undefined && conversations.map(conversation =>
            <ConversationView 
              key={conversation.id} 
              conversation={conversation} 
              characters={characters}
              onRemove={() => { removeConversation(conversation) }} 
              onEdit={() => { editConversation(conversation) }} 
              onAddDialog={(totalDialogs) => { addConversationDialog(conversation, totalDialogs) }} 
              onEditDialog={(dialog) => { editConversationDialog(dialog, conversation) }}
              onRemoveDialog={(dialog) => { removeConversationDialog(dialog, conversation) }}
              onMoveDialogUp={(dialog) => { moveConversationDialogUp(dialog, conversation) }}
              onMoveDialogDown={(dialog) => { moveConversationDialogDown(dialog, conversation) }}
            />
            )
          }
        </Col>
      </Row>
      <AddEditConversation
        conversation={currentConversation}
        isDrawerVisible={addEditConversationVisible} 
        onDrawerClose={() => { setAddEditConversationVisible(false); }} 
      />
      <AddEditConversationDialog
        dialog={currentDialog}
        conversation={currentConversation}
        totalDialogs={currentConversationTotalDialogs}
        isDrawerVisible={addEditConversationDialogVisible} 
        onDrawerClose={() => { setAddEditConversationDialogVisible(false); }} 
      />
    </div>
  );
};

export default ConversationsSection;
