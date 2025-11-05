import React, { useState, useContext } from 'react';
import AuthContext from '../hooks/useAuth';
import { request } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' });
  const { login } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await request('/api/auth/login', { method: 'POST', body: form });
      login(res);
      navigate('/');
    } catch (err) { setErr(err.message || JSON.stringify(err)); }
  };

  return (
    <form onSubmit={submit} style={{maxWidth:400, margin:'20px'}}>
      <h2>Log in</h2>
      {err && <div style={{color:'red'}}>{err}</div>}
      <input required placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /><br/>
      <input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} /><br/>
      <button type="submit">Log in</button>
    </form>
  );
}
