import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CreditCard, Shield, CheckCircle, ArrowLeft, Calendar, Clock, MapPin, AlertCircle, QrCode, Palette as Paypal } from 'lucide-react';
// Header and Footer are provided by App routes; removed local imports to avoid duplicate rendering
import { cartAPI } from '../utils/cartData';
import { checkoutAPI } from '../utils/checkoutData';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

interface CartItem {
  id: number;
  userId: string | number;
  userName: string;
  userEmail: string;
  workshopId: number;
  workshopTitle: string;
  instructor: string;
  startDate: string;
  endDate: string;
  duration: string;
  startTime: string;
  endTime: string;
  mode: string;
  location: string;
  image: string;
  priceINR: number;
  priceNPR: number;
  priceUSD: number;
  quantity: number;
  currency: string;
  addedAt: string;
  status: 'active' | 'abandoned' | 'purchased';
  paymentLinkINR?: string;
  paymentLinkNPR?: string;
  paymentLinkUSD?: string;
  whatsappGroupLink?: string;
}

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currency = searchParams.get('currency') || 'INR';
  
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('payu');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

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