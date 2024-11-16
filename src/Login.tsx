import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigating after login
import { supabase } from './supabaseClient'; // Import Supabase client

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; // Props for setting login state
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState<string>(''); // Username state
  const [password, setPassword] = useState<string>(''); // Password state
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message state
  const [successMessage, setSuccessMessage] = useState<string>(''); // Success message state
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const navigate = useNavigate(); // Use navigate hook for redirection

  // Handle form submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Query the 'auth' table to check the user and password
      const { data, error } = await supabase
        .from('auth')
        .select('*')
        .eq('user', username) // Check 'user' column for the username
        .eq('pwd', password); // Check 'pwd' column for the password

      if (error) {
        setErrorMessage('Error checking credentials');
        return;
      }

      if (data && data.length > 0) {
        setSuccessMessage('Login successful!');
        console.log('Login successful:', data);

        // Store login status in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        
        // Update login state in parent
        setIsLoggedIn(true);

        // Redirect to dashboard after successful login
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (err) {
      setErrorMessage('Error connecting to the database');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '298px' }}>
        <h2 className="h3 mb-3 fw-normal text-right">Please sign in</h2>

        {/* Username input field */}
        <div className="form-floating mb-2">
          <input
            type="text"
            className="form-control"
            id="floatingUsername"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="floatingUsername">Username</label>
        </div>

        {/* Password input field */}
        <div className="form-floating mb-3" style={{ marginTop: '-5px' }}>
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Sign in'
          )}
        </button>

        {/* Show success or error message below the button */}
        {errorMessage && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success mt-3" role="alert">
            {successMessage}
          </div>
        )}

        <p className="mt-5 mb-3 text-body-secondary text-right">© Acehive</p>
      </form>
    </div>
  );
};

export default Login;
