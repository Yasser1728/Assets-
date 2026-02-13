import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState("Ready to finalize...");
  const [isAuth, setIsAuth] = useState(false);
  const Pi = window.Pi;

  useEffect(() => {
    // تهيئة الـ SDK
    if (Pi) {
      Pi.init({ version: "2.0", sandbox: true });
    }
  }, [Pi]);

  const handleAction = async () => {
    if (!isAuth) {
      // المرحلة 1: الاتصال
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
      // المرحلة 2: الدفع (حل مشكلة Expired)
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

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ border: '2px solid #ffcc00', padding: '40px', borderRadius: '20px' }}>
          <h1 style={{ color: '#ffcc00' }}>ASSETS.PI</h1>
          <p>Final Step: Process Transaction</p>
          <button 
            onClick={handleAction}
            style={{
              backgroundColor: '#ffcc00', color: '#000', padding: '15px 30px',
              fontSize: '1.2em', fontWeight: 'bold', borderRadius: '10px', width: '100%'
            }}
          >
            {!isAuth ? "1. Connect Wallet" : "2. Pay 1 Test-Pi"}
          </button>
          <div style={{ marginTop: '20px', color: '#aaa' }}>{status}</div>
        </div>
      </header>
    </div>
  );
}

export default App;
