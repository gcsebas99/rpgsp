//-- Components --//
import { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Col, Row, Button, Popconfirm, Popover, message } from 'antd';
import { SettingFilled, BookFilled, DownloadOutlined, UploadOutlined, DeleteFilled, PlusOutlined, BugOutlined, CaretRightOutlined, RocketOutlined } from '@ant-design/icons';
import NewStory from './drawers/NewStory';
//-- Controller --//
import AppLogicController from '../controllers/AppLogicController';
import ImportExportStoryController from '../controllers/ImportExportStoryController';
//-- Context --//
import { AppContext } from '../stores/AppStore';
//-- Images --//
import logo from '../images/logo192.png';
//-- Style --//
import '../styles/components/AppNav.scss';

const { Sider } = Layout;

const AppNav = () => {
  const [state, dispatch] = useContext(AppContext);

  const [collapsed, setCollapsed] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(true);
  const [newStoryVisible, setNewStoryVisible] = useState(false);

  useEffect(() => {
    //Mount
    document.getElementById('load-story-selector').addEventListener('change', readStoryFile, false);

  }, []); // eslint-disable-line

  useEffect(() => {
    setShouldRenderMenu(false);
    setTimeout(() => {
      setShouldRenderMenu(true);
    }, 5);
  }, [state.storyLoaded]);


  const loadStory = () => {
    document.getElementById('load-story-selector').click();
  };

  const clearStoryTest = () => {
    AppLogicController.devStartOver(dispatch);
    //dispatch({type: 'SET_STORY_LOADED', payload: false});
  };

  const downloadStory = () => {
    ImportExportStoryController.downloadStory(dispatch);
  };

  //dev
  const devStartOver = () => {
    AppLogicController.devStartOver(dispatch);
  };


  const readStoryFile = async (e) => {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    ImportExportStoryController.loadStoryFromFile(dispatch, file, importStoryProgressCallback, importStorySuccessCallback);
  };

  const importStoryProgressCallback = ({totalRows, completedRows}) => {
    //console.log(`Progress: ${completedRows} of ${totalRows} rows completed`);
  };

  const importStorySuccessCallback = () => {
    message.success('Story imported successfully!');
  };

  const toggleNav = () => {
    setCollapsed(!collapsed);
  };

  const handleClick = ({key}) => {
    switch(key) {
      case '1':
        dispatch({type: 'SET_APP_PAGE', payload: 'CONFIG'});
        break;
      case '2':
        dispatch({type: 'SET_APP_PAGE', payload: 'STORY'});
        break;
      case '3':
        dispatch({type: 'SET_APP_PAGE', payload: 'PLAYMODE'});
        break;
      default:
        break;
    }
  };

  const renderMenu = () => {
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={(state.storyLoaded ? ['1'] : [])} onClick={handleClick}>
        <Menu.Item key="1" disabled={!state.storyLoaded} icon={<SettingFilled />}>
          Configuration
        </Menu.Item>
        <Menu.Item key="2" disabled={!state.storyLoaded} icon={<BookFilled />}>
          Story
        </Menu.Item>
        <Menu.Item key="3" disabled={!state.storyLoaded} icon={<CaretRightOutlined />}>
          Play
        </Menu.Item>
      </Menu>
    );
  };

  const renderLoadStory = () => {
    return (
      <>
        {state.storyLoaded
          ? 
          <Popconfirm
            title={() => { return (<p>Download current story to avoid losing your changes.<br/>Continue loading a new story?</p>); }}
            onConfirm={loadStory}
            onCancel={() => {}}
            okText='Yes'
            cancelText='No'
            placement='right'
          >
            <Button type="default" block icon={<UploadOutlined />} style={{ marginBottom: 12 }}>Load story</Button>
          </Popconfirm>
          : 
          <Button type="default" block icon={<UploadOutlined />} style={{ marginBottom: 12 }} onClick={loadStory}>Load story</Button>
        }
        <input type='file' id='load-story-selector' accept='.json' style={{ display: 'none' }} />
      </>
    );
  };

  const renderClearStory = () => {
    return (
      <Popconfirm
        title='All data will be lost. Are you sure to delete this story?'
        onConfirm={clearStoryTest}
        onCancel={() => {}}
        okText='Yes'
        cancelText='No'
        placement='right'
      >
        <Button type='default' block icon={<DeleteFilled />} style={{ marginBottom: 12 }}>Clear story</Button>
      </Popconfirm>
    );
  };

  const renderLoadSamples = () => {
    const content = (
      <div>
        <Button type='default' block style={{ marginBottom: 12 }}>Sample #1 (english)</Button>
        <Button type='default' block style={{ marginBottom: 12 }}>Sample #1 (spanish)</Button>
      </div>
    );
    return (
      <Popover placement='right' title='Select a story' content={content} trigger='click'>
        <Button type="default" block icon={<RocketOutlined />} style={{ marginBottom: 12 }}>Load samples</Button>
      </Popover>
    );
  };

  return (
    <>
      <Sider className='app-nav' collapsible collapsed={collapsed} onCollapse={toggleNav}>
        <div className={`logo ${collapsed ? 'collapsed' : ''}`}>
          <img src={logo} alt="RPG Story Playtesting" onClick={toggleNav} />
        </div>
        <div className='menu-wrapper'>
          {shouldRenderMenu && renderMenu()}
        </div>
        {!collapsed &&
          <Row gutter={16} style={{ marginLeft: 8, marginRight: 8, marginTop: 32 }}>
            <Col span={24}>
              {!state.storyLoaded &&
                <Button type="default" onClick={() => { setNewStoryVisible(true); }} block icon={<PlusOutlined />} style={{ marginBottom: 12 }} >New story</Button>
              }
              {renderLoadStory()}
              {state.storyLoaded &&
                <>
                  <Button type="default" block icon={<DownloadOutlined />} style={{ marginBottom: 12 }} onClick={downloadStory}>Download story</Button>
                  {renderClearStory()}
                </>
              }
              {renderLoadSamples()}
              <Button type="default" block icon={<BugOutlined />} style={{ marginBottom: 12 }} onClick={devStartOver}>dev:startover</Button>
            </Col>
          </Row>
        }
      </Sider>
      <NewStory isDrawerVisible={newStoryVisible} onDrawerClose={() => { setNewStoryVisible(false); }} />
    </>
  );
};

export default AppNav;
