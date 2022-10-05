import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
// import { Card, Typography, Row, Col, Progress } from 'antd';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import ConversionUtils from '../../utils/ConversionUtils';
import InteractiveActionsRunner from './InteractiveActionsRunner';
import SequenceActionsRunner from './SequenceActionsRunner';
// import CFElement from '../ui/CFElement';
// const { Title, Text } = Typography;

const GameRunner = () => {
  const [storyline, setStoryline] = useState(null);

  const livePropsArray = useLiveQuery(AppDataFetchController.fetchPlayGameStateProps(['currentChapter', 'currentAct'], true));
  const liveProps = ConversionUtils.arrayToObject(livePropsArray, 'name');

  useEffect(() => {
    AppDataFetchController.fetchStoryline().then(storyline => { setStoryline(storyline) }).catch(error => { });
  }, []); // eslint-disable-line

  // useEffect(() => {
  //   if(liveProps && liveProps.currentChapter !== undefined) {
  //     if(liveProps.currentChapter.value !== chapter) {
  //       setChapter(liveProps.currentChapter.value);
  //     }
  //   }
  //   if(liveProps && liveProps.currentAct !== undefined) {
  //     if(liveProps.currentAct.value !== act) {
  //       setAct(liveProps.currentAct.value);
  //     }
  //   }
  // }, [liveProps]); // eslint-disable-line

  // useEffect(() => {
  //   AppDataFetchController.chapterByOrder(chapter).then(chapterObj => {
  //     AppDataFetchController.actsByChapterCount(chapterObj.id).then(count => { setActsCount(count) }).catch(error => { });
  //   }).catch(error => { });
  // }, [chapter]);

  const getCurrentAct = () => {
    const currentChapter = storyline.find(chapter => chapter.order === liveProps.currentChapter.value);
    return currentChapter.acts.find(act => act.order === liveProps.currentAct.value);
  };

  if (storyline === null || !liveProps) {
    return null;
  } else {
    const currentAct = getCurrentAct();
    return (
      <>
        {currentAct.type === 'sequence'
          ?
          <SequenceActionsRunner actId={currentAct.id} />
          :
          <InteractiveActionsRunner />
        }
      </>
    );
  }
};

export default GameRunner;