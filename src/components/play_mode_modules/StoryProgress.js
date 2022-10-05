import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card, Typography, Row, Col, Progress } from 'antd';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import ConversionUtils from '../../utils/ConversionUtils';
import CFElement from '../ui/CFElement';
const { Title, Text } = Typography;

const StoryProgress = () => {
  const [chaptersCount, setChaptersCount] = useState(0);
  const [actsCount, setActsCount] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [act, setAct] = useState(0);

  AppDataFetchController.chaptersCount().then(count => { setChaptersCount(count) }).catch(error => { });
  const livePropsArray = useLiveQuery(AppDataFetchController.fetchPlayGameStateProps(['currentChapter', 'currentAct'], true));
  const liveProps = ConversionUtils.arrayToObject(livePropsArray, 'name');

  useEffect(() => {
    if(liveProps && liveProps.currentChapter !== undefined) {
      if(liveProps.currentChapter.value !== chapter) {
        setChapter(liveProps.currentChapter.value);
      }
    }
    if(liveProps && liveProps.currentAct !== undefined) {
      if(liveProps.currentAct.value !== act) {
        setAct(liveProps.currentAct.value);
      }
    }
  }, [liveProps]); // eslint-disable-line

  useEffect(() => {
    AppDataFetchController.chapterByOrder(chapter).then(chapterObj => {
      AppDataFetchController.actsByChapterCount(chapterObj.id).then(count => { setActsCount(count) }).catch(error => { });
    }).catch(error => { });
  }, [chapter]);

  //<Title level={5}>Progress</Title>
  return (
    <Card>
      <CFElement Element={Title} level={5}>Progress</CFElement>
      <Row gutter={[8, 8]}>
        <Col span={24} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Progress percent={(chapter/chaptersCount)*100} format={percent => `${chapter}/${chaptersCount}`} strokeColor='#fa541c' />
          <Text type="secondary">Chapter</Text>
        </Col>
        <Col span={24} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Progress percent={(act/actsCount)*100} format={percent => `${act}/${actsCount}`} strokeColor='#fa541c' />
          <Text type="secondary">Act</Text>
        </Col>
      </Row>
    </Card>
  );
};

export default StoryProgress;