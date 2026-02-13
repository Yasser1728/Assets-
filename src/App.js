import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    // التأكد من تحميل Pi SDK وتهيئته لوضع الاختبار (Sandbox)
    if (window.Pi) {
      window.Pi.init({ version: "2.0", sandbox: true });
      console.log("Pi SDK is initialized in Sandbox mode");
    }
  }, []);

  const handleConnect = () => {
    // وظيفة وهمية للتجربة داخل متصفح Pi
    alert("Connecting to Pi Wallet...");
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      backgroundColor: '#0a0a0a', 
      color: '#d4af37', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      fontFamily: 'sans-serif' 
    }}>
      <div style={{ padding: '20px', border: '2px solid #d4af37', borderRadius: '15px', margin: 'auto', maxWidth: '300px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>ASSETS.PI</h1>
        <p style={{ color: '#b0b0b0', fontSize: '1rem' }}>The Future of Digital Asset Management</p>
        
        <button 
          onClick={handleConnect}
          style={{ 
            backgroundColor: '#d4af37', 
            color: 'black', 
            border: 'none', 
            padding: '12px 25px', 
            borderRadius: '8px', 
            fontWeight: 'bold', 
            marginTop: '20px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Connect Wallet
        </button>
        
        <p style={{ marginTop: '15px', fontSize: '0.8rem', opacity: 0.7 }}>
          Status: Sandbox Mode Active
        </p>
      </div>
    </div>
  );
}

export default App;
