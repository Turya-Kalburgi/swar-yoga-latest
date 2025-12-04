import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Calendar, Clock, MapPin, Gift } from 'lucide-react';
// Header and Footer are provided by App routes; removed local imports to avoid duplicate rendering
import { cartAPI } from '../utils/cartData';
import type { CartItem } from '../utils/cartData';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFirstTimeCart, setIsFirstTimeCart] = useState(false);

  useEffect(() => {
    // Check if this is the user's first time viewing the cart
    const hasViewedCart = localStorage.getItem('swaryoga_cart_viewed');
    if (!hasViewedCart) {
      setIsFirstTimeCart(true);
      localStorage.setItem('swaryoga_cart_viewed', 'true');
    }
    
    loadCartItems();
  }, [user]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        // If not logged in, show sample cart or redirect to login
        const sampleItems = await cartAPI.getAllItems();
        setCartItems(sampleItems.slice(0, 2)); // Just show 2 sample items
      } else {
        // Get user's actual cart
        const items = await cartAPI.getUserCart(user.id);
        setCartItems(items);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await cartAPI.updateItem(id, { quantity: newQuantity });
      setCartItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success('Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (id: number) => {
    try {
      await cartAPI.removeItem(id);
      setCartItems(items => items.filter(item => item.id !== id));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const changeCurrency = async (id: number, currency: string) => {
    try {
      await cartAPI.updateItem(id, { currency });
      setCartItems(items => 
        items.map(item => 
          item.id === id ? { ...item, currency } : item
        )
      );
      toast.success(`Currency changed to ${currency}`);
    } catch (error) {
      console.error('Error changing currency:', error);
      toast.error('Failed to change currency');
    }
  };

  const getPrice = (item: any) => {
    switch (item.currency) {
      case 'NPR': return item.priceNPR;
      case 'USD': return item.priceUSD;
      default: return item.priceINR;
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'NPR': return 'NPR ';
      case 'USD': return '$';
      default: return '₹';
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (getPrice(item) * item.quantity);
    }, 0);
  };

  const calculateTotalByCurrency = (currency: string) => {
    return cartItems
      .filter(item => item.currency === currency)
      .reduce((total, item) => total + (getPrice(item) * item.quantity), 0);
  };

  const groupedByCurrency = cartItems.reduce((acc, item) => {
    if (!acc[item.currency]) acc[item.currency] = [];
    acc[item.currency].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  const handleCheckout = (currency: string) => {
    if (!user) {
      toast.error('Please sign in to proceed with checkout');
      navigate('/signin?redirect=cart');
      return;
    }
    
    navigate(`/checkout?currency=${currency}`);
  };

    if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header provided by App layout */}
        <div className="container mx-auto max-w-6xl px-6 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
        {/* Footer provided by App layout */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
  {/* Header provided by App layout */}

  <div className="container mx-auto max-w-6xl px-6 py-16">
        {/* Welcome Banner for New Users */}
        {isFirstTimeCart && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <Gift className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Welcome to Your Cart! 🎉</h2>
                <p className="text-green-700 mb-4">
                  You're just a few clicks away from enrolling in amazing workshops! Browse our collection, add workshops to your cart, and proceed to checkout when ready.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                    <span>Browse workshops</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                    <span>Add to cart</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                    <span>Review cart</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                    <span>Complete checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3 mb-8">
          <ShoppingCart className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Discover our amazing workshops and start your transformation journey.</p>
            <Link 
              to="/workshops"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Workshops
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    {/* Workshop Image */}
                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image || "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400"} 
                        alt={item.workshopTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Workshop Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.workshopTitle}</h3>
                      <p className="text-gray-600 mb-3">by {item.instructor}</p>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span>{new Date(item.startDate).toLocaleDateString()} ({item.duration})</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span>{item.startTime} - {item.endTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span>{item.location} ({item.mode})</span>
                        </div>
                      </div>

                      {/* Currency Selection */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-600">Currency:</span>
                        <div className="flex space-x-1">
                          {['INR', 'NPR', 'USD'].map(currency => (
                            <button
                              key={currency}
                              onClick={() => changeCurrency(item.id, currency)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                item.currency === currency
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {currency}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600">
                          {getCurrencySymbol(item.currency)}{getPrice(item)}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                {/* Items by Currency */}
                <div className="space-y-4 mb-6">
                  {Object.entries(groupedByCurrency).map(([currency, items]) => (
                    <div key={currency} className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-gray-700 mb-2">{currency} Items</h3>
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{item.workshopTitle} × {item.quantity}</span>
                          <span>{getCurrencySymbol(currency)}{getPrice(item) * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-semibold text-gray-800 mt-2">
                        <span>Subtotal ({currency})</span>
                        <span>{getCurrencySymbol(currency)}{calculateTotalByCurrency(currency)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-3">
                  {Object.keys(groupedByCurrency).map(currency => (
                    <button
                      key={currency}
                      onClick={() => handleCheckout(currency)}
                      className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                    >
                      Checkout {currency} Items ({getCurrencySymbol(currency)}{calculateTotalByCurrency(currency)})
                    </button>
                  ))}
                </div>

                {!user && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Please <Link to="/signin?redirect=cart" className="font-medium underline">sign in</Link> to proceed with checkout.
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link 
                    to="/workshops"
                    className="block w-full text-center text-green-600 hover:text-green-700 transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

  {/* Footer provided by App layout */}
    </div>
  );
};

export default CartPage;