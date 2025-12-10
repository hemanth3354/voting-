import React from "react";

const CookiePolicy = () => {
  return (
    <section className="cookie-page" style={{padding: '2rem', maxWidth: 700, margin: '6rem auto 2rem auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#222'}}>
      <h2 style={{color: '#1976d2', marginBottom: '1.5rem'}}>Cookie Policy</h2>
      <p style={{marginBottom: '1.5rem', color: '#444'}}>
        This Cookie Policy explains how our online voting system uses cookies and similar technologies to enhance your experience and ensure security.
      </p>
      <ul style={{paddingLeft: '1.5rem', marginBottom: '2rem'}}>
        <li><span role="img" aria-label="cookie" style={{marginRight:8}}>🍪</span> We use cookies to keep you logged in and maintain your session securely during voting.</li>
        <li><span role="img" aria-label="security" style={{marginRight:8}}>🔒</span> Cookies help us protect your account and prevent unauthorized access.</li>
        <li><span role="img" aria-label="analytics" style={{marginRight:8}}>📊</span> We may use cookies to analyze usage patterns and improve system performance.</li>
        <li><span role="img" aria-label="settings" style={{marginRight:8}}>⚙️</span> You can manage or disable cookies in your browser settings, but some features may not work properly.</li>
        <li><span role="img" aria-label="privacy" style={{marginRight:8}}>🛡️</span> No personal or voting data is stored in cookies; all sensitive information is encrypted and protected.</li>
      </ul>
      <p style={{color: '#444'}}>
        By using our online voting platform, you consent to our use of cookies as described in this policy.
      </p>
    </section>
  );
};

export default CookiePolicy;
