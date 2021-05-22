import { Card, Typography, Button, Popconfirm } from 'antd';
import '../styles/components/SimpleEntityView.scss';

const { Text } = Typography;

const SimpleEntityView = ({ 
  entity, 
  entityName = 'entity', 
  canEdit = true, 
  canRemove = true,
  onRemove = () => {},
  onEdit = () => {},
}) => {

  const options = [];
  if(canEdit) {
    options.push(<Button key='edit-entity' type='link' size='small' onClick={onEdit}>Edit</Button>);
  }
  if(canRemove) {
    options.push(
      <Popconfirm
        key='remove-entity'
        title={`Are you sure you want to remove this ${entityName}?`}
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

  return (
    <Card className='simple-entity-view' size='small' title={entity.name} extra={options} headStyle={{ background: '#f5f5f5'}} >
      <Text>{entity.description}</Text>
    </Card>
  );
};

export default SimpleEntityView;
