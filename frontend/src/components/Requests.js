import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../hooks/useAuth';
import { request } from '../api';

export default function Requests(){
  const { token } = useContext(AuthContext);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [err, setErr] = useState(null);

  const load = async () => {
    try {
      const data = await request('/api/swap-requests', { token });
      setIncoming(data.incoming || []);
      setOutgoing(data.outgoing || []);
    } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  useEffect(()=>{ if(token) load(); }, [token]);

  const respond = async (id, accept) => {
    try {
      await request(`/api/swap-response/${id}`, { method: 'POST', body: { accept }, token });
      load();
    } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  return (
    <div style={{padding:20}}>
      <h2>Requests</h2>
      {err && <div style={{color:'red'}}>{err}</div>}
      <h3>Incoming</h3>
      <ul>
        {incoming.map(r => (
          <li key={r._id}>
            Offer from {r.requester?.name} — they offer <strong>{r.mySlot?.title}</strong> for your <strong>{r.theirSlot?.title}</strong>
            <button onClick={()=>respond(r._id, true)} style={{marginLeft:10}}>Accept</button>
            <button onClick={()=>respond(r._id, false)} style={{marginLeft:10}}>Reject</button>
            <span> [{r.status}]</span>
          </li>
        ))}
      </ul>

      <h3>Outgoing</h3>
      <ul>
        {outgoing.map(r => (
          <li key={r._id}>
            To {r.responder?.name} — your <strong>{r.mySlot?.title}</strong> for <strong>{r.theirSlot?.title}</strong>
            <span> [{r.status}]</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
