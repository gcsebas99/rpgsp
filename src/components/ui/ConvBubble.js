import { CaretDownOutlined } from '@ant-design/icons';
import CFElement from './CFElement';

const COLOR1 = 'rgba(88, 197, 252, 0.5)';
const COLOR2 = 'rgba(109, 224, 144, 0.5)';

const ConvBubble = ({ direction = 1, text }) => {
  return (
    <div 
      className='conv-bubble'
      style={{
        padding: 16, 
        backgroundColor: (direction === 1 ? COLOR1 : COLOR2),
        borderRadius: 12,
        position: 'relative',
        marginBottom: 40,
        flex: 1,
      }}
    >
      <div style={{overflow: 'auto', maxHeight: 324}}>
        <CFElement Element={'p'} style={{fontSize: 24}}>{text}</CFElement>
      </div>
      <CaretDownOutlined 
        style={{
          fontSize: 48,
          position: 'absolute',
          bottom: -34,
          left: (direction === 1 ? '13%' : 'auto'),
          right: (direction === 2 ? '13%' : 'auto'),
          color: (direction === 1 ? COLOR1 : COLOR2),
        }}
      />
    </div>
  );
};

export default ConvBubble;
