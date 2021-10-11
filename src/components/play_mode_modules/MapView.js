import { Card, Typography } from 'antd';
const { Title } = Typography;

const MapView = () => {

  return (
    <Card style={{flex: 1, marginBottom: 12}}>
      <Title level={5}>Map</Title>
      <p>Map (flexible)</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  );
};

export default MapView;
