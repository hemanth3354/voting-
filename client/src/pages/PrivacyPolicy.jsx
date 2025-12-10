import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="privacy-page" style={{padding: '2rem', maxWidth: 700, margin: '6rem auto 2rem auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#222'}}>
      <h2 style={{color: '#1976d2', marginBottom: '1.5rem'}}>Privacy Policy</h2>
      <p style={{marginBottom: '1.5rem', color: '#444'}}>
        Your privacy is important to us. This policy explains how we collect, use, and protect your personal information in our online voting system.
      </p>
      <ul style={{paddingLeft: '1.5rem', marginBottom: '2rem'}}>
        <li><span role="img" aria-label="secure" style={{marginRight:8}}>🔒</span> All personal data (name, email, voter ID) is securely stored and encrypted.</li>
        <li><span role="img" aria-label="no-share" style={{marginRight:8}}>🚫</span> We do not share your information with third parties except as required by law.</li>
        <li><span role="img" aria-label="vote" style={{marginRight:8}}>🗳️</span> Voting choices are confidential and cannot be linked to your identity.</li>
        <li><span role="img" aria-label="delete" style={{marginRight:8}}>🗑️</span> You may request deletion of your account and data at any time.</li>
        <li><span role="img" aria-label="update" style={{marginRight:8}}>✏️</span> You can update your personal information through your account settings.</li>
        <li><span role="img" aria-label="support" style={{marginRight:8}}>📞</span> For privacy concerns, contact our support team at <strong>support@votingapp.com</strong>.</li>
      </ul>
      <p style={{color: '#444'}}>
        By using our online voting platform, you consent to this privacy policy and the secure handling of your data.
      </p>
    </section>
  );
};

export default PrivacyPolicy;
