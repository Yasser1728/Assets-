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

  const handleAction = async () => {
    if (!isAuth) {
      try {
        setStatus("Connecting...");
        const auth = await Pi.authenticate(['username', 'payments'], (payment) => {
          console.log("Incomplete payment", payment);
        });
        setIsAuth(true);
        setStatus(`Welcome, ${auth.user.username}`);
      } catch (err) {
        setStatus("Auth Error: " + err.message);
      }
    } else {
      try {
        setStatus("Preparing payment...");
        await Pi.createPayment({
          amount: 1.0,
          memo: "Finalizing Assets App Step 10",
          metadata: { step: "10" },
        }, {
          onReadyForServerApproval: (paymentId) => {
            console.log("Auto-approving:", paymentId);
            setStatus("Approving on Testnet...");
          },
          onReadyForServerCompletion: (paymentId, txid) => {
            setStatus("Success! Step 10 Completed ✅");
            alert("Transaction Successful! ID: " + txid);
          },
          onCancel: () => setStatus("Payment Cancelled."),
          onError: (error) => setStatus("Error: " + error.message)
        });
      } catch (err) {
        setStatus("Payment failed to start.");
      }
    }
  };

  const containerStyle = {
    backgroundColor: '#000',
    color: '#ffcc00',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif'
  };

  const boxStyle = {
    border: '2px solid #ffcc00',
    padding: '40px',
    borderRadius: '20px',
    textAlign: 'center',
    maxWidth: '320px'
  };

  return (
    <div style={containerStyle}>
        <div style={boxStyle}>
          <h1 style={{ fontSize: '2.5em', margin: '0 0 10px 0' }}>ASSETS.PI</h1>
          <p style={{ color: '#fff' }}>Final Step: Process Transaction</p>
          <button 
            onClick={handleAction}
            style={{
              backgroundColor: '#ffcc00', color: '#000', padding: '15px 30px',
              fontSize: '1.2em', fontWeight: 'bold', borderRadius: '10px', 
              width: '100%', border: 'none', cursor: 'pointer'
            }}
          >
            {!isAuth ? "1. Connect Wallet" : "2. Pay 1 Test-Pi"}
          </button>
          <div style={{ marginTop: '20px', color: '#aaa' }}>{status}</div>
        </div>
    </div>
  );
}

export default App;
