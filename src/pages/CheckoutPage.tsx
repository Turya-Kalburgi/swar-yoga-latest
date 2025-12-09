import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, CreditCard, DollarSign } from 'lucide-react';
import axios from 'axios';

export default function CheckoutPage() {
  const { slug } = useParams();
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
            onClick={() => navigate('/workshops')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Workshops
          </button>
        </div>
      </div>
    );
  }

  const prices = {
    INR: batch.pricing.INR,
    NPR: batch.pricing.NPR,
    USD: batch.pricing.USD
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

      // Create payment record
      const paymentResponse = await axios.post(
        '/api/payment',
        {
          enrollmentId: enrollment._id,
          userId,
          workshopId: enrollment.workshopId,
          amount: prices[selectedCurrency],
          currency: selectedCurrency,
          subtotal: prices[selectedCurrency]
        },
        {
          headers: {
            'X-User-ID': userId
          }
        }
      );

      if (paymentResponse.data.success) {
        const paymentData = paymentResponse.data.data;
        setPaymentInitiated(true);

        // TODO: Integrate Razorpay SDK
        // For now, simulate successful payment
        setTimeout(async () => {
          try {
            await axios.post(
              `/api/payment/${paymentData._id}/verify`,
              {
                paymentId: `pay_${Date.now()}`,
                orderId: paymentData.orderId,
                signature: 'dummy_signature'
              },
              {
                headers: {
                  'X-User-ID': userId
                }
              }
            );

            navigate('/my-courses', {
              state: { enrollmentId: enrollment._id }
            });
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
          }
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error processing payment');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-gray-600">Registration</span>
          </div>
          <div className="flex-1 h-1 bg-indigo-600 mx-4"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
              <span>3</span>
            </div>
            <span className="text-gray-600">Payment</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600 mb-8">Step 3 of 3</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {paymentInitiated && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-700">Processing your payment...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Order Summary */}
            <div className="md:col-span-2">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>

                <div className="space-y-4 mb-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Course</span>
                    <span className="font-semibold text-gray-800">{enrollment.workshopId.title || 'Swar Yoga'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Batch Mode</span>
                    <span className="font-semibold text-gray-800 capitalize">{batch.mode}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Language</span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {enrollment.selectedLanguage}
                    </span>
                  </div>
                </div>

                {/* Currency Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Currency
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(prices) as Array<'INR' | 'NPR' | 'USD'>).map((currency) => (
                      <button
                        key={currency}
                        onClick={() => setSelectedCurrency(currency)}
                        className={`p-3 rounded-lg border-2 transition ${
                          selectedCurrency === currency
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-800">
                          {currency === 'INR' ? '₹' : currency === 'NPR' ? '₨' : '$'}{' '}
                          {prices[currency]}
                        </div>
                        <div className="text-xs text-gray-600">{currency}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tax & Total */}
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">
                      {selectedCurrency === 'INR' ? '₹' : selectedCurrency === 'NPR' ? '₨' : '$'}
                      {prices[selectedCurrency]}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 mb-2">
                    <span className="text-gray-600">Tax (0%)</span>
                    <span className="font-semibold text-gray-800">
                      {selectedCurrency === 'INR' ? '₹' : selectedCurrency === 'NPR' ? '₨' : '$'}0
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-t-2 border-indigo-600">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {selectedCurrency === 'INR' ? '₹' : selectedCurrency === 'NPR' ? '₨' : '$'}
                      {prices[selectedCurrency]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <div className="bg-indigo-50 border-2 border-indigo-600 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  <h3 className="font-semibold text-gray-800">Payment Method</h3>
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-sm text-gray-600">Gateway: Razorpay</p>
                  <p className="text-sm text-gray-600">Secure & trusted</p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading || paymentInitiated}
                  className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay Now
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  You will be redirected to Razorpay for secure payment
                </p>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-1">Secure Payment</p>
              <p>Your payment is protected by industry-standard SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to proceed with checkout');
      navigate('/signin?redirect=checkout');
      return;
    }

    loadCartItems();
  }, [user, currency]);

  const loadCartItems = async () => {
    try {
      if (!user) return;
      
      const items = await cartAPI.getUserCart(user.id);
      const filteredItems = (items as CartItem[]).filter(item => item.currency === currency);
      
      if (filteredItems.length === 0) {
        toast.error(`No items found in your cart with ${currency} currency`);
        navigate('/cart');
        return;
      }
      
      setOrderItems(filteredItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast.error('Failed to load cart items');
      navigate('/cart');
    }
  };

  const getPrice = (item: CartItem) => {
    switch (item.currency) {
      case 'NPR': return item.priceNPR;
      case 'USD': return item.priceUSD;
      default: return item.priceINR;
    }
  };

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'NPR': return 'NPR ';
      case 'USD': return '$';
      default: return '₹';
    }
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (getPrice(item) * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    // Only apply tax for Indian currency
    if (currency === 'INR') {
      return Math.round(calculateSubtotal() * 0.18); // 18% GST
    }
    return 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setOrderError(null);
      
      // Create order
      if (user) {
        const orderData = {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          items: orderItems.map(item => ({
            workshopId: item.workshopId,
            workshopTitle: item.workshopTitle,
            quantity: item.quantity,
            price: getPrice(item),
            currency: item.currency
          })),
          totalAmount: calculateTotal(),
          currency: currency,
          paymentMethod: paymentMethod,
          paymentStatus: 'pending' as const,
          billingAddress: {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: '',
            city: '',
            state: '',
            country: 'India',
            postalCode: ''
          }
        };
        
        await checkoutAPI.createOrder(orderData);
        
        // Mark cart items as purchased
        await cartAPI.completePurchase(user.id);
        
        // Store workshop details in sessionStorage for thank you page
        const firstItem = orderItems[0];
        sessionStorage.setItem('purchased_workshop', JSON.stringify({
          id: firstItem.workshopId,
          title: firstItem.workshopTitle,
          instructor: firstItem.instructor,
          price: getPrice(firstItem),
          currency: currency,
          image: firstItem.image,
          whatsappGroupLink: firstItem.whatsappGroupLink || ''
        }));
        
        // Redirect to payment URL based on currency
        redirectToPayment();
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setOrderError('An error occurred during checkout. Please try again.');
      toast.error('Checkout failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const redirectToPayment = () => {
    // Get payment URL based on currency
    let paymentUrl = '';
    
    // Find the first item to get the payment link
    const firstItem = orderItems[0];
    if (firstItem) {
      switch(currency) {
        case 'NPR':
          paymentUrl = firstItem.paymentLinkNPR || '';
          break;
        case 'USD':
          paymentUrl = firstItem.paymentLinkUSD || '';
          break;
        default:
          paymentUrl = firstItem.paymentLinkINR || '';
      }
    }
    
    if (!paymentUrl) {
      setOrderError('Payment link not available. Please try another payment method.');
      setIsProcessing(false);
      return;
    }
    
    // Redirect to payment URL
    window.location.href = paymentUrl;
  };

  // Format date in DD/MM/YYYY format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
  {/* Header provided by App layout */}
        <div className="container mx-auto max-w-2xl px-6 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. You will receive a confirmation email shortly with your workshop details.
            </p>
            <div className="space-y-4">
              <Link 
                to="/workshops"
                className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse More Workshops
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header provided by App layout */}

      <div className="container mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            to="/cart"
            className="p-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {currency} Payment
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {orderItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.workshopTitle}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.workshopTitle}</h3>
                      <p className="text-sm text-gray-600">by {item.instructor}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(item.startDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{item.startTime} - {item.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{item.mode}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {getCurrencySymbol(currency)}{getPrice(item)}
                      </div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Method</h2>
              
              {currency === 'INR' && (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="payu"
                        checked={paymentMethod === 'payu'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-green-600" />
                        <div>
                          <div className="font-semibold text-gray-800">PayU Payment Gateway</div>
                          <div className="text-sm text-gray-600">Credit Card, Debit Card, Net Banking, UPI, Wallets</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {currency === 'NPR' && (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="qr"
                        checked={paymentMethod === 'qr'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <div className="flex items-center space-x-3">
                        <QrCode className="h-6 w-6 text-green-600" />
                        <div>
                          <div className="font-semibold text-gray-800">QR Code Payment</div>
                          <div className="text-sm text-gray-600">eSewa, Khalti, Connect IPS, Mobile Banking</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {currency === 'USD' && (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <div className="flex items-center space-x-3">
                        <Paypal className="h-6 w-6 text-blue-600" />
                        <div>
                          <div className="font-semibold text-gray-800">PayPal</div>
                          <div className="text-sm text-gray-600">Credit Card, Debit Card, PayPal Balance</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div className="text-sm text-green-800">
                  Your payment information is secure and encrypted. We never store your card details.
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{getCurrencySymbol(currency)}{calculateSubtotal()}</span>
                </div>
                {currency === 'INR' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span className="font-semibold">{getCurrencySymbol(currency)}{calculateTax()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-green-600">
                      {getCurrencySymbol(currency)}{calculateTotal()}
                    </span>
                  </div>
                </div>
              </div>

              {orderError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{orderError}</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={isProcessing || orderItems.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Pay Now {getCurrencySymbol(currency)}{calculateTotal()}</span>
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* Footer provided by App layout */}
    </div>
  );
};

export default CheckoutPage;