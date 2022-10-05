import { useLiveQuery } from 'dexie-react-hooks';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import TitledCard from '../ui/TitledCard';
import GameStatePropInspectorView from '../entity_views/GameStatePropInspectorView';

const GameStatePropsInspector = () => {

  const livePropsArray = useLiveQuery(AppDataFetchController.fetchPlayGameStateProps(null, true));

  // useEffect(() => {
  //   console.log('||--livePropsArray', livePropsArray);
  // }, [livePropsArray]);

  return (
    <TitledCard style={{flex: 1}} title={'Properties'} bodyStyle={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div style={{overflow: 'auto', flex: 1}}>
        <div style={{height: 0, paddingTop: 10}}>
          { livePropsArray !== undefined && livePropsArray.map(gsProp =>
            <GameStatePropInspectorView 
              key={gsProp.game_state_prop_id} 
              gsProp={gsProp}
            />
            )
          }
        </div>
      </div>
    </TitledCard>
  );
};

export default GameStatePropsInspector;
