import db from '../db/AppDatabase';
import { exportDB, importInto } from 'dexie-export-import';
import download from 'downloadjs';

//Controls story import/export operations
class ImportExportStoryController {

  static async downloadStory(dispatch, progressCallback = () => {}, errorCallback = () => {}) {
    try {
      const story = await db.stories.where('id').equals(1).first();
      const d = new Date();
      const date = d.getFullYear().toString() + d.getMonth().toString() + d.getDate().toString() + '-' + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();
      const fileName = story.title.replaceAll(' ', '_') + '-' + date + '.json';
      const blob = await exportDB(db, {prettyJson: true, progressCallback});
      download(blob, fileName, 'application/json');
    } catch (error) {
      errorCallback(error);
    }
  }

  static async loadStoryFromFile(dispatch, file, progressCallback = () => {}, successCallback = () => {}) {
    try {
      if(db.isOpen()){
        await db.delete().then( () => db.open() );
      }
      await importInto(db, file, {
        acceptMissingTables: false,
        acceptVersionDiff: false,
        acceptNameDiff: false,
        acceptChangedPrimaryKey: false,
        progressCallback: progressCallback
      });
      const story = await db.stories.where('id').equals(1).first();
      if (story !== undefined) {
        dispatch({type: 'SET_STORY_LOADED', payload: true});
      }
      successCallback();
    } catch (error) {
      dispatch({type: 'SET_APP_STORY_LOAD_ERROR', payload: error});
      console.log(error);
    }
  }

  static async loadStoryFromUrl(dispatch, url, progressCallback = () => {}, successCallback = () => {}) {
    dispatch({type: 'SET_APP_GLOBAL_LOADING', payload: true});
    await new Promise(r => setTimeout(r, 800));
    try {
      fetch(url).then(async response => {
        if (response.status !== 200) {
          dispatch({type: 'SET_APP_STORY_LOAD_ERROR', payload: response.status});
          return;
        }
        //clear db
        if(db.isOpen()){
          await db.delete().then( () => db.open() );
        }
        //load new story
        response.blob().then(async blob => {
          await importInto(db, blob, {
            acceptMissingTables: false,
            acceptVersionDiff: false,
            acceptNameDiff: false,
            acceptChangedPrimaryKey: false,
            progressCallback: progressCallback
          });
          const story = await db.stories.where('id').equals(1).first();
          if (story !== undefined) {
            dispatch({type: 'SET_STORY_LOADED', payload: true});
            successCallback();
          }
        });
      })
      .catch(error => {
        dispatch({type: 'SET_APP_STORY_LOAD_ERROR', payload: error});
        console.log(error);
      });
    } catch (error) {
      dispatch({type: 'SET_APP_STORY_LOAD_ERROR', payload: error});
      console.log(error);
    }
  }

}

export default ImportExportStoryController;