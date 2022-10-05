import { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Typography, Select } from 'antd';
import '../../styles/components/sections/CustomizePlaytestSection.scss';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import AppLogicController from '../../controllers/AppLogicController';
import { AppContext } from '../../stores/AppStore';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const CustomizePlaytestSection = () => {
  const [,dispatch] = useContext(AppContext);
  const [selectedFont, setSelectedFont] = useState('default');

  useEffect(() => {
    AppDataFetchController.fetchRunConfiguration('font').then((config) => {
      setSelectedFont(config.value);
    }).catch(error => {
      console.log('||--FAIL', error);
    });
  }, []); // eslint-disable-line

  const onChangeFont = selected => {
    setSelectedFont(selected);
    AppLogicController.setRunConfiguration(dispatch, {name: 'font', value: selected});
  };

  return (
    <div className='customize-playtest-section'>
      <Row gutter={[24, 24]} style={{paddingBottom: 24}}>
        <Col span={24}>
          <Card className='run-configuration'>
            <Row>
              <Col span={16}>
                <Title level={5}>Typography</Title>
                <Paragraph><Text type='secondary'>Change your playtest experience typography</Text></Paragraph>
              </Col>
              <Col span={8}>
                <Select value={selectedFont} onChange={onChangeFont} style={{width: '100%'}}>
                  <Option value='default'>Default font</Option>
                  <Option value='adventure_request'>AdventureRequest</Option>
                  <Option value='breathe_fire_iii'>BreatheFireIII</Option>
                  <Option value='pipe_dream'>PipeDream</Option>
                  <Option value='pixel_azure_bonds'>PixelAzureBonds</Option>
                  <Option value='pixel_emulator'>PixelEmulator</Option>
                </Select>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomizePlaytestSection;
