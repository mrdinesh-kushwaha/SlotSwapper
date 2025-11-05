import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../hooks/useAuth';
import { request } from '../api';

export default function Marketplace(){
  const { token } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [mySwappable, setMySwappable] = useState([]);
  const [selectedTheir, setSelectedTheir] = useState(null);
  const [selectedMy, setSelectedMy] = useState(null);
  const [err, setErr] = useState(null);

  const load = async () => {
    try {
      const s = await request('/api/swappable-slots', { token });
      setSlots(s);
      const mine = await request('/api/events', { token });
      setMySwappable(mine.filter(m=>m.status==='SWAPPABLE'));
    } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  useEffect(()=>{ if(token) load(); }, [token]);

  const openRequest = (their) => { setSelectedTheir(their); setSelectedMy(null); };

  const sendRequest = async () => {
    try {
      await request('/api/swap-request', { method: 'POST', body: { mySlotId: selectedMy, theirSlotId: selectedTheir._id }, token });
      setSelectedTheir(null); setSelectedMy(null);
      load();
      alert('Swap requested');
    } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  return (
    <div style={{padding:20}}>
      <h2>Marketplace</h2>
      {err && <div style={{color:'red'}}>{err}</div>}
      <ul>
        {slots.map(s => (
          <li key={s._id}>
            <strong>{s.title}</strong> by {s.owner?.name || 'unknown'} ({new Date(s.startTime).toLocaleString()})
            <button onClick={()=>openRequest(s)} style={{marginLeft:10}}>Request Swap</button>
          </li>
        ))}
      </ul>

      {selectedTheir && (
        <div style={{border:'1px solid #ccc', padding:10, marginTop:10}}>
          <h3>Offer a slot for: {selectedTheir.title}</h3>
          <select value={selectedMy || ''} onChange={e=>setSelectedMy(e.target.value)}>
            <option value="">Select one of your SWAPPABLE slots</option>
            {mySwappable.map(ms => (<option key={ms._id} value={ms._id}>{ms.title} ({new Date(ms.startTime).toLocaleString()})</option>))}
          </select>
          <button onClick={sendRequest} disabled={!selectedMy} style={{marginLeft:10}}>Send Request</button>
          <button onClick={()=>{ setSelectedTheir(null); setSelectedMy(null); }} style={{marginLeft:10}}>Cancel</button>
        </div>
      )}
    </div>
  );
}
