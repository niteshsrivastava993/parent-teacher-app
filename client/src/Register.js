import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'parent'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength validation
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
    }
    
    return errors;
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Real-time validation as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear previous errors for this field
    setErrors(prev => ({ ...prev, [name]: '', confirmPassword: '' }));

    // Real-time validation
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    }

    if (name === 'password' && value) {
      const passwordErrors = validatePassword(value);
      if (passwordErrors.length > 0) {
        setErrors(prev => ({ ...prev, password: passwordErrors }));
      }
    }

    if (name === 'confirmPassword' && value) {
      if (value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      }
    }

    if (name === 'password' && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordErrors = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = ['Password is required'];
    } else if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await axios.post('http://localhost:5000/api/auth/register', submitData);
      
      if (response.data.requiresVerification) {
        setErrors({ success: 'Registration successful! Please check your email to verify your account before logging in.' });
      } else {
        onRegister(response.data.user, response.data.token);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: '', color: '#ddd' };
    
    const errors = validatePassword(password);
    const strength = ((5 - errors.length) / 5) * 100;
    
    if (strength === 100) return { strength, text: 'Very Strong', color: '#28a745' };
    if (strength >= 80) return { strength, text: 'Strong', color: '#20c997' };
    if (strength >= 60) return { strength, text: 'Good', color: '#ffc107' };
    if (strength >= 40) return { strength, text: 'Fair', color: '#fd7e14' };
    return { strength, text: 'Weak', color: '#dc3545' };
  };

  const passwordStrength = getPasswordStrength();

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    title: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#2c3e50',
      fontSize: '2rem',
      fontWeight: '600'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontWeight: '600',
      color: '#555',
      fontSize: '0.9rem'
    },
    input: {
      padding: '0.875rem 1rem',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.9)'
    },
    inputError: {
      borderColor: '#dc3545'
    },
    inputSuccess: {
      borderColor: '#28a745'
    },
    passwordContainer: {
      position: 'relative'
    },
    passwordToggle: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.2rem',
      color: '#666'
    },
    select: {
      padding: '0.875rem 1rem',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '1rem',
      background: 'rgba(255, 255, 255, 0.9)',
      cursor: 'pointer'
    },
    errorList: {
      color: '#dc3545',
      fontSize: '0.85rem',
      margin: '0',
      paddingLeft: '1rem'
    },
    errorText: {
      color: '#dc3545',
      fontSize: '0.85rem',
      margin: '0'
    },
    successText: {
      color: '#28a745',
      fontSize: '0.9rem',
      textAlign: 'center',
      padding: '1rem',
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(40, 167, 69, 0.3)'
    },
    passwordStrength: {
      marginTop: '0.5rem'
    },
    strengthBar: {
      width: '100%',
      height: '6px',
      backgroundColor: '#e9ecef',
      borderRadius: '3px',
      overflow: 'hidden'
    },
    strengthProgress: {
      height: '100%',
      width: `${passwordStrength.strength}%`,
      backgroundColor: passwordStrength.color,
      transition: 'all 0.3s ease'
    },
    strengthText: {
      fontSize: '0.8rem',
      color: passwordStrength.color,
      fontWeight: '600',
      marginTop: '0.25rem'
    },
    button: {
      padding: '0.875rem 1.5rem',
      background: 'linear-gradient(45deg, #27ae60, #229954)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    switchText: {
      textAlign: 'center',
      marginTop: '1.5rem',
      color: '#666'
    },
    switchBtn: {
      background: 'none',
      border: 'none',
      color: '#3498db',
      cursor: 'pointer',
      textDecoration: 'underline',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Account</h2>
      
      {errors.success && (
        <div style={styles.successText}>{errors.success}</div>
      )}
      
      {errors.general && (
        <div style={styles.errorText}>{errors.general}</div>
      )}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.name ? styles.inputError : {}),
              ...(formData.name && !errors.name ? styles.inputSuccess : {})
            }}
          />
          {errors.name && <p style={styles.errorText}>{errors.name}</p>}
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.email ? styles.inputError : {}),
              ...(formData.email && !errors.email && validateEmail(formData.email) ? styles.inputSuccess : {})
            }}
          />
          {errors.email && <p style={styles.errorText}>{errors.email}</p>}
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password *</label>
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                paddingRight: '3rem',
                ...(errors.password ? styles.inputError : {}),
                ...(formData.password && !errors.password ? styles.inputSuccess : {})
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          {formData.password && (
            <div style={styles.passwordStrength}>
              <div style={styles.strengthBar}>
                <div style={styles.strengthProgress}></div>
              </div>
              <div style={styles.strengthText}>
                Password strength: {passwordStrength.text}
              </div>
            </div>
          )}
          
          {errors.password && Array.isArray(errors.password) && (
            <ul style={styles.errorList}>
              {errors.password.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Confirm Password *</label>
          <div style={styles.passwordContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                ...styles.input,
                paddingRight: '3rem',
                ...(errors.confirmPassword ? styles.inputError : {}),
                ...(formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword ? styles.inputSuccess : {})
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.passwordToggle}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword}</p>}
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="parent">👨‍👩‍👧‍👦 Parent</option>
            <option value="teacher">👩‍🏫 Teacher</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading || Object.keys(errors).some(key => key !== 'success' && errors[key])}
          style={{
            ...styles.button,
            ...(loading || Object.keys(errors).some(key => key !== 'success' && errors[key]) ? styles.buttonDisabled : {})
          }}
        >
          {loading ? '⏳ Creating Account...' : '✨ Create Account'}
        </button>
      </form>
      
      <div style={styles.switchText}>
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} style={styles.switchBtn}>
          Sign in here
        </button>
      </div>
    </div>
  );
};


 


export default Register;