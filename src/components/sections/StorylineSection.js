import { useState, useContext } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { Button, message } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';
import ChapterView from '../entity_views/ChapterView';
import AddEditChapter from '../drawers/AddEditChapter';

const StorylineSection = () => {
  const [,dispatch] = useContext(AppContext);
  const [addEditChapterVisible, setAddEditChapterVisible] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);

  const chapters = useLiveQuery(() => db.chapters.orderBy('order').toArray());

  const addChapter = () => {
    setCurrentChapter(null);
    setAddEditChapterVisible(true);
  };

  const editCharpter = (chapter) => {
    setCurrentChapter(chapter);
    setAddEditChapterVisible(true);
  };

  const moveCharpterUp = (chapter) => {
    const orderInfo = {oldOrder: chapter.order, order: chapter.order - 1};
    AppLogicController.updateChapterOrder(dispatch, chapter.id, orderInfo).then(result => {
      //
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const moveCharpterDown = (chapter) => {
    const orderInfo = {oldOrder: chapter.order, order: chapter.order + 1};
    AppLogicController.updateChapterOrder(dispatch, chapter.id, orderInfo).then(result => {
      //
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const removeChapter = (chapter) => {
    AppLogicController.deleteChapter(dispatch, chapter.id).then(result => {
      message.success('Chapter removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  const totalChapters = (chapters !== undefined) ? chapters.length : 0;

  return (
    <div>
      { chapters !== undefined && chapters.map((chapter, index) =>
        <ChapterView 
          key={chapter.id} 
          chapter={chapter}
          chapterIndex={index} 
          totalChapters={totalChapters}
          onRemove={() => { removeChapter(chapter) }} 
          onEdit={() => { editCharpter(chapter) }} 
          onMoveOrderUp={() => { moveCharpterUp(chapter) }} 
          onMoveOrderDown={() => { moveCharpterDown(chapter) }} 
        />
        )
      }
      <Button type='primary' onClick={addChapter}>
        Add Chapter
      </Button>
      <AddEditChapter
        chapter={currentChapter}
        totalChapters={totalChapters}
        isDrawerVisible={addEditChapterVisible} 
        onDrawerClose={() => { setAddEditChapterVisible(false); }} 
      />
    </div>
  );
};

export default StorylineSection;
