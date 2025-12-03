import React, { useState, useEffect } from 'react';
import { 
  LogIn, 
  Download, 
  Filter, 
  Search,
  Clock,
  Calendar,
  Activity,
  TrendingUp,
  RefreshCw,
  Trash2
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { authAPI } from '../../utils/authData';
import { toast } from 'react-toastify';

interface SignInRecord {
  id: number;
  email: string;
  timestamp: string;
  ip: string;
  device: string;
  status: string;
}

const AdminSigninData = () => {
  const [signInRecords, setSignInRecords] = useState<SignInRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<SignInRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSignInData();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [signInRecords, filter, searchTerm]);

  const loadSignInData = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getSignInData();
      setSignInRecords(data);
    } catch (error) {
      console.error('Error loading signin data:', error);
      toast.error('Failed to load sign-in data');
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = signInRecords;

    // Apply time filter
    const now = new Date();
    if (filter === 'today') {
      filtered = filtered.filter(record => {
        const loginDate = new Date(record.timestamp);
        return loginDate.toDateString() === now.toDateString();
      });
    } else if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(record => {
        return new Date(record.timestamp) >= weekAgo;
      });
    } else if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(record => {
        return new Date(record.timestamp) >= monthAgo;
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ip.includes(searchTerm) ||
        record.device.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by timestamp (most recent first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setFilteredRecords(filtered);
  };

  const exportSigninData = () => {
    const csvContent = [
      ['Email', 'Timestamp', 'IP Address', 'Device', 'Status'].join(','),
      ...filteredRecords.map(record => [
        record.email,
        new Date(record.timestamp).toLocaleString(),
        record.ip,
        record.device,
        record.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signin_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Sign-in data exported successfully');
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const loginTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - loginTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const getLoginStats = () => {
    const now = new Date();
    const today = signInRecords.filter(record => {
      const loginDate = new Date(record.timestamp);
      return loginDate.toDateString() === now.toDateString();
    }).length;

    const thisWeek = signInRecords.filter(record => {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return new Date(record.timestamp) >= weekAgo;
    }).length;

    const thisMonth = signInRecords.filter(record => {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return new Date(record.timestamp) >= monthAgo;
    }).length;

    return { today, thisWeek, thisMonth };
  };

  const stats = getLoginStats();

  // Add Mohan Kalburgi signin record if not present
  const addMohanSignin = async () => {
    try {
      // Add Mohan's record
      await authAPI.recordSignIn({
        email: 'mohan.kalburgi@swaryoga.org',
        name: 'Mohan Kalburgi',
        success: true,
        ipAddress: '192.168.1.3',
        userAgent: navigator.userAgent
      });
      
      toast.success('Added Mohan Kalburgi signin record');
      await loadSignInData();
    } catch (error) {
      console.error('Error adding signin record:', error);
      toast.error('Failed to add signin record');
    }
  };

  // Clear all signin data
  const clearAllData = async () => {
    if (confirm('Are you sure you want to clear all signin data? This action cannot be undone.')) {
      try {
        await authAPI.clearSignInData();
        toast.success('All signin data has been cleared');
        await loadSignInData();
      } catch (error) {
        console.error('Error clearing data:', error);
        toast.error('Failed to clear data');
      }
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

  // Format time in HH:MM format
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading signin data...</p>
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Signin Data Analytics</h1>
            <p className="text-gray-600">Monitor user login activity and engagement</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportSigninData}
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
            Use these tools to manage the signin data for testing purposes:
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={addMohanSignin}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Add Mohan Kalburgi Signin
            </button>
            <button
              onClick={clearAllData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Clear All Data
            </button>
            <button
              onClick={loadSignInData}
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
              <div className="p-3 rounded-lg bg-indigo-100">
                <LogIn className="h-6 w-6 text-indigo-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-indigo-600 mb-1">{signInRecords.length}</div>
            <div className="text-gray-600 text-sm">Total Signins</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600">+{stats.today}</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.today}</div>
            <div className="text-gray-600 text-sm">Today</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-blue-600">+{stats.thisWeek}</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.thisWeek}</div>
            <div className="text-gray-600 text-sm">This Week</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-purple-600">+{stats.thisMonth}</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">{stats.thisMonth}</div>
            <div className="text-gray-600 text-sm">This Month</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <div className="flex space-x-2">
                {[
                  { id: 'all', label: 'All Time' },
                  { id: 'today', label: 'Today' },
                  { id: 'week', label: 'This Week' },
                  { id: 'month', label: 'This Month' }
                ].map(filterOption => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterOption.id
                        ? 'bg-indigo-600 text-white'
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Signin Activity Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Signin Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Ago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <LogIn className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{record.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.timestamp)} {formatTime(record.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getTimeAgo(record.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="truncate max-w-xs">{record.device}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          const updatedRecords = signInRecords.filter(r => r.id !== record.id);
                          setSignInRecords(updatedRecords);
                          localStorage.setItem('signin_data', JSON.stringify(updatedRecords));
                          toast.success('Record deleted');
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <LogIn className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No signin activity found</h3>
            <p className="text-gray-600">Try adjusting your filters or time range.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSigninData;