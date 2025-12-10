import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch } from "react-redux";
import { voteActions } from "../store/vote-slice";


const Login = () => {

    const [userData, setUserData]= useState({fullName: "", email: "", password: "", password2: ""})
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const passwordRef = React.useRef(null);

    const dispatch = useDispatch("")
    const navigate = useNavigate()


    const changeInputHandler = (e) => {
        setUserData(prevState => {
            return{...prevState,[e.target.name]: e.target.value}
        })
    }
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const loginVoter = async (e) => {

        e.preventDefault()
        setIsLoading(true);
        try{
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/voters/login`, userData)
          if (response && response.data) {
              const newVoter = response.data;
              localStorage.setItem("currentUser", JSON.stringify(newVoter))
              dispatch(voteActions.changeCurrentVoter(newVoter))
              alert("Login successful!")
              if (newVoter.isAdmin) {
                  navigate("/elections")
              } else {
                  navigate("/results")
              }
          } else {
              setError("Invalid response from server")
          }
        } catch (err) {
            console.error("Login error:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message)
            } else {
                setError("Login failed. Please check your credentials or try again.")
            }
        }
        setIsLoading(false);
    }

    return(
        <section className="register">

       <div className="container register_container">

        <h2>Sign In</h2>
        <form onSubmit={loginVoter}>
           {error &&  <p className="form_error-message">{error}</p>}

            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              onChange={changeInputHandler} 
              autoComplete="true" 
              autoFocus
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

            <p>Don't have an account? <Link to='/register'>Sign Up</Link></p>

            <button type="submit" className="btn primary" style={{backgroundColor: '#1976d2', color: '#fff'}} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>
       </div>

       <footer className="login-footer">
           <div className="footer-content">
               <div className="footer-top">
                   
                   <div className="footer-links">
                       
                       <Link to="/instructions">Instructions</Link> |
                       <Link to="/contact">Contact Us</Link>|
                        <Link to="/terms">Terms & Conditions</Link> |
                       <Link to="/privacy">Privacy Policy</Link>|
                        <Link to="/cookies">Cookie Policy</Link> 
                       
                       
                   </div>
               </div>
                   <p>&copy; 2025 Voting App. All rights reserved.</p>
           </div>
       </footer>

        </section>
    )
}
export default Login;
