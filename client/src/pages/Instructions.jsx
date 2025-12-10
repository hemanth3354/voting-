import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Instructions = () => {
  const navigate = useNavigate();
  const token = useSelector(state => state?.vote?.currentVoter?.token);

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <section className="instructions">
      <div className="container">
        <h1>Instructions to Voter</h1>
        <p>Welcome to the Instructions page. Please read the following carefully:</p>
        <ul>
          <li>All voters must register before participating in any election.</li>
          <li>Each voter is allowed to cast only one vote per election.</li>
          <li>Voting is confidential and anonymous.</li>
          <li>Any form of tampering or fraud will lead to disqualification.</li>
          <li>Respect the election timelines and deadlines.</li>
          <li>Follow all guidelines provided by the election commission.</li>
          <li>Contact support for any issues or clarifications.</li>
        </ul>
      </div>
    </section>
  );
};

export default Instructions;
