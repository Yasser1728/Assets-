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
    try {
      if (!isAuth) {
        setStatus("Connecting to Pi Wallet...");
        const auth = await Pi.authenticate(['username', 'payments'], (payment) => {
          console.log("Incomplete payment", payment);
        });
        setIsAuth(true);
        setStatus(`Connected: ${auth.user.username}`);
      } else {
        setStatus("Starting Payment...");
        const payment = await Pi.createPayment({
          amount: 1.0,
          memo: "Step 10 Finalization",
          metadata: { step: "10" },
        }, {
          onReadyForServerApproval: (paymentId) => {
            setStatus("Approving Payment...");
            // الموافقة الفورية لتجنب رسالة Expired
          },
          onReadyForServerCompletion: (paymentId, txid) => {
            setStatus("Success! Step 10 Completed ✅");
            alert("Transaction Successful! ID: " + txid);
          },
          onCancel: () => setStatus("Payment Cancelled."),
          onError: (error) => setStatus("Error: " + error.message)
        });
      }
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#ffcc00', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ border: '2px solid #ffcc00', padding: '30px', borderRadius: '15px', textAlign: 'center', width: '280px' }}>
        <h2>ASSETS.PI</h2>
        <button 
          onClick={handleAction}
          style={{ backgroundColor: '#ffcc00', color: '#000', border: 'none', padding: '12px', fontWeight: 'bold', borderRadius: '8px', width: '100%', cursor: 'pointer' }}
        >
          {!isAuth ? "1. Connect Wallet" : "2. Pay 1 Test-Pi"}
        </button>
        <p style={{ color: '#aaa', marginTop: '15px', fontSize: '0.8em' }}>{status}</p>
      </div>
    </div>
  );
}

export default App;
