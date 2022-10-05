import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Tooltip, Tag } from 'antd';
import { CompassOutlined } from '@ant-design/icons';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import ConversionUtils from '../../utils/ConversionUtils';
import LocationMapUtils from '../../utils/LocationMapUtils';
import TitledCard from '../ui/TitledCard';
import CFElement from '../ui/CFElement';

const MapView = () => {
  const [locationString, setLocationString] = useState('');
  const [currentLocationId, setCurrentLocationId] = useState(null);
  const [locationAreas, setLocationAreas] = useState(null);
  const [locationAreaColors, setLocationAreaColors] = useState(null);
  const [locationAreaNames, setLocationAreaNames] = useState(null);
  const [map, setMap] = useState(null);
  //live
  const location = useLiveQuery(AppDataFetchController.fetchLiveLocation(currentLocationId), [currentLocationId]);
  const livePropsArray = useLiveQuery(AppDataFetchController.fetchPlayGameStateProps(['currentLocation', 'currentArea'], true));
  const liveProps = ConversionUtils.arrayToObject(livePropsArray, 'name');

  const locationMapDimension = LocationMapUtils.getLocationMapDimension();

  useEffect(() => {
    //console.log('||--liveProps', liveProps);
    if(liveProps && liveProps.currentLocation !== undefined) {
      setCurrentLocationId(liveProps.currentLocation.tids);
    }
    if(liveProps && liveProps.currentLocation !== undefined && liveProps.currentArea !== undefined) {
      setLocationString(liveProps.currentArea.value + ' (' + liveProps.currentLocation.value + ')');
    }
  }, [liveProps]); // eslint-disable-line

  useEffect(() => {
    if (location) {
      loadAreas();
      buildMap(LocationMapUtils.convertJsonMapToEditableObject(location.map));
    }
  }, [location]); // eslint-disable-line

  const loadAreas = () => {
    AppDataFetchController.fetchAreasByLocation(location.id).then((fetchedAreas) => {
      setLocationAreas(fetchedAreas);
      const colors = fetchedAreas && fetchedAreas.reduce((result, area) => {
        result[area.id] = area.color;
        return result;
      }, {});
      const names = fetchedAreas && fetchedAreas.reduce((result, area) => {
        result[area.id] = area.name;
        return result;
      }, {});
      setLocationAreaColors(colors);
      setLocationAreaNames(names);
    }).catch(error => {
      console.log('||--FAIL', error);
    });
  };

  const buildMap = (jsonAreas) => {
    let map = [];
    let position;
    let columns;
    let xy;
    let currentX;
    let currentY;
    let lowerX = locationMapDimension.x -1;
    let higherX = 0;
    let lowerY = locationMapDimension.y -1;
    let higherY = 0;


    for (const [key] of Object.entries(jsonAreas)) {
      xy = key.split('-');
      currentX = parseInt(xy[0]);
      currentY = parseInt(xy[1]);
      if(currentX < lowerX) {
        lowerX = currentX;
      }
      if(currentX > higherX) {
        higherX = currentX;
      }
      if(currentY < lowerY) {
        lowerY = currentY;
      }
      if(currentY > higherY) {
        higherY = currentY;
      }
    }

    for (let y = lowerY; y <= higherY; y++) {
      columns = [];
      for (let x = lowerX; x <= higherX; x++) {
        position = x + '-' + y;
        if (jsonAreas[position]) {
          columns.push(jsonAreas[position]);
        } else {
          columns.push('*');
        }
      }
      map.push(columns);
    }

    while (map.length !== map[0].length) {
      if(map.length < map[0].length) {
        columns = [];
        for (let i = 0; i < map[0].length; i++) {
          columns.push('*');
        }
        map.push(columns);
      } else {
        for (let j = 0; j < map.length; j++) {
          map[j].push('*');
        }
      }
    }
    setMap(map);
  };

  const renderMap = () => {
    let rows = [];
    let color;
    let name;
    let columns;
    let label;
    let labelsAdded = [];

    for (let y = 0; y < map.length; y++) {
      columns = [];
      for (let x = 0; x < map[0].length; x++) {
        if (typeof map[y][x] === 'number') {
          color = locationAreaColors[map[y][x]];
          name = locationAreaNames[map[y][x]];
          if(labelsAdded.indexOf(name) < 0) {
            label = (<Tag color="#777" style={{position: 'absolute', left: '2px', top: '2px', zIndex: 5, fontSize: 10}}>{name}</Tag>);
            labelsAdded.push(name);
          } else {
            label = null;
          }
          columns.push(
            <Tooltip title={name} key={`map-col-${x}-${y}`}>
              <div className={`map-col map-col-${x}`} data-col={x} data-row={y} style={{color: '#000', flexBasis: '100%'}}>
                <div className={`${map[y][x] === liveProps.currentArea.tids ? 'map-cell-active' : ''}`} style={{width: '96%', height: '96%', margin: '2%', backgroundColor: ConversionUtils.hex2rgba(color, 0.8), position: 'relative'}}>
                  {label}
                </div>
              </div>
            </Tooltip>
          );
        } else {
          columns.push(<div className={`map-col map-col-${x} empty`} key={`map-col-${x}-${y}`} data-col={x} data-row={y} style={{flexBasis: '100%'}}></div>);
        }
      }
      rows.push(<div className={`map-row map-row-${y}`} key={`map-row-${y}`} style={{display: 'flex', flexBasis: '100%'}}>{columns}</div>);
    }

    return (
      <div className="map-view" style={{width: '100%', paddingTop: '100%', position: 'relative'}}>
        <div className="map-wrapper" style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column'}}>
          {rows}
        </div>
      </div>
    );
  };

  return (
    <TitledCard style={{flex: 1, marginBottom: 12}} title={'Map'}>
      <CFElement Element={'p'}><CompassOutlined /> &#8212; {locationString}</CFElement>
      {map && locationAreas && locationAreaNames && locationAreaColors && renderMap()}
    </TitledCard>
  );
};

export default MapView;

