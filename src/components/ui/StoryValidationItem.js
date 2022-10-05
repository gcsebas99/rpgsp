import { Row, Col, Card, Typography } from 'antd';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const StoryValidationItem = ({ title, description, accomplished = false }) => {
  return (
    <Card className='story-validation-item'>
      <Row>
        <Col span={18}>
          <Title level={5}>{title}</Title>
          <Paragraph><Text type='secondary'>{description}</Text></Paragraph>
        </Col>
        <Col span={6} style={{textAlign: 'right'}}>
          {accomplished
            ?
            <>
              <Text style={{color: '#389e0d'}}>DONE</Text>
              <CheckCircleOutlined style={{color: '#389e0d', marginLeft: 8}} />
            </>
            : 
            <>
              <Text style={{color: '#cf1322'}}>Required</Text>
              <CloseCircleOutlined style={{color: '#cf1322', marginLeft: 8}} />
            </>
          }
        </Col>
      </Row>
    </Card>
  );
};

export default StoryValidationItem;
