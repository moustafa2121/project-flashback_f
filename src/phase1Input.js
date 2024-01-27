//input for phase1
//a form that takes the year 
import React from 'react';
import './styles/formStyle.css';
import {SubmitButton} from "./helper"

const Phase1Form = ({year, setTheYear}) => {
  const handleFormSubmit = event => {
    event.preventDefault();
    const value = parseInt(event.target[0].value);
    //todo: redundant?
    if (value >= 2000 && value <= 2023)
        setTheYear(value);
  };

  return (
    <form className="formStyle" id="formPhase1" onSubmit={handleFormSubmit}>
      <input
        type="number"
        id="yearInput"
        name="yearInput"
        min="2000"
        max="2023"
        step="1"
        placeholder={year}
      />
      <SubmitButton />
    </form>
  );
};
export default Phase1Form;