// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import PaymentForm from '../components/PaymentForm';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const headers = { Authorization: `Bearer ${jwt}` };

    // Load profile
    fetch('/api/auth/me', { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setUser(data))
      .catch(() => setUser(null));

    // Load payments
    fetch('/api/payments', { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setPayments(Array.isArray(data) ? data : []))
      .catch(() => setPayments([]));

    // Load audit logs
    fetch('/api/audit-logs', { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setAuditLogs(Array.isArray(data) ? data : []))
      .catch(() => setAuditLogs([]));
  }, []);

  const handlePaymentSuccess = () => {
    const jwt = localStorage.getItem('jwt');
    const headers = { Authorization: `Bearer ${jwt}` };

    fetch('/api/payments', { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setPayments(Array.isArray(data) ? data : []))
      .catch(() => setPayments([]));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Dashboard</h1>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          {user ? (
            <div className="space-y-3">
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Roles:</span> {user.roles?.join(', ')}
              </p>
              <button
                onClick={() => {/* TODO: logout */}}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded w-full"
              >
                Logout
              </button>
            </div>
          ) : (
            <p>Loading profile…</p>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Create Payment */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Create a Payment</h2>
            <PaymentForm amount={10.5} currency="USD" onSuccess={handlePaymentSuccess} />
          </section>

          {/* Payments Table */}
          <section className="bg-white p-6 rounded-lg shadow">
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
                      <td className="px-4 py-2">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{p.amount}</td>
                      <td className="px-4 py-2">{p.currency}</td>
                      <td className="px-4 py-2 capitalize">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* Audit Log */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Audit Log</h2>
            {auditLogs.length === 0 ? (
              <p className="italic">No audit entries yet.</p>
            ) : (
              <ul className="space-y-2">
                {auditLogs.map(log => (
                  <li key={log.id} className="flex justify-between">
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                    <span className="font-medium">— {log.action}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
