'use client';

import React, { useState } from 'react';
import AccountForm from './AccountForm';
import { register, login, logout } from './api';
import { User } from './types';
import './accounts.module.css';

const AccountsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleRegister = async (data: any) => {
    try {
      await register(data);
      setMessage('Registration successful');
    } catch (error) {
      setMessage('Registration failed');
      console.error('Registration failed', error);
    }
  };

  const handleLogin = async (data: any) => {
    try {
      const loggedInUser = await login(data);
      setUser(loggedInUser);
      setMessage('Login successful');
    } catch (error) {
      setMessage('Login failed');
      console.error('Login failed', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setMessage('Logout successful');
    } catch (error) {
      setMessage('Logout failed');
      console.error('Logout failed', error);
    }
  };

  return (
    <div>
      <h1>Account Management</h1>
      {message && <p>{message}</p>}
      {!user ? (
        <>
          <h2>Register</h2>
          <AccountForm onSubmit={handleRegister} isRegister={true} />
          <h2>Login</h2>
          <AccountForm onSubmit={handleLogin} />
        </>
      ) : (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;

