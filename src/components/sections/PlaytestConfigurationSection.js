import { useState } from 'react';
import { Row, Col, Card, Typography, Switch } from 'antd';
import '../../styles/components/sections/PlaytestConfigurationSection.scss';

const { Title, Paragraph, Text } = Typography;

const PlaytestConfigurationSection = () => {
  //demo configs
  const [groupPlayerInventory, setGroupPlayerInventory] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  return (
    <div className='playtest-configuration-section'>
      <Row gutter={[24, 24]} style={{paddingBottom: 24}}>
        <Col span={24}>
          <Card className={`run-configuration ${groupPlayerInventory ? 'enabled-state' : ''}`}>
            <div style={{flex: 1}}>
              <Title level={5}>Group player inventory</Title>
              <Paragraph><Text type='secondary'>Show inventory props in separate group</Text></Paragraph>
            </div>
            <Switch onChange={(e) => { setGroupPlayerInventory(e) }} />
          </Card>
        </Col>
        <Col span={24}>
          <Card className={`run-configuration ${showAchievements ? 'enabled-state' : ''}`}>
            <div style={{flex: 1}}>
              <Title level={5}>Show player achievements</Title>
              <Paragraph><Text type='secondary'>Display notifications when player accomplish objectives, obtain items, etc</Text></Paragraph>
            </div>
            <Switch onChange={(e) => { setShowAchievements(e) }} />
          </Card>
        </Col>
        <Col span={24}>
          <Card className={`run-configuration`}>
            <div style={{flex: 1}}>
              <Title level={5}>Focus Game state props</Title>
              <Paragraph><Text type='secondary'>Analyze specific properties in play mode</Text></Paragraph>
            </div>
            <Text>TBD</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaytestConfigurationSection;
