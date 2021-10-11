import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card, Typography, Row, Col, Progress } from 'antd';
import AppDataFetchController from '../../controllers/AppDataFetchController';
const { Title, Text } = Typography;

const StoryProgress = () => {
  const [chaptersCount, setChaptersCount] = useState(null);
  const [actsCount, setActsCount] = useState(null);

  AppDataFetchController.chaptersCount().then(count => { setChaptersCount(count) }).catch(error => { });
  

  console.log('||-- typeof', typeof AppDataFetchController.fetchPlayGameStateProps(['currentChapter'], true), AppDataFetchController.fetchPlayGameStateProps(['currentChapter'], true));
  const currentChapter = useLiveQuery(AppDataFetchController.fetchPlayGameStateProps(['currentChapter'], true));
  console.log('||-- typeof', typeof currentChapter, currentChapter);
  // const currentAct = useLiveQuery(AppDataFetchController.fetchPlayGameStateProps(['currentAct'], true));

  // useEffect(() => {
  //   if(currentChapter !== undefined) {
  //     const chapter = AppDataFetchController.chapterByOrder(currentChapter);
  //     setActsCount(AppDataFetchController.actsByChapterCount(chapter.id))
  //   }
  // }, [currentChapter]);

  return (
    <Card style={{height: 200}}>
      <Title level={5}>Progress {chaptersCount} == {currentChapter !== undefined && currentChapter[0].value}</Title>
      <Row gutter={[8, 8]}>
        <Col span={12} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Progress type="circle" percent={75} format={percent => `${percent}/${percent}`} strokeColor='#fa541c' />
          <Text type="secondary">Chapter</Text>
        </Col>
        <Col span={12} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Progress type="circle" percent={75} format={percent => `${percent}/${percent}`} strokeColor='#fa541c' />
          <Text type="secondary">Act</Text>
        </Col>
      </Row>
    </Card>
  );
};

//{chaptersCount}={actsCount}  --  {currentChapter}||{currentAct}

export default StoryProgress;