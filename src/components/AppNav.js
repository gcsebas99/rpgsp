import {Fragment, useState} from 'react';
import { Layout, Menu } from 'antd';
import logo from '../images/logo192.png';
import { SettingFilled, BookFilled, DownloadOutlined, UploadOutlined, DeleteFilled } from '@ant-design/icons';
import '../styles/components/AppNav.scss';

const { Sider } = Layout;

const AppNav = ({ onNavChange }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleNav = () => {
    setCollapsed(!collapsed);
  };

  const handleClick = ({key}) => {
    switch(key) {
      case '1':
        onNavChange('CONFIG');
        break;
      case '2':
        onNavChange('STORY');
        break;
      default:
        break;
    }
  };

  return (
    <Sider className='app-nav' collapsible collapsed={collapsed} onCollapse={toggleNav}>
      <div className={`logo ${collapsed ? 'collapsed' : ''}`}>
        <img src={logo} alt="RPG Story Playtesting" onClick={toggleNav} />
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={handleClick}>
        <Menu.Item key="1" icon={<SettingFilled />}>
          Configuration
        </Menu.Item>
        <Menu.Item key="2" icon={<BookFilled />}>
          Story
        </Menu.Item>
        { !collapsed &&
          <Fragment>
            <Menu.Divider />
            <Menu.Item key="3" icon={<UploadOutlined />}>
              Load story
            </Menu.Item>
            <Menu.Item key="4" icon={<DownloadOutlined />}>
              Download story
            </Menu.Item>
            <Menu.Item key="5" icon={<DeleteFilled />}>
              Clear
            </Menu.Item>
          </Fragment>
        }
      </Menu>
    </Sider>
  );
};

export default AppNav;
