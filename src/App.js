import React, { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState("Ready to finalize...");
  const [isAuth, setIsAuth] = useState(false);
  const Pi = window.Pi;

  useEffect(() => {
    if (Pi) {
      Pi.init({ version: "2.0", sandbox: true });
    }
  }, [Pi]);

  const handleConnect = async () => {
    try {
      setStatus("Connecting...");
      const auth = await Pi.authenticate(['username', 'payments'], (payment) => {
        console.log("Incomplete payment", payment);
      });
      setIsAuth(true);
      setStatus(`Welcome, ${auth.user.username}! Now press Pay.`);
    } catch (err) {
      setStatus("Auth Error: " + err.message);
    }
  };

  const handlePay = async () => {
    try {
      setStatus("Opening Wallet...");
      await Pi.createPayment({
        amount: 1.0,
        memo: "Final Step 10 validation",
        metadata: { step: "10" },
      }, {
        onReadyForServerApproval: (paymentId) => {
          setStatus("Payment processing...");
          console.log("Approving:", paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          setStatus("Success! Step 10 Completed ✅");
          alert("Transaction Successful!");
        },
        onCancel: () => setStatus("Payment Cancelled."),
        onError: (error) => setStatus("Error: " + error.message)
      });
    } catch (err) {
      setStatus("Payment failed to start.");
    }
  };

  const containerStyle = {
    backgroundColor: '#000',
    color: '#ffcc00',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif'
  };

  const boxStyle = {
    border: '1px solid #ffcc00',
    padding: '40px',
    borderRadius: '24px',
    textAlign: 'center',
    width: '320px',
    backgroundColor: '#161616'
  };

  const btnBase = {
    padding: '14px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '1.1em',
    width: '100%',
    border: 'none',
    cursor: 'pointer',
    marginTop: '15px'
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h1 style={{ margin: '0 0 10px 0' }}>ASSETS.PI</h1>
        <p style={{ color: '#fff', fontSize: '0.9em' }}>Final Step: Process Transaction</p>
        
        {/* الزر الأول: الاتصال (أصفر) */}
        {!isAuth && (
          <button 
            onClick={handleConnect}
            style={{ ...btnBase, backgroundColor: '#d4af37', color: '#000' }}
          >
            1. Connect Wallet
          </button>
        )}

        {/* الزر الثاني: الدفع (أخضر) - يظهر فقط بعد الاتصال */}
        {isAuth && (
          <button 
            onClick={handlePay}
            style={{ ...btnBase, backgroundColor: '#4caf50', color: '#fff' }}
          >
            2. Pay 1 Test-Pi
          </button>
        )}

        <div style={{ marginTop: '20px', color: '#aaa', fontSize: '0.8em' }}>{status}</div>
      </div>
    </div>
  );
}

export default App;
