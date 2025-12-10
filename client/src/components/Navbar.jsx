import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IoIosMoon, IoMdSunny } from 'react-icons/io';
import { HiOutlineBars3 } from 'react-icons/hi2';
import { AiOutlineClose } from 'react-icons/ai';
import { useSelector } from 'react-redux';
const Navbar = () => {
  // Removed unused showDropdown state
  const [showNav, setShowNav] = useState(false);
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('voting-app-theme') || "");
  const location = useLocation();
  const token = useSelector(state => state?.vote?.currentVoter?.token);
  const isAdmin = useSelector(state => state?.vote?.currentVoter?.isAdmin);
  const navigate = useNavigate();

  const isLoginPage = location.pathname === '/' || location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isMinimalNavPage = isLoginPage || isRegisterPage ||
    location.pathname === '/contact' ||
    location.pathname === '/terms' ||
    location.pathname === '/privacy' ||
    location.pathname === '/cookies';

  const changeThemeHandler = () => {
    if (localStorage.getItem('voting-app-theme') === 'dark') {
      localStorage.setItem('voting-app-theme', '');
    } else {
      localStorage.setItem('voting-app-theme', 'dark');
    }
    setDarkTheme(localStorage.getItem('voting-app-theme'));
  };

  // ...existing code...

  // Place this inside your return statement where the dropdown should appear:
  // Example:
  // <div className="dropdown-menu">
  //   {showDropdown && (
  //     <div style={{ position: 'absolute', top: '100%', right: 0, background: '#e3f2fd', borderRadius: '0 0 8px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 1000 }}>
  //       <NavLink to="/instructions" style={{display: 'block', padding: '0.5rem 1rem', color: '#0d47a1'}} onClick={() => setShowDropdown(false)}>General Instructions</NavLink>
  //       {isAdmin && (
  //         <NavLink to="/admin/messages" style={{display: 'block', padding: '0.5rem 1rem', color: '#0d47a1'}} onClick={() => setShowDropdown(false)}>User Messages</NavLink>
  //       )}
  //     </div>
  //   )}
  // </div>
// ...existing code...

useEffect(() =>{
  document.body.className = localStorage.getItem('voting-app-theme');

},[darkTheme])

  return (
    <nav>
      <div className="container nav_container">
        <Link to="/" className='nav_logo'>HEMANTH</Link>
        <div>
          {/* Only show theme and menu icon on minimal nav pages */}
          {isMinimalNavPage ? (
            <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%'}}>
              <button className="theme_toggle-btn" style={{margin: 0, padding: 0}} onClick={changeThemeHandler}>{darkTheme ? <IoMdSunny /> : <IoIosMoon /> }</button>
              <button className="nav_toggle-btn" style={{margin: 0, padding: 0}}><HiOutlineBars3/></button>
            </div>
          ) : (
            <>
              {!isLoginPage && token && showNav && (
                <menu>
                  <NavLink to="/elections" style={{color: isAdmin ? '#fff' : '#fff', margin: 0, padding: 0, fontSize: 'inherit'}}>Elections</NavLink>|
                  <NavLink to="/results" style={{color: isAdmin ? '#fff' : '#fff', margin: 0, padding: 0, fontSize: 'inherit'}}>Results</NavLink>|
                  <select
                    style={{
                      background: '#4a90e2',
                      color: '#fff',
                      border: 'none',
                      fontSize: 'inherit',
                      outline: 'none',
                      margin: 0,
                      padding: 0,
                      height: '100%'
                    }}
                    value={''}
                    onChange={e => {
                      if (e.target.value === 'instructions') {
                        navigate('/instructions');
                      }
                      if (e.target.value === 'admin-messages') {
                        navigate('/admin-messages');
                      }
                    }}
                  >
                    <option value=""> Instructions</option>
                    <option value="instructions">Instructions</option>
                    {isAdmin && <option value="admin-messages">User Messages</option>}
                  </select>
                  {isAdmin && <NavLink to="/total-registered-voters" style={{color: '#fff', margin: 0, padding: 0, fontSize: 'inherit'}}>Total Registered</NavLink>}{isAdmin && '|'}
                  {isAdmin && <NavLink to="/voters" style={{color: '#fff', margin: 0, padding: 0, fontSize: 'inherit'}}>Voters List</NavLink>}|
                  <NavLink to="/logout" style={{margin: 0, padding: 0, fontSize: 'inherit', display: 'inline'}}>Logout</NavLink>
                </menu>
              )}
              <button className="theme_toggle-btn" style={{margin: 0, padding: 0, display: 'inline'}} onClick={changeThemeHandler}>{darkTheme ? <IoMdSunny /> : <IoIosMoon /> }</button>
              {isLoginPage ? (
                <button className="nav_toggle-btn"><HiOutlineBars3/></button>
              ) : (
                token && <button className="nav_toggle-btn" onClick={() => setShowNav(!showNav)}>
                  {showNav ? <AiOutlineClose /> : <HiOutlineBars3 />}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
