import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEventStore } from '../stores/eventStore';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PaymentForm from '../components/payments/PaymentForm';
import LoadingScreen from '../components/common/LoadingScreen';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Payments: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { 
    currentEvent,
    fetchEvent, 
    isLoading 
  } = useEventStore();
  
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  useEffect(() => {
    const loadEventData = async () => {
      if (!eventId) return;
      
      await fetchEvent(eventId);
      
      setIsInitialLoad(false);
    };
    
    loadEventData();
  }, [eventId, fetchEvent]);
  
  if (isInitialLoad && isLoading) {
    return <LoadingScreen />;
  }
  
  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="page-container text-center py-10 flex-1">
          <h2 className="text-xl font-semibold text-gray-700">Event not found</h2>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="mt-4 btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 5000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title={`Payments - ${currentEvent.title}`} />
      
      <main className="page-container max-w-3xl mx-auto flex-1">
        <div className="card animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Event Payments</h2>
          
          {paymentSuccess ? (
            <div className="bg-success-50 border border-success-200 text-success-700 px-6 py-4 rounded-lg mb-6 animate-fadeIn">
              <div className="flex items-center">
                <svg 
                  className="h-5 w-5 text-success-500 mr-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
                <span className="font-medium">Payment successful!</span>
              </div>
              <p className="mt-2 text-sm">
                Your payment has been processed successfully. You can view the details in the expenses section.
              </p>
              <div className="mt-4">
                <button 
                  onClick={() => navigate(`/events/${eventId}`)}
                  className="text-success-700 hover:text-success-800 font-medium"
                >
                  Return to Event →
                </button>
              </div>
            </div>
          ) : (
            <Elements stripe={stripePromise}>
              <PaymentForm 
                eventId={eventId || ''} 
                eventTitle={currentEvent.title}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payments;