import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/user', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setUserName(data.user.name);
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    } catch {
      setIsLoggedIn(false);
      setUserName('');
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
      setIsLoggedIn(false);
      navigate('/');
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      console.error('Logout failed');
    }
  };

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleRouteClick = (targetPath) => {
    if (location.pathname === targetPath) {
      window.location.reload();
    }
  };

  return (
    <nav className={`navbar ${showNavbar ? 'visible' : 'hidden'}`}>
      <div className="logo-hamburger-container">
        <div
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
      </div>

      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" onClick={() => handleRouteClick('/')}>Home</Link>
        </li>
        <li>
          <Link to="/dashboard" onClick={() => handleRouteClick('/dashboard')}>Dashboard</Link>
        </li>
        <li>
          <Link to="/about" onClick={() => handleRouteClick('/about')}>About Us</Link>
        </li>
      </ul>

      <div className={`nav-buttons ${isOpen ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'flex-end' }}>
        {isLoggedIn ? (
          <>
            <span style={{
              fontSize: '18px',
              color: '#0d6efd',
              marginRight: '12px',
              marginBottom: '0.5cm' // final adjusted position (0.5cm down)
            }}>
              Hi, {userName}
            </span>
            <button className="login" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"><button className="login">Login</button></Link>
            <Link to="/signup"><button className="get-started">Get Started</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
