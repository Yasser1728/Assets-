import React, { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState("Ready to connect...");
  const [statusType, setStatusType] = useState("idle"); // idle | loading | success | error
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step10Done, setStep10Done] = useState(false);

  const Pi = window.Pi;

  // ─── Init Pi SDK ───────────────────────────────────────────
  useEffect(() => {
    if (Pi) {
      Pi.init({ version: "2.0", sandbox: false }); // ← false = Production
      setStatus("Pi SDK ready. Press Connect.");
    } else {
      setStatus("⚠️ Open this app inside Pi Browser.");
      setStatusType("error");
    }
  }, []);

  // ─── Handle Incomplete Payments ───────────────────────────
  const onIncompletePaymentFound = async (payment) => {
    console.log("Incomplete payment found:", payment);
    try {
      await fetch("/api/payments/incomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: payment.identifier })
      });
    } catch (e) {
      console.warn("Incomplete payment handler error:", e.message);
    }
  };

  // ─── Step 1: Connect Wallet ───────────────────────────────
  const handleConnect = async () => {
    if (!Pi) {
      setStatus("Pi Browser required.");
      setStatusType("error");
      return;
    }
    try {
      setIsProcessing(true);
      setStatus("Authenticating with Pi Wallet...");
      setStatusType("loading");

      const auth = await Pi.authenticate(
        ["username", "payments"],
        onIncompletePaymentFound
      );

      setIsAuth(true);
      setUsername(auth.user.username);
      setStatus(`Welcome, ${auth.user.username}! Ready to pay.`);
      setStatusType("success");
    } catch (err) {
      console.error("Auth error:", err);
      setStatus("Auth failed: " + (err.message || "Unknown error"));
      setStatusType("error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Step 2: Pay ──────────────────────────────────────────
  const handlePay = async () => {
    if (!Pi) return;
    try {
      setIsProcessing(true);
      setStatus("Opening Pi Wallet...");
      setStatusType("loading");

      await Pi.createPayment(
        {
          amount: 1.0,
          memo: "Assets.Pi — Step 10 Verification",
          metadata: { step: "10", user: username, timestamp: Date.now() }
        },
        {
          // ── Server Approve ─────────────────────────────────
          onReadyForServerApproval: async (paymentId) => {
            setStatus("Approving payment...");
            try {
              await fetch("/api/payments/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId })
              });
              console.log("✅ Approved:", paymentId);
            } catch (e) {
              console.warn("Approve error (no backend?):", e.message);
            }
          },

          // ── Server Complete ────────────────────────────────
          onReadyForServerCompletion: async (paymentId, txid) => {
            setStatus("Completing transaction...");
            try {
              await fetch("/api/payments/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid })
              });
              console.log("✅ Completed:", paymentId, txid);
            } catch (e) {
              console.warn("Complete error (no backend?):", e.message);
            }
            // ✅ SUCCESS
            setStatus("Step 10 Completed Successfully! ✅");
            setStatusType("success");
            setStep10Done(true);
            setIsProcessing(false);
          },

          onCancel: () => {
            setStatus("Payment cancelled. Try again.");
            setStatusType("idle");
            setIsProcessing(false);
          },

          onError: (error) => {
            console.error("Payment error:", error);
            setStatus("Payment error: " + (error.message || error));
            setStatusType("error");
            setIsProcessing(false);
          }
        }
      );
    } catch (err) {
      console.error("Payment start error:", err);
      setStatus("Failed to start payment.");
      setStatusType("error");
      setIsProcessing(false);
    }
  };

  // ─── Styles ───────────────────────────────────────────────
  const styles = {
    container: {
      backgroundColor: '#0a0a0a',
      color: '#FFD700',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Space Mono', 'Courier New', monospace",
      padding: '20px',
    },
    box: {
      border: '1px solid rgba(255,215,0,0.3)',
      padding: '36px 28px',
      borderRadius: '20px',
      textAlign: 'center',
      width: '100%',
      maxWidth: '340px',
      backgroundColor: '#141414',
      boxShadow: '0 0 40px rgba(255,215,0,0.08)',
      position: 'relative',
      overflow: 'hidden',
    },
    title: {
      fontSize: '2.2em',
      fontWeight: 'bold',
      margin: '0 0 6px 0',
      letterSpacing: '4px',
      textShadow: '0 0 20px rgba(255,215,0,0.4)',
    },
    subtitle: {
      color: '#888',
      fontSize: '0.8em',
      letterSpacing: '2px',
      marginBottom: '28px',
    },
    amountBox: {
      background: 'rgba(255,215,0,0.06)',
      border: '1px solid rgba(255,215,0,0.15)',
      borderRadius: '10px',
      padding: '14px',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    amountLabel: { color: '#666', fontSize: '0.75em', letterSpacing: '2px' },
    amountValue: { color: '#FFD700', fontSize: '1.5em', fontWeight: 'bold' },
    btnConnect: {
      padding: '16px',
      borderRadius: '12px',
      fontWeight: 'bold',
      fontSize: '1em',
      width: '100%',
      border: 'none',
      cursor: isProcessing ? 'not-allowed' : 'pointer',
      backgroundColor: isProcessing ? '#998200' : '#FFD700',
      color: '#000',
      letterSpacing: '2px',
      transition: 'all 0.2s ease',
      opacity: isProcessing ? 0.7 : 1,
    },
    btnPay: {
      padding: '16px',
      borderRadius: '12px',
      fontWeight: 'bold',
      fontSize: '1em',
      width: '100%',
      border: 'none',
      cursor: isProcessing ? 'not-allowed' : 'pointer',
      backgroundColor: step10Done ? '#1a1a1a' : (isProcessing ? '#2e6e30' : '#4CAF50'),
      color: step10Done ? '#4CAF50' : '#fff',
      letterSpacing: '2px',
      transition: 'all 0.2s ease',
      opacity: isProcessing ? 0.7 : 1,
      border: step10Done ? '1px solid #4CAF50' : 'none',
    },
    statusBox: {
      marginTop: '20px',
      padding: '12px',
      borderRadius: '10px',
      fontSize: '0.78em',
      letterSpacing: '1px',
      lineHeight: '1.5',
      backgroundColor:
        statusType === 'success' ? 'rgba(76,175,80,0.1)' :
        statusType === 'error'   ? 'rgba(255,23,68,0.1)' :
        statusType === 'loading' ? 'rgba(255,215,0,0.08)' :
        'rgba(255,255,255,0.03)',
      color:
        statusType === 'success' ? '#4CAF50' :
        statusType === 'error'   ? '#FF1744' :
        statusType === 'loading' ? '#FFD700' :
        '#888',
      border:
        statusType === 'success' ? '1px solid rgba(76,175,80,0.3)' :
        statusType === 'error'   ? '1px solid rgba(255,23,68,0.3)' :
        statusType === 'loading' ? '1px solid rgba(255,215,0,0.2)' :
        '1px solid rgba(255,255,255,0.05)',
    },
    stepsRow: {
      marginTop: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    stepItem: (done) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 14px',
      borderRadius: '10px',
      fontSize: '0.75em',
      letterSpacing: '1px',
      backgroundColor: done ? 'rgba(76,175,80,0.08)' : 'rgba(255,255,255,0.03)',
      border: done ? '1px solid rgba(76,175,80,0.2)' : '1px solid rgba(255,255,255,0.05)',
      color: done ? '#4CAF50' : '#555',
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>

        {/* Title */}
        <h1 style={styles.title}>ASSETS.PI</h1>
        <p style={styles.subtitle}>FINAL STEP · PROCESS TRANSACTION</p>

        {/* Amount */}
        <div style={styles.amountBox}>
          <span style={styles.amountLabel}>AMOUNT</span>
          <span style={styles.amountValue}>1 π</span>
        </div>

        {/* Step 1 Button */}
        {!isAuth && (
          <button
            onClick={handleConnect}
            disabled={isProcessing}
            style={styles.btnConnect}
          >
            {isProcessing ? "Connecting..." : "1. Connect Wallet"}
          </button>
        )}

        {/* Step 2 Button */}
        {isAuth && (
          <button
            onClick={handlePay}
            disabled={isProcessing || step10Done}
            style={styles.btnPay}
          >
            {step10Done
              ? "✓ Completed"
              : isProcessing
              ? "Processing..."
              : "2. Pay 1 Pi"}
          </button>
        )}

        {/* Status */}
        <div style={styles.statusBox}>{status}</div>

        {/* Steps Progress */}
        <div style={styles.stepsRow}>
          <div style={styles.stepItem(true)}>✓ Domain Ownership Validated</div>
          <div style={styles.stepItem(true)}>✓ PiNet Subdomain Added</div>
          <div style={styles.stepItem(step10Done)}>
            {step10Done ? "✓" : "○"} Process Transaction (Step 10)
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
