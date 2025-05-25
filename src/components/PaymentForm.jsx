// src/components/PaymentForm.jsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

function CheckoutForm({ onSuccess, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState();

  const handleConfirm = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);

    const card = elements.getElement(CardElement);
    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

    setBusy(false);
    if (stripeError) setError(stripeError.message);
    else onSuccess(paymentIntent);
  };

  return (
    <form onSubmit={handleConfirm} className="space-y-4">
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

export default function PaymentForm({ onSuccess }) {
  const [step, setStep]           = useState("setup");  // setup vs card
  const [amount, setAmount]       = useState("");
  const [currency, setCurrency]   = useState("USD");
  const [clientSecret, setSecret] = useState();

  const handleSetup = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return alert("Enter a valid amount.");

    try {
      const jwt = localStorage.getItem("jwt");
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({ amount: amt, currency })
      });
      const data = await res.json();
      setSecret(data.clientSecret);
      setStep("card");
    } catch {
      alert("Failed to initialize payment.");
    }
  };

  if (step === "setup") {
    return (
      <form onSubmit={handleSetup} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="10.00"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Currency</label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next: Enter Card
        </button>
      </form>
    );
  }

  // step === "card"
  if (!clientSecret) {
    return <p>Loading payment form…</p>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm onSuccess={onSuccess} clientSecret={clientSecret} />
    </Elements>
  );
}
