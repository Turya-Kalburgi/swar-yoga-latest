import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Users, DollarSign, TrendingUp, Eye } from 'lucide-react';
import axios from 'axios';

interface Workshop {
  _id: string;
  title: string;
  category: string;
  instructor: string;
  thumbnail: string;
  totalEnrollments: number;
  totalCompleted: number;
  averageRating: number;
  batches: any[];
}

interface AdminStats {
  totalWorkshops: number;
  totalEnrollments: number;
  totalRevenue: number;
  completionRate: number;
}

export default function AdminWorkshopPage() {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalWorkshops: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const adminStr = localStorage.getItem('adminUser');
      if (!adminStr) {
        navigate('/admin-login');
        return;
      }

      const admin = JSON.parse(adminStr);
      const adminId = admin.id || admin._id;

      // Fetch all workshops
      const workshopsRes = await axios.get('/api/workshops', {
        headers: { 'X-Admin-ID': adminId }
      });

      const workshopsData = Array.isArray(workshopsRes.data)
        ? workshopsRes.data
        : workshopsRes.data.data || [];

      setWorkshops(workshopsData);

      // Calculate stats
      const totalEnrollments = workshopsData.reduce(
        (sum, w) => sum + (w.totalEnrollments || 0),
        0
      );
      const totalCompleted = workshopsData.reduce(
        (sum, w) => sum + (w.totalCompleted || 0),
        0
      );
      const completionRate =
        totalEnrollments > 0
          ? Math.round((totalCompleted / totalEnrollments) * 100)
          : 0;

      setStats({
        totalWorkshops: workshopsData.length,
        totalEnrollments,
        totalRevenue: workshopsData.length * 5000, // Placeholder
        completionRate
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workshopId: string) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;

    try {
      const adminStr = localStorage.getItem('adminUser');
      if (!adminStr) return;

      const admin = JSON.parse(adminStr);
      const adminId = admin.id || admin._id;

      await axios.delete(`/api/workshops/${workshopId}`, {
        headers: { 'X-Admin-ID': adminId }
      });

      setWorkshops(workshops.filter((w) => w._id !== workshopId));
    } catch (error) {
      console.error('Error deleting workshop:', error);
      alert('Error deleting workshop');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Workshop Admin</h1>
            <p className="text-gray-600 mt-2">Manage all your courses and students</p>
          </div>
          <button
            onClick={() => navigate('/admin/workshop/create')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            Create Workshop
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Workshops</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalWorkshops}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-indigo-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Enrollments</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalEnrollments}</p>
              </div>
              <Users className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">
                  ₹{(stats.totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completionRate}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Workshops Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Your Workshops</h2>
          </div>

          {workshops.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No workshops created yet</p>
              <button
                onClick={() => navigate('/admin/workshop/create')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Your First Workshop
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Workshop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Enrollments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workshops.map((workshop) => (
                    <tr key={workshop._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={workshop.thumbnail}
                            alt={workshop.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {workshop.title}
                            </p>
                            <p className="text-sm text-gray-600">{workshop.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{workshop.instructor}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{workshop.totalEnrollments}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < Math.round(workshop.averageRating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="text-sm text-gray-600 ml-2">
                            {workshop.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedWorkshop(workshop);
                              setShowDetailModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/workshop/${workshop._id}/edit`)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(workshop._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedWorkshop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedWorkshop.title}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-gray-800">
                    {selectedWorkshop.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Instructor</p>
                  <p className="font-semibold text-gray-800">
                    {selectedWorkshop.instructor}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Enrollments</p>
                  <p className="font-semibold text-gray-800">
                    {selectedWorkshop.totalEnrollments}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="font-semibold text-gray-800">
                    {selectedWorkshop.totalCompleted}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigate(`/admin/workshop/${selectedWorkshop._id}/edit`);
                    setShowDetailModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
