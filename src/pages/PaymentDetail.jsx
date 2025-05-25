import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }        from 'react-router-dom';

export default function PaymentDetail() {
  const { id } = useParams();
  const nav    = useNavigate();
  const [payment, setPayment] = useState(null);
  const [error, setError]     = useState();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    fetch(`/api/payments/${id}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setPayment)
      .catch(() => setError('Failed to load payment'));
  }, [id]);

  const doAction = async (action) => {
    try {
      const jwt = localStorage.getItem('jwt');
      const res = await fetch(`/api/payments/${id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` }
      });
      const updated = await res.json();
      setPayment(updated);
    } catch {
      setError(`Failed to ${action}`);
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!payment) return <p>Loading…</p>;

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-bold mb-4">Payment #{payment.id}</h1>
      <p><strong>Amount:</strong> {payment.amount} {payment.currency}</p>
      <p><strong>Status:</strong> {payment.status}</p>
      <p><strong>Created:</strong> {new Date(payment.createdAt).toLocaleString()}</p>

      <div className="mt-6 space-x-2">
        {payment.status === 'AUTHORIZED' && (
          <button
            onClick={() => doAction('capture')}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Capture
          </button>
        )}
        {payment.status === 'CAPTURED' && (
          <button
            onClick={() => doAction('refund')}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Refund
          </button>
        )}
        <button
          onClick={() => nav(-1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}
