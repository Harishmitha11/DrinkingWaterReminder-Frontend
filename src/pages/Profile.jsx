import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const nav = useNavigate();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [dailyGoal, setDailyGoal] = useState(0);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/auth/profile');
        const { height, weight, wakeTime, sleepTime } = res.data;
        setHeight(height || '');
        setWeight(weight || '');
        setWakeTime(wakeTime || '07:00');
        setSleepTime(sleepTime || '23:00');
        if (weight) setDailyGoal((weight * 0.033).toFixed(2)); // liters
      } catch (err) { console.error(err); }
    }
    fetchProfile();
  }, []);

  async function saveProfile() {
    const goal = (weight * 0.033).toFixed(2);
    await api.put('/auth/profile', { height, weight, wakeTime, sleepTime, dailyGoal: goal });
    setDailyGoal(goal);
    alert('Profile saved!');
    nav('/dashboard');
  }

  return (
    <div className="center">
      <div className="card small">
        <h2>Profile</h2>
        <label>Height (cm)</label>
        <input value={height} onChange={e => setHeight(e.target.value)} />
        <label>Weight (kg)</label>
        <input value={weight} onChange={e => setWeight(e.target.value)} />
        <label>Wake time</label>
        <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} />
        <label>Sleep time</label>
        <input type="time" value={sleepTime} onChange={e => setSleepTime(e.target.value)} />
        <div>Daily Goal: {dailyGoal} L</div>
        <button onClick={saveProfile}>Save & Go to Dashboard</button>
      </div>
    </div>
  );
}
