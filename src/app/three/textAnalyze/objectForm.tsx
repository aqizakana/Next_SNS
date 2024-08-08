import React, { useState } from 'react';
import styles from './form.module.css';

const Objects = ['Sphere', 'Box', 'Circle', 'DoubleCone', 'crossCylinder', 'PathCircle'];

export default function ObjectForm({ selectedObject_1, onChange }) {
  const [inputValue, setInputValue] = useState(selectedObject_1);
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Objects.includes(inputValue)) {
      onChange(inputValue);
      setInputValue(''); // 入力をリセット
    } else {
      alert('Please enter a valid object name');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter object name"
        list="objects"
      />
      <datalist id="objects">
        {Objects.map((object) => (
          <option key={object} value={object}>
            {object}
          </option>
        ))}
      </datalist>
      <button className={styles.button} type="submit">Submit</button>
    </form>
  );
}
