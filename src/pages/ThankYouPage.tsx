import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, ArrowRight, MessageSquare } from 'lucide-react';
// Header and Footer are provided by App routes; removed local imports to avoid duplicate rendering

interface PurchasedWorkshop {
  id: number;
  title: string;
  instructor: string;
  price: number;
  currency: string;
  image: string;
  whatsappGroupLink?: string;
}

const ThankYouPage = () => {
  const [workshop, setWorkshop] = useState<PurchasedWorkshop | null>(null);

  useEffect(() => {
    // Get workshop details from sessionStorage
    const workshopData = sessionStorage.getItem('purchased_workshop');
    if (workshopData) {
      try {
        const parsedWorkshop = JSON.parse(workshopData);
        setWorkshop(parsedWorkshop);
      } catch (error) {
        console.error('Error parsing workshop data:', error);
      }
    }
  }, []);

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'NPR': return 'NPR ';
      case 'USD': return '$';
      default: return '₹';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
  {/* Header provided by App layout */}
      <div className="container mx-auto max-w-4xl px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You for Your Purchase!</h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Your payment has been processed successfully. You will receive a confirmation email shortly with all the details about your workshop.
          </p>

          {workshop && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Workshop Details</h2>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-left">
                <img 
                  src={workshop.image || "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400"} 
                  alt={workshop.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{workshop.title}</h3>
                  <p className="text-gray-600 mb-3">by {workshop.instructor}</p>
                  <p className="text-green-600 font-bold mb-3">
                    {getCurrencySymbol(workshop.currency)}{workshop.price}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {workshop.whatsappGroupLink ? (
                      <a 
                        href={workshop.whatsappGroupLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Join WhatsApp Group</span>
                      </a>
                    ) : (
                      <div className="inline-flex items-center space-x-2 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">
                        <MessageSquare className="h-4 w-4" />
                        <span>WhatsApp group link coming soon</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/workshops"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Browse More Workshops</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What's Next?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Mark Your Calendar</h3>
              <p className="text-gray-600 text-sm">
                Add the workshop dates to your calendar to ensure you don't miss any sessions.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Join the Community</h3>
              <p className="text-gray-600 text-sm">
                Connect with fellow participants in our WhatsApp group for updates and discussions.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Prepare Materials</h3>
              <p className="text-gray-600 text-sm">
                Check your email for any preparation instructions or materials needed for the workshop.
              </p>
            </div>
          </div>
        </div>
      </div>
  {/* Footer provided by App layout */}
    </div>
  );
};

export default ThankYouPage;