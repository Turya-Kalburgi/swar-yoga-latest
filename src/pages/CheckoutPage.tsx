import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import axios from 'axios';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { enrollment, batch } = location.state || {};

  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'NPR' | 'USD'>('INR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  if (!enrollment || !batch) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">Invalid checkout session</p>
          <button
            onClick={() => navigate('/workshop-list')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Workshops
          </button>
        </div>
      </div>
    );
  }

  const prices = {
    INR: batch.pricing?.INR || 5000,
    NPR: batch.pricing?.NPR || 6500,
    USD: batch.pricing?.USD || 60
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/signin');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id || user._id;

      // In real implementation, call payment API
      console.log('Processing payment:', { userId, amount: prices[selectedCurrency], currency: selectedCurrency });
      
      setPaymentInitiated(true);
      setTimeout(() => {
        navigate('/my-courses');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Complete Your Payment</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {paymentInitiated && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">Processing your payment...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course</span>
                    <span className="font-semibold">{batch.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode</span>
                    <span className="font-semibold capitalize">{batch.mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-semibold">{enrollment.selectedLanguage}</span>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Currency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(prices) as Array<'INR' | 'NPR' | 'USD'>).map((currency) => (
                    <button
                      key={currency}
                      onClick={() => setSelectedCurrency(currency)}
                      className={`p-3 rounded-lg border-2 ${
                        selectedCurrency === currency
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="font-semibold">
                        {currency === 'INR' ? '₹' : currency === 'NPR' ? '₨' : '$'}{prices[currency]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-indigo-50 border-2 border-indigo-600 rounded-lg p-6">
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Total</h3>
                  <p className="text-3xl font-bold text-indigo-600">
                    {selectedCurrency === 'INR' ? '₹' : selectedCurrency === 'NPR' ? '₨' : '$'}{prices[selectedCurrency]}
                  </p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading || paymentInitiated}
                  className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure payment via PayU/PayPal/QR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
