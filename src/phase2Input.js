//form for phase2
//takes the story prompt as input

import React, {useState} from 'react';
import './styles/formStyle.css';
import {SubmitButton} from "./helper"

const Phase2Form = ({setStoryPrompt}) => {
  //sets the form invisible when data being fetched
  const [formVisible, setFormVisible] = useState(true);
  const handleFormSubmit = event => {
    event.preventDefault();
    //todo: conditions?
    setStoryPrompt(event.target.elements.storyInput.value);
    setFormVisible(false);
  };

  return (
    <>
    {formVisible && (
      <form className="formStyle" id="formPhase2" onSubmit={handleFormSubmit}>
        <input
          type="text"
          id="storyInput"
          name="storyInput"
          maxLength="200"
          minLength="20"
          placeholder="Story prompt"
        />
        <SubmitButton />
      </form>
      )}
    </>
  );
};
export default Phase2Form;