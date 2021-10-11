import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../stores/AppStore';
import { Affix, Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import AppLogicController from '../controllers/AppLogicController';
import '../styles/components/PlayActions.scss';

const PlayActions = () => {
  const [state, dispatch] = useContext(AppContext);
  const [shouldRenderPlayMessage, setShouldRenderPlayMessage] = useState(true);

  useEffect(() => {
    setShouldRenderPlayMessage(false);
    setTimeout(() => {
      setShouldRenderPlayMessage(true);
    }, 5);
  }, [state.storyVerifyingRunnable]);

  const runPlaytest = () => {
    AppLogicController.startNewPlayTestRun(dispatch).then(() => {
      const searchParams = new URLSearchParams();
      searchParams.set('play', 'true');
      const url = window.location.href + '?' + searchParams.toString();
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const renderPlayMessage = () => {
    let playMessage;
    if (state.storyVerifyingRunnable) {
      playMessage = <LoadingOutlined />;
    } else {
      if (state.storyRunnable) {
        playMessage = <span>You're all set!! Play your story.</span>;
      } else {
        playMessage = <span>Please check "Story validation" tab.</span>;
      }
    }
    return (
      <p style={{marginBottom: 0, marginRight: 8}}>{playMessage}</p>
    );
  };

  return (
    <Affix>
      <div className='play-actions'>
        {shouldRenderPlayMessage && renderPlayMessage()}
        <Button type='primary' disabled={!state.storyRunnable} onClick={runPlaytest}>
          RUN PLAYTEST
        </Button>
      </div>
    </Affix>
  );
};

export default PlayActions;
