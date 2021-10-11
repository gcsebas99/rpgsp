import { useState, useEffect, useContext } from 'react';
import { Drawer, Button, Switch, Row, Col, message } from 'antd';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import EntitySelectorView from '../entity_views/EntitySelectorView';
import LocationMapUtils from '../../utils/LocationMapUtils';
import '../../styles/components/drawers/EditLocationMap.scss';

const EditLocationMap = ({ location = null, isDrawerVisible, onDrawerClose }) => {
  const [,dispatch] = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [setOrErase, setSetOrErase] = useState(true);
  const [currentArea, setCurrentArea] = useState(null);
  const [locationAreas, setLocationAreas] = useState(null);
  const [currentMap, setCurrentMap] = useState({});

  const locationMapDimension = LocationMapUtils.getLocationMapDimension();

  useEffect(() => {
    if(isDrawerVisible) { //opening drawer
      setSetOrErase(true);
      setCurrentArea(null);
      setCurrentMap(LocationMapUtils.convertJsonMapToEditableObject(location.map));
      loadAreas();
      openDrawer();
    }
  }, [isDrawerVisible, location]); // eslint-disable-line

  const openDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
    onDrawerClose && onDrawerClose();
  };

  const loadAreas = () => {
    AppDataFetchController.fetchAreasByLocation(location.id).then((fetchedAreas) => {
      setLocationAreas(fetchedAreas);
    }).catch(error => {
      console.log('||--FAIL', error);
    });
  };

  const selectCurrentArea = (areaId) => {
    const area = locationAreas.find(area => area.id === areaId);
    setCurrentArea(area);
  };

  const handleMapClick = (e) => {
    //col = x   row = y
    let newMap;
    if(e.target.dataset.col && e.target.dataset.row){
      const position = e.target.dataset.col + '-' + e.target.dataset.row;
      if(setOrErase) {
        if(currentArea !== null) { //adding area
          newMap = LocationMapUtils.setMapTile(Object.assign({}, currentMap), position, currentArea.id);
          setCurrentMap(newMap);
        }
      } else { //erasing
         newMap = LocationMapUtils.setMapTile(Object.assign({}, currentMap), position, null);
         setCurrentMap(newMap);
      }
    }
  };

  const handleClearMap = () => {
    setCurrentMap({});
  };

  const saveMap = () => {
    const newJsonMap = LocationMapUtils.convertEditableObjectToJsonMap(currentMap);
    const data = {map: newJsonMap};
    AppLogicController.updateLocationMap(dispatch, location.id, data).then(result => {
      closeDrawer();
      message.success('Location map updated!');
    }).catch(error => {
      closeDrawer();
      message.error('Something went wrong, sorry :(');
    });
  };

  const renderMap = () => {
    const colors = locationAreas && locationAreas.reduce((result, area) => {
      result[area.id] = area.color;
      return result;
    }, {});
    let mapClasses = ['map-view-edit'];
    let rows = [];
    let position;
    let color;
    let columns;

    for (let y = 0; y < locationMapDimension.y; y++) {
      columns = [];
      for (let x = 0; x < locationMapDimension.x; x++) {
        position = x + '-' + y;
        if (currentMap[position] && colors !== null) {
          color = colors[currentMap[position]];
          columns.push(<div className={`map-col map-col-${x}`} key={`map-col-${x}-${y}`} data-col={x} data-row={y} style={{backgroundColor: color, color: '#000'}}>{x}-{y}</div>);
        } else {
          columns.push(<div className={`map-col map-col-${x}`} key={`map-col-${x}-${y}`} data-col={x} data-row={y}>{x}-{y}</div>);
        }
      }
      rows.push(<div className={`map-row map-row-${y}`} key={`map-row-${y}`}>{columns}</div>);
    }
    //add map classes
    if(setOrErase) {
      if(currentArea !== null) { //painting
        mapClasses.push('painting');
      }
    } else { //erasing
      mapClasses.push('erasing');
    }
    return (<div className={mapClasses.join(' ')} onClick={handleMapClick}>{rows}</div>);
  };

  return (
    <Drawer
      title={'Edit Map: ' + (location ? location.name : '')}
      width={720}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ paddingBottom: 20 }}
      footer={
        <div style={{textAlign: 'right'}} >
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type='primary' onClick={saveMap}>
            Save
          </Button>
        </div>
      }
    >
      <Row gutter={[8, 16]} style={{paddingBottom: 16}}>
        <Col span={18}>
          <Switch checkedChildren="SET" unCheckedChildren="ERASE" checked={setOrErase} onChange={(e) => { setSetOrErase(e) }} />
        </Col>
        <Col span={6} style={{textAlign: 'right'}}>
          <Button type='default' size='small' onClick={handleClearMap}>Clear map</Button>
        </Col>
      </Row>
      <Row gutter={[8, 16]} style={{display: (setOrErase ? 'block' : 'none'), paddingBottom: 16}}>
        <Col span={24}>
          <EntitySelectorView customFetch={visible ? 'areasByLocation' : null} customFetchParams={{locationId: location && location.id}} value={currentArea ? currentArea.id : null} onChangeCallback={(e, n) => { selectCurrentArea(e); }} placeholder="Area to set" />
        </Col>
      </Row>
      { renderMap() }
    </Drawer>
  );
};

export default EditLocationMap;
