import { Card, Typography, Button, Popconfirm, Divider } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
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
}) => {

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

  return (
    <Card className='act-view' size='small' title={title} extra={options} headStyle={{ background: '#d9d9d9'}} >
      <Text>{act.description}</Text>
      <Divider></Divider>
      {(act.type === 'interactive')
        ? 
          <Text strong>This act ends when:</Text>
        : 
          <Text strong>This act contains ## steps</Text>
      }
    </Card>
  );
};

export default ActView;
