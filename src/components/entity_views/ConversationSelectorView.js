import { useState, useEffect } from 'react';
import { Select } from 'antd';
import AppDataFetchController from '../../controllers/AppDataFetchController';

const { Option } = Select;

const ConversationSelectorView = ({
  value,
  onChangeCallback,
  disabled = false,
  placeholder = '',
  emptyOption = false,
  emptyOptionLabel = '(empty)',
  multiple = false,
}) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    //Mount
    AppDataFetchController.fetchConversations().then((fetchedConversations) => {
      setConversations(fetchedConversations);
    }).catch(error => {
      console.log('||--FAIL', error);
    });
  }, []); // eslint-disable-line


  const getConversationName = (id) => {
    return (id !== -1) ? conversations.find(conversation => conversation.id === id).name : '';
  };

  const getConversationsName = (values) => {
    let names = [];
    values.forEach(value => {
      names.push(getConversationName(value));
    });
    return names;
  };

  const handleOnChange = (value) => {
    if(multiple) {
      onChangeCallback(value, getConversationsName(value));
    } else {
      onChangeCallback(value, getConversationName(value));
    }
  };

  return (
    <Select 
      value={value} 
      onChange={handleOnChange}
      style={{width: '100%'}} 
      disabled={disabled} 
      placeholder={placeholder}
      mode={multiple ? 'multiple' : undefined}
    >
      {emptyOption && <Option key='empty-opt' value={-1}>{emptyOptionLabel}</Option>}
      { conversations && conversations.length > 0 && conversations.map(conversation => {
          return (<Option key={conversation.id} value={conversation.id}>{conversation.name}</Option>);
        })
      }
    </Select>
  );
};

export default ConversationSelectorView;
