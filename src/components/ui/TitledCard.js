import styled from '@emotion/styled';
import CFElement from './CFElement';
import { Card, Typography } from 'antd';
const { Title } = Typography;

const CardPadd = styled(Card, {
  shouldForwardProp: (prop) => !['cfelement'].includes(prop),
})(({ cfelement }) => ({
  '.ant-card-body': {
    padding: '6px 10px',
    'h5': {
      marginTop: cfelement ? -18 : -16,
      fontSize: cfelement ? 16 : 13,
    },
  },
}));

const TitledCard = ({ title, titleStyle = {}, cfelement = true, children, ...props }) => {
  return (
    <CardPadd cfelement={cfelement} {...props}>
      {cfelement
        ? <CFElement Element={Title} level={5} style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...titleStyle}}>{title}</CFElement>
        : <Title level={5} type='secondary' style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...titleStyle}}>{title}</Title>
      }
      
      {children}
    </CardPadd>
  );
};

export default TitledCard;
