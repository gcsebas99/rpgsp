import { useState, useContext } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { Button, message } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';
import LocationView from '../LocationView';
import AddEditLocation from '../AddEditLocation';
import AddEditArea from '../AddEditArea';

const LocationConfigSection = () => {
  const [,dispatch] = useContext(AppContext);
  const [addEditLocationVisible, setAddEditLocationVisible] = useState(false);
  const [addEditAreaVisible, setAddEditAreaVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentArea, setCurrentArea] = useState(null);

  const locations = useLiveQuery(() => db.locations.toArray());

  //location handlers
  const addLocation = () => {
    setCurrentLocation(null);
    setAddEditLocationVisible(true);
  };

  const editLocation = (location) => {
    setCurrentLocation(location);
    setAddEditLocationVisible(true);
  };

  const removeLocation = (location) => {
    AppLogicController.deleteLocation(dispatch, location.id).then(result => {
      message.success('Location removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  //area handlers
  const addArea = (location) => {
    setCurrentArea(null);
    setCurrentLocation(location);
    setAddEditAreaVisible(true);
  };

  const editArea = (area, location) => {
    setCurrentLocation(location);
    setCurrentArea(area);
    setAddEditAreaVisible(true);
  };

  const removeArea = (area) => {
    AppLogicController.deleteArea(dispatch, area.id).then(result => {
      message.success('Area removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  return (
    <div>
      { locations !== undefined && locations.map(location =>
        <LocationView 
          key={location.id} 
          location={location} 
          onRemove={() => { removeLocation(location) }} 
          onEdit={() => { editLocation(location) }} 
          onAddArea={() => { addArea(location) }} 
          onEditArea={(area) => { editArea(area, location) }}
          onRemoveArea={(area) => { removeArea(area) }}
        />
        )
      }
      <Button type='primary' onClick={addLocation}>
        Add Location
      </Button>
      <AddEditLocation
        location={currentLocation}
        isDrawerVisible={addEditLocationVisible} 
        onDrawerClose={() => { setAddEditLocationVisible(false); }} 
      />
      <AddEditArea
        area={currentArea}
        location={currentLocation}
        isDrawerVisible={addEditAreaVisible} 
        onDrawerClose={() => { setAddEditAreaVisible(false); }} 
      />
    </div>
  );
};

export default LocationConfigSection;
