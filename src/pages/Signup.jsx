import React, {useState} from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const nav = useNavigate();
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [height,setHeight]=useState(''); // in cm
  const [weight,setWeight]=useState(''); // in kg
  const [wakeTime,setWakeTime]=useState('07:00');
  const [bedTime,setBedTime]=useState('23:00');
  const [err,setErr]=useState('');

  async function submit(e){
    e.preventDefault(); 
    setErr('');
    try {
      const res = await api.post('/auth/register', { 
        name, email, password, height, weight, wakeTime, bedTime
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.user.name);
      // setToken(res.data.token); 
      nav('/dashboard');
    } catch (errr) { 
      setErr(errr.response?.data?.message || 'Signup failed'); 
    }
  }

  return (
    <div className="center">
      <form className="card small" onSubmit={submit}>
        <h2>Sign up</h2>
        {err && <div className="error">{err}</div>}
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} required />
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <label>Height (cm)</label>
        <input type="number" value={height} onChange={e=>setHeight(e.target.value)} required />
        <label>Weight (kg)</label>
        <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} required />
        <label>Wake Time</label>
        <input type="time" value={wakeTime} onChange={e=>setWakeTime(e.target.value)} required />
        <label>Bed Time</label>
        <input type="time" value={bedTime} onChange={e=>setBedTime(e.target.value)} required />
        <button type="submit">Create account</button>
        <p>Have account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
}
