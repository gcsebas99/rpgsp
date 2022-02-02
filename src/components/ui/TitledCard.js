import { Card, Typography } from 'antd';
const { Title } = Typography;

const TitledCard = ({ title, titleStyle = {}, children, ...props }) => {
  return (
    <Card {...props}>
      <Title level={5} style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...titleStyle}}>{title}</Title>
      {children}
    </Card>
  );
};

export default TitledCard;
