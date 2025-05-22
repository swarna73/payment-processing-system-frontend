// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import PaymentForm from './PaymentForm';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [payments, setPayments] = useState([]);  // always start as array

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const headers = { Authorization: `Bearer ${jwt}` };

    // load profile
    fetch('/api/auth/me', { headers })
      .then(r => r.json())
      .then(setUser)
      .catch(console.error);

    // load audit logs
    fetch('/api/audit-logs', { headers })
      .then(r => r.json())
      .then(setAuditLogs)
      .catch(console.error);

    // load payments
    fetch('/api/payments', { headers })
      .then(r => r.json())
      .then(data => {
        // If the API returns an array directly, use it.
        if (Array.isArray(data)) {
          setPayments(data);
        }
        // If it returns an object with a `payments` key, use that.
        else if (data && Array.isArray(data.payments)) {
          setPayments(data.payments);
        }
        // Otherwise fall back to empty array
        else {
          console.warn('Unexpected /api/payments response shape', data);
          setPayments([]);
        }
      })
      .catch(err => {
        console.error(err);
        setPayments([]); 
      });
  }, []);

  const handlePaymentSuccess = () => {
    // re-fetch payments the same way
    const jwt = localStorage.getItem('jwt');
    fetch('/api/payments', { headers: { Authorization: `Bearer ${jwt}` } })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPayments(data);
        else if (data && Array.isArray(data.payments)) setPayments(data.payments);
        else setPayments([]);
      })
      .catch(console.error);
  };

  return (
    <div className="container mx-auto p-6">
      {/* ... profile and audit-log sections unchanged ... */}

      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Payments</h2>

        {payments.length === 0 ? (
          <p className="italic">No payments yet.</p>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Currency</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{new Date(p.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{p.amount}</td>
                  <td className="px-4 py-2">{p.currency}</td>
                  <td className="px-4 py-2 capitalize">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ... audit log section ... */}
    </div>
  );
}
