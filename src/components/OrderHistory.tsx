import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle, Clock8, Download } from 'lucide-react';
import { checkoutAPI } from '../utils/checkoutData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

interface OrderItem {
  workshopId: number;
  workshopTitle: string;
  quantity: number;
  price: number;
  currency: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderDate: string;
}

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const userOrders = await checkoutAPI.getUserOrders(user.id);
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'NPR': return 'NPR ';
      case 'USD': return '$';
      default: return '₹';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            <Clock8 className="h-3 w-3" />
            <span>Pending</span>
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            <AlertCircle className="h-3 w-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Format date in DD/MM/YYYY format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const downloadInvoice = (order: Order) => {
    // In a real app, this would generate a PDF invoice
    toast.info(`Downloading invoice for order #${order.id}...`);
    
    // Mock download by creating a text file
    const invoiceContent = `
      INVOICE
      -------
      Order ID: ${order.id}
      Date: ${formatDate(order.orderDate)}
      Customer: ${order.userName}
      Email: ${order.userEmail}
      
      ITEMS
      -----
      ${order.items.map((item: OrderItem) => 
        `${item.workshopTitle} x ${item.quantity}: ${getCurrencySymbol(item.currency)}${item.price * item.quantity}`
      ).join('\n')}
      
      TOTAL: ${getCurrencySymbol(order.currency)}${order.totalAmount}
      
      Payment Method: ${order.paymentMethod}
      Payment Status: ${order.paymentStatus}
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
        <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
        <h3 className="font-medium text-yellow-800 mb-1">Please Sign In</h3>
        <p className="text-sm text-yellow-700">
          You need to be signed in to view your order history.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Orders Yet</h3>
        <p className="text-gray-600 mb-4">
          You haven't placed any orders yet. Explore our workshops to get started.
        </p>
        <a 
          href="/workshops" 
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Browse Workshops
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Order History</h2>
      
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Order #</span>
                <span className="font-semibold">{order.id.substring(0, 8)}</span>
                {getStatusBadge(order.paymentStatus)}
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(order.orderDate)} • {getCurrencySymbol(order.currency)}{order.totalAmount}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedOrder(selectedOrder === order ? null : order)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
              >
                {selectedOrder === order ? 'Hide Details' : 'View Details'}
              </button>
              <button
                onClick={() => downloadInvoice(order)}
                className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm transition-colors flex items-center space-x-1"
              >
                <Download className="h-3 w-3" />
                <span>Invoice</span>
              </button>
            </div>
          </div>
          
          {selectedOrder === order && (
            <div className="p-4">
              <h4 className="font-medium text-gray-800 mb-3">Order Items</h4>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{item.workshopTitle}</div>
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity} • {getCurrencySymbol(item.currency)}{item.price} each
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800">
                      {getCurrencySymbol(item.currency)}{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="text-gray-800">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-bold text-green-600">{getCurrencySymbol(order.currency)}{order.totalAmount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;