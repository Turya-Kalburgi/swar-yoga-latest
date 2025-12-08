import React from 'react';
// Header and Footer are provided by App routes; removed local imports to avoid duplicate rendering
import PageHeader from '../components/PageHeader';
import SwarYogaCalendar from '../components/SwarYogaCalendar';

const SwarCalendarPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
  {/* Header provided by App layout */}
      <PageHeader 
        title="Swar Yoga Calendar" 
        breadcrumbs={[{ name: 'Swar Calendar', path: '/swar-calendar' }]}
        image="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Swar Yoga Calendar</h2>
          <p className="text-gray-600 mb-6">
            The Swar Yoga Calendar helps you determine the active Nadi (energy channel) for any given date and location.
            This knowledge is essential for planning your activities according to the cosmic rhythms for optimal health and well-being.
          </p>
          
          <SwarYogaCalendar />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Understanding Swar Yoga</h2>
          
          <div className="space-y-4 text-gray-600">
            <p>
              Swar Yoga is an ancient science that recognizes the relationship between breath, cosmic rhythms, and human well-being. 
              By understanding which Nadi (energy channel) is active on a particular day, you can plan your activities accordingly.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Sun Nadi (Pingala)</h3>
                <p className="text-sm">
                  When the Sun Nadi is active, it's ideal for:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                  <li>Physical activities and exercise</li>
                  <li>Important meetings and negotiations</li>
                  <li>Analytical thinking and problem-solving</li>
                  <li>Outward-focused activities</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Moon Nadi (Ida)</h3>
                <p className="text-sm">
                  When the Moon Nadi is active, it's ideal for:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                  <li>Meditation and spiritual practices</li>
                  <li>Creative work and artistic pursuits</li>
                  <li>Rest and healing activities</li>
                  <li>Inward-focused activities</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-green-800 mb-2">Daily Practice</h3>
              <p className="text-sm text-green-700">
                By checking the Swar Calendar each morning, you can plan your day to align with the natural cosmic rhythms.
                This simple practice can lead to improved energy levels, better decision-making, and enhanced overall well-being.
              </p>
            </div>
          </div>
        </div>
      </div>
      
  {/* Footer provided by App layout */}
    </div>
  );
};

export default SwarCalendarPage;