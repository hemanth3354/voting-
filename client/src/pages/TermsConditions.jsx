import React from "react";

const TermsConditions = () => {
  return (
    <section className="terms-page" style={{padding: '2rem', maxWidth: 700, margin: '6rem auto 2rem auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#222'}}>
  <h2 style={{color: '#1976d2', marginBottom: '1.5rem'}}>Terms & Conditions</h2>
  <ol style={{paddingLeft: '1.5rem'}}>
        <li><span role="img" aria-label="vote" style={{marginRight:8}}>🗳️</span>Each registered voter is entitled to cast only one vote per election.</li>
        <li><span role="img" aria-label="lock" style={{marginRight:8}}>🔒</span>Voters must keep their login credentials confidential and not share them with others.</li>
        <li><span role="img" aria-label="warning" style={{marginRight:8}}>⚠️</span>Any attempt to manipulate, tamper, or hack the voting system is strictly prohibited and may result in legal action.</li>
        <li><span role="img" aria-label="no-entry" style={{marginRight:8}}>🚫</span>Votes once submitted cannot be changed or withdrawn.</li>
        <li><span role="img" aria-label="privacy" style={{marginRight:8}}>🛡️</span>All personal information provided during registration will be kept confidential and used only for election purposes.</li>
        <li><span role="img" aria-label="agreement" style={{marginRight:8}}>✅</span>By participating, voters agree to abide by the rules and regulations set forth by the election authority.</li>
        <li><span role="img" aria-label="admin" style={{marginRight:8}}>👨‍💼</span>The system administrators reserve the right to suspend or terminate accounts found violating these terms.</li>
        <li><span role="img" aria-label="support" style={{marginRight:8}}>📞</span>Any disputes or complaints regarding the voting process should be reported to the support team immediately.</li>
        <li><span role="img" aria-label="system" style={{marginRight:8}}>💻</span>The voting system is provided as-is; the administrators are not liable for any technical issues or data loss.</li>
        <li><span role="img" aria-label="accept" style={{marginRight:8}}>👍</span>By using this platform, you acknowledge and accept all the above terms and conditions.</li>
      </ol>
      <p style={{marginTop: '2rem', color: '#444'}}>For any questions or clarifications, please contact our support team at <strong>support@votingapp.com</strong>.</p>
    </section>
  );
};

export default TermsConditions;
