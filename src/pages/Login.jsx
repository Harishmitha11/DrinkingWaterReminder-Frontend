import React, {useState, useEffect} from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const nav = useNavigate();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if(localStorage.getItem('token')) {
      nav('/dashboard');
    }
  }, []);

  async function submit(e){
    e.preventDefault(); 
    setErr('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.user.name);
      // setToken(res.data.token); 
      nav('/dashboard');  // navigate to dashboard
    } catch (errr) {
      setErr(errr.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="center">
      <form className="card small" onSubmit={submit}>
        <h2>Login</h2>
        {err && <div className="error">{err}</div>}
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <p>New? <a href="/signup">Sign up</a></p>
      </form>
    </div>
  );
}
