import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Calendar, Clock, DollarSign, Users, MapPin, Globe, Loader } from 'lucide-react';
import { toast } from 'react-toastify';

interface WorkshopFormData {
  id?: string;
  title: string;
  instructor: string;
  startDate: string;
  endDate: string;
  duration: string;
  startTime: string;
  endTime: string;
  category: string;
  mode: string;
  language: string;
  level: string;
  location: string;
  maxParticipants: number;
  priceINR: number;
  priceNPR: number;
  priceUSD: number;
  paymentLinkINR: string;
  paymentLinkNPR: string;
  paymentLinkUSD: string;
  image?: string;
  youtubeId?: string;
  description?: string;
  whatsappGroupLink?: string;
  prerequisites?: string;
  learningOutcomes?: string;
  includedItems?: string;
  remarks?: string;
}

const WorkshopAdminForm: React.FC = () => {
  const [workshops, setWorkshops] = useState<WorkshopFormData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<WorkshopFormData>({
    title: '',
    instructor: '',
    startDate: '',
    endDate: '',
    duration: '',
    startTime: '09:00',
    endTime: '17:00',
    category: 'swar yoga basic workshop',
    mode: 'Online',
    language: 'Hindi',
    level: 'Beginner',
    location: 'Online',
    maxParticipants: 50,
    priceINR: 0,
    priceNPR: 0,
    priceUSD: 0,
    paymentLinkINR: '',
    paymentLinkNPR: '',
    paymentLinkUSD: '',
    image: '',
    youtubeId: '',
    description: '',
    whatsappGroupLink: '',
    prerequisites: '',
    learningOutcomes: '',
    includedItems: '',
    remarks: ''
  });

  const categories = [
    'swar yoga basic workshop',
    'swar yoga level-1',
    'swar yoga level-2',
    'swar yoga level-3',
    'swar yoga level-4',
    '90 days weight loss program',
    '90 days amrut aahar program',
    '30 days meditation program',
    'pre planning garbh sanskar',
    'global youth program',
    'children swar yoga program',
    'business growth and swar yoga program',
    'trekking camp',
    '7 days naturopathy program'
  ];

  const modes = ['Online', 'Offline', 'Residential', 'Resort'];
  const languages = ['Hindi', 'English', 'Marathi', 'Mixed'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  useEffect(() => {
    loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      const storageKey = 'admin_workshops_list';
      const stored = localStorage.getItem(storageKey);
      const data = stored ? JSON.parse(stored) : [];
      setWorkshops(data);
      console.log('✅ Workshops loaded:', data.length);
    } catch (error) {
      console.error('❌ Error loading workshops:', error);
      toast.error('Failed to load workshops');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.instructor.trim()) newErrors.instructor = 'Instructor is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.maxParticipants < 1) newErrors.maxParticipants = 'Max participants must be at least 1';
    if (formData.priceINR < 0) newErrors.priceINR = 'Price must be positive';
    if (formData.priceNPR < 0) newErrors.priceNPR = 'Price must be positive';
    if (formData.priceUSD < 0) newErrors.priceUSD = 'Price must be positive';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    try {
      const storageKey = 'admin_workshops_list';
      const existingWorkshops = JSON.parse(localStorage.getItem(storageKey) || '[]');

      if (editingId) {
        const index = existingWorkshops.findIndex((w: WorkshopFormData) => w.id === editingId);
        if (index !== -1) {
          existingWorkshops[index] = { ...formData, id: editingId };
        }
        console.log('✅ Workshop updated:', formData.title);
      } else {
        const newWorkshop = {
          ...formData,
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        existingWorkshops.push(newWorkshop);
        console.log('✅ Workshop created:', formData.title);
      }

      localStorage.setItem(storageKey, JSON.stringify(existingWorkshops));
      await loadWorkshops();

      toast.success(editingId ? 'Workshop updated!' : 'Workshop created!');
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error saving workshop:', error);
      toast.error('Failed to save workshop');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this workshop?')) return;

    try {
      const storageKey = 'admin_workshops_list';
      const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = data.filter((w: WorkshopFormData) => w.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));

      console.log('✅ Workshop deleted');
      await loadWorkshops();
      toast.success('Workshop deleted!');
    } catch (error) {
      console.error('❌ Error deleting workshop:', error);
      toast.error('Failed to delete workshop');
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
      category: 'swar yoga basic workshop',
      mode: 'Online',
      language: 'Hindi',
      level: 'Beginner',
      location: 'Online',
      maxParticipants: 50,
      priceINR: 0,
      priceNPR: 0,
      priceUSD: 0,
      paymentLinkINR: '',
      paymentLinkNPR: '',
      paymentLinkUSD: '',
      image: '',
      youtubeId: '',
      description: '',
      whatsappGroupLink: '',
      prerequisites: '',
      learningOutcomes: '',
      includedItems: '',
      remarks: ''
    });
    setErrors({});
    setEditingId(null);
  };

  const handleEdit = (workshop: WorkshopFormData) => {
    setFormData(workshop);
    setEditingId(workshop.id || null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Workshop Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Workshop
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">Total Workshops</p>
          <p className="text-3xl font-bold text-green-900">{workshops.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">Categories</p>
          <p className="text-3xl font-bold text-blue-900">{categories.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-700">Total Modes</p>
          <p className="text-3xl font-bold text-purple-900">{modes.length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-700">Total Languages</p>
          <p className="text-3xl font-bold text-orange-900">{languages.length}</p>
        </div>
      </div>

      {/* Workshops List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Workshops List</h2>
          <p className="text-sm text-gray-600 mt-1">Total: {workshops.length} workshops</p>
        </div>

        <div className="overflow-x-auto">
          {workshops.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No workshops added yet. Create your first workshop!</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price (INR)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {workshops.map(workshop => (
                  <tr key={workshop.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{workshop.title}</p>
                        <p className="text-sm text-gray-600">by {workshop.instructor}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {workshop.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(workshop.startDate).toLocaleDateString()} - {new Date(workshop.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      ₹{workshop.priceINR}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {workshop.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(workshop)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(workshop.id || '')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Workshop Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? 'Edit Workshop' : 'Add New Workshop'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Basic Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Workshop Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="E.g., Swar Yoga Basic Workshop"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor Name *
                    </label>
                    <input
                      type="text"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      placeholder="E.g., Yogacharya Mohan Kalburgi"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        errors.instructor ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.instructor && <p className="text-red-600 text-sm mt-1">{errors.instructor}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mode *
                    </label>
                    <select
                      value={formData.mode}
                      onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      {modes.map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language *
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates and Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Dates & Time
                </h3>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        errors.startDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="E.g., 5 days, 2 weeks"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        errors.duration ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.duration && <p className="text-red-600 text-sm mt-1">{errors.duration}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="E.g., Online, Mumbai"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.maxParticipants && <p className="text-red-600 text-sm mt-1">{errors.maxParticipants}</p>}
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4 bg-gradient-to-r from-green-50 to-transparent p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Pricing & Payment Links
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (INR) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.priceINR}
                      onChange={(e) => setFormData({ ...formData, priceINR: parseFloat(e.target.value) })}
                      placeholder="E.g., 5000"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        errors.priceINR ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.priceINR && <p className="text-red-600 text-sm mt-1">{errors.priceINR}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (Nepali) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.priceNPR}
                      onChange={(e) => setFormData({ ...formData, priceNPR: parseFloat(e.target.value) })}
                      placeholder="E.g., 7000"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        errors.priceNPR ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.priceNPR && <p className="text-red-600 text-sm mt-1">{errors.priceNPR}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.priceUSD}
                      onChange={(e) => setFormData({ ...formData, priceUSD: parseFloat(e.target.value) })}
                      placeholder="E.g., 70"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                        errors.priceUSD ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.priceUSD && <p className="text-red-600 text-sm mt-1">{errors.priceUSD}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Link (INR)
                    </label>
                    <input
                      type="url"
                      value={formData.paymentLinkINR}
                      onChange={(e) => setFormData({ ...formData, paymentLinkINR: e.target.value })}
                      placeholder="https://payment-link-inr.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Link (Nepali)
                    </label>
                    <input
                      type="url"
                      value={formData.paymentLinkNPR}
                      onChange={(e) => setFormData({ ...formData, paymentLinkNPR: e.target.value })}
                      placeholder="https://payment-link-npr.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Link (USD)
                    </label>
                    <input
                      type="url"
                      value={formData.paymentLinkUSD}
                      onChange={(e) => setFormData({ ...formData, paymentLinkUSD: e.target.value })}
                      placeholder="https://payment-link-usd.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  Media
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      YouTube Video ID
                    </label>
                    <input
                      type="text"
                      value={formData.youtubeId}
                      onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                      placeholder="E.g., dQw4w9WgXcQ"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Workshop description..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prerequisites
                  </label>
                  <textarea
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                    placeholder="Any prerequisites..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learning Outcomes
                  </label>
                  <textarea
                    value={formData.learningOutcomes}
                    onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
                    placeholder="What will participants learn..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Included Items
                  </label>
                  <textarea
                    value={formData.includedItems}
                    onChange={(e) => setFormData({ ...formData, includedItems: e.target.value })}
                    placeholder="What's included in the workshop..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Group Link
                  </label>
                  <input
                    type="url"
                    value={formData.whatsappGroupLink}
                    onChange={(e) => setFormData({ ...formData, whatsappGroupLink: e.target.value })}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Any additional remarks..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? 'Update Workshop' : 'Create Workshop'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopAdminForm;
