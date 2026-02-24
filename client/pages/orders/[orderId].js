import { useEffect, useState } from 'react';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../lib/stripe';
import CheckoutForm from '../../components/CheckoutForm';

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const msLeft =
        new Date(order.expiresAt).getTime() - new Date().getTime();

      setTimeLeft(Math.round(msLeft / 1000));
    };

    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [order.expiresAt]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post('/api/payments', {
          orderId: order.id,
        });

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent', err);
      }
    };

    createPaymentIntent();
  }, [order.id]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <h4>{timeLeft} seconds left</h4>

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

// 🔹 getInitialProps ONLY fetches order
OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;