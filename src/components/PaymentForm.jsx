// src/components/PaymentForm.jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const card = elements.getElement(CardElement);
    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card }
      });

    setBusy(false);
    if (stripeError) {
      setError(stripeError.message);
    } else {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-2 border rounded" />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy || !stripe}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {busy ? "Processing…" : "Pay"}
      </button>
    </form>
  );
}

export default function PaymentForm({ amount, currency, onSuccess }) {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${jwt}`
      },
      body: JSON.stringify({ amount, currency })
    })
    .then(r => r.json())
    .then(data => {
      setClientSecret(data.clientSecret);
    })
    .catch(console.error);
  }, [amount, currency]);

  if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
    return <p className="text-red-600">Stripe key not configured.</p>;
  }

  if (!clientSecret) {
    return <p>Loading payment form…</p>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess} />
    </Elements>
  );
}
