import React, { useRef, useState } from "react";
import axios from "axios";

const Contact = () => {
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Move focus to next field on Enter
  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await axios.post("http://localhost:5000/api/messages", form);
      setSuccess("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <section className="contact-page" style={{padding: '2rem', maxWidth: 600, margin: '6rem auto 2rem auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#222'}}>
      <h2 style={{color: '#1976d2', marginBottom: '1.5rem'}}>Contact Us</h2>
      <p style={{color: '#222'}}>If you have any questions, feedback, or need support, please reach out to us:</p>
      <ul style={{listStyle: 'none', padding: 0, color: '#222'}}>
        <li><strong style={{color: '#222'}}>Email:</strong> <span style={{color: '#222'}}>support@votingapp.com</span></li>
        <li><strong style={{color: '#222'}}>Phone:</strong> <span style={{color: '#222'}}>+91 98765 43210</span></li>
        <li><strong style={{color: '#222'}}>Address:</strong> <span style={{color: '#222'}}>123, Main Street, Bengaluru, India</span></li>
      </ul>
      <div style={{marginTop: '2rem'}}>
  <h4 style={{color: '#1976d2', marginBottom: '1rem'}}>Or send us a message / Feedback :</h4>
        <form onSubmit={handleSubmit}>
          {success && <p style={{color: 'green'}}>{success}</p>}
          {error && <p style={{color: 'red'}}>{error}</p>}
          <input
            type="text"
            name="name"
            value={form.name}
            placeholder="Your Name"
            style={{width: '100%', marginBottom: '1rem', padding: '0.5rem', color: '#222'}} 
            onKeyDown={e => handleKeyDown(e, emailRef)}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Your Email"
            style={{width: '100%', marginBottom: '1rem', padding: '0.5rem', color: '#222'}} 
            ref={emailRef}
            onKeyDown={e => handleKeyDown(e, messageRef)}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            value={form.message}
            placeholder="Your Message"
            rows={4}
            style={{width: '100%', marginBottom: '1rem', padding: '0.5rem', color: '#222'}} 
            ref={messageRef}
            onChange={handleChange}
            required
          />
          <button type="submit" style={{backgroundColor: '#1976d2', color: '#fff', padding: '0.75rem 2rem', border: 'none', borderRadius: 4}}>Send</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
