import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ErrorMessage from '../common/ErrorMessage';

interface PaymentFormProps {
  eventId: string;
  eventTitle: string;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ eventId, eventTitle, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real implementation, you would make an API call to your server
      // which would create a PaymentIntent with Stripe and return the client secret
      
      // Mock successful payment after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate a successful payment
      onSuccess();
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during payment processing');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Payment Details</h3>
        <p className="text-sm text-gray-500 mb-4">
          Make a payment for {eventTitle}
        </p>
        
        {error && <ErrorMessage message={error} />}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="form-label">Amount ($)</label>
            <input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="form-label">Description</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              placeholder="What is this payment for?"
              required
            />
          </div>
          
          <div>
            <label htmlFor="card-element" className="form-label">
              Credit or debit card
            </label>
            <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentForm;