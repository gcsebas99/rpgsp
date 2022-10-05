import { useContext } from 'react';
import { AppContext } from '../../stores/AppStore';

const CFElement = ({ Element, className = '', children, ...props }) => {
  const [state] = useContext(AppContext);
  let cfClassName = className;

  if(state.runConfigurations && state.runConfigurations.font && state.runConfigurations.font !== 'default') {
    cfClassName += ' c-f cf-' + state.runConfigurations.font;
  }

  return (
    <Element className={cfClassName} {...props}>
      {children}
    </Element>
  );
};

export default CFElement;
