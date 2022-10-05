import { useState } from 'react';
import TitledCard from '../ui/TitledCard';
import NextButton from '../ui/NextButton';

import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';

const InteractiveActionsRunner = () => {
  // const [conversation, setConversation] = useState(true);

  // const characters = useLiveQuery(() => db.characters.toArray());

  return (
    <TitledCard style={{flex: 1}} title={'Actions'} bodyStyle={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <p>THIS IS INTERACTIVE</p>
      <NextButton />
    </TitledCard>
  );
};

export default InteractiveActionsRunner;