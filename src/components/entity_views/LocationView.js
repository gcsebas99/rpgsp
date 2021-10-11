import { Card, Divider, Typography, Button, List, Row, Col, Popconfirm } from 'antd';
import { EnvironmentFilled } from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';
import '../../styles/components/LocationView.scss';

const { Text } = Typography;

const LocationView = ({ 
  location,  
  canEdit = true, 
  canRemove = true,
  onRemove = () => {},
  onEdit = () => {},
  onEditMap = () => {},
  //
  onAddArea = () => {},
  onEditArea = () => {},
  onRemoveArea = () => {},
}) => {

  const areas = useLiveQuery(() => db.areas.where('location_id').equals(location.id).toArray());

  const options = [];
  options.push(<Button key='edit-map' type='link' size='small' onClick={onEditMap}>Map</Button>);
  if(canEdit) {
    options.push(<Button key='edit-location' type='link' size='small' onClick={onEdit}>Edit</Button>);
  }
  if(canRemove) {
    options.push(
      <Popconfirm
        key='remove-location'
        title={`Are you sure you want to remove this location and all its areas?`}
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

  const header = (
    <Row>
      <Col span={6}><Text strong>Area Name</Text></Col>
      <Col span={12}><Text strong>Description</Text></Col>
      <Col span={6}></Col>
    </Row>
  );

  return (
    <Card className='location-view' size='small' title={location.name} extra={options} headStyle={{ background: '#f5f5f5'}} >
      <Text>{location.description}</Text>
      <Divider />
      { (areas !== undefined && areas.length > 0) && 
        <List
          header={header}
          dataSource={areas}
          renderItem={area => (
            <List.Item className='area-list-item'>
              <Row>
                <Col span={6}><EnvironmentFilled style={{color: area.color}} /> {area.name}</Col>
                <Col span={12}>{area.description}</Col>
                <Col span={6} style={{textAlign: 'right'}}>
                  <Button type='link' size='small' onClick={() => { onEditArea(area) }}>Edit</Button>
                  <Popconfirm
                    title={`Are you sure you want to remove this area?`}
                    onConfirm={() => { onRemoveArea(area) }}
                    onCancel={() => {}}
                    okText='Yes'
                    cancelText='No'
                    placement='bottomRight'
                  >
                    <Button type='link' size='small'>Remove</Button>
                  </Popconfirm>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      }
      <Button type='default' size='small' onClick={onAddArea}>
        Add Area
      </Button>
    </Card>
  );
};

export default LocationView;
