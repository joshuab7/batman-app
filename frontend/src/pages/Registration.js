import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../services/api';

const Registration = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
        }
        
        setIsLoading(true);
        
        try {
        const { confirmPassword, ...userData } = formData;
        
        console.log('Registering with:', userData);
        const response = await auth.register(userData);
        console.log('Registration response:', response);
        
        login(response.data.user, response.data.token);
        navigate('/characters');
        } catch (err) {
        console.error('Registration error:', err);
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
        setIsLoading(false);
        }
    };
    
    return (
        <div className="register-page">
        <h1>Create an Account</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            </div>
            
            <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            </div>
            
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            </div>
            
            <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
            />
            </div>
            
            <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
            >
            {isLoading ? 'Creating Account...' : 'Register'}
            </button>
            
            <div className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
            </div>
        </form>
        </div>
    );
};

export default Registration;