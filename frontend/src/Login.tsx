import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation login($password: String!) {
    login(password: $password)
  }
`;

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [login, { error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const token = data.login;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/devices');
      }
    },
  });

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: { password } });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Login;
