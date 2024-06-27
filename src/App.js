import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

import "bootswatch/dist/lux/bootstrap.min.css";
import "./App.css";

const stripePromise = loadStripe(
  "pk_test_51PVz1LP0Hf605oErp0Y7krZmJc8Q06rAmW2sGbGCAvzMBu4ZcxSb9qjFmb0A4yFCQMenx3BtawnDGFPajGPCrASr00fTl6fGyW"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      const { id } = paymentMethod;

      await axios.post('http://localhost:3000/api/checkout', {
        id,
        amount: 10000
      })
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <img
        src="https://tierramarketing.es/wp-content/uploads/2022/07/micro-eventos.png"
        alt="k68 keyboard"
        className="img-fluid"
      />
      <h3></h3>
      
      <div className="form-group">
        <CardElement className="form-control"/>
      </div>
      <button className="btn btn-success">buy</button>
    </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
