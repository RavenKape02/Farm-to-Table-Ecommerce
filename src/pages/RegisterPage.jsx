import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { firstName, middleName, lastName, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      console.log('Attempting registration with:', { email });
      
      const response = await axios.post('/api/users/register', registerData);
      console.log('Registration successful:', response.data);
      
      // Use login function from context
      login(response.data);
      
      // Redirect to home page after successful registration
      navigate('/');
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        setError(error.response.data.message || 'Registration failed. Please try again.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('Server not responding. Please try again later.');
      } else {
        console.error('Error message:', error.message);
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <div className="auth-logo">
          <h3>Farm-to-table</h3>
          <p>Department of Agriculture E-commerce Platform</p>
        </div>
        
        <h2>Create an Account</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="middleName">Middle Name (optional)</label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              value={middleName}
              onChange={handleChange}
              placeholder="Enter your middle name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            className="register-button" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="login-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 