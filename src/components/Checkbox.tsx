import './Checkbox.css';
import React from 'react';

interface CheckboxProps {
  inputType: string;
  inputName: string;
  inputId: string;
  inputPlaceholder: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ inputType, inputName, inputId, inputPlaceholder }) => {
  return (
    <label className="label container">
      {inputPlaceholder}
      <input
        className="input"
        type={inputType}
        name={inputName}
        id={inputId}
      />
      <span className="checkmark"></span>
    </label>
  );
}

export default Checkbox;
