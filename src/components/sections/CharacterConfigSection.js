import { useState, useContext } from 'react';
import { AppContext } from '../../stores/AppStore';
import AppLogicController from '../../controllers/AppLogicController';
import { Button, message } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/AppDatabase';
import CharacterView from '../entity_views/CharacterView';
import AddEditCharacter from '../drawers/AddEditCharacter';

const CharacterConfigSection = () => {
  const [,dispatch] = useContext(AppContext);
  const [addEditCharacterVisible, setAddEditCharacterVisible] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(null);

  const characters = useLiveQuery(() => db.characters.toArray());

  const addCharacter = () => {
    setCurrentCharacter(null);
    setAddEditCharacterVisible(true);
  };

  const editCharacter = (character) => {
    setCurrentCharacter(character);
    setAddEditCharacterVisible(true);
  };

  const removeCharacter = (character) => {
    AppLogicController.deleteCharacter(dispatch, character.id).then(result => {
      message.success('Character removed!');
    }).catch(error => {
      message.error('Something went wrong, sorry :(');
    });
  };

  return (
    <div>
      { characters !== undefined && characters.map(character =>
        <CharacterView 
          key={character.id} 
          character={character} 
          onRemove={() => { removeCharacter(character) }} 
          onEdit={() => { editCharacter(character) }} 
        />
        )
      }
      <Button type='primary' onClick={addCharacter}>
        Add Character
      </Button>
      <AddEditCharacter
        character={currentCharacter}
        isDrawerVisible={addEditCharacterVisible} 
        onDrawerClose={() => { setAddEditCharacterVisible(false); }} 
      />
    </div>
  );
};

export default CharacterConfigSection;
