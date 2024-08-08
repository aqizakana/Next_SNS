import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function TextForm() {
  const [inputText, setInputText] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push({
      pathname: '/result',
      query: { text: inputText }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text"
      />
      <button type="submit">Submit</button>
    </form>
  );
}