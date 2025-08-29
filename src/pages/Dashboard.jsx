


// import React, { useEffect, useState, useRef } from 'react';
// import api from '../api';
// import { useNavigate } from 'react-router-dom';

// function formatLocal(dt) {
//   const d = new Date(dt);
//   const off = d.getTimezoneOffset();
//   const local = new Date(d.getTime() - off*60*1000);
//   return local.toISOString().slice(0,16);
// }

// export default function Dashboard(){
//   const nav = useNavigate();
//   const [reminders, setReminders] = useState([]);
//   const [title,setTitle] = useState('Drink water');
//   const [message,setMessage] = useState('Time to drink water 💧');
//   const [nextAt,setNextAt] = useState('');
//   const [frequency,setFrequency] = useState('once');
//   const [error,setError] = useState('');
//   const [userName,setUserName] = useState(localStorage.getItem('userName') || 'User');

//   const [dailyWater, setDailyWater] = useState(2); // default 2L
//   const [consumed, setConsumed] = useState(0);    // how much user drank
//   const [loading, setLoading] = useState(true);

//   const audioRef = useRef(null);
//   const timersRef = useRef([]);

//   // --- fetch data after login/signup
//   useEffect(()=>{
//     async function init(){
//       const token = localStorage.getItem('token');
//       if(!token) { nav('/login'); return; }
//       setLoading(true);
//       await fetchUser();
//       await fetchReminders();
//       requestNotificationPermission();
//       setLoading(false);
//     }
//     init();
//     return () => clearTimers();
//   },[]);

//   function clearTimers(){ timersRef.current.forEach(t => clearTimeout(t)); timersRef.current = []; }

//   async function fetchUser() {
//     try {
//       const res = await api.get('/auth/me'); 
//       setDailyWater(res.data.dailyWaterLiters || 2);
//       setConsumed(res.data.consumedToday || 0);
//     } catch(e) { console.error(e); }
//   }

//   async function fetchReminders(){
//     try {
//       const res = await api.get('/reminders');
//       setReminders(res.data);
//       scheduleLocal(res.data);
//     } catch (err) { console.error(err); }
//   }

//   async function scheduleLocal(list){
//     clearTimers();
//     const now = Date.now();
//     for (const r of list) {
//       if (!r.active) continue;
//       const ms = new Date(r.nextAt).getTime() - now;
//       if (ms <= 0) continue;
//       const id = setTimeout(()=> { showNotification(r); }, ms);
//       timersRef.current.push(id);
//     }
//   }

//   function requestNotificationPermission(){
//     if (!('Notification' in window)) return;
//     if (Notification.permission === 'default') Notification.requestPermission();
//   }

//   function playSound(){ try { audioRef.current && audioRef.current.play(); } catch(e){} }

//   async function showNotification(rem){
//     if (Notification.permission === 'granted') {
//       const perGlass = ((dailyWater - consumed)/Math.max(reminders.filter(r=>r.active).length,1)).toFixed(2);
//       const n = new Notification(rem.title, { body: `Drink ${perGlass} L 💧`, tag: rem._id });
//       playSound();
//       n.onclick = () => window.focus();
//       await fetchReminders();
//       await fetchUser(); // update remaining water
//     }
//   }

//   async function addReminder(e){
//     e.preventDefault(); setError('');
//     if (!nextAt) { setError('Select date & time'); return; }
//     try {
//       const activeCount = reminders.filter(r=>r.active).length + 1;
//       const perGlass = (dailyWater / activeCount).toFixed(2);
//       const payload = { 
//         title, 
//         message: `Drink ${perGlass} L water 💧`,
//         nextAt: new Date(nextAt).toISOString(),
//         frequency
//       };
//       await api.post('/reminders', payload);
//       setTitle('Drink water');
//       setMessage('Time to drink water 💧');
//       setNextAt('');
//       setFrequency('once');
//       await fetchReminders();
//     } catch (err) { setError(err.response?.data?.message || 'Failed'); }
//   }

//   async function toggleActive(id, val){
//     await api.put(`/reminders/${id}`, { active: val });
//     await fetchReminders();
//   }

//   async function deleteReminder(id){
//     await api.delete(`/reminders/${id}`);
//     await fetchReminders();
//   }

//   async function markDrank(liters){
//     try {
//       await api.put('/reminders/drank', { liters }); // backend should update consumedToday
//       setConsumed(prev => {
//         const newVal = prev + liters;
//         return newVal > dailyWater ? dailyWater : newVal;
//       });
//       await fetchReminders();
//     } catch(e) { console.error(e); }
//   }

//   async function snooze(id, minutes=10){
//     const rem = reminders.find(r=>r._id===id);
//     if (!rem) return;
//     const newDate = new Date(Date.now() + minutes*60*1000).toISOString();
//     await api.put(`/reminders/${id}`, { nextAt: newDate, active: true });
//     await fetchReminders();
//   }

//   function logout(){ localStorage.removeItem('token'); localStorage.removeItem('userName'); nav('/login'); }

//   if(loading) return <div>Loading...</div>;

//   const total = reminders.length;
//   const activeCount = reminders.filter(r=>r.active).length;
//   const lastSent = reminders.flatMap(r => r.history || []).sort((a,b)=> new Date(b.sentAt)-new Date(a.sentAt))[0];

//   const now = new Date();

//   return (
//     <div className="container">
//       <audio ref={audioRef} src="/notification.mp3" preload="auto" />
//       <header className="topbar">
//         <h1>Water Reminder</h1>
//         <div>
//           <span style={{marginRight:10}}>Hi, {userName}</span>
//           <button className="btn small" onClick={logout}>Logout</button>
//         </div>
//       </header>

//       <main>
//         <section className="card">
//           <h3>Create Reminder</h3>
//           {error && <div className="error">{error}</div>}
//           <form onSubmit={addReminder} className="form-grid">
//             <div>
//               <label>Title</label>
//               <input value={title} onChange={e=>setTitle(e.target.value)} required />
//             </div>
//             <div>
//               <label>Message</label>
//               <input value={message} onChange={e=>setMessage(e.target.value)} required />
//             </div>
//             <div>
//               <label>When (local)</label>
//               <input type="datetime-local" value={nextAt} onChange={e=>setNextAt(e.target.value)} required />
//             </div>
//             <div>
//               <label>Frequency</label>
//               <select value={frequency} onChange={e=>setFrequency(e.target.value)}>
//                 <option value="once">Once</option>
//                 <option value="hourly">Hourly</option>
//                 <option value="daily">Daily</option>
//               </select>
//             </div>
//             <div style={{gridColumn:'1/-1'}}>
//               <button type="submit">Add</button>
//             </div>
//           </form>
//         </section>

//         <section className="card">
//           <h3>Stats</h3>
//           <div style={{display:'flex',gap:12}}>
//             <div className="stat">Total: <strong>{total}</strong></div>
//             <div className="stat">Active: <strong>{activeCount}</strong></div>
//             <div className="stat">Last sent: <strong>{ lastSent ? new Date(lastSent.sentAt).toLocaleString() : '—' }</strong></div>
//             <div className="stat">Remaining water: <strong>{ (dailyWater - consumed).toFixed(2) } L</strong></div>
//           </div>
//         </section>

//         <section className="card">
//           <h3>Your reminders</h3>
//           {reminders.length===0 && <p>No reminders yet</p>}
//           <ul className="list">
//             {reminders.map(r=>{
//               const isFuture = new Date(r.nextAt) > now;
//               const perGlass = ((dailyWater - consumed)/Math.max(activeCount,1)).toFixed(2);
//               return (
//               <li key={r._id} className="reminder">
//                 <div>
//                   <strong>{r.title}</strong>
//                   <div className="muted">{r.message}</div>
//                 </div>
//                 <div className="meta">
//                   <div>{new Date(r.nextAt).toLocaleString()}</div>
//                   <div className="muted">{r.frequency}{r.active ? '' : ' (paused)'}</div>
//                   <div style={{marginTop:8}}>
//                     <button 
//                       className="btn small" 
//                       disabled={isFuture} 
//                       style={{ backgroundColor: isFuture ? 'grey' : ''}}
//                       onClick={()=>{ markDrank(Number(perGlass)); snooze(r._id, 5); }}
//                     >
//                       Drank 
//                     </button>{' '}
//                     <button className="btn small" onClick={()=>toggleActive(r._id, !r.active)}>{r.active ? 'Pause' : 'Resume'}</button>{' '}
//                     <button className="btn small" onClick={()=>deleteReminder(r._id)}>Delete</button>
//                   </div>
//                 </div>
//               </li>
//             )})}
//           </ul>
//         </section>
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function formatLocal(dt) {
  const d = new Date(dt);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function Dashboard() {
  const nav = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('Drink water');
  const [message, setMessage] = useState('Time to drink water 💧');
  const [nextAt, setNextAt] = useState('');
  const [frequency, setFrequency] = useState('once');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'User');

  const [dailyWater, setDailyWater] = useState(2);
  const [consumed, setConsumed] = useState(0);
  const [loading, setLoading] = useState(true);

  const audioRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    async function init() {
      const token = localStorage.getItem('token');
      if (!token) {
        nav('/login');
        return;
      }
      setLoading(true);
      await fetchUser();
      await fetchReminders();
      requestNotificationPermission();
      setLoading(false);
    }
    init();
    return () => clearTimers();
  }, []);

  function clearTimers() {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  }

  async function fetchUser() {
    try {
      const res = await api.get('/auth/me');
      setDailyWater(res.data.dailyWaterLiters || 2);
      setConsumed(res.data.consumedToday || 0);
      setUserName(res.data.name || 'User');
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchReminders() {
    try {
      const res = await api.get('/reminders');
      setReminders(res.data);
      scheduleLocal(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function scheduleLocal(list) {
    clearTimers();
    const now = Date.now();
    for (const r of list) {
      if (!r.active) continue;
      const ms = new Date(r.nextAt).getTime() - now;
      if (ms <= 0) continue;
      const id = setTimeout(() => { showNotification(r); }, ms);
      timersRef.current.push(id);
    }
  }

  function requestNotificationPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') Notification.requestPermission();
  }

  function playSound() { try { audioRef.current && audioRef.current.play(); } catch (e) { } }

  async function showNotification(rem) {
    if (Notification.permission === 'granted') {
      const activeCount = reminders.filter(r => r.active).length || 1;
      const perGlass = ((dailyWater - consumed) / activeCount).toFixed(2);
      const n = new Notification(rem.title, { body: `Drink ${perGlass} L 💧`, tag: rem._id });
      playSound();
      n.onclick = () => window.focus();
      await fetchReminders();
      await fetchUser();
    }
  }

  async function addReminder(e) {
    e.preventDefault(); setError('');
    if (!nextAt) { setError('Select date & time'); return; }
    try {
      const activeCount = reminders.filter(r => r.active).length + 1;
      const perGlass = (dailyWater / activeCount).toFixed(2);
      const payload = {
        title,
        message: `Drink ${perGlass} L water 💧`,
        nextAt: new Date(nextAt).toISOString(),
        frequency
      };
      await api.post('/reminders', payload);
      setTitle('Drink water');
      setMessage('Time to drink water 💧');
      setNextAt('');
      setFrequency('once');
      await fetchReminders();
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  }

  async function toggleActive(id, val) {
    await api.put(`/reminders/${id}`, { active: val });
    await fetchReminders();
  }

  async function deleteReminder(id) {
    await api.delete(`/reminders/${id}`);
    await fetchReminders();
  }

  async function markDrank(liters) {
    try {
      await api.put('/auth/drink', { liters }); // ✅ fixed endpoint
      setConsumed(prev => {
        const newVal = prev + liters;
        return newVal > dailyWater ? dailyWater : newVal;
      });
      await fetchReminders();
    } catch (e) { console.error(e); }
  }

  async function snooze(id, minutes = 10) {
    const rem = reminders.find(r => r._id === id);
    if (!rem) return;
    const newDate = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    await api.put(`/reminders/${id}`, { nextAt: newDate, active: true });
    await fetchReminders();
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    nav('/login');
  }

  if (loading) return <div>Loading...</div>;

  const total = reminders.length;
  const activeCount = reminders.filter(r => r.active).length;
  const lastSent = reminders.flatMap(r => r.history || []).sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))[0];

  const now = new Date();

  return (
    <div className="container">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      <header className="topbar">
        <h1>Water Reminder</h1>
        <div>
          <span style={{ marginRight: 10 }}>Hi, {userName}</span>
          <button className="btn small" onClick={logout}>Logout</button>
        </div>
      </header>

      <main>
        <section className="card">
          <h3>Create Reminder</h3>
          {error && <div className="error">{error}</div>}
          <form onSubmit={addReminder} className="form-grid">
            <div>
              <label>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <label>Message</label>
              <input value={message} onChange={e => setMessage(e.target.value)} required />
            </div>
            <div>
              <label>When (local)</label>
              <input type="datetime-local" value={formatLocal(nextAt)} onChange={e => setNextAt(e.target.value)} required />
            </div>
            <div>
              <label>Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)}>
                <option value="once">Once</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button type="submit">Add</button>
            </div>
          </form>
        </section>

        <section className="card">
          <h3>Stats</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="stat">Total: <strong>{total}</strong></div>
            <div className="stat">Active: <strong>{activeCount}</strong></div>
            <div className="stat">Last sent: <strong>{lastSent ? new Date(lastSent.sentAt).toLocaleString() : '—'}</strong></div>
            <div className="stat">Remaining water: <strong>{(dailyWater - consumed).toFixed(2)} L</strong></div>
          </div>
        </section>

        <section className="card">
          <h3>Your reminders</h3>
          {reminders.length === 0 && <p>No reminders yet</p>}
          <ul className="list">
            {reminders.map(r => {
              const isFuture = new Date(r.nextAt) > now;
              const perGlass = activeCount > 0 ? ((dailyWater - consumed) / activeCount).toFixed(2) : 0;
              return (
                <li key={r._id} className="reminder">
                  <div>
                    <strong>{r.title}</strong>
                    <div className="muted">{r.message}</div>
                  </div>
                  <div className="meta">
                    <div>{new Date(r.nextAt).toLocaleString()}</div>
                    <div className="muted">{r.frequency}{r.active ? '' : ' (paused)'}</div>
                    <div style={{ marginTop: 8 }}>
                      <button
                        className="btn small"
                        disabled={isFuture}
                        style={{ backgroundColor: isFuture ? 'grey' : '' }}
                        onClick={() => { markDrank(Number(perGlass)); snooze(r._id, 5); }}
                      >
                        Drank
                      </button>{' '}
                      <button className="btn small" onClick={() => toggleActive(r._id, !r.active)}>
                        {r.active ? 'Pause' : 'Resume'}
                      </button>{' '}
                      <button className="btn small" onClick={() => deleteReminder(r._id)}>Delete</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
