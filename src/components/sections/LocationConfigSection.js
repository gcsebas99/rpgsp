import { useState, useContext } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { Button, message } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';
import LocationView from '../entity_views/LocationView';
import AddEditLocation from '../drawers/AddEditLocation';
import AddEditArea from '../drawers/AddEditArea';
import EditLocationMap from '../drawers/EditLocationMap';

const LocationConfigSection = () => {
  const [,dispatch] = useContext(AppContext);
  const [addEditLocationVisible, setAddEditLocationVisible] = useState(false);
  const [editLocationMapVisible, setEditLocationMapVisible] = useState(false);
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

  const editLocationMap = (location) => {
    setCurrentLocation(location);
    setEditLocationMapVisible(true);
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
          onEditMap={() => { editLocationMap(location) }} 
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
      <EditLocationMap
        location={currentLocation}
        isDrawerVisible={editLocationMapVisible} 
        onDrawerClose={() => { setEditLocationMapVisible(false); }} 
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
