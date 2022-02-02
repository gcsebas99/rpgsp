import { Card, Typography, Button } from 'antd';
import PlayInteractionsController from '../../controllers/PlayInteractionsController';
const { Title } = Typography;

const MapView = () => {

  return (
    <Card style={{flex: 1, marginBottom: 12}}>
      <Title level={5}>Map</Title>
      <p>Map (flexible)</p>
      <p>Card content</p>
      <p>Card content</p>
      <Button onClick={() => { PlayInteractionsController.simulateNextAct() }}>
        Simulate Next Act
      </Button>
    </Card>
  );
};

export default MapView;
