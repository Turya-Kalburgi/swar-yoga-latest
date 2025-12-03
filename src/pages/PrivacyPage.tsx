import React from 'react';
import { Link } from 'react-router-dom';
// Header and Footer are provided by App routes; removed local imports to avoid duplicate rendering
import PageHeader from '../components/PageHeader';
import { ArrowRight, Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white">
  {/* Header provided by App layout */}
      
      <PageHeader 
        title="Privacy Policy" 
        breadcrumbs={[{ name: 'Privacy Policy', path: '/privacy' }]}
        image="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="prose max-w-none">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800 m-0">Privacy Policy</h2>
            </div>
            
            <p className="text-gray-700">
              At Swar Yogaa, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Information We Collect</h3>
            <p className="text-gray-700">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Register for an account</li>
              <li>Sign up for our newsletter</li>
              <li>Register for workshops or retreats</li>
              <li>Make a purchase</li>
              <li>Contact us with inquiries</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="text-gray-700">
              This information may include your name, email address, phone number, mailing address, payment information, and demographic information.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. How We Use Your Information</h3>
            <p className="text-gray-700">
              We may use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Providing and maintaining our services</li>
              <li>Processing transactions and sending related information</li>
              <li>Responding to inquiries and offering support</li>
              <li>Sending administrative information</li>
              <li>Sending marketing and promotional communications</li>
              <li>Improving our website and services</li>
              <li>Protecting our services and addressing fraud</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Cookies and Tracking Technologies</h3>
            <p className="text-gray-700">
              We may use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Third-Party Service Providers</h3>
            <p className="text-gray-700">
              We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, and customer service. These providers have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Data Security</h3>
            <p className="text-gray-700">
              We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Your Data Protection Rights</h3>
            <p className="text-gray-700">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>The right to access your personal information</li>
              <li>The right to rectify inaccurate information</li>
              <li>The right to erase your personal information</li>
              <li>The right to restrict processing of your information</li>
              <li>The right to data portability</li>
              <li>The right to object to processing</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Children's Privacy</h3>
            <p className="text-gray-700">
              Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we learn we have collected personal information from a child under 13, we will delete that information.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Changes to This Privacy Policy</h3>
            <p className="text-gray-700">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Contact Us</h3>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at:
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
            <Link to="/terms" className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              <FileText className="h-5 w-5" />
              <span>Terms and Conditions</span>
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

export default PrivacyPage;