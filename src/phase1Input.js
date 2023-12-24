import React, { useState } from 'react';
import './styles/style.css';


const Phase1Form = ({year, setTheYear}) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(e.target[0].value);
    if (value >= 2000 && value <= 2023)
        setTheYear(value);
  };

  return (
    <form className="phase1Form" onSubmit={handleFormSubmit}>
      <input
        type="number"
        id="yearInput"
        name="yearInput"
        min="2000"
        max="2023"
        step="1"
        placeholder={year}
      />

      {/* <select id="scopeSelect" disabled={true} title="Scope">
        <option value="globalScope">Global</option>
      </select> */}
      <button type="submit">Submit</button>
    </form>
  );
};
export default Phase1Form;
