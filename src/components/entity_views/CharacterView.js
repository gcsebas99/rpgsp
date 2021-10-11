import { Card, Typography, Button, Popconfirm } from 'antd';
import { StarFilled } from '@ant-design/icons';

const { Text } = Typography;

const CharacterView = ({ 
  character, 
  canEdit = true, 
  canRemove = true,
  onRemove = () => {},
  onEdit = () => {},
}) => {

  const options = [];
  if(canEdit) {
    options.push(<Button key='edit-character' type='link' size='small' onClick={onEdit}>Edit</Button>);
  }
  if(canRemove) {
    options.push(
      <Popconfirm
        key='remove-character'
        title={`Are you sure you want to remove this character?`}
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

  const title = character.name + '  (' + (character.is_pc ? 'PC' : 'NPC') + ')';
  const iconAndTitle = <> <StarFilled style={{color: character.color}} /> {title} </>;

  return (
    <Card className='character-view' size='small' title={iconAndTitle} extra={options} headStyle={{ background: '#f5f5f5'}} style={{marginBottom: 16}} >
      <Text>{character.description}</Text>
    </Card>
  );
};

export default CharacterView;
