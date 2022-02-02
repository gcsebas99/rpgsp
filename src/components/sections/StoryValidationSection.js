import { Row, Col, Card } from 'antd';

const StoryValidationSection = () => {

  return (
    <div className='story-validation-section' style={{width: '80%', margin: '0 auto'}}>
      <Row gutter={[4, 4]} style={{paddingBottom: 24}}>
        <Col span={24}>
          <Card>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StoryValidationSection;
