import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, Sun, Moon, Info, Loader, Download, CalendarDays } from 'lucide-react';
import * as SunCalc from 'suncalc';
import { fetchHinduCalendarData, calculateLocalHinduCalendar } from '../utils/hinduCalendarAPI';
import { countries, capitalsByCountry } from '../data/countriesData';

interface CalendarData {
  date: string;
  day: string;
  paksha: 'Shukla Paksha' | 'Krishna Paksha';
  tithi: number;
  tithiName: string;
  sunriseTime: string;
  nadi: {
    type: 'Sun' | 'Moon';
    symbol: string;
    name: string;
  };
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface MonthlyCalendarData {
  date: string;
  day: string;
  paksha: 'Shukla Paksha' | 'Krishna Paksha';
  tithi: number;
  tithiName: string;
  sunriseTime: string;
  nadi: string;
}

const SwarCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCapital, setSelectedCapital] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Download form states
  const [showDownloadForm, setShowDownloadForm] = useState<boolean>(false);
  const [downloadStartDate, setDownloadStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [downloadEndDate, setDownloadEndDate] = useState<string>('');
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);



  // Get states for selected country
  const getStatesForCountry = (country: string): string[] => {
    if (capitalsByCountry[country]) {
      return Object.keys(capitalsByCountry[country]);
    }
    return [];
  };

  // Get capitals for selected state
  const getCapitalsForState = (country: string, state: string): string[] => {
    if (capitalsByCountry[country] && capitalsByCountry[country][state]) {
      return [capitalsByCountry[country][state].name];
    }
    return [];
  };

  // Set default end date to one month from start date
  useEffect(() => {
    if (downloadStartDate) {
      const startDate = new Date(downloadStartDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(endDate.getDate() - 1); // One day before next month
      setDownloadEndDate(endDate.toISOString().split('T')[0]);
    }
  }, [downloadStartDate]);

  // Update coordinates when capital is selected
  const updateCoordinates = (country: string, state: string, capital: string) => {
    if (capitalsByCountry[country] && capitalsByCountry[country][state]) {
      const coords = capitalsByCountry[country][state];
      setLatitude(coords.lat);
      setLongitude(coords.lng);
    } else {
      // Default coordinates (New Delhi, India)
      setLatitude(28.6139);
      setLongitude(77.2090);
    }
  };

  // Handle country change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCapital('');
    setLatitude(0);
    setLongitude(0);
  };

  // Handle state change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCapital('');
    
    if (selectedCountry && state) {
      const capitals = getCapitalsForState(selectedCountry, state);
      if (capitals.length > 0) {
        setSelectedCapital(capitals[0]);
        updateCoordinates(selectedCountry, state, capitals[0]);
      }
    }
  };

  // Handle capital change
  const handleCapitalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const capital = e.target.value;
    setSelectedCapital(capital);
    updateCoordinates(selectedCountry, selectedState, capital);
  };

  // Calculate accurate sunrise time using SunCalc
  const calculateAccurateSunrise = (date: Date, lat: number, lng: number): string => {
    try {
      // Use SunCalc to get sunrise time in UTC
      const times = SunCalc.getTimes(date, lat, lng);
      
      // Get the sunrise time and format it properly
      const sunrise = times.sunrise;
      
      // Format time in local 12-hour format
      const hours = sunrise.getHours();
      const minutes = sunrise.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      
      return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('Error calculating sunrise:', error);
      // Fallback to approximate sunrise time
      return '06:00 AM';
    }
  };

  // Calculate Nadi based on paksha and tithi
  const calculateNadi = (paksha: 'Shukla Paksha' | 'Krishna Paksha', tithi: number) => {
    let nadiType: 'Sun' | 'Moon';
    
    // Nadi calculation logic as specified
    if (paksha === 'Shukla Paksha') {
      if ([1, 2, 3, 7, 8, 9, 13, 14, 15].includes(tithi)) {
        nadiType = 'Moon';
      } else {
        nadiType = 'Sun';
      }
    } else {
      if ([1, 2, 3, 7, 8, 9, 13, 14, 15].includes(tithi)) {
        nadiType = 'Sun';
      } else {
        nadiType = 'Moon';
      }
    }
    
    return {
      type: nadiType,
      symbol: nadiType === 'Sun' ? '☀️' : '🌙',
      name: nadiType === 'Sun' ? 'Surya Nadi' : 'Chandra Nadi'
    };
  };

  // Generate monthly calendar data
  const generateMonthlyCalendarData = (startDate: string, endDate: string, lat: number, lng: number): MonthlyCalendarData[] => {
    const data: MonthlyCalendarData[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure we don't exceed one month
    const maxDate = new Date(start);
    maxDate.setMonth(maxDate.getMonth() + 1);
    const actualEndDate = end > maxDate ? maxDate : end;
    
    let currentDate = new Date(start);
    
    while (currentDate <= actualEndDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const hinduData = calculateLocalHinduCalendar(dateString, lat, lng);
      const sunriseTime = calculateAccurateSunrise(currentDate, lat, lng);
      const nadi = calculateNadi(hinduData.paksha, hinduData.tithi);
      
      data.push({
        date: dateString,
        day: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        paksha: hinduData.paksha,
        tithi: hinduData.tithi,
        tithiName: hinduData.tithiName,
        sunriseTime,
        nadi: nadi.name
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  // Download monthly calendar
  const handleDownloadMonthlyCalendar = async () => {
    if (!downloadStartDate || !downloadEndDate || !latitude || !longitude) {
      alert('Please fill in all required fields first');
      return;
    }
    
    // Validate date range (max 1 month)
    const start = new Date(downloadStartDate);
    const end = new Date(downloadEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 31) {
      alert('Date range cannot exceed one month (31 days)');
      return;
    }
    
    setDownloadLoading(true);
    
    try {
      const monthlyData = generateMonthlyCalendarData(downloadStartDate, downloadEndDate, latitude, longitude);
      
      // Separate data by paksha
      const shuklaData = monthlyData.filter(item => item.paksha === 'Shukla Paksha');
      const krishnaData = monthlyData.filter(item => item.paksha === 'Krishna Paksha');
      
      // Create CSV content
      const headers = 'Date,Day,Paksha,Tithi,Tithi Name,Sunrise Time,Nadi';
      
      const shuklaCSV = [
        '=== SHUKLA PAKSHA (Waxing Moon) ===',
        headers,
        ...shuklaData.map(row => 
          `${formatDate(row.date)},${row.day},${row.paksha},${row.tithi},${row.tithiName},${row.sunriseTime},${row.nadi}`
        )
      ];
      
      const krishnaCSV = [
        '',
        '=== KRISHNA PAKSHA (Waning Moon) ===',
        headers,
        ...krishnaData.map(row => 
          `${formatDate(row.date)},${row.day},${row.paksha},${row.tithi},${row.tithiName},${row.sunriseTime},${row.nadi}`
        )
      ];
      
      const csvContent = [
        `Hindu Calendar - ${selectedCapital}, ${selectedState}, ${selectedCountry}`,
        `Period: ${formatDate(downloadStartDate)} to ${formatDate(downloadEndDate)}`,
        `Location: Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}`,
        `Generated on: ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`,
        '',
        ...shuklaCSV,
        ...krishnaCSV,
        '',
        '=== NADI CALCULATION LOGIC ===',
        'Shukla Paksha: Tithi 1,2,3,7,8,9,13,14,15 = Chandra Nadi | Tithi 4,5,6,10,11,12 = Surya Nadi',
        'Krishna Paksha: Tithi 1,2,3,7,8,9,13,14,15 = Surya Nadi | Tithi 4,5,6,10,11,12 = Chandra Nadi',
        '',
        'Powered by Swar Yoga Science - Authentic Hindu Calendar Calculations'
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Hindu-Calendar-${downloadStartDate}-to-${downloadEndDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setShowDownloadForm(false);
    } catch (error) {
      console.error('Error generating monthly calendar:', error);
      alert('Error generating calendar. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedCountry || !selectedState || !selectedCapital || !latitude || !longitude) return;
    
    setLoading(true);
    setConnectionError(null);
    
    try {
      const date = new Date(selectedDate);
      
      // Get day of week
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      // Calculate Hindu calendar data
      const hinduData = calculateLocalHinduCalendar(selectedDate, latitude, longitude);
      
      if (!hinduData) {
        throw new Error('Failed to calculate Hindu calendar data');
      }
      
      // Calculate accurate sunrise time using SunCalc directly
      const accurateSunrise = calculateAccurateSunrise(date, latitude, longitude);
      
      // Calculate Nadi using our specific logic
      const nadi = calculateNadi(hinduData.paksha, hinduData.tithi);
      
      setCalendarData({
        date: selectedDate,
        day: dayOfWeek,
        paksha: hinduData.paksha,
        tithi: hinduData.tithi,
        tithiName: hinduData.tithiName,
        sunriseTime: accurateSunrise, // Use the accurate sunrise calculation
        nadi,
        location: `${selectedCapital}, ${selectedState}, ${selectedCountry}`,
        coordinates: {
          latitude,
          longitude
        }
      });
      
      setShowResults(true);
    } catch (error) {
      console.error('Error calculating calendar data:', error);
      setConnectionError('Failed to calculate calendar data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 text-white p-8 rounded-3xl shadow-2xl">
        <Calendar className="w-16 h-16 mx-auto mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4">Swar Calendar</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Authentic Hindu Calendar calculations based on location and date.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-2 mb-6">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Location & Date Information</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                id="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            
            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State/Region
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={handleStateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={!selectedCountry}
              >
                <option value="">Select State/Region</option>
                {selectedCountry && getStatesForCountry(selectedCountry).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Capital City */}
            <div>
              <label htmlFor="capital" className="block text-sm font-medium text-gray-700 mb-1">
                Capital City
              </label>
              <select
                id="capital"
                value={selectedCapital}
                onChange={handleCapitalChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={!selectedState}
              >
                <option value="">Select Capital City</option>
                {selectedState && getCapitalsForState(selectedCountry, selectedState).map((capital) => (
                  <option key={capital} value={capital}>
                    {capital}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Latitude */}
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                step="0.000001"
                placeholder="e.g., 19.0760"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            {/* Longitude */}
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                step="0.000001"
                placeholder="e.g., 72.8777"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !selectedDate || !selectedCountry || !selectedState || !selectedCapital || !latitude || !longitude}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Calculating...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Calculate Hindu Calendar
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Display */}
      {connectionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {connectionError}
        </div>
      )}

      {/* Results Section - Single Row */}
      {showResults && calendarData && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-green-600" />
              <span>Hindu Calendar Results</span>
            </h2>
            <button
              onClick={() => setShowDownloadForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download Monthly Calendar</span>
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-green-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Today's Hindu Calendar</h3>
                <div className="text-sm">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {calendarData.location}
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Day</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Paksha</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tithi</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sunrise Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Today's Nadi</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-t border-gray-200">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {formatDate(calendarData.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {calendarData.day}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {calendarData.paksha}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <span className="font-semibold text-purple-600">{calendarData.tithi}</span>
                        <div className="text-xs text-gray-500">{calendarData.tithiName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Sun className="w-4 h-4 text-orange-500 mr-1" />
                        <span className="font-medium">{calendarData.sunriseTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">{calendarData.nadi.symbol}</span>
                        <div>
                          <span className="font-medium">{calendarData.nadi.name}</span>
                          <div className="text-xs text-gray-500">
                            {calendarData.nadi.type === 'Sun' ? 'Sun Energy' : 'Moon Energy'}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold">COORDINATES</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {calendarData.coordinates.latitude.toFixed(4)}, {calendarData.coordinates.longitude.toFixed(4)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold">SUNRISE</p>
                  <p className="text-sm font-medium text-orange-600 mt-1">{calendarData.sunriseTime}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold">NADI ENERGY</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">{calendarData.nadi.type}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold">LOCATION</p>
                  <p className="text-sm font-medium text-gray-900 mt-1 truncate">{calendarData.location}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600"><strong>Hindu Calendar Logic:</strong> Tithi calculated from moon phase using SunCalc astronomical library. Nadi determined by Paksha (lunar phase) and Tithi combination. Sunrise time is key marker for Hindu calendar day transitions.</p>
            </div>
          </div>
        </div>
      )}

      {/* Download Form Modal */}
      {showDownloadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <CalendarDays className="w-6 h-6 text-blue-600" />
                <span>Download Monthly Calendar</span>
              </h3>
              <button
                onClick={() => setShowDownloadForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={downloadStartDate}
                  onChange={(e) => setDownloadStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Max 1 Month)
                </label>
                <input
                  type="date"
                  value={downloadEndDate}
                  onChange={(e) => setDownloadEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Download Features:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Separate sections for Shukla Paksha and Krishna Paksha</li>
                  <li>• Same table format as today's results</li>
                  <li>• Complete Nadi calculation logic included</li>
                  <li>• CSV format for easy viewing in Excel</li>
                  <li>• Maximum one month period allowed</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDownloadForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownloadMonthlyCalendar}
                  disabled={downloadLoading || !downloadStartDate || !downloadEndDate}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center text-xs text-gray-500">
        <p>Calculations based on authentic Hindu Panchang and astronomical methods</p>
        <p>Powered by Swar Yoga Science</p>
      </div>
    </div>
  );
};

export default SwarCalendar;