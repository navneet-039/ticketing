import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useRouter } from 'next/router';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed');
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      setSuccess(true);

      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center mt-16 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Complete Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!success && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <PaymentElement />
            </div>
          )}

          {!success && (
            <button
              type="submit"
              disabled={!stripe || loading}
              className={`w-full py-3 rounded-lg text-white font-medium transition duration-200 ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          )}

          {errorMessage && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          {success && (
            <div className="text-green-600 bg-green-50 p-4 rounded-lg text-center font-medium animate-pulse">
               Payment Successful! Redirecting...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;