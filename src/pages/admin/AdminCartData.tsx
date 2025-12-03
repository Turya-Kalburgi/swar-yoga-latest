import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Download, 
  Filter, 
  Search,
  DollarSign,
  TrendingUp,
  Package,
  Users,
  RefreshCw,
  Trash2
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { cartAPI } from '../../utils/cartData';
import { toast } from 'react-toastify';

interface CartItem {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  workshopId: number;
  workshopTitle: string;
  instructor: string;
  price: number;
  currency: string;
  quantity: number;
  addedAt: string;
  status: 'active' | 'abandoned' | 'purchased';
}

const AdminCartData = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCartData();
  }, []);

  useEffect(() => {
    filterCartItems();
  }, [cartItems, filter, searchTerm]);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const data = await cartAPI.getAllItems();
      // map utility CartItem shape to admin CartItem shape expected here
      const mapped = data.map(d => ({
        id: d.id,
        userId: typeof d.userId === 'number' ? d.userId : (d.userId as any),
        userName: d.userName,
        userEmail: d.userEmail,
        workshopId: d.workshopId,
        workshopTitle: d.workshopTitle,
        instructor: d.instructor,
        // prefer INR price if available
        price: (d as any).priceINR ?? (d as any).priceUSD ?? (d as any).priceNPR ?? 0,
        currency: (d as any).currency ?? 'INR',
        quantity: d.quantity,
        addedAt: d.addedAt,
        status: d.status
      }));
      setCartItems(mapped);
    } catch (error) {
      console.error('Error loading cart data:', error);
      toast.error('Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };

  const filterCartItems = () => {
    let filtered = cartItems;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.workshopTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by added date (most recent first)
    filtered.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

    setFilteredItems(filtered);
  };

  const exportCartData = () => {
    const csvContent = [
      ['User Name', 'Email', 'Workshop', 'Instructor', 'Price', 'Currency', 'Quantity', 'Added Date', 'Status'].join(','),
      ...filteredItems.map(item => [
        item.userName,
        item.userEmail,
        item.workshopTitle,
        item.instructor,
        item.price,
        item.currency,
        item.quantity,
        new Date(item.addedAt).toLocaleString(),
        item.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cart_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Cart data exported successfully');
  };

  const getCartStats = () => {
    const totalItems = cartItems.length;
    const activeItems = cartItems.filter(item => item.status === 'active').length;
    const abandonedItems = cartItems.filter(item => item.status === 'abandoned').length;
    const purchasedItems = cartItems.filter(item => item.status === 'purchased').length;
    
    const totalValue = cartItems.reduce((sum, item) => {
      // Convert all to INR for calculation (simplified)
      const inrValue = item.currency === 'USD' ? item.price * 83 : 
                     item.currency === 'NPR' ? item.price * 0.625 : item.price;
      return sum + (inrValue * item.quantity);
    }, 0);

    const conversionRate = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;

    return { totalItems, activeItems, abandonedItems, purchasedItems, totalValue, conversionRate };
  };

  const stats = getCartStats();

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'NPR': return 'NPR ';
      default: return '₹';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'abandoned': return 'bg-yellow-100 text-yellow-800';
      case 'purchased': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearAllCartData = async () => {
    if (confirm('Are you sure you want to clear all cart data? This action cannot be undone.')) {
      try {
        await cartAPI.clearAllCartData();
        toast.success('All cart data has been cleared');
        await loadCartData();
      } catch (error) {
        console.error('Error clearing cart data:', error);
        toast.error('Failed to clear cart data');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cart data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Cart Data Analytics</h1>
            <p className="text-gray-600">Monitor shopping cart activity and conversion rates</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportCartData}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Debug Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Debug Tools</h3>
          <p className="text-sm text-blue-700 mb-3">
            Use these tools to manage the cart data for testing purposes:
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={clearAllCartData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Clear All Cart Data
            </button>
            <button
              onClick={loadCartData}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">{stats.totalItems}</div>
            <div className="text-gray-600 text-sm">Total Cart Items</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-blue-600">{stats.activeItems}</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.activeItems}</div>
            <div className="text-gray-600 text-sm">Active Carts</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600">{stats.conversionRate.toFixed(1)}%</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.purchasedItems}</div>
            <div className="text-gray-600 text-sm">Conversions</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-purple-600">₹{Math.round(stats.totalValue).toLocaleString()}</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">₹{Math.round(stats.totalValue / 1000)}K</div>
            <div className="text-gray-600 text-sm">Total Value</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <div className="flex space-x-2">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'active', label: 'Active' },
                  { id: 'abandoned', label: 'Abandoned' },
                  { id: 'purchased', label: 'Purchased' }
                ].map(filterOption => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterOption.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cart items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Cart Items Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Cart Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workshop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                          <ShoppingCart className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.userName}</div>
                          <div className="text-sm text-gray-500">{item.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.workshopTitle}</div>
                      <div className="text-sm text-gray-500">by {item.instructor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCurrencySymbol(item.currency)}{item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.addedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cart items found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCartData;