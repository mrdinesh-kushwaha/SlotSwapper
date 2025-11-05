import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../hooks/useAuth';
import { request } from '../api';

export default function Dashboard(){
  const { token, user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title:'', startTime:'', endTime:'' });
  const [err, setErr] = useState(null);

  const load = async () => {
    try {
      const data = await request('/api/events', { token });
      setEvents(data);
    } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  useEffect(()=>{ if(token) load(); }, [token]);

  const create = async (e) => {
    e.preventDefault();
    try {
      await request('/api/events', { method: 'POST', body: form, token });
      setForm({ title:'', startTime:'', endTime:'' });
      load();
    } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  const makeSwappable = async (id) => {
    try {
      await request(`/api/events/${id}/make-swappable`, { method: 'PATCH', token });
      load();
    } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  return (
    <div style={{padding:20}}>
      <h2>Dashboard</h2>
      {user && <div>Welcome, {user.name}</div>}
      {err && <div style={{color:'red'}}>{err}</div>}
      <h3>My Events</h3>
      <ul>
        {events.map(ev => (
          <li key={ev._id}>
            <strong>{ev.title}</strong> ({new Date(ev.startTime).toLocaleString()} - {new Date(ev.endTime).toLocaleString()}) [{ev.status}]
            {ev.status==='BUSY' && <button onClick={()=>makeSwappable(ev._id)} style={{marginLeft:10}}>Make Swappable</button>}
          </li>
        ))}
      </ul>
      <h3>Create Event</h3>
      <form onSubmit={create}>
        <input required placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} /><br/>
        <input required type="datetime-local" value={form.startTime} onChange={e=>setForm({...form, startTime:e.target.value})} /><br/>
        <input required type="datetime-local" value={form.endTime} onChange={e=>setForm({...form, endTime:e.target.value})} /><br/>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
