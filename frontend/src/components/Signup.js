import React, { useState, useContext } from 'react';
import AuthContext from '../hooks/useAuth';
import { request } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const { login } = useContext(AuthContext);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await request('/api/auth/signup', { method: 'POST', body: form });
      login(res);
      navigate('/');
    } catch (err) { setErr(err.message || JSON.stringify(err)); }
  };

  return (
    <form onSubmit={submit} style={{maxWidth:400, margin:'20px'}}>
      <h2>Sign up</h2>
      {err && <div style={{color:'red'}}>{err}</div>}
      <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /><br/>
      <input required placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /><br/>
      <input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} /><br/>
      <button type="submit">Sign up</button>
    </form>
  );
}
