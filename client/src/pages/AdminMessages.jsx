import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/messages");
        setMessages(res.data);
      } catch (err) {
        setError("Failed to fetch messages.");
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  return (
    <div style={{display: 'flex', justifyContent: 'flex-end', minHeight: '80vh'}}>
      <div style={{width: 400, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#222', padding: '2rem', margin: '6rem 2rem 2rem 0'}}>
        <h2 style={{color: '#1976d2', marginBottom: '1.5rem'}}>User Messages / Feedback</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}
        {messages.length === 0 && !loading && <p>No messages found.</p>}
        <div style={{maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {messages.map(msg => (
            <div key={msg._id} style={{alignSelf: 'flex-end', background: '#e3f2fd', borderRadius: '12px 12px 0 12px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'}}>
              <div style={{fontWeight: 'bold', color: '#1976d2'}}>{msg.name} <span style={{fontSize: '0.9em', color: '#888'}}>({msg.email})</span></div>
              <div style={{margin: '0.5rem 0'}}>{msg.message}</div>
              <div style={{fontSize: '0.8em', color: '#888', textAlign: 'right'}}>{new Date(msg.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
