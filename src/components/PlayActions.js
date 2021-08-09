import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../stores/AppStore';
import { Affix, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import '../styles/components/PlayActions.scss';

const PlayActions = () => {
  const [state] = useContext(AppContext);
  const [shouldRenderPlayMessage, setShouldRenderPlayMessage] = useState(true);

  useEffect(() => {
    setShouldRenderPlayMessage(false);
    setTimeout(() => {
      setShouldRenderPlayMessage(true);
    }, 5);
  }, [state.storyVerifyingRunnable]);

  const renderPlayMessage = () => {
    let message;
    if (state.storyVerifyingRunnable) {
      message = <LoadingOutlined />;
    } else {
      if (state.storyRunnable) {
        message = <span>You're all set!! Play your story.</span>;
      } else {
        message = <span>Please check "Story validation" tab.</span>;
      }
    }
    return (
      <p style={{marginBottom: 0, marginRight: 8}}>{message}</p>
    );
  };

  return (
    <Affix>
      <div className='play-actions'>
        {shouldRenderPlayMessage && renderPlayMessage()}
        <Button type='primary' disabled={!state.storyRunnable}>
          RUN PLAYTEST
        </Button>
      </div>
    </Affix>
  );
};

export default PlayActions;
