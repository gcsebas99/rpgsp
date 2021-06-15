import { Card, Typography, Button, Popconfirm } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import '../../styles/components/entity_views/ChapterView.scss';

const { Text } = Typography;

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
}) => {

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
        title='Are you sure you want to remove this chapter?'
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

  const title = 'Chapter ' + chapter.order + ': ' + chapter.name;

  return (
    <Card className='chapter-view' size='small' title={title} extra={options} headStyle={{ background: '#f5f5f5'}} >
      <Text>{chapter.description}</Text>
    </Card>
  );
};

export default ChapterView;
