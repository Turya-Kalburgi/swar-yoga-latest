import React from 'react';
import { Link } from 'react-router-dom';
// Header and Footer are provided by App routes; removed local imports to avoid duplicate rendering
import PageHeader from '../components/PageHeader';
import { ArrowRight, CheckCircle, FileText, Shield } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-white">
  {/* Header provided by App layout */}
      
      <PageHeader 
        title="Terms and Conditions" 
        breadcrumbs={[{ name: 'Terms and Conditions', path: '/terms' }]}
        image="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="prose max-w-none">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800 m-0">Terms and Conditions</h2>
            </div>
            
            <p className="text-gray-700">
              Welcome to Swar Yogaa. By accessing and using our website, services, and products, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before using our services.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Acceptance of Terms</h3>
            <p className="text-gray-700">
              By accessing or using the Swar Yogaa website, attending our workshops, or purchasing our products, you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions, you may not access or use our services.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Services Description</h3>
            <p className="text-gray-700">
              Swar Yogaa provides yoga instruction, workshops, retreats, and related wellness services. Our services are intended for general wellness purposes and not as a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. User Accounts</h3>
            <p className="text-gray-700">
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account password and for any activities or actions under your account.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Payment Terms</h3>
            <p className="text-gray-700">
              Payments for our services are due at the time of registration or purchase unless otherwise specified. All fees are non-refundable except as described in our Refund Policy.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Workshop and Retreat Policies</h3>
            <p className="text-gray-700">
              Registration for workshops and retreats is on a first-come, first-served basis. We reserve the right to cancel or reschedule events due to insufficient enrollment or circumstances beyond our control. In such cases, participants will be offered alternative dates or refunds as appropriate.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Intellectual Property</h3>
            <p className="text-gray-700">
              All content on the Swar Yogaa website, including text, graphics, logos, images, audio clips, and software, is the property of Swar Yogaa and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. User Conduct</h3>
            <p className="text-gray-700">
              You agree not to use our services for any unlawful purpose or in any way that could damage, disable, or impair our services. You also agree not to attempt to gain unauthorized access to any part of our services or systems.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Health Disclaimer</h3>
            <p className="text-gray-700">
              Participants should consult with a qualified healthcare professional before beginning any exercise program or making significant changes to their diet. Our services are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Limitation of Liability</h3>
            <p className="text-gray-700">
              Swar Yogaa shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Changes to Terms</h3>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Your continued use of our services following any changes indicates your acceptance of the new terms.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11. Governing Law</h3>
            <p className="text-gray-700">
              These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">12. Contact Information</h3>
            <p className="text-gray-700">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="text-gray-700">
              Email: globalswaryoga@gmail.com<br />
              Phone: +91 9779006820 (11AM to 5PM)
            </p>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                Last updated: April 25, 2024
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/privacy" className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              <Shield className="h-5 w-5" />
              <span>Privacy Policy</span>
            </Link>
            <Link to="/refund" className="flex items-center justify-center space-x-2 border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
              <ArrowRight className="h-5 w-5" />
              <span>Refund Policy</span>
            </Link>
          </div>
        </div>
      </div>
      
  {/* Footer provided by App layout */}
    </div>
  );
};

export default TermsPage;