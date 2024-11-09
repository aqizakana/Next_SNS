import type React from 'react';
import { useState } from 'react';
import type { LoginCredentials, RegisterCredentials } from './types';

interface AccountFormProps {
  onSubmit: (data: LoginCredentials | RegisterCredentials) => void;
  isRegister?: boolean;
}

const AccountForm: React.FC<AccountFormProps> = ({
  onSubmit,
  isRegister = false,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      onSubmit({ username, password, email });
    } else {
      onSubmit({ username, password });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {isRegister && (
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      )}
      <button type='submit'>{isRegister ? 'Register' : 'Login'}</button>
    </form>
  );
};

export default AccountForm;
