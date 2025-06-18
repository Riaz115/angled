import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("SignIn component mounted");
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Sign in functionality would work here!");
    }, 1000);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000e2f',
      display: 'flex',
      flexDirection: 'row'
    }}>
      {/* Debug test div */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        background: 'red', 
        color: 'white', 
        padding: '10px', 
        zIndex: 9999 
      }}>
        SignIn Component is rendering!
      </div>
      
      {/* Main content */}
      <div style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h1 style={{ marginBottom: '30px' }}>Sign In</h1>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#000e2f',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '5px'
                }}
                placeholder="Enter your email"
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#000e2f',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '5px'
                }}
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'white',
                color: '#000e2f',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              Sign In
            </button>
          </form>
          
          <p style={{ fontSize: '14px' }}>
            Don't have an account? 
            <span 
              onClick={() => navigate("/sign-up")}
              style={{ color: '#004fff', cursor: 'pointer', marginLeft: '5px' }}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
      
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000
        }}>
          <div style={{ color: 'white' }}>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
