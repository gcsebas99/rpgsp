//-- Components --//
import { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Col, Row, Button, Popconfirm } from 'antd';
import { SettingFilled, BookFilled, DownloadOutlined, UploadOutlined, DeleteFilled, PlusOutlined, BugOutlined, CaretRightOutlined } from '@ant-design/icons';
import NewStory from './drawers/NewStory';
//-- Controller --//
import AppLogicController from '../controllers/AppLogicController';
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
    setShouldRenderMenu(false);
    setTimeout(() => {
      setShouldRenderMenu(true);
    }, 5);
  }, [state.storyLoaded]);


  //test
  const loadStoryTest = () => {
    dispatch({type: 'SET_STORY_LOADED', payload: true});
  };
  const clearStoryTest = () => {
    AppLogicController.devStartOver(dispatch);
    //dispatch({type: 'SET_STORY_LOADED', payload: false});
  };

  //dev
  const devStartOver = () => {
    AppLogicController.devStartOver(dispatch);
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
              <Button type="default" block icon={<UploadOutlined />} style={{ marginBottom: 12 }} onClick={loadStoryTest}>Load story</Button>
              {state.storyLoaded &&
                <>
                  <Button type="default" block icon={<DownloadOutlined />} style={{ marginBottom: 12 }}>Download story</Button>
                  {renderClearStory()}
                </>
              }
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
