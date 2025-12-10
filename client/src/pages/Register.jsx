import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

// Configure axios with longer timeout
axios.defaults.timeout = 15000; // 15 seconds

const Register = () => {

    const [userData, setUserData]= useState({fullName: "", email: "", password: "", password2: "", voterId: ""})
    const [error, setError] =useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const voterIdRef = React.useRef(null);
    const emailRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const confirmPasswordRef = React.useRef(null);
    const navigate = useNavigate()


    const changeInputHandler =  (e) => {
        setUserData(prevState => {
            return{...prevState,[e.target.name]: e.target.value}
        })
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const registerVoter = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!userData.fullName || !userData.email || !userData.password || !userData.password2 || !userData.voterId) {
            setError("Please fill in all fields.");
            return;
        }
        
        if (userData.password !== userData.password2) {
            setError("Passwords do not match.");
            return;
        }
        
        if (userData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/voters/register`, {
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password,
                password2: userData.password2,
                voterId: userData.voterId
            });
            
            // Success - show alert and redirect to login
            alert("Registration successful! Please login to continue.");
            navigate('/');

        } catch (err) {
            console.error("Registration error:", err);
            
            // Handle error response properly
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    }


    return(
        <section className="register">

       <div className="container register_container">

        <h2>Sign Up</h2>
        <form onSubmit={registerVoter}>
            {error && <p className="form_error-message">{error}</p>}
            <input 
              type="text" 
              name="fullName" 
              placeholder="Full Name" 
              onChange={changeInputHandler} 
              autoComplete="true" 
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (voterIdRef.current) voterIdRef.current.focus();
                }
              }}
            />
            <input 
              type="text" 
              name="voterId" 
              placeholder="Voter ID" 
              onChange={changeInputHandler} 
              autoComplete="true"
              ref={voterIdRef}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (emailRef.current) emailRef.current.focus();
                }
              }}
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              onChange={changeInputHandler} 
              autoComplete="true"
              ref={emailRef}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (passwordRef.current) passwordRef.current.focus();
                }
              }}
            />
            <div className="password-input-container">
                <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    placeholder="Password"  
                    onChange={changeInputHandler} 
                    autoComplete="true"
                    ref={passwordRef}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (confirmPasswordRef.current) confirmPasswordRef.current.focus();
                      }
                    }}
                />
                <button 
                    type="button" 
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? (
                        <span>🔓</span> // Unlock symbol when password is visible
                    ) : (
                        <span>🔒</span> // Lock symbol when password is hidden
                    )}
                </button>
            </div>
            <div className="password-input-container">
                <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="password2" 
                    placeholder="Confirm Password" 
                    onChange={changeInputHandler} 
                    autoComplete="true"
                    ref={confirmPasswordRef}
                />
                <button 
                    type="button" 
                    className="password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                >
                    {showConfirmPassword ? (
                        <span>🔓</span> // Unlock symbol when confirm password is visible
                    ) : (
                        <span>🔒</span> // Lock symbol when confirm password is hidden
                    )}
                </button>
            </div>
            <p>Already have an account? <Link to='/'>Sign in</Link></p>
                        <button type="submit" className="btn primary" style={{backgroundColor: '#388e3c', color: '#fff'}} disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
        </form>
       </div>

        </section>
    )
}
export default Register;
