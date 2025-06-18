import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple test component
function TestApp() {
  return (
    <div style={{
      backgroundColor: '#000e2f',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <h1>🎉 React is Working!</h1>
      <p>If you can see this, React is properly loaded.</p>
      <div style={{
        background: 'red',
        color: 'white',
        padding: '10px',
        margin: '10px',
        borderRadius: '5px'
      }}>
        This should be a red box
      </div>
      <button 
        onClick={() => alert('JavaScript is working!')}
        style={{
          padding: '10px 20px',
          backgroundColor: 'white',
          color: '#000e2f',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Test Button
      </button>
    </div>
  )
}

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
)
