import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppDataFetchController from '../../controllers/AppDataFetchController';
import PlayInteractionsController from '../../controllers/PlayInteractionsController';
import ConversionUtils from '../../utils/ConversionUtils';
import TitledCard from '../ui/TitledCard';
import CFElement from '../ui/CFElement';
import NextButton from '../ui/NextButton';
import ConvBubble from '../ui/ConvBubble';
import TwoWayConv from '../ui/TwoWayConv';

import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';

const SequenceActionsRunner = ({ actId }) => {
  const [,dispatch] = useContext(AppContext);
  const [initialized, setInitialized] = useState(false);
  const [actionsList, setActionsList] = useState(null);
  const [conversation, setConversation] = useState(true);
  const characters = useLiveQuery(() => db.characters.toArray());

  const livePropsArray = useLiveQuery(AppDataFetchController.fetchPlayGameStateProps(['currentAct', 'currentActSequence'], true));
  const liveProps = ConversionUtils.arrayToObject(livePropsArray, 'name');

  useEffect(() => {
    if(!initialized && liveProps) {
      setInitialized(true);
      //running module reset
      console.log('||--running module reset: Sequence actions for act: ', actId);
      initialize();
    }
  }, [liveProps, initialized]);

  const initialize = () => {
    const data = {'game_state_prop_id': liveProps.currentActSequence.game_state_prop_id, 'newValue': 1};
    PlayInteractionsController.updateGameStateProperty(dispatch, data);
    //
    AppDataFetchController.fetchSequencedActionsByAct(actId).then((actions) => {
      setActionsList(actions);
    }).catch(error => {
      console.log('||--FAIL', error);
    });
  };

  const renderCurrentStep = () => {
    if(actionsList === null || liveProps.currentActSequence.value < 1) {
      return null;
    }
    const currentStep = actionsList.find(a => a.order === liveProps.currentActSequence.value);
    if(currentStep.type === 'description') {
      return (
        <div className='action-container' style={{overflow: 'auto', flex: 1, paddingTop: 10, marginBottom: 10}}>
          <div style={{height: 0}}>
          <CFElement Element={'p'} style={{fontSize: 24}}>{currentStep.text_value}</CFElement>
          </div>
        </div>
      );
    } else {
      if(characters !== undefined) {
        return (
          <div className='action-container' style={{flex: 1, paddingTop: 10, marginBottom: 10}}>
            <ConvBubble
              direction={1}
              text={currentStep.text_value}
            />
            <TwoWayConv 
              character1={characters[0]}
              character2={null}
            />
          </div>
        );
      } else {
        return null;
      }
    }
  };

  return (
    <TitledCard style={{flex: 1}} title={'Actions'} bodyStyle={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      {renderCurrentStep()}
      <NextButton />
    </TitledCard>
  );
};

export default SequenceActionsRunner;