import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Filter, Search, Star, Play, DollarSign, Globe, RefreshCw, ShoppingCart, ArrowRight, ExternalLink } from 'lucide-react';
// Header and Footer are provided by App routes; removed local imports to avoid duplicate rendering
import { workshopAPI, Workshop, debugWorkshopDatabase, forceRefreshWorkshops } from '../utils/workshopData';
import { cartAPI } from '../utils/cartData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const WorkshopPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [filters, setFilters] = useState({
    month: 'all',
    mode: 'all',
    language: 'all',
    category: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Load workshops from the workshop data system (connected to admin panel)
  const loadWorkshops = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      
      console.log('🔄 === LOADING WORKSHOPS FOR PUBLIC PAGE ===');
      
      // Debug the database state first
      debugWorkshopDatabase();
      
      // Force refresh from localStorage
      forceRefreshWorkshops();
      
      const publicWorkshops = await workshopAPI.getPublicWorkshops();
      console.log('📋 Final result - workshops to display:', publicWorkshops);
      
      setWorkshops(publicWorkshops);
      setFilteredWorkshops(publicWorkshops);
      setLastRefreshTime(new Date());
      
      console.log('🔄 === LOADING COMPLETE ===');
    } catch (error) {
      console.error('❌ Error loading workshops:', error);
      toast.error('Failed to load workshops');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('🚀 WorkshopPage component mounted, loading workshops...');
    loadWorkshops();
    
    // Set up BroadcastChannel listener if available
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('workshop_updates');
      bc.onmessage = (event) => {
        if (event.data.type === 'WORKSHOP_UPDATE') {
          console.log('Received workshop update from another tab:', event.data.timestamp);
          loadWorkshops();
          toast.info('Workshops have been updated!');
        }
      };
    } catch (error) {
      console.log('BroadcastChannel not supported, using localStorage events only');
    }
    
    // Set up storage event listener
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'workshop_sync_trigger' || event.key === 'swaryoga_workshops') {
        console.log('🔄 Storage change detected, reloading workshops...');
        loadWorkshops();
        toast.info('Workshops have been updated!');
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
    let filtered = workshops.filter(workshop => {
      const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMonth = filters.month === 'all' || 
        new Date(workshop.startDate).getMonth() === parseInt(filters.month);

      const matchesMode = filters.mode === 'all' || workshop.mode.toLowerCase() === filters.mode.toLowerCase();
      const matchesLanguage = filters.language === 'all' || workshop.language.toLowerCase() === filters.language.toLowerCase();
      const matchesCategory = filters.category === 'all' || workshop.category.toLowerCase().includes(filters.category.toLowerCase());

      return matchesSearch && matchesMonth && matchesMode && matchesLanguage && matchesCategory;
    });

    setFilteredWorkshops(filtered);
  }, [workshops, filters, searchTerm]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered by user');
    await loadWorkshops(true);
    toast.success('Workshops refreshed successfully!');
  };

  const viewWorkshopDetails = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
  };

  const openVideoModal = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setShowVideoModal(true);
  };

  const addToCart = async (workshop: Workshop) => {
    try {
      if (!user) {
        toast.error('Please sign in to add items to your cart');
        navigate('/signin?redirect=cart');
        return;
      }
      
      const cartItem = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        workshopId: workshop.id,
        workshopTitle: workshop.title,
        instructor: workshop.instructor,
        startDate: workshop.startDate,
        endDate: workshop.endDate,
        duration: workshop.duration,
        startTime: workshop.startTime,
        endTime: workshop.endTime,
        mode: workshop.mode,
        location: workshop.location,
        image: workshop.image,
        priceINR: workshop.priceINR,
        priceNPR: workshop.priceNPR,
        priceUSD: workshop.priceUSD,
        quantity: 1,
        currency: 'INR', // Default to INR
        paymentLinkINR: workshop.paymentLinkINR,
        paymentLinkNPR: workshop.paymentLinkNPR,
        paymentLinkUSD: workshop.paymentLinkUSD
      };
      
      await cartAPI.addToCart(cartItem);
      toast.success(`${workshop.title} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const months = [
    { value: 'all', label: 'All Months' },
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' }
  ];

  const modes = [
    { value: 'all', label: 'All Modes' },
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'retreat', label: 'Retreat' }
  ];

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'english', label: 'English' },
    { value: 'marathi', label: 'Marathi' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'basic swar yoga master class', label: 'Basic Swar Yoga Master Class' },
    { value: 'swar yoga master class', label: 'Swar Yoga Master Class' },
    { value: '90 days weight loss', label: '90 Days Weight Loss' },
    { value: '90 days meditation program', label: '90 Days Meditation Program' },
    { value: '90 days amrut aahar', label: '90 Days Amrut Aahar' },
    { value: '12 days garbh sanskrar', label: '12 Days Garbh Sanskrar' },
    { value: '12 days pranayama workshop', label: '12 Days Pranayama Workshop' },
    { value: '15 days bandhan mukti workshop', label: '15 Days Bandhan Mukti Workshop' },
    { value: '12 days children swar yoga', label: '12 Days Children Swar Yoga' },
    { value: '4 days swar yoga retreat', label: '4 Days Swar Yoga Retreat' },
    { value: '5 days swar yoga master class', label: '5 Days Swar Yoga Master Class(Residential)' },
    { value: 'gurukul teacher program', label: 'Gurukul Teacher Program(Residential)' },
    { value: 'swar yoga teachers training', label: 'Swar Yoga Teachers Training(Residential)' },
    { value: 'swar yoga trekking camp', label: 'Swar Yoga Trekking Camp' }
  ];

  // Function to format date in dd/mm/yyyy format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
  {/* Header provided by App layout */}
        <div className="container mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workshops...</p>
        </div>
  {/* Footer provided by App layout */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header provided by App layout */}

      {/* Hero Section with Background Image */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.postimg.cc/YqHFfcqn/temp-Imageqklun-M.avif"
            alt="Yoga Workshop"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Yoga+Workshop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6">
            Transform Your Life with Our <span className="text-green-400">Workshops</span>
          </h1>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Join expert-led workshops designed to enhance your physical, mental, and spiritual well-being.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => document.getElementById('workshops-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center group hover:translate-y-[-2px] hover:shadow-lg"
            >
              <span className="text-lg">Start Your Journey</span>
              <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              className="px-8 py-4 border-2 border-white text-white hover:bg-white/10 rounded-lg transition-all duration-300 text-center text-lg hover:translate-y-[-2px]"
            >
              View Categories
            </button>
          </div>
        </div>
      </section>

      <div id="workshops-section" className="container mx-auto max-w-7xl px-6 py-16">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Filter className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Filter Workshops</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${workshops.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {workshops.length > 0 ? `${workshops.length} Live` : 'No Data'}
                </span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>

            {/* Mode Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
              <select
                value={filters.mode}
                onChange={(e) => handleFilterChange('mode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {modes.map(mode => (
                  <option key={mode.value} value={mode.value}>{mode.label}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {languages.map(language => (
                  <option key={language.value} value={language.value}>{language.label}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search workshops..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredWorkshops.length} of {workshops.length} workshops</span>
            <span>Last refreshed: {lastRefreshTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Workshops Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkshops.map(workshop => (
            <div key={workshop.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Workshop Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={workshop.image || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                  alt={workshop.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Workshop+Image';
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    workshop.mode === 'Online' ? 'bg-blue-100 text-blue-800' :
                    workshop.mode === 'Offline' ? 'bg-green-100 text-green-800' :
                    workshop.mode === 'Hybrid' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {workshop.mode}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium">{workshop.rating}</span>
                  </div>
                </div>
                {workshop.youtubeId && (
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openVideoModal(workshop);
                      }}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      aria-label="Play video"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Workshop Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{workshop.title}</h3>
                  <p className="text-gray-600 text-sm">by {workshop.instructor}</p>
                </div>

                {/* Workshop Details */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span>{formatDate(workshop.startDate)} - {formatDate(workshop.endDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span>{workshop.startTime} - {workshop.endTime} ({workshop.duration})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>{workshop.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span>{workshop.enrolledCount}/{workshop.maxParticipants} enrolled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span>{workshop.language} • {workshop.level}</span>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {workshop.category}
                  </span>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold">₹{workshop.priceINR}</span>
                    </div>
                    <div className="text-gray-500">
                      NPR {workshop.priceNPR} • ${workshop.priceUSD}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(workshop)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button 
                    onClick={() => viewWorkshopDetails(workshop)}
                    className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredWorkshops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {workshops.length === 0 ? 'No workshops available yet' : 'No workshops found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {workshops.length === 0 
                ? 'Workshops added through the admin panel will appear here automatically.' 
                : 'Try adjusting your filters or search terms.'
              }
            </p>
            <div className="space-y-3">
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleRefresh}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Refresh Workshops
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workshop Details Modal */}
        {selectedWorkshop && !showVideoModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{selectedWorkshop.title}</h2>
                <button
                  onClick={() => setSelectedWorkshop(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <img 
                      src={selectedWorkshop.image || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                      alt={selectedWorkshop.title}
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Workshop+Image';
                      }}
                    />
                    {selectedWorkshop.youtubeId && (
                      <button
                        onClick={() => setShowVideoModal(true)}
                        className="mt-4 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Play className="h-5 w-5" />
                        <span>Watch Video Preview</span>
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Workshop Details</h3>
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <span>{formatDate(selectedWorkshop.startDate)} - {formatDate(selectedWorkshop.endDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        <span>{selectedWorkshop.startTime} - {selectedWorkshop.endTime} ({selectedWorkshop.duration})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <span>{selectedWorkshop.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <span>{selectedWorkshop.enrolledCount}/{selectedWorkshop.maxParticipants} enrolled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-green-600" />
                        <span>{selectedWorkshop.language} • {selectedWorkshop.level}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div>
                          <span className="font-semibold">₹{selectedWorkshop.priceINR}</span>
                          <span className="text-gray-500 ml-2">NPR {selectedWorkshop.priceNPR} • ${selectedWorkshop.priceUSD}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">About the Workshop</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Prerequisites</h4>
                      <p className="text-gray-600 text-sm">{selectedWorkshop.prerequisites || 'No prerequisites required.'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">What's Included</h4>
                      <p className="text-gray-600 text-sm">{selectedWorkshop.includedItems || 'Details not provided.'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Learning Outcomes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">{selectedWorkshop.learningOutcomes || 'Learning outcomes not specified.'}</p>
                  </div>
                </div>
                
                {selectedWorkshop.remarks && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">{selectedWorkshop.remarks}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedWorkshop(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      addToCart(selectedWorkshop);
                      setSelectedWorkshop(null);
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* YouTube Video Modal */}
        {showVideoModal && selectedWorkshop && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 flex justify-between items-center bg-black/50">
                <h3 className="text-xl font-bold text-white">{selectedWorkshop.title} - Video Preview</h3>
                <button
                  onClick={() => {
                    setShowVideoModal(false);
                  }}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close video"
                >
                  ✕
                </button>
              </div>
              
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${selectedWorkshop.youtubeId}`}
                  title={`${selectedWorkshop.title} Video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="p-6 bg-black">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{selectedWorkshop.title}</h4>
                    <p className="text-gray-400">by {selectedWorkshop.instructor}</p>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(selectedWorkshop);
                      setShowVideoModal(false);
                      setSelectedWorkshop(null);
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
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

export default WorkshopPage;