import { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Drawer, Col, Row } from 'antd';
import AppDataFetchController from '../../controllers/AppDataFetchController';

const PlayTestAppMenu = ({ isDrawerVisible, onDrawerClose }) => {
  const audioEl = useRef();
  const [visible, setVisible] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentAreaId, setCurrentAreaId] = useState(null);
  //live
  const area = useLiveQuery(AppDataFetchController.fetchLiveArea(currentAreaId), [currentAreaId]);
  const currentArea = useLiveQuery(AppDataFetchController.fetchPlayGameStateProps(['currentArea'], true));

  useEffect(() => {
    if(currentArea !== undefined) {
      setCurrentAreaId(currentArea.tids);
    }
  }, [currentArea]); // eslint-disable-line

  useEffect(() => {
    if (area && area.sound) {
      setCurrentAudio(area.sound);
      if(audioEl.current !== undefined) {
        audioEl.current.play();
      }
    }
  }, [area]); // eslint-disable-line

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      openDrawer();
    }
  }, [isDrawerVisible]);

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  return (
    <Drawer
      title='Config'
      width={360}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      forceRender
    >
      <Row gutter={16}>
        <Col span={24}>
          <audio controls loop autoPlay ref={audioEl} src={currentAudio} />
        </Col>
      </Row>
    </Drawer>
  );
};

export default PlayTestAppMenu;

