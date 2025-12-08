import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  Filter,
  Search,
  Download,
  X,
  Play,
  Globe,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { 
  getAllWorkshops, 
  createWorkshop, 
  updateWorkshop, 
  deleteWorkshop, 
  toggleWorkshopVisibility,
  type WorkshopBatch as Workshop
} from '../../utils/workshopAPI';
import { toast } from 'react-toastify';

const AdminWorkshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');

  // Form state for adding/editing workshops
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    startDate: '',
    endDate: '',
    duration: '',
    startTime: '09:00',
    endTime: '17:00',
    priceINR: 0,
    priceNPR: 0,
    priceUSD: 0,
    maxParticipants: 50,
    category: '',
    mode: 'Online',
    language: 'Hindi',
    level: 'Beginner',
    location: '',
    image: '',
    youtubeId: '',
    paymentLinkINR: '',
    paymentLinkNPR: '',
    paymentLinkUSD: '',
    whatsappGroupLink: '',
    prerequisites: '',
    learningOutcomes: '',
    includedItems: '',
    remarks: '',
    isPublic: false
  });

  useEffect(() => {
    loadWorkshops();
    
    // Set up BroadcastChannel listener if available
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('workshop_updates');
      bc.onmessage = (event) => {
        if (event.data.type === 'WORKSHOP_UPDATE') {
          console.log('Received workshop update from another tab:', event.data.timestamp);
          loadWorkshops();
        }
      };
    } catch (error) {
      console.log('BroadcastChannel not supported, using localStorage events only');
    }
    
    // Set up storage event listener
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'workshop_sync_trigger' || event.key === 'swaryoga_workshops') {
        console.log('Storage change detected, reloading workshops...');
        loadWorkshops();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (bc) bc.close();
    };
  }, []);

  useEffect(() => {
    filterWorkshops();
  }, [workshops, filter, searchTerm]);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      
      console.log('📋 Loading workshops from API...');
      
      const data = await getAllWorkshops();
      console.log('✅ Loaded workshops from API:', data);
      setWorkshops(data);
    } catch (error) {
      console.error('❌ Error loading workshops:', error);
      toast.error('Failed to load workshops');
    } finally {
      setLoading(false);
    }
  };

  const filterWorkshops = () => {
    let filtered = workshops.filter(workshop => {
      const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filter === 'all' || 
        (filter === 'public' && workshop.isPublic) ||
        (filter === 'draft' && !workshop.isPublic);

      return matchesSearch && matchesStatus;
    });

    setFilteredWorkshops(filtered);
  };

  // Auto-calculate prices when INR price changes
  const handleINRPriceChange = (inrPrice: number) => {
    const calculatedNPR = calculateNPRPrice(inrPrice);
    const calculatedUSD = calculateUSDPriceWithCharges(inrPrice);
    
    setFormData(prev => ({
      ...prev,
      priceINR: inrPrice,
      priceNPR: calculatedNPR,
      priceUSD: calculatedUSD
    }));
  };

  // Helper functions for price calculations
  const calculateNPRPrice = (inrPrice: number): number => {
    // 1 INR = 1.6 NPR (approximate exchange rate)
    return Math.round(inrPrice * 1.6);
  };

  const calculateUSDPriceWithCharges = (inrPrice: number): number => {
    // Calculate base USD price and add 3% charges
    const baseUSDPrice = inrPrice * 0.012;
    const priceWithCharges = baseUSDPrice * 1.03; // Add 3% charges
    return Math.round(priceWithCharges);
  };

  // Function to format date in dd/mm/yyyy format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('📤 Submitting workshop form:', formData);
      
      if (editingWorkshop) {
        console.log('✏️ Updating existing workshop:', editingWorkshop.id);
        await updateWorkshop(editingWorkshop.id, formData);
        toast.success('Workshop updated successfully!');
      } else {
        console.log('➕ Creating new workshop');
        const newWorkshop = await createWorkshop(formData);
        console.log('✅ Created workshop:', newWorkshop);
        toast.success('Workshop created successfully!');
      }
      
      await loadWorkshops();
      resetForm();
      setShowAddModal(false);
      setEditingWorkshop(null);
      
      // Broadcast to other tabs/windows
      try {
        const bc = new BroadcastChannel('workshop_updates');
        bc.postMessage({ 
          type: 'WORKSHOP_UPDATE', 
          action: editingWorkshop ? 'update' : 'create',
          timestamp: Date.now() 
        });
        bc.close();
        console.log('📡 Broadcast sent to other tabs');
      } catch (error) {
        console.log('BroadcastChannel not available');
      }
      
      // Also update localStorage for fallback
      localStorage.setItem('workshop_sync_trigger', Date.now().toString());
      
      // Show success message
      setSyncStatus('success');
      setSyncMessage(editingWorkshop ? 'Workshop updated successfully!' : 'Workshop created successfully!');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 3000);
    } catch (error) {
      console.error('❌ Error saving workshop:', error);
      toast.error('Error saving workshop. Please try again.');
      
      setSyncStatus('error');
      setSyncMessage('Failed to save workshop. Please try again.');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      instructor: '',
      startDate: '',
      endDate: '',
      duration: '',
      startTime: '09:00',
      endTime: '17:00',
      priceINR: 0,
      priceNPR: 0,
      priceUSD: 0,
      maxParticipants: 50,
      category: '',
      mode: 'Online',
      language: 'Hindi',
      level: 'Beginner',
      location: '',
      image: '',
      youtubeId: '',
      paymentLinkINR: '',
      paymentLinkNPR: '',
      paymentLinkUSD: '',
      whatsappGroupLink: '',
      prerequisites: '',
      learningOutcomes: '',
      includedItems: '',
      remarks: '',
      isPublic: false
    });
  };

  const handleEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      title: workshop.title,
      instructor: workshop.instructor,
      startDate: workshop.startDate,
      endDate: workshop.endDate,
      duration: workshop.duration,
      startTime: workshop.startTime,
      endTime: workshop.endTime,
      priceINR: workshop.priceINR,
      priceNPR: workshop.priceNPR,
      priceUSD: workshop.priceUSD,
      maxParticipants: workshop.maxParticipants,
      category: workshop.category,
      mode: workshop.mode,
      language: workshop.language,
      level: workshop.level,
      location: workshop.location,
      image: workshop.image,
      youtubeId: workshop.youtubeId || '',
      paymentLinkINR: workshop.paymentLinkINR,
      paymentLinkNPR: workshop.paymentLinkNPR,
      paymentLinkUSD: workshop.paymentLinkUSD,
      whatsappGroupLink: workshop.whatsappGroupLink || '',
      prerequisites: workshop.prerequisites,
      learningOutcomes: workshop.learningOutcomes,
      includedItems: workshop.includedItems,
      remarks: workshop.remarks || '',
      isPublic: workshop.isPublic
    });
    setShowAddModal(true);
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      console.log('👁️ Toggling visibility for workshop:', id);
      await toggleWorkshopVisibility(id);
      await loadWorkshops();
      
      // Broadcast update to other tabs
      try {
        const bc = new BroadcastChannel('workshop_updates');
        bc.postMessage({ 
          type: 'WORKSHOP_UPDATE', 
          action: 'visibility',
          timestamp: Date.now() 
        });
        bc.close();
      } catch (error) {
        console.log('BroadcastChannel not available');
      }
      
      localStorage.setItem('workshop_sync_trigger', Date.now().toString());
      toast.success('Workshop visibility updated successfully!');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update workshop visibility');
    }
  };

  const handleDeleteWorkshop = async (id: string) => {
    if (confirm('Are you sure you want to delete this workshop?')) {
      try {
        console.log('🗑️ Deleting workshop:', id);
        await deleteWorkshop(id);
        await loadWorkshops();
        
        // Broadcast update to other tabs
        try {
          const bc = new BroadcastChannel('workshop_updates');
          bc.postMessage({ 
            type: 'WORKSHOP_UPDATE', 
            action: 'delete',
            timestamp: Date.now() 
          });
          bc.close();
        } catch (error) {
          console.log('BroadcastChannel not available');
        }
        
        localStorage.setItem('workshop_sync_trigger', Date.now().toString());
        toast.success('Workshop deleted successfully!');
      } catch (error) {
        console.error('Error deleting workshop:', error);
        toast.error('Failed to delete workshop');
      }
    }
  };

  const handleManualSync = async () => {
    try {
      setSyncStatus('syncing');
      await loadWorkshops();
      setSyncStatus('success');
      setSyncMessage('Workshops synced successfully!');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error syncing workshops:', error);
      setSyncStatus('error');
      setSyncMessage('Failed to sync workshops. Please try again.');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSyncStatus('idle');
        setSyncMessage('');
      }, 3000);
    }
  };

  const exportWorkshops = () => {
    const csvContent = [
      ['Title', 'Instructor', 'Start Date', 'End Date', 'Price (INR)', 'Status', 'Enrollments'].join(','),
      ...filteredWorkshops.map(w => [
        w.title,
        w.instructor,
        formatDate(w.startDate),
        formatDate(w.endDate),
        w.priceINR,
        w.isPublic ? 'Public' : 'Draft',
        w.enrolledCount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workshops_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Workshops exported successfully!');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading workshops...</p>
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Workshop Management</h1>
            <p className="text-gray-600">Create, edit, and manage all workshops</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleManualSync}
              className={`flex items-center space-x-2 ${
                syncStatus === 'idle' ? 'bg-blue-600 text-white' :
                syncStatus === 'syncing' ? 'bg-yellow-600 text-white' :
                syncStatus === 'success' ? 'bg-green-600 text-white' :
                'bg-red-600 text-white'
              } px-4 py-2 rounded-lg transition-colors`}
              disabled={syncStatus === 'syncing'}
            >
              <Globe className={`h-4 w-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>
                {syncStatus === 'idle' ? 'Sync Workshops' :
                 syncStatus === 'syncing' ? 'Syncing...' :
                 syncStatus === 'success' ? 'Sync Successful' :
                 'Sync Failed'}
              </span>
            </button>
            <button
              onClick={exportWorkshops}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => {
                resetForm();
                setEditingWorkshop(null);
                setShowAddModal(true);
              }}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span>Add Workshop</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">{workshops.length}</div>
            <div className="text-gray-600 text-sm">Total Workshops</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {workshops.filter(w => w.isPublic).length}
            </div>
            <div className="text-gray-600 text-sm">Public Workshops</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {workshops.filter(w => !w.isPublic).length}
            </div>
            <div className="text-gray-600 text-sm">Draft Workshops</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {workshops.reduce((sum, w) => sum + w.enrolledCount, 0)}
            </div>
            <div className="text-gray-600 text-sm">Total Enrollments</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <div className="flex space-x-2">
                {[
                  { id: 'all', label: 'All Workshops' },
                  { id: 'public', label: 'Public' },
                  { id: 'draft', label: 'Draft' }
                ].map(filterOption => (
                  <button
                    key={filterOption.id}
                    onClick={() => setFilter(filterOption.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterOption.id
                        ? 'bg-green-600 text-white'
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
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Sync Status Alert */}
        {syncStatus === 'success' && syncMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">{syncMessage}</h3>
              <p className="text-sm text-green-700">
                All workshops have been synced across all devices and browsers.
              </p>
            </div>
          </div>
        )}

        {syncStatus === 'error' && syncMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-red-800">{syncMessage}</h3>
              <p className="text-sm text-red-700">
                There was an error syncing workshops. Please try again.
              </p>
            </div>
          </div>
        )}

        {/* Workshops Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workshop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollments
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
                {filteredWorkshops.map((workshop) => (
                  <tr key={workshop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={workshop.image || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                          alt={workshop.title}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2210%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22 font-family=%22Arial%22%3EWS%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{workshop.title}</div>
                          <div className="text-sm text-gray-500">{workshop.category}</div>
                          {workshop.youtubeId && (
                            <div className="text-xs text-red-600 flex items-center mt-1">
                              <Play className="h-3 w-3 mr-1" />
                              <span>Has video</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workshop.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{formatDate(workshop.startDate)}</div>
                      <div className="text-gray-500">{workshop.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>₹{workshop.priceINR}</div>
                      <div className="text-xs text-gray-500">
                        NPR {workshop.priceNPR} • ${workshop.priceUSD}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {workshop.enrolledCount}/{workshop.maxParticipants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        workshop.isPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {workshop.isPublic ? 'Public' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleVisibility(workshop.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title={workshop.isPublic ? 'Make Draft' : 'Make Public'}
                        >
                          {workshop.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(workshop)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWorkshop(workshop.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredWorkshops.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workshops found</h3>
            <p className="text-gray-600">Create your first workshop to get started.</p>
          </div>
        )}

        {/* Add/Edit Workshop Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingWorkshop ? 'Edit Workshop' : 'Add New Workshop'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingWorkshop(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workshop Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter workshop title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructor *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.instructor}
                      onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Instructor name"
                    />
                  </div>
                </div>

                {/* Dates and Duration */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 3 Days, 1 Week"
                    />
                  </div>
                </div>

                {/* Time and Pricing with Auto-calculation */}
                <div className="grid md:grid-cols-5 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (INR) * 🔄
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.priceINR}
                      onChange={(e) => handleINRPriceChange(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50"
                      placeholder="0"
                    />
                    <div className="text-xs text-green-600 mt-1">Auto-calculates others</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (NPR) 🇳🇵
                    </label>
                    <input
                      type="number"
                      value={formData.priceNPR}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceNPR: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                      placeholder="Auto-calculated"
                    />
                    <div className="text-xs text-gray-500 mt-1">1.6x INR rate</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (USD) 🇺🇸
                    </label>
                    <input
                      type="number"
                      value={formData.priceUSD}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceUSD: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                      placeholder="Auto-calculated"
                    />
                    <div className="text-xs text-gray-500 mt-1">0.012x + 3% charges</div>
                  </div>
                </div>

                {/* Workshop Details */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="Basic Swar Yoga Master Class">Basic Swar Yoga Master Class</option>
                      <option value="Swar Yoga Master Class">Swar Yoga Master Class</option>
                      <option value="90 Days Weight Loss">90 Days Weight Loss</option>
                      <option value="90 Days Meditation Program">90 Days Meditation Program</option>
                      <option value="90 Days Amrut Aahar">90 Days Amrut Aahar</option>
                      <option value="12 Days Garbh Sanskrar">12 Days Garbh Sanskrar</option>
                      <option value="12 Days Pranayama Workshop">12 Days Pranayama Workshop</option>
                      <option value="15 Days Bandhan Mukti Workshop">15 Days Bandhan Mukti Workshop</option>
                      <option value="12 Days Children Swar Yoga">12 Days Children Swar Yoga</option>
                      <option value="4 Days Swar Yoga Retreat">4 Days Swar Yoga Retreat</option>
                      <option value="5 Days Swar Yoga Master Class(Residential)">5 Days Swar Yoga Master Class(Residential)</option>
                      <option value="Gurukul Teacher Program(Residential)">Gurukul Teacher Program(Residential)</option>
                      <option value="Swar Yoga Teachers Training(Residential)">Swar Yoga Teachers Training(Residential)</option>
                      <option value="Swar Yoga Trekking Camp">Swar Yoga Trekking Camp</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode *
                    </label>
                    <select
                      required
                      value={formData.mode}
                      onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Retreat">Retreat</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language *
                    </label>
                    <select
                      required
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                      <option value="Marathi">Marathi</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level *
                    </label>
                    <select
                      required
                      value={formData.level}
                      onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                </div>

                {/* Location and Media */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Zoom, Delhi, Rishikesh"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 50 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image && (
                      <div className="mt-2 h-20 w-20 rounded overflow-hidden">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2212%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22 font-family=%22Arial%22%3EInvalid%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube Video ID
                    </label>
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        value={formData.youtubeId}
                        onChange={(e) => setFormData(prev => ({ ...prev, youtubeId: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., dQw4w9WgXcQ"
                      />
                      <div className="text-xs text-gray-500">
                        Enter only the ID part from YouTube URL (e.g., for https://www.youtube.com/watch?v=dQw4w9WgXcQ, enter dQw4w9WgXcQ)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Links */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Link (INR) 🇮🇳
                    </label>
                    <input
                      type="url"
                      value={formData.paymentLinkINR}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentLinkINR: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://payu.in/payment-link"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Direct payment URL for Indian customers
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Link (NPR) 🇳🇵
                    </label>
                    <input
                      type="url"
                      value={formData.paymentLinkNPR}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentLinkNPR: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://esewa.com.np/payment-link"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      QR code payment URL for Nepali customers
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Link (USD) 🇺🇸
                    </label>
                    <input
                      type="url"
                      value={formData.paymentLinkUSD}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentLinkUSD: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://paypal.me/payment-link"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      PayPal payment URL for international customers
                    </div>
                  </div>
                </div>

                {/* WhatsApp Group Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Group Link 💬
                  </label>
                  <input
                    type="url"
                    value={formData.whatsappGroupLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsappGroupLink: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://chat.whatsapp.com/..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    WhatsApp group link that will be shared with customers on the thank you page after they purchase this workshop
                  </div>
                </div>

                {/* Text Areas */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prerequisites
                    </label>
                    <textarea
                      value={formData.prerequisites}
                      onChange={(e) => setFormData(prev => ({ ...prev, prerequisites: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="What participants need to know or have..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Learning Outcomes
                    </label>
                    <textarea
                      value={formData.learningOutcomes}
                      onChange={(e) => setFormData(prev => ({ ...prev, learningOutcomes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="What participants will learn or achieve..."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What's Included
                    </label>
                    <textarea
                      value={formData.includedItems}
                      onChange={(e) => setFormData(prev => ({ ...prev, includedItems: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Materials, recordings, certificates, etc..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks (optional)
                    </label>
                    <textarea
                      value={formData.remarks}
                      onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Additional notes or special instructions..."
                    />
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                    ✅ Make this workshop public (visible on website)
                  </label>
                  <div className="text-xs text-green-600 ml-auto">
                    {formData.isPublic ? '🌐 Will appear on website' : '📝 Draft only'}
                  </div>
                </div>

                {/* YouTube Video Preview */}
                {formData.youtubeId && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">📺 YouTube Video Preview</h4>
                    <div className="aspect-video w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube-nocookie.com/embed/${formData.youtubeId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <p className="text-xs text-red-600 mt-2 text-center">
                      This video will be available on the workshop page for potential students to watch
                    </p>
                  </div>
                )}

                {/* Price Summary */}
                {formData.priceINR > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">💰 Price Summary</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">🇮🇳 India:</span>
                        <div className="font-bold text-blue-800">₹{formData.priceINR}</div>
                      </div>
                      <div>
                        <span className="text-blue-700">🇳🇵 Nepal:</span>
                        <div className="font-bold text-blue-800">NPR {formData.priceNPR}</div>
                        <div className="text-xs text-blue-600">(1.6x rate)</div>
                      </div>
                      <div>
                        <span className="text-blue-700">🇺🇸 USA:</span>
                        <div className="font-bold text-blue-800">${formData.priceUSD}</div>
                        <div className="text-xs text-blue-600">(0.012x + 3% charges)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingWorkshop(null);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
                  >
                    {editingWorkshop ? 'Update Workshop' : 'Create Workshop'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// Simple check icon component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Simple X icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default AdminWorkshops;